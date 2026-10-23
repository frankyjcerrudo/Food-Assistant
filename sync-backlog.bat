@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-backlog.ps1" %*
if errorlevel 1 (
    echo Error durante la sincronizacion.
)
