# 🔧 Correção do Problema do Expo/Metro

## Problema
Erro: `Package subpath './src/lib/TerminalReporter' is not defined by "exports"`
Isso acontece por conflito de cache entre versões do Metro/Expo.

## ✅ Soluções (tente na ordem)

### Opção 1: Correção Rápida do Metro
```bash
cd mobile
fix-metro.bat
```

### Opção 2: Limpeza Completa (se Opção 1 não funcionar)
```bash
cd mobile
reset-expo.bat
```

### Opção 3: Manual (última opção)
```bash
cd mobile

# 1. Limpar caches
npx clear-npx-cache
npm cache clean --force
rmdir /s /q .expo
rmdir /s /q node_modules
del package-lock.json

# 2. Atualizar Expo CLI
npm uninstall -g expo-cli
npm install -g @expo/cli@latest

# 3. Reinstalar
npm install

# 4. Iniciar com cache limpo
npx expo start --clear
```

## 🔍 Verificação

Após executar os comandos acima, execute:
```bash
npx expo --version
```

Deve mostrar versão 51.x.x

## 📱 Testando

1. Execute: `npx expo start`
2. Escaneie o QR code com seu Expo Go 54
3. O app deve carregar sem problemas

## ⚠️ Se ainda não funcionar

### Atualizar Expo CLI globalmente:
```bash
npm uninstall -g expo-cli
npm install -g @expo/cli@latest
```

### Verificar versão do Node.js:
```bash
node --version
```
Recomendado: Node.js 18.x ou superior

## 📋 Versões Corretas

- **Expo SDK**: 51.0.28
- **React Native**: 0.74.5  
- **Expo Go**: 54.x (seu celular)
- **Node.js**: 18.x+

## 🎯 Resultado Esperado

Após a correção, você deve conseguir:
- ✅ Executar `npx expo start` sem erros
- ✅ Escanear QR code com Expo Go 54
- ✅ Ver o app carregando no celular
- ✅ Navegar entre as telas do quiz