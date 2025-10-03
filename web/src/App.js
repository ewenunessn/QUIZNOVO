import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import SettingsScreen from './screens/SettingsScreen';
import AdminScreen from './screens/AdminScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [quizResult, setQuizResult] = useState(null);

  // Verificar se a URL contém /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentScreen('admin');
    }
  }, []);

  const navigate = (screen, data = null) => {
    if (screen === 'quiz-result') {
      setQuizResult(data);
      setCurrentScreen('result');
    } else if (screen === 'admin') {
      setCurrentScreen('admin');
      window.history.pushState({}, '', '/admin');
    } else {
      setCurrentScreen(screen);
      if (screen !== 'admin') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen navigation={navigate} />;
      case 'home':
        return <HomeScreen navigation={navigate} />;
      case 'instructions':
        return <InstructionsScreen navigation={navigate} />;
      case 'quiz':
        return <QuizScreen navigation={(data) => data ? navigate('quiz-result', data) : navigate('instructions')} />;
      case 'result':
        return <ResultScreen navigation={navigate} result={quizResult} />;
      case 'settings':
        return <SettingsScreen navigation={() => navigate('welcome')} />;
      case 'admin':
        return <AdminScreen onNavigate={navigate} />;
      default:
        return <WelcomeScreen navigation={navigate} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;