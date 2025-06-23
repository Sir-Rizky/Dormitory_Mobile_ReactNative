import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AbsenMalamScreen from './src/screens/AbsenMalamScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        {/* Dashboard untuk Penghuni */}
        <Stack.Screen name="DashboardPenghuni" component={DashboardScreen} initialParams={{ mode: 'penghuni' }} />
        {/* Dashboard untuk Admin */}
        <Stack.Screen name="DashboardAdmin" component={DashboardScreen} initialParams={{ mode: 'admin' }} />
        {/* Dashboard untuk Kepala Kemahasiswaan */}
        <Stack.Screen name="DashboardKemahasiswaan" component={DashboardScreen} initialParams={{ mode: 'kemahasiswaan' }} />
        <Stack.Screen name="AbsenMalam" component={AbsenMalamScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}