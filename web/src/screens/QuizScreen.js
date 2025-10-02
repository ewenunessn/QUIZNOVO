import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/colors';
import { questions } from '../data/questions';

const QuizScreen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (answer) => {
    const correct = answer === questions[currentQuestion].resposta;
    setSelectedAnswer(answer);
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
      setSelectedAnswer(null);
    } else {
      navigate('/result', { state: { score: score + (isCorrect ? 1 : 0) } });
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '50px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      marginBottom: '30px',
      maxWidth: '800px',
      margin: '0 auto 30px auto',
    },
    progressContainer: {
      flex: 1,
      marginRight: '20px',
    },
    progressBar: {
      height: '8px',
      backgroundColor: colors.white,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      width: `${progress}%`,
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: '14px',
      color: colors.gray,
      marginTop: '5px',
    },
    scoreContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    scoreText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: '5px',
    },
    questionContainer: {
      backgroundColor: colors.white,
      margin: '0 20px 20px 20px',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      animation: 'fadeIn 0.6s ease-out',
    },
    questionText: {
      fontSize: '18px',
      color: colors.primary,
      textAlign: 'center',
      lineHeight: '24px',
      fontWeight: '500',
    },
    buttonsContainer: {
      padding: '0 20px',
      marginTop: '20px',
      maxWidth: '800px',
      margin: '20px auto 0 auto',
    },
    answerButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      borderRadius: '25px',
      marginBottom: '15px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      width: '100%',
    },
    trueButton: {
      backgroundColor: colors.success,
      color: colors.white,
    },
    falseButton: {
      backgroundColor: colors.error,
      color: colors.white,
    },
    explanationContainer: {
      padding: '0 20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    resultIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      borderRadius: '25px',
      marginBottom: '20px',
      color: colors.white,
      fontSize: '18px',
      fontWeight: 'bold',
    },
    explanationCard: {
      backgroundColor: colors.white,
      padding: '20px',
      borderRadius: '15px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    correctAnswerText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '10px',
    },
    explanationText: {
      fontSize: '16px',
      color: colors.gray,
      lineHeight: '22px',
    },
    nextButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      width: '100%',
    },
  };

  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
          <div style={styles.progressText}>
            {currentQuestion + 1} de {questions.length}
          </div>
        </div>
        <div style={styles.scoreContainer}>
          <span style={{ color: colors.secondary, fontSize: '20px' }}>⭐</span>
          <span style={styles.scoreText}>{score}</span>
        </div>
      </div>

      {/* Question */}
      <div style={styles.questionContainer}>
        <p style={styles.questionText}>
          {questions[currentQuestion].pergunta}
        </p>
      </div>

      {/* Answer Buttons */}
      {!showExplanation && (
        <div style={styles.buttonsContainer}>
          <button 
            style={{...styles.answerButton, ...styles.trueButton}}
            onClick={() => handleAnswer(true)}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            <span style={{ marginRight: '10px' }}>✓</span>
            Verdadeiro
          </button>
          
          <button 
            style={{...styles.answerButton, ...styles.falseButton}}
            onClick={() => handleAnswer(false)}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            <span style={{ marginRight: '10px' }}>✗</span>
            Falso
          </button>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div style={styles.explanationContainer}>
          <div style={{
            ...styles.resultIndicator,
            backgroundColor: isCorrect ? colors.success : colors.error
          }}>
            <span style={{ marginRight: '10px' }}>
              {isCorrect ? '✓' : '✗'}
            </span>
            {isCorrect ? 'Correto!' : 'Incorreto!'}
          </div>
          
          <div style={styles.explanationCard}>
            <p style={styles.correctAnswerText}>
              Resposta correta: {questions[currentQuestion].resposta ? 'Verdadeiro' : 'Falso'}
            </p>
            <p style={styles.explanationText}>
              {questions[currentQuestion].explicacao}
            </p>
          </div>
          
          <button 
            style={styles.nextButton}
            onClick={nextQuestion}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            <span style={{ marginLeft: '10px' }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;