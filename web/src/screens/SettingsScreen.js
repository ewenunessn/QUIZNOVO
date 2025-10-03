import React, { useState, useEffect } from 'react';
import { colors } from '../constants/colors';
import Icon from '../components/Icon';

const SettingsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = () => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
      setNewName(name);
    }
  };

  const saveName = () => {
    if (newName.trim().length < 2) {
      alert('Por favor, digite um nome com pelo menos 2 caracteres.');
      return;
    }
    
    try {
      localStorage.setItem('userName', newName.trim());
      setUserName(newName.trim());
      setIsEditing(false);
      alert('Nome alterado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      alert('Não foi possível salvar seu nome. Tente novamente.');
    }
  };

  const cancelEdit = () => {
    setNewName(userName);
    setIsEditing(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.secondary,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      paddingTop: '60px',
      paddingBottom: '20px',
      backgroundColor: colors.primary,
    },
    backButton: {
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
      color: colors.white,
      fontSize: '20px',
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: colors.white,
    },
    placeholder: {
      width: '40px',
    },
    content: {
      flex: 1,
      padding: '20px',
    },
    section: {
      marginBottom: '30px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: '10px',
    },
    profileCard: {
      backgroundColor: colors.white,
      padding: '20px',
      borderRadius: '15px',
    },
    profileLabel: {
      fontSize: '14px',
      color: colors.gray,
      marginBottom: '8px',
      fontWeight: '500',
    },
    nameContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    nameText: {
      fontSize: '18px',
      color: colors.primary,
      fontWeight: '600',
      flex: 1,
    },
    editIconButton: {
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      backgroundColor: colors.secondary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
    },
    editContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    nameInput: {
      border: `1px solid ${colors.secondary}`,
      borderRadius: '10px',
      padding: '12px 15px',
      fontSize: '16px',
      color: colors.primary,
      outline: 'none',
    },
    editButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    },
    editButton: {
      width: '36px',
      height: '36px',
      borderRadius: '18px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
    },
    cancelButton: {
      backgroundColor: '#ffebee',
      color: colors.error,
    },
    saveButton: {
      backgroundColor: '#e8f5e8',
      color: colors.success,
    },
    infoCard: {
      backgroundColor: colors.white,
      padding: '20px',
      borderRadius: '15px',
    },
    appName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '5px',
    },
    appVersion: {
      fontSize: '14px',
      color: colors.gray,
      marginBottom: '10px',
    },
    appDescription: {
      fontSize: '14px',
      color: colors.gray,
      lineHeight: '20px',
    },
    logoutButton: {
      backgroundColor: colors.white,
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      borderRadius: '15px',
      cursor: 'pointer',
      border: `1px solid ${colors.error}20`,
      width: '100%',
      boxSizing: 'border-box',
    },
    logoutText: {
      fontSize: '16px',
      color: colors.error,
      fontWeight: '500',
      marginLeft: '12px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigation()}
        >
          <Icon name="arrow-back" size={24} color={colors.white} />
        </button>
        <div style={styles.headerTitle}>Configurações</div>
        <div style={styles.placeholder} />
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Profile Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Icon name="person-circle-outline" size={24} color={colors.primary} />
            <div style={styles.sectionTitle}>Perfil</div>
          </div>

          <div style={styles.profileCard}>
            <div style={styles.profileLabel}>Nome</div>
            
            {!isEditing ? (
              <div style={styles.nameContainer}>
                <div style={styles.nameText}>{userName}</div>
                <button 
                  style={styles.editIconButton}
                  onClick={() => setIsEditing(true)}
                >
                  <Icon name="pencil" size={16} color={colors.primary} />
                </button>
              </div>
            ) : (
              <div style={styles.editContainer}>
                <input
                  style={styles.nameInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Digite seu nome"
                  maxLength={30}
                  autoFocus
                />
                <div style={styles.editButtons}>
                  <button 
                    style={{...styles.editButton, ...styles.cancelButton}}
                    onClick={cancelEdit}
                  >
                    <Icon name="close" size={16} color={colors.error} />
                  </button>
                  <button 
                    style={{...styles.editButton, ...styles.saveButton}}
                    onClick={saveName}
                  >
                    <Icon name="checkmark" size={16} color={colors.success} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* App Info Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Icon name="information-circle-outline" size={24} color={colors.primary} />
            <div style={styles.sectionTitle}>Sobre o App</div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.appName}>Quiz Odontologia Estética</div>
            <div style={styles.appVersion}>Versão 1.0.0</div>
            <div style={styles.appDescription}>
              Desenvolvido para ensinar sobre os bastidores da odontologia estética
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div style={styles.section}>
          <button 
            style={styles.logoutButton}
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair do aplicativo?')) {
                localStorage.removeItem('userName');
                window.location.reload();
              }
            }}
          >
            <Icon name="log-out-outline" size={20} color={colors.error} />
            <span style={styles.logoutText}>Sair do Aplicativo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;