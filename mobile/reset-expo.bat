@echo off
echo ========================================
echo  LIMPEZA COMPLETA DO EXPO
echo ========================================
echo.

echo 1. Removendo node_modules...
rmdir /s /q node_modules 2>nul

echo 2. Removendo package-lock.json...
del package-lock.json 2>nul

echo 3. Removendo cache do Expo...
rmdir /s /q .expo 2>nul

echo 4. Limpando cache do npm...
npm cache clean --force

echo 5. Limpando cache do npx...
npx clear-npx-cache

echo 6. Desinstalando Expo CLI global antigo...
npm uninstall -g expo-cli 2>nul

echo 7. Instalando Expo CLI mais recente...
npm install -g @expo/cli@latest

echo 8. Instalando dependencias do projeto...
npm install

echo.
echo ========================================
echo  LIMPEZA CONCLUIDA!
echo ========================================
echo.
echo Agora execute: npx expo start --clear
pause