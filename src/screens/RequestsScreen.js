import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function RequestsScreen({ navigation }) {
  const [tab, setTab] = useState('incoming');
  const { incoming, outgoing, matches, acceptIncoming, rejectIncoming } = useApp();

  const getActiveList = () => {
    if (tab === 'incoming') return incoming;
    if (tab === 'outgoing') return outgoing;
    return matches;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Заявки</Text>
        <View style={{width: 38}} />
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'incoming' && styles.tabActive]} onPress={() => setTab('incoming')}>
          <Text style={[styles.tabText, tab === 'incoming' && styles.tabTextActive]}>Входящие</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'outgoing' && styles.tabActive]} onPress={() => setTab('outgoing')}>
          <Text style={[styles.tabText, tab === 'outgoing' && styles.tabTextActive]}>Исходящие</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'matches' && styles.tabActive]} onPress={() => setTab('matches')}>
          <Text style={[styles.tabText, tab === 'matches' && styles.tabTextActive]}>Контакты</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {getActiveList().length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBg}>
              <Feather name="search" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyStateTitle}>
              {tab === 'matches' ? 'Пока нет контактов' : 'Пока нет заявок'}
            </Text>
            <Text style={styles.emptyStateDesc}>
              {tab === 'matches' 
                ? 'Отправляйте и принимайте заявки! Здесь появятся контакты ваших будущих соседей.' 
                : 'Листайте анкеты в ленте и отправляйте заявки, чтобы они появились здесь 🙌'}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateBtn} 
              onPress={() => navigation.navigate('FeedTab')}
            >
              <Text style={styles.emptyStateBtnText}>Искать соседей</Text>
            </TouchableOpacity>
          </View>
        ) : (
          getActiveList().map(r => (
            <TouchableOpacity 
              key={r.id} 
              style={styles.card}
              onPress={() => navigation.navigate('ExpandedProfile', { profile: r, hideKnock: true, requestType: tab })}
            >
            <Image source={r.image} style={styles.avatar} contentFit="cover" transition={200} />
            <View style={styles.info}>
              <Text style={styles.name}>{r.name}, {r.age} <Text style={styles.match}>({r.match}%)</Text></Text>
              <Text style={styles.subtitle}>{r.text}</Text>
              
              {tab === 'incoming' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptIncoming(r)}>
                    <Text style={styles.acceptText}>Принять</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectIncoming(r)}>
                    <Feather name="x" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              )}

              {tab === 'outgoing' && r.text === 'Ожидает ответа...' && (
                <TouchableOpacity style={styles.addMessageBtn} onPress={() => navigation.navigate('ExpandedProfile', { profile: r, hideKnock: true, requestType: 'outgoing', promptMessage: true })}>
                  <Feather name="message-circle" size={14} color={colors.primary} />
                  <Text style={styles.addMessageText}>Прикрепить сообщение</Text>
                </TouchableOpacity>
              )}

              {tab === 'matches' && (
                <View style={[styles.contactBadge, r.hasPhone && { backgroundColor: '#34C759' }]}>
                  <Feather name={r.hasPhone ? "phone" : "send"} size={14} color={colors.white} />
                  <Text style={styles.contactText}>{r.contact}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { padding: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textDark },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#EADFC7', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.white, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textLight },
  tabTextActive: { color: colors.textDark, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 50 },
  card: { flexDirection: 'row', backgroundColor: colors.white, padding: 16, borderRadius: 20, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15, backgroundColor: '#e1e4e8' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: colors.textDark, marginBottom: 4 },
  match: { fontSize: 16, color: colors.primary, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: colors.textLight, marginBottom: 10 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  acceptBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 15, marginRight: 10 },
  acceptText: { color: colors.white, fontWeight: 'bold' },
  rejectBtn: { backgroundColor: '#F0F0F0', padding: 8, borderRadius: 15 },
  addMessageBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255, 149, 0, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  addMessageText: { color: colors.primary, fontWeight: '700', fontSize: 13, marginLeft: 6 },
  contactBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0088CC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, alignSelf: 'flex-start' },
  contactText: { color: colors.white, fontWeight: 'bold', marginLeft: 6 },
  
  // Empty State Styles
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 20 },
  emptyStateIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 149, 0, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textDark, marginBottom: 12, textAlign: 'center' },
  emptyStateDesc: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  emptyStateBtn: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 30, borderRadius: 25, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  emptyStateBtnText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});
