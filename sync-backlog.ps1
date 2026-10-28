<#
.SYNOPSIS
    Sincroniza BACKLOG.md de Food Assistant con GitHub Issues y GitHub Projects v2.
.DESCRIPTION
    Parsea las historias de usuario (US-xx) y defectos (BUG-xx) de BACKLOG.md,
    comprueba cuáles existen ya en GitHub, crea los que falten con sus etiquetas,
    actualiza los existentes si tienen discrepancias o texto corrupto,
    y los añade al tablero de GitHub Projects ("Food Assistant Roadmap").
#>

[CmdletBinding()]
param(
    [string]$Token = "",
    [string]$Owner = "frankyjcerrudo",
    [string]$Repo = "Food-Assistant",
    [string]$ProjectId = "PVT_kwHODCGG2s4Bn8Jm",
    [switch]$UpdateExisting,
    [switch]$DryRun
)

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

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

# Mapeo de prefijos y etiquetas por número de Épica (inmune a problemas de codificación)
function Get-EpicInfo([int]$epicNum) {
    switch ($epicNum) {
        1  { return @{ Prefix = "[NUTRITION]"; Label = "enhancement" } }
        2  { return @{ Prefix = "[PLANNER]";   Label = "epic-2-planificador" } }
        3  { return @{ Prefix = "[SHOPPING]";  Label = "epic-3-compra" } }
        4  { return @{ Prefix = "[RECIPES]";   Label = "epic-4-recetas" } }
        5  { return @{ Prefix = "[AI]";        Label = "epic-5-ia" } }
        6  { return @{ Prefix = "[DESIGN]";    Label = "design-system" } }
        7  { return @{ Prefix = "[MOBILE]";    Label = "mobile" } }
        8  { return @{ Prefix = "[COMMUNITY]"; Label = "enhancement" } }
        9  { return @{ Prefix = "[SYNC]";      Label = "enhancement" } }
        10 { return @{ Prefix = "[SECURITY]";  Label = "security" } }
        11 { return @{ Prefix = "[ARCH]";      Label = "architecture" } }
        12 { return @{ Prefix = "[A11Y/PWA]";  Label = "accessibility" } }
        default { return @{ Prefix = "[FEAT]"; Label = "enhancement" } }
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
$currentEpicNum = 0
$currentEpicName = ""
$inBugSection = $false

# Constantes Unicode seguras
$clipEmoji = [char]::ConvertFromUtf32(0x1F4CB)
$checkEmoji = [char]::ConvertFromUtf32(0x2705)
$bugEmoji = [char]::ConvertFromUtf32(0x1F41B)
$toolsEmoji = "$([char]::ConvertFromUtf32(0x1F6E0))$([char]0xFE0F)"
$wordDesc = "Descripci$([char]0x00F3)n"
$wordEpic = "$([char]0x00C9)pica"
$wordAcept = "Aceptaci$([char]0x00F3)n"
$wordRes = "Resoluci$([char]0x00F3)n"
$wordCorr = "Correcci$([char]0x00F3)n"
$wordAuto = "autom$([char]0x00E1)ticamente"

foreach ($line in $lines) {
    if ($line -match '^##\s+(?:.*?[eE\u00C9\u00E9]pica\s*(\d+)\s*:\s*(.*)|(.*))') {
        if ($matches[1]) {
            $currentEpicNum = [int]$matches[1]
            $currentEpicName = "$wordEpic $($matches[1]): $($matches[2].Trim())"
            $inBugSection = $false
            continue
        } elseif ($matches[3] -match 'Defectos|Bugs') {
            $inBugSection = $true
            $currentEpicName = "Bugs & Defectos"
            continue
        }
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

        $epicInfo = Get-EpicInfo $currentEpicNum
        $issueTitle = "$($epicInfo.Prefix) $($id): $title"

        # Formatear DoD como lista de checkboxes limpia (sin viñetas residuales)
        $dodFormatted = ""
        $bullets = $dod -split '<br>'
        foreach ($b in $bullets) {
            $cleanBullet = [regex]::Replace($b.Trim(), '^(\s*(\u2022|[\-\*])\s*)+', '')
            if ($cleanBullet) {
                $dodFormatted += "- [ ] $cleanBullet`n"
            }
        }

        $body = @"
## $clipEmoji $wordDesc
**Historia**: $id - $title  
**$wordEpic**: $currentEpicName  
**Prioridad**: $prioRaw  
**Estado en Backlog**: ``$statusRaw``  

## $checkEmoji Criterios de $wordAcept (DoD)
$dodFormatted
---
*Sincronizado $wordAuto desde [BACKLOG.md](https://github.com/$Owner/$Repo/blob/main/BACKLOG.md)*
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
## $bugEmoji Registro de Defecto
**Incidencia**: $id - $desc  
**Severidad**: $sevRaw  
**Estado en Backlog**: ``$statusRaw``  

## $toolsEmoji $wordRes / Criterios de $wordCorr
$res

---
*Sincronizado $wordAuto desde [BACKLOG.md](https://github.com/$Owner/$Repo/blob/main/BACKLOG.md)*
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

# 3. Consultar Issues existentes en GitHub
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
Write-Host "Nuevos elementos pendientes de crear: $($missingItems.Count)" -ForegroundColor Magenta

# 4. Asegurar que las etiquetas necesarias existan en el repositorio
$labelsToEnsure = @{
    "security"     = "b60205"
    "architecture" = "1d76db"
    "pwa"          = "0075ca"
    "epic-4-recetas" = "d93f0b"
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

# 5. Si se especifica -UpdateExisting, sincronizar issues existentes que difieran
if ($UpdateExisting) {
    Write-Host "`n>>> Verificando y actualizando issues existentes..." -ForegroundColor Cyan
    $updatedCount = 0
    foreach ($item in $itemsToProcess) {
        if ($existingMap.ContainsKey($item.ID)) {
            $existing = $existingMap[$item.ID]
            $issueNum = $existing.number
            $curTitle = $existing.title
            $curBody = $existing.body

            $normCurBody = $curBody.Replace("`r`n", "`n").Trim()
            $normTargetBody = $item.Body.Replace("`r`n", "`n").Trim()

            $titleDiff = ($curTitle -ne $item.Title)
            $bodyDiff = ($normCurBody -ne $normTargetBody)

            if ($titleDiff -or $bodyDiff) {
                Write-Host "Actualizando Issue #$issueNum ($($item.ID))..." -NoNewline
                if ($DryRun) {
                    Write-Host " [SIMULADO]" -ForegroundColor Yellow
                } else {
                    $patchPayload = @{
                        title  = $item.Title
                        body   = $item.Body
                        labels = $item.Labels
                    }
                    $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes(($patchPayload | ConvertTo-Json -Depth 5))
                    try {
                        $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/issues/$issueNum" `
                            -Method Patch -Headers $headersRest -Body $jsonBytes -ContentType "application/json; charset=utf-8"

                        # Sincronizar también Prioridad y Status en el tablero de GitHub Projects v2
                        $issueNodeId = $existing.node_id
                        if ($issueNodeId) {
                            $addMutation = @"
{"query": "mutation { addProjectV2ItemById(input: { projectId: \"$ProjectId\", contentId: \"$issueNodeId\" }) { item { id } } }"}
"@
                            $addRes = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $addMutation
                            $projectItemId = $addRes.data.addProjectV2ItemById.item.id

                            $prioOptId = $priorityOptions[$item.Priority]
                            if ($projectItemId -and $prioOptId) {
                                $updatePrioGql = @"
{"query": "mutation { updateProjectV2ItemFieldValue(input: { projectId: \"$ProjectId\", itemId: \"$projectItemId\", fieldId: \"$fieldPriorityId\", value: { singleSelectOptionId: \"$prioOptId\" } }) { projectV2Item { id } } }"}
"@
                                $null = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $updatePrioGql
                            }

                            $statusOptId = $statusOptions[$item.ProjectStatus]
                            if ($projectItemId -and $statusOptId) {
                                $updateStatusGql = @"
{"query": "mutation { updateProjectV2ItemFieldValue(input: { projectId: \"$ProjectId\", itemId: \"$projectItemId\", fieldId: \"$fieldStatusId\", value: { singleSelectOptionId: \"$statusOptId\" } }) { projectV2Item { id } } }"}
"@
                                $null = Invoke-RestMethod -Uri "https://api.github.com/graphql" -Method Post -Headers $headersGql -Body $updateStatusGql
                            }
                        }

                        Write-Host " [OK]" -ForegroundColor Green
                        $updatedCount++
                        Start-Sleep -Milliseconds 400
                    } catch {
                        Write-Host " [ERROR: $($_.Exception.Message)]" -ForegroundColor Red
                    }
                }
            }
        }
    }
    Write-Host "Total issues existentes actualizados: $updatedCount" -ForegroundColor Green
}

if ($DryRun) {
    Write-Host "`n[DRY RUN] Simulacion activada. Fin del proceso." -ForegroundColor Yellow
    exit 0
}

# 6. Crear issues pendientes y agregarlos al Project V2
if ($missingItems.Count -gt 0) {
    Write-Host "`n>>> Creando nuevos issues pendientes..." -ForegroundColor Cyan
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

    Write-Host "`nNuevos elementos anadidos: $createdCount" -ForegroundColor Green
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " Sincronizacion finalizada con exito!" -ForegroundColor Green
Write-Host " Tablero: https://github.com/users/$Owner/projects/1" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
