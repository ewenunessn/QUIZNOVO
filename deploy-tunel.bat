@echo off
title Deploy do Tunel FTP Android
color 0A

echo ========================================
echo   DEPLOY DO TUNEL FTP ANDROID
echo ========================================
echo.

echo [1/5] Verificando dependencias...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI nao encontrado
    echo Instale com: npm install -g vercel
    pause
    exit /b 1
)
echo ✅ Vercel CLI encontrado

echo.
echo [2/5] Fazendo deploy na Vercel...
vercel --prod

if %errorlevel% neq 0 (
    echo ❌ Erro no deploy
    pause
    exit /b 1
)

echo.
echo [3/5] Obtendo URL do deploy...
for /f "tokens=*" %%i in ('vercel --prod 2^>nul ^| findstr "https://"') do set DEPLOY_URL=%%i

if "%DEPLOY_URL%"=="" (
    echo ⚠️ Nao foi possivel obter URL automaticamente
    set DEPLOY_URL=https://odontoquiz.vercel.app
    echo Usando URL padrao: %DEPLOY_URL%
)

echo ✅ URL do deploy: %DEPLOY_URL%

echo.
echo [4/5] Configurando IP do dispositivo Android...
echo.
echo Obtendo IP do dispositivo conectado via ADB...
for /f "tokens=*" %%i in ('adb shell ip route get 1.1.1.1 2^>nul ^| findstr "src"') do (
    for %%j in (%%i) do (
        echo %%j | findstr /R "^[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*$" >nul
        if !errorlevel! equ 0 set DEVICE_IP=%%j
    )
)

if "%DEVICE_IP%"=="" (
    echo ⚠️ Nao foi possivel obter IP automaticamente
    set /p DEVICE_IP="Digite o IP do dispositivo Android: "
)

echo ✅ IP do dispositivo: %DEVICE_IP%

echo.
echo Configurando IP no tunel...
curl -X PUT "%DEPLOY_URL%/api/ftp-config" ^
  -H "Content-Type: application/json" ^
  -d "{\"target\": \"http://%DEVICE_IP%:8080\"}"

echo.
echo [5/5] Testando conectividade...
curl -s "%DEPLOY_URL%/api/ftp-status" | findstr "success" >nul
if %errorlevel% equ 0 (
    echo ✅ Tunel configurado com sucesso!
) else (
    echo ⚠️ Tunel configurado, mas dispositivo pode estar offline
)

echo.
echo ========================================
echo   TUNEL FTP ATIVO!
echo ========================================
echo.
echo 🌐 Painel de Controle:
echo %DEPLOY_URL%/ftp-panel
echo.
echo 📁 Navegador de Arquivos:
echo %DEPLOY_URL%/ftp
echo.
echo 🔧 API de Status:
echo %DEPLOY_URL%/api/ftp-status
echo.
echo 🔍 Descoberta de Dispositivos:
echo %DEPLOY_URL%/api/ftp-discover
echo.
echo 👤 Credenciais: admin / admin123
echo.
echo ========================================
echo   PROXIMOS PASSOS
echo ========================================
echo.
echo 1. Abra o painel: %DEPLOY_URL%/ftp-panel
echo 2. Verifique o status dos servidores
echo 3. Use a descoberta automatica se necessario
echo 4. Acesse seus arquivos: %DEPLOY_URL%/ftp
echo.
echo 💡 Dica: Salve esses links nos favoritos!
echo.

echo Deseja abrir o painel agora? (S/N)
set /p open="Resposta: "

if /i "%open%"=="S" (
    start "" "%DEPLOY_URL%/ftp-panel"
    echo.
    echo 🚀 Painel aberto no navegador!
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul