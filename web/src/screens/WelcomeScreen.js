import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/colors';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      fontSize: '120px',
      marginBottom: '40px',
      animation: isVisible ? 'bounceIn 2s ease-out' : 'none',
    },
    icon: {
      color: colors.secondary,
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: '20px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 0.5s both' : 'none',
    },
    subtitle: {
      fontSize: '18px',
      color: colors.secondary,
      marginBottom: '60px',
      lineHeight: '24px',
      maxWidth: '500px',
      animation: isVisible ? 'fadeIn 0.6s ease-out 0.8s both' : 'none',
    },
    button: {
      backgroundColor: colors.secondary,
      color: colors.primary,
      padding: '15px 50px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      animation: isVisible ? 'fadeIn 0.6s ease-out 1.2s both' : 'none',
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
        <span style={styles.icon}>😊</span>
      </div>
      
      <h1 style={styles.title}>
        Odontologia Estética
      </h1>
      
      <p style={styles.subtitle}>
        Descubra os bastidores da saúde e estética bucal
      </p>
      
      <button 
        style={styles.button}
        onClick={() => navigate('/home')}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
      >
        Entrar
      </button>
    </div>
  );
};

export default WelcomeScreen;