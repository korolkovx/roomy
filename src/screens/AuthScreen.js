import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function AuthScreen({ navigation }) {
  const { login } = useApp();
  const [phone, setPhone] = useState('79991234567');
  const [code, setCode] = useState('1234');

  const handleLogin = () => {
    navigation.navigate('Onboarding', { phone, code });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.subtitle}>Найди своих людей.{'\n'}Снимите жилье в кайф.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Телефон" 
            placeholderTextColor={colors.textLight} 
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Код из СМС" 
            secureTextEntry 
            placeholderTextColor={colors.textLight} 
            value={code}
            onChangeText={setCode}
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Войти / Создать аккаунт</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  content: { padding: 30, alignItems: 'center' },
  logoImage: { width: 200, height: 60, marginBottom: 20 },
  subtitle: { fontSize: 18, color: colors.textDark, textAlign: 'center', lineHeight: 26, marginBottom: 40, fontWeight: '500' },
  inputContainer: { width: '100%', marginBottom: 30 },
  input: { 
    backgroundColor: colors.white, padding: 18, borderRadius: 16, marginBottom: 15,
    fontSize: 16, color: colors.textDark,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  primaryBtn: { 
    backgroundColor: colors.primary, width: '100%', padding: 20, borderRadius: 30, alignItems: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6
  },
  primaryBtnText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});
