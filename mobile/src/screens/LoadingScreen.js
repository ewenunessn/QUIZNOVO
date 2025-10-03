import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { getQuestions, getAppSettings, initializeDefaultData } from '../services/questionsService';

const LoadingScreen = ({ onLoadComplete }) => {
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Inicializar dados padrão se necessário
      await initializeDefaultData();
      
      // Pré-carregar perguntas e configurações
      await Promise.all([
        getQuestions(),
        getAppSettings()
      ]);
      
      // Pequeno delay para garantir que tudo está pronto
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      // Mesmo com erro, continua para não travar o app
      setTimeout(() => {
        onLoadComplete();
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.secondary} />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.secondary,
  },
});

export default LoadingScreen;
