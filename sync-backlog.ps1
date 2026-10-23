<#
.SYNOPSIS
    Sincroniza BACKLOG.md de Food Assistant con GitHub Issues y GitHub Projects v2.
.DESCRIPTION
    Parsea las historias de usuario (US-xx) y defectos (BUG-xx) de BACKLOG.md,
    comprueba cuáles existen ya en GitHub, crea los que falten con sus etiquetas
    y los añade al tablero de GitHub Projects ("Food Assistant Roadmap").
#>

[CmdletBinding()]
param(
    [string]$Token = "",
    [string]$Owner = "frankyjcerrudo",
    [string]$Repo = "Food-Assistant",
    [string]$ProjectId = "PVT_kwHODCGG2s4Bn8Jm",
    [switch]$DryRun
)

# 1. Obtener Token de GitHub
if (-not $Token) {
    if ($env:GITHUB_TOKEN) {
        $Token = $env:GITHUB_TOKEN
    } elseif (Test-Path (Join-Path $PSScriptRoot ".env")) {
        $envLines = Get-Content (Join-Path $PSScriptRoot ".env")
        foreach ($line in $envLines) {
            if ($line -match '^\s*GITHUB_TOKEN\s*=\s*(.*)') {
                $Token = $matches[1].Trim().Trim('"').Trim("'")
                break
            }
        }
    }
    
    if (-not $Token) {
        # Intentar extraer del remote origin de Git
        try {
            $remoteUrl = git config --get remote.origin.url
            if ($remoteUrl -match 'https://[^:]+:(ghp_[a-zA-Z0-9]+)@') {
                $Token = $matches[1]
            }
        } catch {}
    }
}

if (-not $Token) {
    Write-Error "No se encontro ningun token de GitHub. Especifica -Token 'ghp_...' o define GITHUB_TOKEN."
    exit 1
}

$headersRest = @{
    "Authorization" = "token $Token"
    "User-Agent" = "food-assistant-sync"
    "Accept" = "application/vnd.github+json"
}

$headersGql = @{
    "Authorization" = "token $Token"
    "User-Agent" = "food-assistant-sync"
    "Content-Type" = "application/json"
}

# IDs de opciones del Proyecto "Food Assistant Roadmap" (PVT_kwHODCGG2s4Bn8Jm)
$fieldStatusId = "PVTSSF_lAHODCGG2s4Bn8JmzhmedVg"
$statusOptions = @{
    "To-Do"       = "f75ad846"
    "In Progress" = "47fc9ee4"
    "Done"        = "98236657"
}

$fieldPriorityId = "PVTSSF_lAHODCGG2s4Bn8JmzhmevBY"
$priorityOptions = @{
    "High"   = "a6f099d7"
    "Medium" = "141872a3"
    "Low"    = "bf845904"
}

# Mapeo de prefijos por Épica
function Get-EpicPrefix([string]$epicName) {
    switch -Regex ($epicName) {
        'Nutricional'    { return @{ Prefix = "[NUTRITION]"; Label = "enhancement" } }
        'Planificador'   { return @{ Prefix = "[PLANNER]";   Label = "epic-2-planificador" } }
        'Lista de la Compra' { return @{ Prefix = "[SHOPPING]"; Label = "epic-3-compra" } }
        'Catálogo de Recetas' { return @{ Prefix = "[RECIPES]";  Label = "epic-4-recetas" } }
        'Inteligencia Artificial' { return @{ Prefix = "[AI]";    Label = "epic-5-ia" } }
        'Diseño'         { return @{ Prefix = "[DESIGN]";   Label = "design-system" } }
        'Android'        { return @{ Prefix = "[MOBILE]";   Label = "mobile" } }
        'Comunidad'      { return @{ Prefix = "[COMMUNITY]"; Label = "enhancement" } }
        'Sincronización' { return @{ Prefix = "[SYNC]";     Label = "enhancement" } }
        'Seguridad'      { return @{ Prefix = "[SECURITY]"; Label = "security" } }
        'Calidad Técnica'{ return @{ Prefix = "[ARCH]";     Label = "architecture" } }
        'Accesibilidad'  { return @{ Prefix = "[A11Y/PWA]"; Label = "accessibility" } }
        default          { return @{ Prefix = "[FEAT]";     Label = "enhancement" } }
    }
}

# 2. Leer y parsear BACKLOG.md
$backlogFile = Join-Path $PSScriptRoot "BACKLOG.md"
if (-not (Test-Path $backlogFile)) {
    Write-Error "No se encontro el archivo BACKLOG.md en $PSScriptRoot"
    exit 1
}

Write-Host ">>> Parseando BACKLOG.md..." -ForegroundColor Cyan
$lines = Get-Content -Path $backlogFile -Encoding UTF8

$itemsToProcess = @()
$currentEpic = ""
$inBugSection = $false

