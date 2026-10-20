@echo off
title Food Assistant - Servidor Local
echo ==============================================
echo  Iniciando Food Assistant en http://localhost:3000
echo ==============================================
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0server.ps1"
pause
