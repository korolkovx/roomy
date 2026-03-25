import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import RoomyCard from '../components/RoomyCard';
import BackgroundWaves from '../components/BackgroundWaves';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwipingTutorialOverlay from './SwipingTutorialOverlay';

export default function FeedScreen({ navigation }) {
  const { feedProfiles: profiles, swipeLeft: handleSwipeLeftCtx, swipeRight: handleSwipeRightCtx } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [customText, setCustomText] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Assuming onFeedLoad is a function that loads feed data
    // onFeedLoad(); 
  }, []);

  useEffect(() => {
    const checkTutorial = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('@has_seen_tutorial_v3');
        if (!hasSeen) {
          setShowTutorial(true);
        }
      } catch (e) {
        console.error('Tutorial check error:', e);
      }
    };
    checkTutorial();
  }, []);

  const dismissTutorial = async () => {
    setShowTutorial(false);
    try {
      await AsyncStorage.setItem('@has_seen_tutorial_v3', 'true');
    } catch (e) {
      console.error('Failed to save tutorial state', e);
    }
  };

  const handleSwipeLeft = (id) => { 
    const profile = profiles.find(p => p.id === id);
    if (profile) handleSwipeLeftCtx(profile); 
  };
  
  const handleSwipeRight = (id) => { 
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setPendingProfile(profile);
      setCustomText('');
      setModalVisible(true);
    }
  };

  const submitSwipeRight = (message) => {
    if (pendingProfile) {
      handleSwipeRightCtx(pendingProfile, message);
    }
    setModalVisible(false);
    setPendingProfile(null);
  };
  
  const onPressCard = (profile) => { navigation.navigate('ExpandedProfile', { profile }); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
      </View>
      <View style={styles.deckContainer}>
        {profiles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Анкеты закончились 😢</Text>
            <Text style={styles.emptyText}>Вокруг больше нет подходящих вариантов. Попробуй изменить параметры поиска!</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Filters')}>
              <Text style={styles.emptyBtnText}>Настроить фильтры</Text>
            </TouchableOpacity>
          </View>
        ) : (
          profiles.slice(0, 3).reverse().map((profile, i, arr) => {
            const index = arr.length - 1 - i; 
            const isTop = index === 0;
            return (
              <View
                key={profile.id}
                style={[ StyleSheet.absoluteFillObject, { zIndex: 10 - index, elevation: 10 - index, transform: isTop ? [] : [{ translateY: index * 16 }, { scale: 1 - index * 0.05 }] } ]}
                pointerEvents={isTop ? 'auto' : 'none'}
              >
                <RoomyCard profile={profile} isTop={isTop} onSwipeLeft={() => handleSwipeLeft(profile.id)} onSwipeRight={() => handleSwipeRight(profile.id)} onPress={() => onPressCard(profile)} />
              </View>
            );
          })
        )}
      </View>

      {/* Модалка для сообщения при свайпе */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Отправить заявку?</Text>
            <Text style={styles.modalDesc}>Вы можете прикрепить сообщение, чтобы повысить шансы на ответ.</Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Привет! Ищу соседа..."
              value={customText}
              onChangeText={setCustomText}
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSkipBtn} onPress={() => submitSwipeRight('')}>
                <Text style={styles.modalSkipText}>Отправить без текста</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSendBtn, customText.trim() ? styles.modalSendBtnActive : null]} onPress={() => submitSwipeRight(customText)}>
                <Text style={styles.modalSendText}>Отправить</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => submitSwipeRight('')}>
              <Feather name="x" size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal visible={showTutorial} transparent={true} animationType="fade">
        <SwipingTutorialOverlay onDismiss={dismissTutorial} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingVertical: 10, marginTop: 10, marginBottom: 5 },
  logoImage: { width: 160, height: 45 },
  deckContainer: { flex: 1, marginHorizontal: 16, marginBottom: 110 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 30, marginBottom: 40 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textDark, marginBottom: 15, textAlign: 'center' },
  emptyText: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  emptyBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  
  // Modal styles 
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: colors.white, borderRadius: 24, padding: 24, paddingBottom: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textDark, marginBottom: 10 },
  modalDesc: { fontSize: 14, color: colors.textLight, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  messageInput: { width: '100%', backgroundColor: colors.background, borderRadius: 16, padding: 16, paddingTop: 16, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 },
  modalActions: { width: '100%', flexDirection: 'column', gap: 10 },
  modalSendBtn: { backgroundColor: '#E0E0E0', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  modalSendBtnActive: { backgroundColor: colors.primary },
  modalSendText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  modalSkipBtn: { paddingVertical: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  modalSkipText: { color: colors.textDark, fontSize: 16, fontWeight: '600' },
  modalCloseBtn: { position: 'absolute', top: 15, right: 15, padding: 5 }
});
