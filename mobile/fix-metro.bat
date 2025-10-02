@echo off
echo Corrigindo problema do Metro/npx...
echo.

echo Limpando cache do npx...
npx clear-npx-cache

echo Removendo cache local...
rmdir /s /q .expo 2>nul

echo Tentando iniciar com cache limpo...
npx expo start --clear

pause