import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import SettingsScreen from './screens/SettingsScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [quizResult, setQuizResult] = useState(null);

  const navigate = (screen, data = null) => {
    if (screen === 'quiz-result') {
      setQuizResult(data);
      setCurrentScreen('result');
    } else {
      setCurrentScreen(screen);
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