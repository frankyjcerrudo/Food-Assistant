# Food Assistant - Servidor Local Ligero
Add-Type -AssemblyName System.Net.Http -ErrorAction SilentlyContinue

$port = 3000
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " Food Assistant iniciado con exito!       " -ForegroundColor Green
    Write-Host " Servidor: http://localhost:$port         " -ForegroundColor Yellow
    Write-Host " API Proxy: http://localhost:$port/api/fetch?url=... " -ForegroundColor Magenta
    Write-Host " Presiona Ctrl+C para detener el servidor " -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Cyan

    Start-Process "http://localhost:$port"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $path = $req.Url.LocalPath.TrimStart('/')
        
        # Endpoint de descarga sin restricciones CORS ni bloqueo de Cloudflare
        if ($path -eq 'api/fetch') {
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
            $res.Headers.Add("Access-Control-Allow-Headers", "*")

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

            try {
                $handler = [System.Net.Http.HttpClientHandler]::new()
                $handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
                $handler.AllowAutoRedirect = $true
                $client = [System.Net.Http.HttpClient]::new($handler)
                $client.Timeout = [System.TimeSpan]::FromSeconds(12)
                $client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                $client.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                $client.DefaultRequestHeaders.Add("Accept-Language", "es-ES,es;q=0.9,en;q=0.8")

                $html = $client.GetStringAsync($targetUrl).GetAwaiter().GetResult()
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
        $filePath = Join-Path $root $path

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.svg'  { 'image/svg+xml' }
                Default { 'application/octet-stream' }
            }
            $res.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
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
}
