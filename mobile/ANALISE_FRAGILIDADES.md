# 🔍 Análise de Fragilidades e Riscos - Quiz Odontologia

**Data:** 10/03/2025  
**Tipo:** Análise Preventiva de Bugs e Problemas

---

## 🚨 CRÍTICO - Problemas que DEVEM ser corrigidos

### 1. 🔥 **API Keys Expostas no Código**
**Arquivo:** `mobile/src/config/firebase.js`  
**Risco:** CRÍTICO ⚠️⚠️⚠️

```javascript
// ❌ PROBLEMA: Credenciais expostas publicamente
const firebaseConfig = {
    apiKey: "AIzaSyD9cm0-9Wazg_l6Nv6ZiyehqhCroMlA6ow",
    authDomain: "quiz-odontologia-estetica.firebaseapp.com",
    projectId: "quiz-odontologia-estetica",
    // ...
};
```

**Impacto:**
- ❌ Qualquer pessoa pode acessar seu Firebase
- ❌ Possível manipulação de dados
- ❌ Custos inesperados (uso abusivo)
- ❌ Violação de dados

**Solução:**
```javascript
// ✅ Usar variáveis de ambiente
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: Constants.expoConfig.extra.firebaseApiKey,
    authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
    // ...
};
```

**Ações Necessárias:**
1. Configurar Firebase Security Rules
2. Mover credenciais para `.env`
3. Adicionar `.env` ao `.gitignore`
4. Regenerar API keys se já publicado

---

### 2. 🔒 **Sem Regras de Segurança no Firebase**
**Risco:** CRÍTICO ⚠️⚠️⚠️

**Problema:**
- Qualquer usuário pode ler/escrever no Firestore
- Sem autenticação implementada
- Admin acessível sem login

**Impacto:**
- ❌ Dados podem ser deletados por qualquer um
- ❌ Perguntas podem ser modificadas
- ❌ Configurações podem ser alteradas
- ❌ Spam e abuso

