# 🚨 Correções Urgentes - Implementação Imediata

## 1. 🔒 Proteger Firebase (CRÍTICO)

### Passo 1: Criar arquivo .env
```bash
# Criar na raiz do projeto mobile/
FIREBASE_API_KEY=AIzaSyD9cm0-9Wazg_l6Nv6ZiyehqhCroMlA6ow
FIREBASE_AUTH_DOMAIN=quiz-odontologia-estetica.firebaseapp.com
FIREBASE_PROJECT_ID=quiz-odontologia-estetica
FIREBASE_STORAGE_BUCKET=quiz-odontologia-estetica.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=762109202575
FIREBASE_APP_ID=1:762109202575:web:b39036a9a507e20708e0fa
```

### Passo 2: Atualizar .gitignore
```bash
# Adicionar ao .gitignore
.env
.env.local
.env.production
```

### Passo 3: Configurar app.json
```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": process.env.FIREBASE_API_KEY,
      "firebaseAuthDomain": process.env.FIREBASE_AUTH_DOMAIN,
      "firebaseProjectId": process.env.FIREBASE_PROJECT_ID,
      "firebaseStorageBucket": process.env.FIREBASE_STORAGE_BUCKET,
      "firebaseMessagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "firebaseAppId": process.env.FIREBASE_APP_ID
    }
  }
}
```