foreach ($line in $lines) {
    if ($line -match '^##\s+.*?(\d+):\s*(.*)') {
        $currentEpic = "Épica $($matches[1]): $($matches[2].Trim())"
        $inBugSection = $false
        continue
    }
    if ($line -match 'Defectos\s*\(Bugs\)') {
        $inBugSection = $true
        $currentEpic = "Bugs & Defectos"
        continue
    }

    # User Story
    if (-not $inBugSection -and $line -match '^\s*\|\s*\*\*?(US-\d+)\*\*?\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*`?(.*?)`?\s*\|\s*(.*?)\s*\|$') {
        $id = $matches[1].Trim()
        $title = $matches[2].Trim()
        $prioRaw = $matches[3].Trim()
        $statusRaw = $matches[4].Trim().Replace('`', '')
        $dod = $matches[5].Trim()

        $prio = "Medium"
        $prioLabel = "p2-should"
        if ($prioRaw -match 'Alta') { 
            $prio = "High" 
            $prioLabel = "must-have"
        } elseif ($prioRaw -match 'Baja') { 
            $prio = "Low" 
            $prioLabel = "could-have"
        }

        $projStatus = "To-Do"
        if ($statusRaw -match 'Done') { $projStatus = "Done" }
        elseif ($statusRaw -match 'In Progress|Ready for Dev') { $projStatus = "In Progress" }

        $epicInfo = Get-EpicPrefix $currentEpic
        $issueTitle = "$($epicInfo.Prefix) $($id): $title"

        # Formatear DoD como lista de checkboxes markdown
        $dodFormatted = ""
        $bullets = $dod -split '<br>'
        foreach ($b in $bullets) {
            $cleanBullet = $b.Trim().TrimStart('•').Trim()
            if ($cleanBullet) {
                $dodFormatted += "- [ ] $cleanBullet`n"
            }
        }

        $body = @"
## 📋 Descripción
**Historia**: $id - $title  
**Épica**: $currentEpic  
**Prioridad**: $prioRaw  
**Estado en Backlog**: `$statusRaw`  

## ✅ Criterios de Aceptación (DoD)
$dodFormatted

---
*Sincronizado automáticamente desde [BACKLOG.md](https://github.com/$Owner/$Repo/blob/main/BACKLOG.md)*
"@

        $labels = @("enhancement", $prioLabel)
        if ($epicInfo.Label -and $epicInfo.Label -ne "enhancement") {
            $labels += $epicInfo.Label
        }

        $itemsToProcess += [PSCustomObject]@{
            Type = "US"
            ID = $id
            Title = $issueTitle
            Body = $body
            Labels = $labels
            Priority = $prio
            ProjectStatus = $projStatus
            RawStatus = $statusRaw
        }
    }

    # Bug
    if ($inBugSection -and $line -match '^\s*\|\s*\*\*?(BUG-\d+)\*\*?\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*`?(.*?)`?\s*\|\s*(.*?)\s*\|$') {
        $id = $matches[1].Trim()
        $desc = $matches[2].Trim()
        $sevRaw = $matches[3].Trim()
        $statusRaw = $matches[4].Trim().Replace('`', '')
        $res = $matches[5].Trim()

        $prio = "Medium"
        $prioLabel = "p2-should"
        if ($sevRaw -match 'Alta') { 
            $prio = "High" 
            $prioLabel = "must-have"
        } elseif ($sevRaw -match 'Baja') { 
            $prio = "Low" 
            $prioLabel = "could-have"
        }

        $projStatus = "To-Do"
        if ($statusRaw -match 'Done') { $projStatus = "Done" }
        elseif ($statusRaw -match 'In Progress|Ready for Dev') { $projStatus = "In Progress" }

        $issueTitle = "[BUG] $($id): $desc"

        $body = @"
## 🐛 Registro de Defecto
**Incidencia**: $id - $desc  
**Severidad**: $sevRaw  
**Estado en Backlog**: `$statusRaw`  

## 🛠️ Resolución / Criterios de Corrección
$res

---
*Sincronizado automáticamente desde [BACKLOG.md](https://github.com/$Owner/$Repo/blob/main/BACKLOG.md)*
"@

        $labels = @("bug", $prioLabel)

        $itemsToProcess += [PSCustomObject]@{
            Type = "BUG"
            ID = $id
            Title = $issueTitle
            Body = $body
            Labels = $labels
            Priority = $prio
            ProjectStatus = $projStatus
            RawStatus = $statusRaw
        }
    }
}

Write-Host "Elementos encontrados en BACKLOG.md: $($itemsToProcess.Count)" -ForegroundColor Green

# 3. Consultar Issues existentes en GitHub para evitar duplicados
Write-Host ">>> Consultando Issues existentes en GitHub ($Owner/$Repo)..." -ForegroundColor Cyan
$existingMap = @{}
$page = 1
while ($true) {
    $url = "https://api.github.com/repos/$Owner/$Repo/issues?state=all&per_page=100&page=$page"
    $batch = Invoke-RestMethod -Uri $url -Headers $headersRest
    if (-not $batch -or $batch.Count -eq 0) { break }
    foreach ($iss in $batch) {
        if ($iss.title -match '\b(US-\d+|BUG-\d+)\b') {
            $existingMap[$matches[1]] = $iss
        }
    }
    $page++
}
Write-Host "Total issues ya registrados en GitHub: $($existingMap.Count)" -ForegroundColor Yellow

$missingItems = $itemsToProcess | Where-Object { -not $existingMap.ContainsKey($_.ID) }
Write-Host "Nuevos elementos pendientes de crear y sincronizar: $($missingItems.Count)" -ForegroundColor Magenta

if ($DryRun) {
    Write-Host "`n[DRY RUN] Simulación activada. No se modificará GitHub." -ForegroundColor Yellow
    Write-Host "Detalle de los primeros 10 elementos que se crearían:" -ForegroundColor Gray
    $missingItems | Select-Object -First 10 | ForEach-Object {
        Write-Host " - [$($_.ID)] $($_.Title) | Prio: $($_.Priority) | Status: $($_.ProjectStatus) | Labels: $(($_.Labels) -join ', ')"
    }
    Write-Host "`nPara ejecutar la sincronización real, ejecuta el script sin el parámetro -DryRun." -ForegroundColor Green
    exit 0
}

# 4. Asegurar que las etiquetas necesarias existan en el repositorio
$labelsToEnsure = @{
    "security"     = "b60205"
    "architecture" = "1d76db"
    "pwa"          = "0075ca"
}

foreach ($lbl in $labelsToEnsure.Keys) {
    try {
        $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/labels/$lbl" -Headers $headersRest
    } catch {
        try {
            $lblBody = @{ name = $lbl; color = $labelsToEnsure[$lbl] } | ConvertTo-Json
            $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/labels" `
                -Method Post -Headers $headersRest -Body ([System.Text.Encoding]::UTF8.GetBytes($lblBody)) -ContentType "application/json; charset=utf-8"
        } catch {}
    }
}

# 5. Crear issues y agregarlos al Project V2
Write-Host "`n>>> Iniciando sincronización con GitHub..." -ForegroundColor Cyan
$createdCount = 0

foreach ($item in $missingItems) {
    Write-Host "Creando $($item.ID): $($item.Title)..." -NoNewline
    
    $issuePayload = @{
        title  = $item.Title
        body   = $item.Body
        labels = $item.Labels
    } | ConvertTo-Json -Depth 5

    try {
        # A) Crear Issue en el repo
        $createdIssue = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/issues" `
            -Method Post -Headers $headersRest -Body ([System.Text.Encoding]::UTF8.GetBytes($issuePayload)) -ContentType "application/json; charset=utf-8"
        
        $issueNum = $createdIssue.number
        $issueNodeId = $createdIssue.node_id

        # B) Añadir al Project V2 vía GraphQL
        $addMutation = @"
{"query": "mutation { addProjectV2ItemById(input: { projectId: \"$ProjectId\", contentId: \"$issueNodeId\" }) { item { id } } }"}
"@
        $addRes = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $addMutation
        $projectItemId = $addRes.data.addProjectV2ItemById.item.id

        # C) Asignar Status en el Proyecto
        $statusOptId = $statusOptions[$item.ProjectStatus]
        if ($projectItemId -and $statusOptId) {
            $updateStatusGql = @"
{"query": "mutation { updateProjectV2ItemFieldValue(input: { projectId: \"$ProjectId\", itemId: \"$projectItemId\", fieldId: \"$fieldStatusId\", value: { singleSelectOptionId: \"$statusOptId\" } }) { projectV2Item { id } } }"}
"@
            $null = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $updateStatusGql
        }

        # D) Asignar Prioridad en el Proyecto
        $prioOptId = $priorityOptions[$item.Priority]
        if ($projectItemId -and $prioOptId) {
            $updatePrioGql = @"
{"query": "mutation { updateProjectV2ItemFieldValue(input: { projectId: \"$ProjectId\", itemId: \"$projectItemId\", fieldId: \"$fieldPriorityId\", value: { singleSelectOptionId: \"$prioOptId\" } }) { projectV2Item { id } } }"}
"@
            $null = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $updatePrioGql
        }

        # E) Si el item ya estaba marcado como Done, cerramos el Issue en GitHub
        if ($item.RawStatus -eq 'Done') {
            $closePayload = @{ state = "closed" } | ConvertTo-Json
            $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/issues/$issueNum" `
                -Method Patch -Headers $headersRest -Body $closePayload
        }

        Write-Host " [OK -> Issue #$issueNum]" -ForegroundColor Green
        $createdCount++

        # Pausa suave para evitar Rate Limits secundarios de GitHub
        Start-Sleep -Milliseconds 600

    } catch {
        Write-Host " [ERROR: $($_.Exception.Message)]" -ForegroundColor Red
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " Sincronización completada: $createdCount elementos añadidos a GitHub Projects!" -ForegroundColor Green
Write-Host " Tablero: https://github.com/users/$Owner/projects/1" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
