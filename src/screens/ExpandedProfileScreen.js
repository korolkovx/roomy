import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import colors from '../theme/colors';
import Bubble from '../components/Bubble';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ExpandedProfileScreen({ route, navigation }) {
  const { profile, hideKnock, requestType, promptMessage } = route.params;
  const { swipeRight, updateOutgoingMessage } = useApp();
  
  const [modalVisible, setModalVisible] = useState(promptMessage || false);
  const [message, setMessage] = useState('');

  const handleSendRequest = () => {
    if (requestType === 'outgoing') {
      updateOutgoingMessage(profile.id, message);
    } else {
      swipeRight(profile, message);
    }
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <RNImage source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <View style={{width: 38}} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={profile.image} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.content}>
          <Text style={styles.name}>{profile.name} <Text style={styles.age}>{profile.age} лет</Text></Text>
          <View style={styles.bubblesContainer}>
            {profile.bubbles?.map((b, i) => (
              <Bubble key={i} label={b.label} color={b.color} />
            ))}
          </View>
          <Text style={styles.bio}>{profile.bio}</Text>
          
          {hideKnock && profile.text && (
            <View style={styles.attachedMessage}>
              <Text style={styles.attachedMessageTitle}>Сообщение:</Text>
              <Text style={styles.attachedMessageText}>{profile.text}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!hideKnock && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.knockButton} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="door-open" size={20} color={colors.white} />
            <Text style={styles.knockText}>Постучаться</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Модалка для сообщения */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Прикрепить сообщение</Text>
            <Text style={styles.modalDesc}>Расскажите, чем вам понравилась анкета, чтобы повысить шансы на ответ.</Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Привет! Ищу соседа..."
              value={message}
              onChangeText={setMessage}
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSkipBtn} onPress={handleSendRequest}>
                <Text style={styles.modalSkipText}>Отправить без текста</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSendBtn, message.trim() ? styles.modalSendBtnActive : null]} onPress={handleSendRequest}>
                <Text style={styles.modalSendText}>Отправить</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
              setModalVisible(false);
              if (promptMessage) navigation.goBack(); // Возвращаемся, если открыто из заявок только ради сообщения
            }}>
              <Feather name="x" size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 5,
  },
  logoImage: {
    width: 120,
    height: 35,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '95%',
    height: 400,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#e1e4e8'
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  age: {
    fontSize: 22,
    fontWeight: 'normal',
    color: colors.textLight,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bio: {
    fontSize: 18,
    color: colors.textDark,
    lineHeight: 28,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  knockButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  knockText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  attachedMessage: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    padding: 16,
    borderRadius: 16,
  },
  attachedMessageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
  },
  attachedMessageText: {
    fontSize: 15,
    color: colors.textDark,
    fontStyle: 'italic',
  },
  
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
