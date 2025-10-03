import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - Credenciais do seu projeto
const firebaseConfig = {
    apiKey: "AIzaSyD9cm0-9Wazg_l6Nv6ZiyehqhCroMlA6ow",
    authDomain: "quiz-odontologia-estetica.firebaseapp.com",
    projectId: "quiz-odontologia-estetica",
    storageBucket: "quiz-odontologia-estetica.firebasestorage.app",
    messagingSenderId: "762109202575",
    appId: "1:762109202575:web:b39036a9a507e20708e0fa"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;