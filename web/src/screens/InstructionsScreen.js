import React from 'react';
import { colors } from '../constants/colors';

const InstructionsScreen = ({ navigation }) => {

  const instructions = [
    "Você receberá 10 questões sobre odontologia estética",
    "Para cada questão, escolha Verdadeiro ou Falso",
    "Após cada resposta, você verá uma explicação detalhada",
    "No final, você ganhará um brinde especial!"
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.secondary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '600px',
      width: '100%',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.6s ease-out',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: '30px',
    },
    instructionsList: {
      marginBottom: '40px',
    },
    instructionItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    numberContainer: {
      width: '30px',
      height: '30px',
      borderRadius: '15px',
      backgroundColor: colors.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '15px',
      flexShrink: 0,
    },
    number: {
      color: colors.white,
      fontSize: '16px',
      fontWeight: 'bold',
    },
    instructionText: {
      fontSize: '16px',
      color: colors.gray,
      lineHeight: '22px',
      flex: 1,
    },
    button: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '15px 30px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
    },
    buttonIcon: {
      marginLeft: '10px',
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
      <div style={styles.card}>
        <h1 style={styles.title}>Como Funciona</h1>
        
        <div style={styles.instructionsList}>
          {instructions.map((instruction, index) => (
            <div key={index} style={styles.instructionItem}>
              <div style={styles.numberContainer}>
                <span style={styles.number}>{index + 1}</span>
              </div>
              <span style={styles.instructionText}>{instruction}</span>
            </div>
          ))}
        </div>
        
        <button 
          style={styles.button}
          onClick={() => navigation('quiz')}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Começar Agora
          <span style={styles.buttonIcon}>→</span>
        </button>
      </div>
    </div>
  );
};

export default InstructionsScreen;