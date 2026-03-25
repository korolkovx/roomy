import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const [isPaused, setIsPaused] = useState(false);
  const { logout } = useApp();

  const togglePause = () => setIsPaused(!isPaused);

  const handleLogout = async () => {
    Alert.alert(
      'Сброс сессии', 
      'Выйти из профиля и сбросить всё обучение?', 
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Да, выйти', style: 'destructive', onPress: async () => await logout() }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert('Удалить аккаунт', 'Вы уверены? Это действие нельзя отменить.');
  };

  const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconBg}>
        <Feather name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Хедер профиля */}
        <View style={styles.headerInfo}>
          
          {/* Кнопка "Глазик" (Предпросмотр) */}
          <TouchableOpacity style={styles.previewBtn} onPress={() => {}}>
            <Feather name="eye" size={24} color={colors.white} />
          </TouchableOpacity>

          <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300' }} style={styles.avatar} />
          
          <View style={[styles.badge, isPaused ? styles.badgePaused : styles.badgeActive]}>
            <Text style={[styles.badgeText, isPaused ? styles.badgeTextPaused : styles.badgeTextActive]}>
              {isPaused ? 'На паузе' : 'Активна'}
            </Text>
          </View>
          <Text style={styles.statusDesc}>
            {isPaused 
              ? 'Вашу анкету сейчас никто не видит' 
              : 'Показываем вашу анкету подходящим людям'}
          </Text>
        </View>

        {/* Секция 1 — Анкета и поиск */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Анкета и поиск</Text>
          
          <MenuItem 
            icon="edit-2" 
            title="Редактировать анкету" 
            subtitle="Фото, о себе, привычки, предпочтения"
            onPress={() => navigation.navigate('EditProfile')} 
          />
          <MenuItem 
            icon="sliders" 
            title="Параметры поиска" 
            subtitle="Кого и в каких условиях вы ищете"
            onPress={() => navigation.navigate('Filters')} 
          />
        </View>

        {/* Секция 2 — Аккаунт */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Аккаунт</Text>
          
          <MenuItem 
            icon="help-circle" 
            title="Поддержка" 
            subtitle="Поможем с вопросом или проблемой"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="settings" 
            title="Настройки аккаунта" 
            subtitle="Уведомления, конфиденциальность, вход"
            onPress={() => {}} 
          />
        </View>

        {/* Секция 3 — Статус профиля */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статус профиля</Text>
          
          <View style={styles.statusBlock}>
            <Text style={styles.statusBlockTitle}>
              {isPaused ? 'Профиль на паузе' : 'Профиль активен'}
            </Text>
            <Text style={styles.statusBlockDesc}>
              {isPaused 
                ? 'Вашу анкету не увидят другие пользователи' 
                : 'Вы видимы в поиске и можете получать отклики'}
            </Text>
            
            <TouchableOpacity 
              style={[styles.statusBtn, isPaused ? styles.statusBtnActive : styles.statusBtnPause]} 
              onPress={togglePause}
            >
              <Text style={[styles.statusBtnText, isPaused ? styles.statusBtnTextActive : styles.statusBtnTextPause]}>
                {isPaused ? 'Возобновить профиль' : 'Поставить на паузу'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dangerous zone */}
        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleLogout}>
            <Text style={styles.deleteTitle}>Выйти из аккаунта (Сброс)</Text>
          </TouchableOpacity>
          <Text style={styles.deleteDesc}>Сбросить прогресс онбординга</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 110 },
  
  headerInfo: { 
    alignItems: 'center', 
    marginBottom: 35,
    width: '100%',
    position: 'relative'
  },
  
  previewBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },

  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  badgeActive: { backgroundColor: 'rgba(52, 199, 89, 0.15)' },
  badgePaused: { backgroundColor: 'rgba(255, 149, 0, 0.15)' },
  badgeText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeTextActive: { color: '#34C759' },
  badgeTextPaused: { color: colors.primary },
  
  statusDesc: { fontSize: 13, color: colors.textLight, textAlign: 'center', marginTop: 4 },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#4A3B2C', marginBottom: 16, marginLeft: 6 },
  
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.white, 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 4 },
  menuSubtitle: { fontSize: 13, color: colors.textLight },

  statusBlock: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2
  },
  statusBlockTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  statusBlockDesc: { fontSize: 14, color: colors.textLight, marginBottom: 20, lineHeight: 20 },
  
  statusBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBtnPause: { borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: 'transparent' },
  statusBtnActive: { backgroundColor: colors.primary },
  
  statusBtnText: { fontSize: 15, fontWeight: '700' },
  statusBtnTextPause: { color: colors.textDark },
  statusBtnTextActive: { color: colors.white },

  dangerZone: { alignItems: 'center', marginTop: 10, paddingBottom: 20 },
  deleteBtn: { paddingVertical: 12, paddingHorizontal: 24, marginBottom: 4 },
  deleteTitle: { fontSize: 15, fontWeight: '700', color: '#FF453A' },
  deleteDesc: { fontSize: 12, color: colors.textLight }
});
