import React, { useState, useEffect } from 'react';
import { colors } from '../constants/colors';
import { questions } from '../data/questions';
import Icon from '../components/Icon';

const QuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const confirmExit = () => {
    if (window.confirm('Sair do Quiz?\n\nVocê perderá todo o progresso atual. Tem certeza que deseja sair?')) {
      navigation();
    }
  };

  const handleAnswer = (answer) => {
    const correct = answer === questions[currentQuestion].resposta;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      navigation({ score: score + (isCorrect ? 1 : 0) });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Intercepta o botão de voltar do navegador
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (e) => {
      e.preventDefault();
      confirmExit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.secondary,
      paddingTop: '60px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      marginBottom: '40px',
    },
    backButton: {
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      backgroundColor: colors.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '16px',
      cursor: 'pointer',
      border: 'none',
    },
    progressSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    questionNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.primary,
      marginRight: '12px',
    },
    progressContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    progressTrack: {
      flex: 1,
      height: '8px',
      backgroundColor: 'rgba(3, 56, 96, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginRight: '8px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: '4px',
      width: `${progress}%`,
      transition: 'width 0.5s ease-out',
    },
    totalQuestions: {
      fontSize: '16px',
      color: colors.primary,
      fontWeight: '600',
    },
    scoreContainer: {
      marginLeft: '16px',
    },
    scoreBadge: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: '6px 12px',
      borderRadius: '20px',
    },
    scoreText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: '4px',
    },
    questionCard: {
      backgroundColor: colors.white,
      margin: '0 24px 40px 24px',
      padding: '32px',
      paddingTop: '48px',
      borderRadius: '24px',
      position: 'relative',
    },
    iconCircle: {
      position: 'absolute',
      top: '-24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '48px',
      height: '48px',
      borderRadius: '24px',
      backgroundColor: colors.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },

    questionText: {
      fontSize: '20px',
      color: colors.primary,
      textAlign: 'justify',
      lineHeight: '28px',
      fontWeight: '500',
    },
    answersContainer: {
      padding: '0 24px',
    },
    answerButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: '20px 24px',
      borderRadius: '20px',
      marginBottom: '16px',
      cursor: 'pointer',
      border: 'none',
      opacity: 0.9,
      transition: 'opacity 0.2s',
      width: '100%',
      boxSizing: 'border-box',
    },
    falseButton: {
      backgroundColor: colors.error,
    },
    answerLetter: {
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      backgroundColor: colors.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '16px',
    },
    answerLetterText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.primary,
    },
    answerText: {
      fontSize: '18px',
      color: colors.white,
      fontWeight: '500',
    },
    explanationContainer: {
      flex: 1,
      padding: '0 24px',
    },
    resultBanner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '24px',
    },
    resultText: {
      color: colors.white,
      fontSize: '18px',
      fontWeight: 'bold',
      marginLeft: '8px',
    },
    explanationCard: {
      backgroundColor: colors.white,
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '24px',
    },
    correctAnswerLabel: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '12px',
    },
    explanationText: {
      fontSize: '16px',
      color: colors.gray,
      lineHeight: '24px',
    },
    nextButton: {
      backgroundColor: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 24px',
      borderRadius: '20px',
      cursor: 'pointer',
      border: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    nextButtonText: {
      color: colors.white,
      fontSize: '18px',
      fontWeight: 'bold',
      marginRight: '8px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header com barra de progresso moderna */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={confirmExit}
        >
          <Icon name="arrow-back" size={20} color={colors.primary} />
        </button>
        
        <div style={styles.progressSection}>
          <div style={styles.questionNumber}>
            {String(currentQuestion + 1).padStart(2, '0')}
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>
            <div style={styles.totalQuestions}>/{questions.length}</div>
          </div>
        </div>
        
        <div style={styles.scoreContainer}>
          <div style={styles.scoreBadge}>
            <Icon name="star" size={16} color={colors.secondary} />
            <span style={styles.scoreText}>{score}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        {/* Círculo com ícone no topo */}
        <div style={styles.iconCircle}>
          <Icon name={questions[currentQuestion].icon} size={28} />
        </div>
        
        <div style={styles.questionText}>
          {questions[currentQuestion].pergunta}
        </div>
      </div>

      {/* Answer Buttons */}
      {!showExplanation && (
        <div style={styles.answersContainer}>
          <button 
            style={styles.answerButton}
            onClick={() => handleAnswer(true)}
          >
            <div style={styles.answerLetter}>
              <span style={styles.answerLetterText}>V</span>
            </div>
            <span style={styles.answerText}>Verdadeiro</span>
          </button>
          
          <button 
            style={{...styles.answerButton, ...styles.falseButton}}
            onClick={() => handleAnswer(false)}
          >
            <div style={styles.answerLetter}>
              <span style={styles.answerLetterText}>F</span>
            </div>
            <span style={styles.answerText}>Falso</span>
          </button>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div style={styles.explanationContainer}>
          <div 
            style={{
              ...styles.resultBanner,
              backgroundColor: isCorrect ? colors.success : colors.error
            }}
          >
            <Icon name={isCorrect ? "checkmark-circle" : "close-circle"} size={24} color={isCorrect ? colors.success : colors.error} />
            <span style={styles.resultText}>
              {isCorrect ? 'Correto!' : 'Incorreto!'}
            </span>
          </div>
          
          <div style={styles.explanationCard}>
            <div style={styles.correctAnswerLabel}>
              Resposta correta: {questions[currentQuestion].resposta ? 'Verdadeiro' : 'Falso'}
            </div>
            <div style={styles.explanationText}>
              {questions[currentQuestion].explicacao}
            </div>
          </div>
          
          <button 
            style={styles.nextButton}
            onClick={nextQuestion}
          >
            <span style={styles.nextButtonText}>
              {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            </span>
            <Icon name="arrow-forward" size={20} color={colors.white} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;