import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { token } = useApp(); // В реальном проекте тут берем инфу о пользователе
  
  // Для MVP заполним стейт фейковыми данными "Оля" или пустыми
  const [name, setName] = useState('Оля');
  const [bio, setBio] = useState('Ранняя пташка, люблю тишину.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400');
  
  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/profiles/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image })
      });
      if (res.ok) {
        Alert.alert('Успешно', 'Профиль обновлен', [{ text: 'ОК', onPress: () => navigation.goBack() }]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Обновить анкету</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoContainer}>
          <Image source={image} style={styles.avatar} contentFit="cover" />
          <TouchableOpacity style={styles.editPhotoBtn}>
            <Feather name="camera" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Имя</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Например, Александр" 
        />

        <Text style={styles.label}>О себе</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={bio} 
          onChangeText={setBio} 
          multiline 
          placeholder="Расскажите о своих привычках..." 
        />
        
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Сохранить изменения</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, borderRadius: 22 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.textDark },
  content: { padding: 20 },
  photoContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e1e4e8' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.background },
  label: { fontSize: 16, fontWeight: 'bold', color: colors.textDark, marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: colors.white, padding: 18, borderRadius: 16, marginBottom: 20, fontSize: 16, color: colors.textDark, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  textArea: { minHeight: 120, paddingTop: 18, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: colors.primary, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 20, shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  saveBtnText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});