**Solução Mínima:**
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Perguntas: leitura pública, escrita apenas admin
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false; // Desabilitar escrita pública
    }
    
    // Configurações: leitura pública, escrita apenas admin
    match /settings/{settingId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Solução Ideal:**
- Implementar Firebase Authentication
- Criar role de admin
- Proteger rotas administrativas

---

## ⚠️ ALTO - Problemas que podem causar bugs

### 3. 🔄 **Race Condition no Score**
**Arquivo:** `QuizScreen.js`  
**Risco:** ALTO ⚠️⚠️

**Problema:**
```javascript
// Potencial race condition
setScore(currentScore => {
    navigation.navigate('Result', { 
        score: currentScore,
        totalQuestions: questions.length 
    });
    return currentScore;
});
```

**Cenário de Falha:**
- Usuário clica rapidamente em "Próxima"
- Score pode não estar atualizado
- Navegação pode acontecer antes do setState

**Solução:**
```javascript
// Usar useRef para garantir valor correto
const scoreRef = useRef(0);

const handleAnswer = (answer) => {
    if (correct) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
    }
};

const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
        // próxima pergunta
    } else {
        navigation.navigate('Result', { 
            score: scoreRef.current,
            totalQuestions: questions.length 
        });
    }
};
```

---

### 4. 📱 **Sem Tratamento de Conexão Offline**
**Risco:** ALTO ⚠️⚠️

**Problema:**
- App não funciona sem internet
- Sem cache de perguntas
- Sem feedback de erro de conexão
- Loading infinito se Firebase estiver fora

**Cenários de Falha:**
1. Usuário perde conexão durante o quiz
2. Firebase está temporariamente indisponível
3. Timeout de rede

**Impacto:**
- ❌ App trava na tela de loading
- ❌ Perguntas não carregam
- ❌ Usuário não sabe o que fazer
- ❌ Experiência ruim

**Solução:**
```javascript
// Adicionar timeout e retry
const loadQuestionsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const questions = await Promise.race([
                getQuestions(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 10000)
                )
            ]);
            return questions;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Adicionar cache local
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCachedQuestions = async () => {
    try {
        const cached = await AsyncStorage.getItem('cached_questions');
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};
```

---

### 5. 🎵 **AudioContext pode falhar em alguns navegadores**
**Arquivo:** `soundEffects.js`  
**Risco:** MÉDIO ⚠️

**Problema:**
- AudioContext requer interação do usuário (política de autoplay)
- Pode não funcionar em navegadores antigos
- Sem fallback silencioso

**Cenário de Falha:**
- Usuário abre o app
- Sons não tocam
- Console cheio de erros

**Solução:**
```javascript
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.enabled = true; // Flag para desabilitar se falhar
    }

    init() {
        if (this.initialized || !this.enabled) return;

        try {
            if (typeof window !== 'undefined') {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
            }
        } catch (error) {
            console.log('Audio não disponível, desabilitando sons');
            this.enabled = false; // Desabilita permanentemente
        }
    }

    playCorrect() {
        if (!this.enabled) return; // Retorna silenciosamente
        this.init();
        if (!this.audioContext) return;
        // ... resto do código
    }
}
```

---

### 6. 🔄 **LoadingScreen pode travar indefinidamente**
**Arquivo:** `LoadingScreen.js`  
**Risco:** ALTO ⚠️⚠️

**Problema:**
```javascript
// Se initializeDefaultData falhar, pode demorar muito
await initializeDefaultData();
```

**Cenário de Falha:**
- Firebase lento ou fora do ar
- Timeout não configurado
- Usuário fica preso na tela de loading

**Solução:**
```javascript
const loadAllData = async () => {
    try {
        // Timeout de 15 segundos
        await Promise.race([
            initializeDefaultData(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 15000)
            )
        ]);
        
        // Carregar dados com timeout
        await Promise.race([
            Promise.all([getQuestions(), getAppSettings()]),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 10000)
            )
        ]);
        
        setTimeout(() => onLoadComplete(), 500);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        // Mostrar mensagem de erro ao usuário
        Alert.alert(
            'Erro de Conexão',
            'Não foi possível carregar os dados. Verifique sua conexão.',
            [
                { text: 'Tentar Novamente', onPress: () => loadAllData() },
                { text: 'Continuar Offline', onPress: () => onLoadComplete() }
            ]
        );
    }
};
```

---

## ⚠️ MÉDIO - Problemas que podem afetar UX

### 7. 📊 **Histórico de Resultados pode crescer indefinidamente**
**Arquivo:** `ResultScreen.js`  
**Risco:** MÉDIO ⚠️

**Problema:**
```javascript
// Adiciona resultado sem limite
results.push(result);
await AsyncStorage.setItem('quizResults', JSON.stringify(results));
```

**Impacto:**
- AsyncStorage pode ficar cheio
- Performance degradada
- App pode crashar

**Solução:**
```javascript
// Limitar a 50 resultados mais recentes
const MAX_RESULTS = 50;
results.push(result);
if (results.length > MAX_RESULTS) {
    results = results.slice(-MAX_RESULTS);
}
await AsyncStorage.setItem('quizResults', JSON.stringify(results));
```

---

### 8. 🎨 **Animações podem causar lag em dispositivos antigos**
**Risco:** MÉDIO ⚠️

**Problema:**
- Múltiplas animações simultâneas
- Sem verificação de performance
- Pode travar em dispositivos low-end

**Solução:**
```javascript
// Detectar dispositivo low-end e simplificar animações
import { Platform } from 'react-native';

const isLowEndDevice = () => {
    // Heurística simples
    return Platform.OS === 'android' && Platform.Version < 28;
};

const startAnimations = () => {
    if (isLowEndDevice()) {
        // Animações simplificadas
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    } else {
        // Animações completas
        // ...
    }
};
```

---

### 9. 🔤 **Validação de Nome Fraca**
**Arquivo:** `WelcomeScreen.js`  
**Risco:** BAIXO ⚠️

**Problema:**
```javascript
if (userName.trim().length < 2) {
    Alert.alert('Nome inválido', '...');
}
```

**Cenários não tratados:**
- Nome com apenas espaços: "  "
- Nome com caracteres especiais: "@@@@"
- Nome muito longo: "A".repeat(1000)
- Emojis: "😀😀😀"

**Solução:**
```javascript
const validateName = (name) => {
    const trimmed = name.trim();
    
    // Mínimo 2, máximo 30 caracteres
    if (trimmed.length < 2 || trimmed.length > 30) {
        return { valid: false, message: 'Nome deve ter entre 2 e 30 caracteres' };
    }
    
    // Apenas letras, espaços e alguns caracteres especiais
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(trimmed)) {
        return { valid: false, message: 'Nome contém caracteres inválidos' };
    }
    
    // Não pode ser apenas espaços
    if (trimmed.replace(/\s/g, '').length === 0) {
        return { valid: false, message: 'Nome não pode ser apenas espaços' };
    }
    
    return { valid: true };
};
```

---

### 10. 🔄 **Botão de voltar do Android não tratado em todas as telas**
**Risco:** MÉDIO ⚠️

**Problema:**
- Apenas QuizScreen intercepta o botão de voltar
- Outras telas podem ter comportamento inesperado

**Solução:**
```javascript
// Adicionar em todas as telas críticas
useFocusEffect(
    React.useCallback(() => {
        if (Platform.OS === 'android') {
            const onBackPress = () => {
                // Comportamento customizado
                return true; // Impede comportamento padrão
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription?.remove();
        }
    }, [])
);
```

---

## ⚠️ BAIXO - Melhorias recomendadas

### 11. 📱 **Sem tratamento de orientação de tela**
**Risco:** BAIXO

**Problema:**
- Layout pode quebrar em landscape
- Sem lock de orientação

**Solução:**
```javascript
// app.json
{
  "expo": {
    "orientation": "portrait"
  }
}
```

---

### 12. ♿ **Acessibilidade não implementada**
**Risco:** BAIXO

**Problema:**
- Sem labels para screen readers
- Sem suporte a TalkBack/VoiceOver
- Contraste de cores não validado

**Solução:**
```javascript
<TouchableOpacity
    accessible={true}
    accessibilityLabel="Botão Verdadeiro"
    accessibilityHint="Selecione se a afirmação é verdadeira"
    accessibilityRole="button"
>
```

---

### 13. 🌐 **Sem internacionalização**
**Risco:** BAIXO

**Problema:**
- Textos hardcoded em português
- Difícil adicionar outros idiomas

**Solução:**
```javascript
// Usar i18n
import i18n from 'i18n-js';

i18n.translations = {
    pt: { welcome: 'Bem-vindo' },
    en: { welcome: 'Welcome' }
};
```

---

### 14. 📊 **Sem Analytics**
**Risco:** BAIXO

**Problema:**
- Não sabe quantos usuários usam o app
- Não sabe onde os usuários desistem
- Sem dados para melhorias

**Solução:**
```javascript
// Firebase Analytics
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);
logEvent(analytics, 'quiz_started');
logEvent(analytics, 'quiz_completed', { score: 8 });
```

---

### 15. 🧪 **Sem Testes**
**Risco:** BAIXO (mas importante)

**Problema:**
- Sem testes unitários
- Sem testes de integração
- Difícil garantir que mudanças não quebram nada

**Solução:**
```javascript
// Jest + React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';

test('should navigate to quiz on button press', () => {
    const { getByText } = render(<HomeScreen />);
    const button = getByText('Iniciar Quiz');
    fireEvent.press(button);
    expect(navigation.navigate).toHaveBeenCalledWith('Instructions');
});
```

---

## 🔧 Problemas de Performance

### 16. 🐌 **Re-renders desnecessários**
**Risco:** BAIXO

**Problema:**
- Componentes re-renderizam sem necessidade
- Sem uso de React.memo ou useMemo

**Solução:**
```javascript
// Memoizar componentes pesados
const QuestionCard = React.memo(({ question }) => {
    return <Text>{question.pergunta}</Text>;
});

// Memoizar cálculos pesados
const percentage = useMemo(() => {
    return Math.round((score / totalQuestions) * 100);
}, [score, totalQuestions]);
```

---

### 17. 📦 **Bundle size não otimizado**
**Risco:** BAIXO

**Problema:**
- Importando bibliotecas inteiras
- Sem code splitting
- Sem lazy loading

**Solução:**
```javascript
// Importar apenas o necessário
import { getFirestore } from 'firebase/firestore';
// Ao invés de: import firebase from 'firebase';
```

---

## 📋 Checklist de Correções Prioritárias

### 🚨 URGENTE (Fazer ANTES de publicar)
- [ ] Mover API keys para variáveis de ambiente
- [ ] Configurar Firebase Security Rules
- [ ] Adicionar timeout em operações de rede
- [ ] Implementar tratamento de offline
- [ ] Adicionar limite ao histórico de resultados

### ⚠️ IMPORTANTE (Fazer logo)
- [ ] Corrigir race condition no score
- [ ] Melhorar validação de nome
- [ ] Adicionar tratamento de erro no LoadingScreen
- [ ] Desabilitar sons graciosamente se falhar
- [ ] Tratar botão voltar em todas as telas

### 💡 RECOMENDADO (Fazer quando possível)
- [ ] Adicionar Analytics
- [ ] Implementar testes
- [ ] Melhorar acessibilidade
- [ ] Otimizar performance
- [ ] Lock de orientação

---

## 🎯 Resumo Executivo

### Riscos Críticos: 2
1. API Keys expostas
2. Sem regras de segurança Firebase

### Riscos Altos: 4
1. Race condition no score
2. Sem tratamento offline
3. LoadingScreen pode travar
4. Histórico sem limite

### Riscos Médios: 6
- AudioContext pode falhar
- Animações em dispositivos antigos
- Validação de nome fraca
- Botão voltar inconsistente
- Sem orientação de tela
- Sem acessibilidade

### Riscos Baixos: 5
- Sem internacionalização
- Sem analytics
- Sem testes
- Re-renders desnecessários
- Bundle não otimizado

---

## 🚀 Plano de Ação Recomendado

### Fase 1 - Segurança (1-2 dias)
1. Mover credenciais para .env
2. Configurar Firebase Rules
3. Regenerar API keys

### Fase 2 - Estabilidade (2-3 dias)
1. Adicionar timeouts
2. Implementar offline mode
3. Corrigir race conditions
4. Melhorar tratamento de erros

### Fase 3 - Qualidade (3-5 dias)
1. Adicionar testes básicos
2. Melhorar validações
3. Otimizar performance
4. Adicionar analytics

---

**Conclusão:** O app está funcional mas tem **fragilidades críticas de segurança** que DEVEM ser corrigidas antes de publicação. As outras fragilidades são gerenciáveis e podem ser corrigidas gradualmente.

**Prioridade Máxima:** Segurança do Firebase! 🔒
