import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';

const SettingsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

          <View style={styles.infoCard}>
            <Text style={styles.appName}>Quiz Odontologia Estética</Text>
            <Text style={styles.appVersion}>Versão 1.0.0</Text>
            <Text style={styles.appDescription}>
              Desenvolvido para ensinar sobre os bastidores da odontologia estética
            </Text>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                'Sair do Aplicativo',
                'Tem certeza que deseja sair do aplicativo?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
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
                    },
                  },
                ],
              );
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sair do Aplicativo</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
  },
  profileLabel: {
    fontSize: 14,
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
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  editIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    gap: 15,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.primary,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    padding: 20,
    borderRadius: 15,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default SettingsScreen;