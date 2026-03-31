@echo off
title Weatherscan XL Launcher

REM Change to the weatherscan directory
cd /d "%~dp0"

REM Launch the standalone wrapper
start "" /b node launcher.js
