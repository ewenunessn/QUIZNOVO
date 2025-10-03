import React, { useEffect, useState } from 'react';
import { colors } from '../constants/colors';

const ResultScreen = ({ navigation, result }) => {
  const score = result?.score || 0;
  const totalQuestions = 10;
  const percentage = Math.round((score / totalQuestions) * 100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const saveResult = () => {
      try {
        const result = {
          score,
          totalQuestions,
          percentage,
          date: new Date().toISOString(),
        };
        
        const existingResults = localStorage.getItem('quizResults');
        const results = existingResults ? JSON.parse(existingResults) : [];
        results.push(result);
        
        localStorage.setItem('quizResults', JSON.stringify(results));
      } catch (error) {
        console.error('Erro ao salvar resultado:', error);
      }
    };
    
    saveResult();
  }, [score, totalQuestions, percentage]);

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "Excelente!";
    if (percentage >= 60) return "Muito bem!";
    if (percentage >= 40) return "Bom trabalho!";
    return "Continue estudando!";
  };

  const getPerformanceIcon = () => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "🥈";
    if (percentage >= 40) return "🎖️";
    return "📚";
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px',
      textAlign: 'center',
    },
    iconContainer: {
      fontSize: '100px',
      marginBottom: '30px',
      animation: isVisible ? 'bounceIn 1.5s ease-out' : 'none',
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: '10px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 0.5s both' : 'none',
    },
    performanceText: {
      fontSize: '20px',
      color: colors.secondary,
      marginBottom: '40px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 0.7s both' : 'none',
    },
    scoreContainer: {
      marginBottom: '40px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 0.9s both' : 'none',
    },
    scoreText: {
      fontSize: '18px',
      color: colors.white,
      marginBottom: '20px',
    },
    progressContainer: {
      width: '250px',
      textAlign: 'center',
    },
    progressBar: {
      width: '100%',
      height: '12px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '6px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.secondary,
      width: `${percentage}%`,
      transition: 'width 1s ease-out 1.2s',
      '--target-width': `${percentage}%`,
    },
    percentageText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.secondary,
    },
    prizeContainer: {
      marginBottom: '40px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 1.4s both' : 'none',
    },
    prizeCard: {
      backgroundColor: colors.white,
      padding: '25px',
      borderRadius: '20px',
      maxWidth: '400px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
    prizeIcon: {
      fontSize: '40px',
      marginBottom: '15px',
    },
    prizeTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '15px',
    },
    prizeText: {
      fontSize: '14px',
      color: colors.gray,
      lineHeight: '20px',
    },
    button: {
      backgroundColor: colors.secondary,
      color: colors.primary,
      display: 'flex',
      alignItems: 'center',
      padding: '15px 30px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      animation: isVisible ? 'fadeIn 0.6s ease-out 1.6s both' : 'none',
    },
    buttonIcon: {
      marginRight: '10px',
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
      <div style={styles.iconContainer}>
        {getPerformanceIcon()}
      </div>
      
      <h1 style={styles.title}>
        Parabéns!
      </h1>
      
      <p style={styles.performanceText}>
        {getPerformanceMessage()}
      </p>
      
      <div style={styles.scoreContainer}>
        <p style={styles.scoreText}>
          Você acertou {score} de {totalQuestions} questões
        </p>
        
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
          <p style={styles.percentageText}>{percentage}%</p>
        </div>
      </div>
      
      <div style={styles.prizeContainer}>
        <div style={styles.prizeCard}>
          <div style={styles.prizeIcon}>🎁</div>
          <h3 style={styles.prizeTitle}>Você ganhou um brinde!</h3>
          <p style={styles.prizeText}>
            Procure nossa equipe para retirar seu presente especial por ter participado do quiz.
          </p>
        </div>
      </div>
      
      <button 
        style={styles.button}
        onClick={() => navigation('welcome')}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
      >
        <span style={styles.buttonIcon}>🏠</span>
        Voltar ao Início
      </button>
    </div>
  );
};

export default ResultScreen;