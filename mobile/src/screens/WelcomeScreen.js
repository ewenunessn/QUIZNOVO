import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { getAppSettings } from '../services/questionsService';

const WelcomeScreen = ({ navigation }) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [appSettings, setAppSettings] = useState({
    appTitle: 'Odontologia Estética',
    appDescription: 'Descubra os bastidores da saúde e estética bucal'
  });
  
  // Animações fluidas
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nameInputOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkUserName();
    loadAppSettings();
  }, []);

  const loadAppSettings = async () => {
    try {
      const settings = await getAppSettings();
      setAppSettings(settings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Mantém as configurações padrão se houver erro
    }
  };

  // Atualiza o nome e configurações quando a tela ganha foco (volta das configurações)
  useFocusEffect(
    React.useCallback(() => {
      const updateData = async () => {
        try {
          const name = await AsyncStorage.getItem('userName');
          if (name && name !== savedName) {
            setSavedName(name);
          }
          // Recarregar configurações do app
          await loadAppSettings();
        } catch (error) {
          console.error('Erro ao atualizar dados:', error);
        }
      };
      updateData();
    }, [savedName])
  );

  const checkUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setSavedName(name);
        startAnimations();
      } else {
        setShowNameInput(true);
        startNameInputAnimation();
      }
    } catch (error) {
      console.error('Erro ao verificar nome:', error);
      startAnimations();
    }
  };

  const saveName = async () => {
    if (userName.trim().length < 2) {
      Alert.alert('Nome inválido', 'Por favor, digite um nome com pelo menos 2 caracteres.');
      return;
    }
    
    try {
      await AsyncStorage.setItem('userName', userName.trim());
      setSavedName(userName.trim());
      setShowNameInput(false);
      
      // Fade out do input e fade in do conteúdo principal
      Animated.timing(nameInputOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Se já tinha animações rodando, não precisa rodar novamente
        if (titleOpacity._value === 0) {
          startAnimations();
        }
      });
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      Alert.alert('Erro', 'Não foi possível salvar seu nome. Tente novamente.');
    }
  };

  const editName = () => {
    setUserName(savedName);
    setShowNameInput(true);
    startNameInputAnimation();
  };

  const startNameInputAnimation = () => {
    Animated.timing(nameInputOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const startAnimations = () => {
    // Sequência de animações suaves
    Animated.sequence([
      // Ícone com bounce
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        })
      ]),
      
      // Título
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Subtítulo
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Botão
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      
      // Logo da Estácio
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  };

  const rotateInterpolate = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header com nome e configurações */}
      {!showNameInput && savedName && (
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderName}>Olá, {savedName}! 👋</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Tela de entrada de nome */}
      {showNameInput && (
        <Animated.View 
          style={[
            styles.nameInputContainer,
            { opacity: nameInputOpacity }
          ]}
        >
          <Ionicons name="person-circle-outline" size={80} color={colors.secondary} />
          
          <Text style={styles.nameInputTitle}>
            {savedName ? 'Editar Nome' : 'Bem-vindo!'}
          </Text>
          <Text style={styles.nameInputSubtitle}>
            {savedName ? 'Digite seu novo nome:' : 'Para começar, digite seu nome:'}
          </Text>
          
          <TextInput
            style={styles.nameInput}
            placeholder="Seu nome"
            placeholderTextColor={colors.gray}
            value={userName}
            onChangeText={setUserName}
            maxLength={30}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={saveName}
          />
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveName}
          >
            <Text style={styles.saveButtonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Conteúdo principal */}
      {!showNameInput && (
        <View style={styles.contentContainer}>
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                transform: [
                  { scale: iconScale },
                  { rotate: rotateInterpolate }
                ]
              }
            ]}
          >
            <Ionicons name="happy-outline" size={120} color={colors.secondary} />
          </Animated.View>
          
          <Animated.Text 
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }]
              }
            ]}
          >
            {appSettings.appTitle}
          </Animated.Text>
          

          
          <Animated.Text 
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }]
              }
            ]}
          >
            {appSettings.appDescription}
          </Animated.Text>
          
          <Animated.View 
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }]
            }}
          >
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Logo da Estácio no rodapé */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { opacity: logoOpacity }
            ]}
          >
            <Image 
              source={require('../data/logo/estacio-logo-1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  topHeaderName: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: '600',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(178, 210, 209, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(178, 210, 209, 0.3)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  nameInputTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  nameInputSubtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  nameInput: {
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

});

export default WelcomeScreen;