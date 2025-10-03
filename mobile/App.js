import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AdminScreen from './src/screens/AdminScreen';
import AdminEditScreen from './src/screens/AdminEditScreen';
import AdminSettingsScreen from './src/screens/AdminSettingsScreen';
import AdminWebScreen from './src/screens/AdminWebScreen';

const Stack = createStackNavigator();

export default function App() {
  // Verificar se deve mostrar admin diretamente
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/admin') {
      return (
        <>
          <StatusBar style="light" />
          <AdminWebScreen navigation={{ goBack: () => window.history.back() }} />
        </>
      );
    }
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Instructions" component={InstructionsScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="AdminEdit" component={AdminEditScreen} />
        <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
        <Stack.Screen name="AdminWeb" component={AdminWebScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}