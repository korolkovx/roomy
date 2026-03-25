import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import colors from './src/theme/colors';

import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import FeedScreen from './src/screens/FeedScreen';
import ExpandedProfileScreen from './src/screens/ExpandedProfileScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FiltersScreen from './src/screens/FiltersScreen';
import RequestsScreen from './src/screens/RequestsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import { AppProvider, useApp } from './src/context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();





function MainTabs() {
  const insets = useSafeAreaInsets();
  const { unreadRequests } = useApp();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: { 
          backgroundColor: '#FEF6D9',
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: Math.max(15, insets.bottom),
          height: 65,
          borderRadius: 35,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#FF9500',
          shadowOpacity: 0.15,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 6 },
          paddingBottom: 0,
          paddingTop: 0,
          paddingHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          marginVertical: 0,
          justifyContent: 'center',
        },
        tabBarShowLabel: false,
        safeAreaInsets: { bottom: 0 },
      }}
    >
      <Tab.Screen 
        name="Requests" 
        component={RequestsScreen} 
        options={{ 
          tabBarBadge: unreadRequests > 0 ? unreadRequests : null,
          tabBarBadgeStyle: { backgroundColor: colors.error, color: 'white', fontSize: 10 },
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: '100%', marginTop: 23 }}>
              <View style={{ 
                backgroundColor: focused ? 'rgba(255, 149, 0, 0.15)' : 'transparent', 
                width: 54, height: 54, borderRadius: 27, 
                justifyContent: 'center', alignItems: 'center' 
              }}>
                <Image 
                  source={require('./assets/icons/chat.png')}
                  style={{ width: 35, height: 35, tintColor: focused ? '#FF9500' : '#A0A0A0' }}
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{ 
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: '100%', marginTop: 23 }}>
              <View style={{ 
                backgroundColor: focused ? 'rgba(255, 149, 0, 0.15)' : 'transparent', 
                width: 54, height: 54, borderRadius: 27, 
                justifyContent: 'center', alignItems: 'center' 
              }}>
                <Image 
                  source={require('./assets/icons/home.png')}
                  style={{ width: 35, height: 35, tintColor: focused ? '#FF9500' : '#A0A0A0' }}
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: '100%', marginTop: 23 }}>
              <View style={{ 
                backgroundColor: focused ? 'rgba(255, 149, 0, 0.15)' : 'transparent', 
                width: 54, height: 54, borderRadius: 27, 
                justifyContent: 'center', alignItems: 'center' 
              }}>
                <Image 
                  source={require('./assets/icons/profile.png')}
                  style={{ width: 35, height: 35, tintColor: focused ? '#FF9500' : '#A0A0A0' }}
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

// Глобальное переопределение удалено (ломало векторные иконки). 
// Шрифты "Involve" будут работать только там, где они явно заданы.

function RootNavigator() {
  const { token, authLoading } = useApp();

  if (authLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!token ? (
        <>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Requests" component={RequestsScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Filters" component={FiltersScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="ExpandedProfile" component={ExpandedProfileScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ presentation: 'modal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    'Involve-Regular': Manrope_400Regular,
    'Involve-Medium': Manrope_500Medium,
    'Involve-SemiBold': Manrope_600SemiBold,
    'Involve-Bold': Manrope_700Bold,
    'Involve-Black': Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
