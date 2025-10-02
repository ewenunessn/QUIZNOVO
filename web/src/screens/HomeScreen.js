import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/colors';

const HomeScreen = () => {
  const navigate = useNavigate();

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
      textAlign: 'center',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.6s ease-out',
    },
    iconContainer: {
      fontSize: '60px',
      marginBottom: '20px',
    },
    icon: {
      color: colors.primary,
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '20px',
    },
    description: {
      fontSize: '16px',
      color: colors.gray,
      textAlign: 'justify',
      lineHeight: '22px',
      marginBottom: '30px',
    },
    button: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '15px 40px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
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
        <div style={styles.iconContainer}>
          <span style={styles.icon}>😊</span>
        </div>
        
        <h1 style={styles.title}>Quiz Odontologia Estética</h1>
        
        <p style={styles.description}>
          Este jogo foi criado para transmitir informações sobre os bastidores da odontologia estética — saúde e estética bucal — aspectos que nem sempre aparecem nas redes sociais, mas que são discutidos em consultas e baseados em conhecimentos técnicos.
          <br /><br />
          Com perguntas de verdadeiro ou falso, você aprenderá a diferenciar expectativas irreais de práticas seguras, adquirindo conhecimento que ajuda a cuidar do sorriso de forma consciente e saudável.
        </p>
        
        <button 
          style={styles.button}
          onClick={() => navigate('/instructions')}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Iniciar Quiz
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;