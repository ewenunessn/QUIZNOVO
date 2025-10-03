import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { initializeDefaultData } from '../services/questionsService';
import { normalize, moderateScale } from '../utils/responsive';

const SettingsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [adminTaps, setAdminTaps] = useState(0);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
        setNewName(name);
      }
    } catch (error) {
      console.error('Erro ao carregar nome:', error);
    }
  };

  const saveName = async () => {
    if (newName.trim().length < 2) {
      Alert.alert('Nome inválido', 'Por favor, digite um nome com pelo menos 2 caracteres.');
      return;
    }
    
    try {
      await AsyncStorage.setItem('userName', newName.trim());
      setUserName(newName.trim());
      setIsEditing(false);
      Alert.alert('Sucesso', 'Nome alterado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      Alert.alert('Erro', 'Não foi possível salvar seu nome. Tente novamente.');
    }
  };

  const cancelEdit = () => {
    setNewName(userName);
    setIsEditing(false);
  };

  const handleAdminAccess = async () => {
    const newTapCount = adminTaps + 1;
    setAdminTaps(newTapCount);

    if (newTapCount >= 7) {
      Alert.alert(
        'Acesso Administrativo',
        'Deseja acessar o painel de administração?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Acessar',
            onPress: async () => {
              try {
                // Inicializar dados padrão se necessário
                await initializeDefaultData();
                navigation.navigate('Admin');
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível acessar a administração: ' + error.message);
              }
            }
          }
        ]
      );
      setAdminTaps(0);
    }

    // Reset após 3 segundos
    setTimeout(() => {
      setAdminTaps(0);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Perfil</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.profileLabel}>Nome</Text>
            
            {!isEditing ? (
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{userName}</Text>
                <TouchableOpacity 
                  style={styles.editIconButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Digite seu nome"
                  placeholderTextColor={colors.gray}
                  maxLength={30}
                  autoCapitalize="words"
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={[styles.editButton, styles.cancelButton]}
                    onPress={cancelEdit}
                  >
                    <Ionicons name="close" size={16} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.editButton, styles.saveButton]}
                    onPress={saveName}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.success} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Sobre o App</Text>
          </View>

          <TouchableOpacity 
            style={styles.infoCard}
            onPress={handleAdminAccess}
            activeOpacity={0.8}
          >
            <Text style={styles.appName}>Quiz Odontologia Estética</Text>
            <Text style={styles.appVersion}>Versão 1.0.0</Text>
            <Text style={styles.appDescription}>
              Desenvolvido para ensinar sobre os bastidores da odontologia estética
            </Text>
            {adminTaps > 0 && adminTaps < 7 && (
              <Text style={styles.adminHint}>
                Toque mais {7 - adminTaps} vezes para acessar admin
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={async () => {
              // Usar window.confirm na web ao invés de Alert.alert
              const confirmed = Platform.OS === 'web' 
                ? window.confirm('Tem certeza que deseja sair?')
                : await new Promise((resolve) => {
                    Alert.alert(
                      'Sair',
                      'Tem certeza que deseja sair?',
                      [
                        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
                        { text: 'Sair', style: 'destructive', onPress: () => resolve(true) }
                      ]
                    );
                  });

              if (confirmed) {
                try {
                  await AsyncStorage.removeItem('userName');
                  
                  // Se estiver rodando na web (Expo Go web), recarrega a página
                  if (Platform.OS === 'web') {
                    window.location.reload();
                  } else {
                    // Se estiver no app nativo, usa navegação
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Welcome' }],
                    });
                  }
                } catch (error) {
                  console.error('Erro ao sair:', error);
                }
              }
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(60),
    paddingBottom: moderateScale(20),
    backgroundColor: colors.primary,
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: moderateScale(40),
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
  },
  section: {
    marginBottom: moderateScale(30),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: moderateScale(10),
  },
  profileCard: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
  },
  profileLabel: {
    fontSize: normalize(14),
    color: colors.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: normalize(18),
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  editIconButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    gap: moderateScale(15),
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    fontSize: normalize(16),
    color: colors.primary,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(10),
  },
  editButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffebee',
  },
  saveButton: {
    backgroundColor: '#e8f5e8',
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
  },
  appName: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: moderateScale(5),
  },
  appVersion: {
    fontSize: normalize(14),
    color: colors.gray,
    marginBottom: moderateScale(10),
  },
  appDescription: {
    fontSize: normalize(14),
    color: colors.gray,
    lineHeight: normalize(20),
  },
  adminHint: {
    fontSize: normalize(12),
    color: colors.primary,
    marginTop: moderateScale(8),
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  logoutText: {
    fontSize: normalize(16),
    color: colors.error,
    fontWeight: '500',
    marginLeft: moderateScale(12),
  },
});

export default SettingsScreen;