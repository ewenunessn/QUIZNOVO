import React, { useState, useEffect } from 'react';
import { colors } from '../constants/colors';
import Icon from '../components/Icon';

const WelcomeScreen = ({ navigation }) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [savedName, setSavedName] = useState('');

  useEffect(() => {
    checkUserName();
  }, []);

  const checkUserName = () => {
    const name = localStorage.getItem('userName');
    if (name) {
      setSavedName(name);
    } else {
      setShowNameInput(true);
    }
  };

  const saveName = () => {
    if (userName.trim().length < 2) {
      alert('Por favor, digite um nome com pelo menos 2 caracteres.');
      return;
    }
    
    try {
      localStorage.setItem('userName', userName.trim());
      setSavedName(userName.trim());
      setShowNameInput(false);
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      alert('Não foi possível salvar seu nome. Tente novamente.');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      display: 'flex',
      flexDirection: 'column',
    },
    topHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      paddingTop: '60px',
      paddingBottom: '20px',
    },
    topHeaderName: {
      fontSize: '18px',
      color: colors.secondary,
      fontWeight: '600',
    },
    settingsButton: {
      width: '44px',
      height: '44px',
      borderRadius: '22px',
      backgroundColor: 'rgba(178, 210, 209, 0.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid rgba(178, 210, 209, 0.3)',
      cursor: 'pointer',
      color: colors.secondary,
      fontSize: '20px',
    },
    contentContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 30px',
    },
    iconContainer: {
      marginBottom: '40px',
      fontSize: '120px',
      color: colors.secondary,
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center',
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '18px',
      color: colors.secondary,
      textAlign: 'center',
      marginBottom: '60px',
      lineHeight: '24px',
    },
    button: {
      backgroundColor: colors.secondary,
      padding: '15px 50px',
      borderRadius: '25px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
    },
    buttonText: {
      color: colors.primary,
      fontSize: '18px',
      fontWeight: 'bold',
    },
    logoContainer: {
      position: 'absolute',
      bottom: '80px',
      alignSelf: 'center',
    },
    logo: {
      width: '120px',
      height: '40px',
    },
    nameInputContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 30px',
    },
    nameInputTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '10px',
    },
    nameInputSubtitle: {
      fontSize: '16px',
      color: colors.secondary,
      textAlign: 'center',
      marginBottom: '40px',
    },
    nameInput: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: colors.white,
      padding: '15px 20px',
      borderRadius: '25px',
      fontSize: '16px',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: '30px',
      border: 'none',
      outline: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
    },
    saveButton: {
      backgroundColor: colors.secondary,
      display: 'flex',
      alignItems: 'center',
      padding: '15px 30px',
      borderRadius: '25px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
    },
    saveButtonText: {
      color: colors.primary,
      fontSize: '18px',
      fontWeight: 'bold',
      marginRight: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header com nome e configurações */}
      {!showNameInput && savedName && (
        <div style={styles.topHeader}>
          <div style={styles.topHeaderName}>Olá, {savedName}! 👋</div>
          <button 
            style={styles.settingsButton}
            onClick={() => navigation('settings')}
          >
            <Icon name="settings-outline" size={24} color={colors.secondary} />
          </button>
        </div>
      )}

      {/* Tela de entrada de nome */}
      {showNameInput && (
        <div style={styles.nameInputContainer}>
          <Icon name="person-circle-outline" size={80} color={colors.secondary} />
          
          <div style={styles.nameInputTitle}>
            {savedName ? 'Editar Nome' : 'Bem-vindo!'}
          </div>
          <div style={styles.nameInputSubtitle}>
            {savedName ? 'Digite seu novo nome:' : 'Para começar, digite seu nome:'}
          </div>
          
          <input
            style={styles.nameInput}
            placeholder="Seu nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={30}
            onKeyPress={(e) => e.key === 'Enter' && saveName()}
          />
          
          <button 
            style={styles.saveButton}
            onClick={saveName}
          >
            <span style={styles.saveButtonText}>Continuar</span>
            <Icon name="arrow-forward" size={20} color={colors.primary} />
          </button>
        </div>
      )}

      {/* Conteúdo principal */}
      {!showNameInput && (
        <div style={styles.contentContainer}>
          <div style={styles.iconContainer}>
            <Icon name="happy-outline" size={120} color={colors.secondary} />
          </div>
          
          <div style={styles.title}>
            Odontologia Estética
          </div>
          
          <div style={styles.subtitle}>
            Descubra os bastidores da saúde e estética bucal
          </div>
          
          <button 
            style={styles.button}
            onClick={() => navigation('home')}
          >
            <span style={styles.buttonText}>Entrar</span>
          </button>
          
          {/* Logo da Estácio no rodapé */}
          <div style={styles.logoContainer}>
            <div style={{color: colors.secondary, fontSize: '14px', textAlign: 'center'}}>
              Universidade Estácio
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;