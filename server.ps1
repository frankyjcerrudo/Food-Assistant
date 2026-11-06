param(
    [int]$port = 3000,
    [switch]$NoBrowser
)

# Food Assistant - Servidor Local Ligero y Seguro
Add-Type -AssemblyName System.Net.Http -ErrorAction SilentlyContinue

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
$fullRoot = [System.IO.Path]::GetFullPath($root)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

# Función auxiliar para validar destinos no-SSRF (bloquea localhost, IPs privadas y link-local)
function Test-IsSafeExternalUrl([string]$urlString) {
    try {
        $uri = [System.Uri]::new($urlString)
        if ($uri.Scheme -ne 'http' -and $uri.Scheme -ne 'https') {
            return $false
        }
        $hostName = $uri.DnsSafeHost.ToLower()
        if ($hostName -eq 'localhost' -or $hostName -eq '127.0.0.1' -or $hostName -eq '::1') {
            return $false
        }
        # Intentar resolver dirección IP y verificar rangos privados
        $addresses = [System.Net.Dns]::GetHostAddresses($hostName)
        foreach ($addr in $addresses) {
            if ([System.Net.IPAddress]::IsLoopback($addr)) { return $false }
            $bytes = $addr.GetAddressBytes()
            if ($addr.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork) {
                # 10.0.0.0/8
                if ($bytes[0] -eq 10) { return $false }
                # 172.16.0.0/12
                if ($bytes[0] -eq 172 -and ($bytes[1] -ge 16 -and $bytes[1] -le 31)) { return $false }
                # 192.168.0.0/16
                if ($bytes[0] -eq 192 -and $bytes[1] -eq 168) { return $false }
                # 169.254.0.0/16 (link-local / metadata cloud)
                if ($bytes[0] -eq 169 -and $bytes[1] -eq 254) { return $false }
            }
        }
        return $true
    } catch {
        return $false
    }
}

# Reutilizar una única instancia de HttpClient (evita socket exhaustion)
$handler = [System.Net.Http.HttpClientHandler]::new()
$handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
$handler.AllowAutoRedirect = $false
$httpClient = [System.Net.Http.HttpClient]::new($handler)
$httpClient.Timeout = [System.TimeSpan]::FromSeconds(12)
$httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
$httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
$httpClient.DefaultRequestHeaders.Add("Accept-Language", "es-ES,es;q=0.9,en;q=0.8")

try {
    $listener.Start()
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " Food Assistant iniciado con exito!       " -ForegroundColor Green
    Write-Host " Servidor: http://localhost:$port         " -ForegroundColor Yellow
    Write-Host " API Proxy: http://localhost:$port/api/fetch?url=... " -ForegroundColor Magenta
    Write-Host " Seguridad: SSRF & Path Traversal activo  " -ForegroundColor Green
    Write-Host " Presiona Ctrl+C para detener el servidor " -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Cyan

    if (-not $NoBrowser) {
        Start-Process "http://localhost:$port"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $path = $req.Url.LocalPath.TrimStart('/')
        
        # Endpoint de descarga para recetas remotas
        if ($path -eq 'api/fetch') {
            # Limitar CORS a orígenes locales seguros
            $origin = $req.Headers["Origin"]
            if ($origin -and ($origin -like "http://localhost:*" -or $origin -like "http://127.0.0.1:*")) {
                $res.Headers.Add("Access-Control-Allow-Origin", $origin)
            } else {
                $res.Headers.Add("Access-Control-Allow-Origin", "http://localhost:$port")
            }
            $res.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
            $res.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With")

            if ($req.HttpMethod -eq 'OPTIONS') {
                $res.StatusCode = 204
                $res.Close()
                continue
            }

            $targetUrl = $req.QueryString["url"]
            if ([string]::IsNullOrWhiteSpace($targetUrl)) {
                $res.StatusCode = 400
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error": "Parametro url requerido"}')
                $res.ContentType = "application/json; charset=utf-8"
                $res.ContentLength64 = $errBytes.Length
                $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $res.Close()
                continue
            }

            # Validación anti-SSRF
            if (-not (Test-IsSafeExternalUrl $targetUrl)) {
                $res.StatusCode = 403
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error": "Destino no permitido o direccion IP privada/local (SSRF protegido)"}')
                $res.ContentType = "application/json; charset=utf-8"
                $res.ContentLength64 = $errBytes.Length
                $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $res.Close()
                continue
            }

            try {
                $html = $httpClient.GetStringAsync($targetUrl).GetAwaiter().GetResult()
                $htmlBytes = [System.Text.Encoding]::UTF8.GetBytes($html)
                $res.StatusCode = 200
                $res.ContentType = "text/html; charset=utf-8"
                $res.ContentLength64 = $htmlBytes.Length
                $res.OutputStream.Write($htmlBytes, 0, $htmlBytes.Length)
            } catch {
                $res.StatusCode = 502
                $msg = "Error al descargar la receta: " + $_.Exception.Message
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $res.ContentType = "text/plain; charset=utf-8"
                $res.ContentLength64 = $errBytes.Length
                $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $res.Close()
            continue
        }

        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') { 
            $path = 'index.html' 
        }

        # Protección estricta contra Path Traversal
        $combined = Join-Path $fullRoot $path
        $fullPath = [System.IO.Path]::GetFullPath($combined)
        
        if (-not $fullPath.StartsWith($fullRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            $res.StatusCode = 403
            $forbidden = [System.Text.Encoding]::UTF8.GetBytes("Acceso denegado")
            $res.OutputStream.Write($forbidden, 0, $forbidden.Length)
            $res.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = switch ($ext) {
                '.html'        { 'text/html; charset=utf-8' }
                '.css'         { 'text/css; charset=utf-8' }
                '.js'          { 'application/javascript; charset=utf-8' }
                '.json'        { 'application/json; charset=utf-8' }
                '.webmanifest' { 'application/manifest+json; charset=utf-8' }
                '.png'         { 'image/png' }
                '.jpg'         { 'image/jpeg' }
                '.jpeg'        { 'image/jpeg' }
                '.webp'        { 'image/webp' }
                '.gif'         { 'image/gif' }
                '.svg'         { 'image/svg+xml' }
                '.ico'         { 'image/x-icon' }
                '.woff'        { 'font/woff' }
                '.woff2'       { 'font/woff2' }
                Default        { 'application/octet-stream' }
            }
            $res.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("Archivo no encontrado")
            $res.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $res.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
    if ($httpClient) { $httpClient.Dispose() }
    if ($handler) { $handler.Dispose() }
}