### Passo 4: Atualizar firebase.js
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
```

### Passo 5: Configurar Firebase Security Rules
```javascript
// No Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Perguntas: leitura pública, escrita bloqueada
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Configurações: leitura pública, escrita bloqueada
    match /settings/{settingId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 2. ⏱️ Adicionar Timeouts (ALTO)

### Atualizar questionsService.js
```javascript
// Adicionar função helper
const withTimeout = (promise, timeoutMs = 10000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        )
    ]);
};

// Atualizar getQuestions
export const getQuestions = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('id', 'asc'));
        const querySnapshot = await withTimeout(getDocs(q), 10000);
        
        const questions = [];
        querySnapshot.forEach((doc) => {
            questions.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        
        return questions;
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        
        // Retornar perguntas em cache se disponível
        const cached = await getCachedQuestions();
        if (cached) {
            console.log('Usando perguntas em cache');
            return cached;
        }
        
        throw error;
    }
};

// Adicionar cache
const getCachedQuestions = async () => {
    try {
        const cached = await AsyncStorage.getItem('cached_questions');
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

const setCachedQuestions = async (questions) => {
    try {
        await AsyncStorage.setItem('cached_questions', JSON.stringify(questions));
    } catch (error) {
        console.error('Erro ao cachear perguntas:', error);
    }
};
```

---

## 3. 🔄 Corrigir Race Condition no Score (ALTO)

### Atualizar QuizScreen.js
```javascript
import React, { useState, useEffect, useRef } from 'react';

const QuizScreen = ({ navigation }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const scoreRef = useRef(0); // ✅ Adicionar ref
    
    const handleAnswer = (answer) => {
        const correct = answer === questions[currentQuestion].resposta;
        setIsCorrect(correct);

        if (correct) {
            soundEffects.playCorrect();
            scoreRef.current += 1; // ✅ Atualizar ref
            setScore(scoreRef.current);
            
            // Animação no score...
        } else {
            soundEffects.playIncorrect();
        }
        
        // ... resto do código
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            // próxima pergunta...
        } else {
            // ✅ Usar ref ao invés de state
            navigation.navigate('Result', { 
                score: scoreRef.current,
                totalQuestions: questions.length 
            });
        }
    };
};
```

---

## 4. 🔄 Melhorar LoadingScreen (ALTO)

### Atualizar LoadingScreen.js
```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { getQuestions, getAppSettings, initializeDefaultData } from '../services/questionsService';

const LoadingScreen = ({ onLoadComplete }) => {
    const [error, setError] = useState(null);
    const [retrying, setRetrying] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setError(null);
            
            // Timeout de 15 segundos para inicialização
            await Promise.race([
                initializeDefaultData(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout na inicialização')), 15000)
                )
            ]);
            
            // Timeout de 10 segundos para carregar dados
            await Promise.race([
                Promise.all([
                    getQuestions(),
                    getAppSettings()
                ]),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout ao carregar dados')), 10000)
                )
            ]);
            
            // Pequeno delay para garantir que tudo está pronto
            setTimeout(() => {
                onLoadComplete();
            }, 500);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            setError(error.message);
            
            // Mostrar opções ao usuário
            Alert.alert(
                'Erro de Conexão',
                'Não foi possível carregar os dados. Verifique sua conexão com a internet.',
                [
                    { 
                        text: 'Tentar Novamente', 
                        onPress: () => {
                            setRetrying(true);
                            loadAllData();
                        }
                    },
                    { 
                        text: 'Continuar Mesmo Assim', 
                        onPress: () => onLoadComplete(),
                        style: 'cancel'
                    }
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.loadingText}>
                {retrying ? 'Tentando novamente...' : 'Carregando...'}
            </Text>
            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: colors.secondary,
    },
    errorText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
    },
});

export default LoadingScreen;
```

---

## 5. 📊 Limitar Histórico de Resultados (MÉDIO)

### Atualizar ResultScreen.js
```javascript
const saveResult = async () => {
    try {
        const result = {
            score: validScore,
            totalQuestions: validTotal,
            percentage,
            date: new Date().toISOString(),
        };
        
        const existingResults = await AsyncStorage.getItem('quizResults');
        let results = existingResults ? JSON.parse(existingResults) : [];
        
        // ✅ Adicionar novo resultado
        results.push(result);
        
        // ✅ Limitar a 50 resultados mais recentes
        const MAX_RESULTS = 50;
        if (results.length > MAX_RESULTS) {
            results = results.slice(-MAX_RESULTS);
        }
        
        await AsyncStorage.setItem('quizResults', JSON.stringify(results));
    } catch (error) {
        console.error('Erro ao salvar resultado:', error);
    }
};
```

---

## 6. 🎵 Melhorar SoundEffects (MÉDIO)

### Atualizar soundEffects.js
```javascript
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.enabled = true; // ✅ Flag para desabilitar se falhar
        this.failedAttempts = 0;
    }

    init() {
        if (this.initialized || !this.enabled) return;
        
        // ✅ Desabilitar após 3 falhas
        if (this.failedAttempts >= 3) {
            this.enabled = false;
            return;
        }

        try {
            if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                this.failedAttempts = 0;
            }
        } catch (error) {
            console.log('Audio context não disponível:', error);
            this.failedAttempts++;
            if (this.failedAttempts >= 3) {
                console.log('Desabilitando sons permanentemente');
                this.enabled = false;
            }
        }
    }

    playCorrect() {
        if (!this.enabled) return; // ✅ Retorna silenciosamente
        this.init();
        if (!this.audioContext) return;
        
        try {
            // ... código existente
        } catch (error) {
            console.log('Erro ao reproduzir som:', error);
            this.failedAttempts++;
        }
    }
    
    // ✅ Aplicar o mesmo padrão para todos os métodos
}
```

---

## 7. 🔤 Melhorar Validação de Nome (MÉDIO)

### Atualizar WelcomeScreen.js
```javascript
const validateName = (name) => {
    const trimmed = name.trim();
    
    // Mínimo 2, máximo 30 caracteres
    if (trimmed.length < 2) {
        return { valid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (trimmed.length > 30) {
        return { valid: false, message: 'Nome deve ter no máximo 30 caracteres' };
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

const saveName = async () => {
    const validation = validateName(userName);
    
    if (!validation.valid) {
        Alert.alert('Nome inválido', validation.message);
        return;
    }

    try {
        await AsyncStorage.setItem('userName', userName.trim());
        setSavedName(userName.trim());
        setShowNameInput(false);
        // ... resto do código
    } catch (error) {
        console.error('Erro ao salvar nome:', error);
        Alert.alert('Erro', 'Não foi possível salvar seu nome. Tente novamente.');
    }
};
```

---

## 📋 Ordem de Implementação Recomendada

### Dia 1 - Segurança
1. ✅ Mover API keys para .env
2. ✅ Configurar Firebase Rules
3. ✅ Atualizar .gitignore

### Dia 2 - Estabilidade
4. ✅ Adicionar timeouts
5. ✅ Corrigir race condition
6. ✅ Melhorar LoadingScreen

### Dia 3 - Qualidade
7. ✅ Limitar histórico
8. ✅ Melhorar soundEffects
9. ✅ Validação de nome

---

## 🧪 Como Testar

### Teste 1: Timeout
```javascript
// Desligar WiFi e tentar abrir o app
// Deve mostrar erro após 10-15 segundos
```

### Teste 2: Race Condition
```javascript
// Responder todas as perguntas rapidamente
// Verificar se o score final está correto
```

### Teste 3: Validação
```javascript
// Tentar nomes inválidos:
// - "  " (apenas espaços)
// - "A" (muito curto)
// - "A".repeat(50) (muito longo)
// - "@@@@" (caracteres inválidos)
```

---

## ⚠️ IMPORTANTE

Após implementar as correções:
1. Testar em dispositivo real
2. Testar com conexão lenta
3. Testar sem conexão
4. Verificar logs do Firebase
5. Monitorar uso de memória

---

**Status:** Pronto para implementação  
**Tempo estimado:** 2-3 dias  
**Prioridade:** CRÍTICA 🚨
