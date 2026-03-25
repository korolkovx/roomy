import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import Bubble from '../components/Bubble';
import { useApp } from '../context/AppContext';

const filters = [
  {
    title: 'Базовые параметры',
    items: [
      { label: 'хочу снять', color: colors.bubbles.blue },
      { label: 'сдаю комнату', color: colors.bubbles.lightGreen },
      { label: 'есть жилье', color: colors.bubbles.purple },
      { label: 'ищем вместе (с нуля)', color: colors.bubbles.orange },
      { label: 'до 30k', color: colors.bubbles.teal },
      { label: '30-45k', color: colors.bubbles.red },
      { label: '45-60k', color: colors.bubbles.pink },
      { label: '60-80k', color: colors.bubbles.brown },
      { label: 'М', color: colors.bubbles.grey },
      { label: 'Ж', color: colors.bubbles.pink },
    ]
  },
  {
    title: 'Бытовуха (Слой A)',
    items: [
      { label: 'жаворонок', color: colors.bubbles.yellow },
      { label: 'сова', color: colors.bubbles.purple },
      { label: 'работаю онлайн', color: colors.bubbles.green },
      { label: 'работаю в офисе', color: colors.bubbles.blue },
      { label: 'терпимо чисто', color: colors.bubbles.lightBlue },
      { label: 'график уборок', color: colors.bubbles.pink },
      { label: 'чистоплюй', color: colors.bubbles.teal },
      { label: 'питаюсь доставками', color: colors.bubbles.orange },
      { label: 'готовлю дома', color: colors.bubbles.yellow },
    ]
  },
  {
    title: 'Вайб (Слой B)',
    items: [
      { label: 'приятели', color: colors.bubbles.yellow },
      { label: 'соулмейты', color: colors.bubbles.purple },
      { label: 'индифферентно', color: colors.bubbles.grey },
      { label: 'пьем редко (или чай)', color: colors.bubbles.brown },
      { label: 'люблю тусовки/вписки', color: colors.bubbles.pink },
      { label: 'тихие вечера/книги', color: colors.bubbles.lightBlue },
      { label: 'творческий хаос', color: colors.bubbles.lightGreen },
      { label: 'кошка', color: colors.bubbles.teal },
      { label: 'собака', color: colors.bubbles.brown },
    ]
  }
];

export default function FiltersScreen({ navigation }) {
  const { activeFilters, setActiveFilters, totalFeedCount } = useApp();
  const [localFilters, setLocalFilters] = useState([...activeFilters]);

  const toggleFilter = (label) => {
    if (localFilters.includes(label)) {
      setLocalFilters(localFilters.filter(f => f !== label));
    } else {
      setLocalFilters([...localFilters, label]);
    }
  };

  const applyFilters = () => {
    setActiveFilters(localFilters);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Фильтры</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {filters.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.bubblesContainer}>
              {section.items.map((b, i) => {
                const isActive = localFilters.includes(b.label);
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={{ opacity: isActive ? 1 : 0.4 }}
                    onPress={() => toggleFilter(b.label)}
                  >
                    <Bubble label={b.label} color={b.color} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
        <Text style={styles.applyText}>Применить фильтры {localFilters.length > 0 ? `(${localFilters.length})` : ''}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textDark, marginBottom: 15 },
  bubblesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  applyBtn: { 
    position: 'absolute', bottom: 30, left: 20, right: 20, 
    backgroundColor: colors.primary, padding: 16, borderRadius: 30, alignItems: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6
  },
  applyText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});
