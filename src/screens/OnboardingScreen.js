import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Picker } from '@react-native-picker/picker';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
import SunWheel from '../components/SunWheel';

const SOCIAL_TAGS = [
  { label: 'спорт', color: '#D4F5E9' },
  { label: 'бег', color: '#FFF3D0' },
  { label: 'йога', color: '#E1F0FF' },
  { label: 'качалка', color: '#F3E5F5' },
  { label: 'танцы', color: '#FFEBEE' },
  { label: 'настолки', color: '#FFF3D0' },
  { label: 'видеоигры', color: '#E1F0FF' },
  { label: 'музыка', color: '#D4F5E9' },
  { label: 'кино', color: '#F3E5F5' },
  { label: 'искусство', color: '#FFEBEE' },
  { label: 'фотография', color: '#FFF3D0' },
  { label: 'путешествия', color: '#E1F0FF' },
  { label: 'веган', color: '#D4F5E9' },
  { label: 'кофе', color: '#F3E5F5' },
  { label: 'готовлю', color: '#FFEBEE' },
  { label: 'вино', color: '#FFCDD2' },
  { label: 'стендап', color: '#E1BEE7' },
  { label: 'котики', color: '#C5CAE9' },
  { label: 'собаки', color: '#B2EBF2' },
  { label: 'вечеринки', color: '#FFECB3' },
  { label: 'астрология', color: '#E8EAF6' },
  { label: 'дизайн', color: '#F8BBD0' },
  { label: 'айти (IT)', color: '#DCEDC8' },
  { label: 'бизнес', color: '#D7CCC8' },
  { label: 'наука', color: '#B3E5FC' },
  { label: 'поэзия', color: '#F0F4C3' },
  { label: 'мода', color: '#FFCCBC' },
  { label: 'психология', color: '#C8E6C9' },
];

const BUDGET_OPTIONS = [];
for (let i = 15000; i <= 45000; i += 1000) BUDGET_OPTIONS.push(i);
for (let i = 50000; i <= 100000; i += 5000) BUDGET_OPTIONS.push(i);

export default function OnboardingScreen({ navigation, route }) {
  const [step, setStep] = useState(1);
  const { login } = useApp();
  const phone = route?.params?.phone || '79991234567';
  const code = route?.params?.code || '1234';

  // Base Layer
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('');
  const [housingRole, setHousingRole] = useState('');
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(45000);

  // Domestic Layer
  const [rhythm, setRhythm] = useState(50);
  const [cleaning, setCleaning] = useState('');
  const [guests, setGuests] = useState('');
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [pets, setPets] = useState('');
  const [schedule, setSchedule] = useState('');

  // Social Layer
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.some(t => t.label === tag.label) 
        ? prev.filter(t => t.label !== tag.label) 
        : [...prev, tag]
    );
  };

  const handleFinish = () => {
    const profileData = {
      name,
      age: parseInt(age) || 0,
      gender,
      housing_role: housingRole,
      budget_min: parseInt(budgetMin) || 0,
      budget_max: parseInt(budgetMax) || 0,
      rhythm,
      cleaning,
      guests,
      smoking,
      alcohol,
      pets,
      schedule,
      bubbles: selectedTags,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', // Mock avatar for now
      bio: 'Новый пользователь Roomy'
    };
    login(phone, code, profileData);
  };

  const renderOption = (value, setter, current, title, isRow = false) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={[styles.selectable, isRow && {flex: 1, marginBottom: 0}, current === value && styles.selectableActive]}
      onPress={() => setter(value)}
    >
      <Text style={[styles.selectableText, current === value && styles.selectableTextActive]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>Базовый слой</Text>
            <Text style={styles.subtitle}>Расскажите немного о себе и что вы ищете.</Text>

            <Text style={styles.label}>Как вас зовут?</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Имя" placeholderTextColor={colors.textLight} />
            
            <Text style={styles.label}>Возраст: {age ? age + ' лет' : ''}</Text>
            <TextInput 
              style={styles.input} 
              value={age.toString()} 
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                setAge(num);
              }} 
              placeholder="Полных лет (например, 25)" 
              keyboardType="numeric" 
              maxLength={2}
              placeholderTextColor={colors.textLight} 
            />

            <Text style={styles.label}>Ваш пол</Text>
            <View style={[styles.row, {marginBottom: 12}]}>
              {renderOption('male', setGender, gender, 'Парень', true)}
              <View style={{width: 10}}/>
              {renderOption('female', setGender, gender, 'Девушка', true)}
            </View>

            <Text style={styles.label}>Цель поиска</Text>
            {renderOption('ищу', setHousingRole, housingRole, 'Ищу комнату')}
            {renderOption('сдаю', setHousingRole, housingRole, 'Сдаю комнату')}
            {renderOption('вместе', setHousingRole, housingRole, 'Ищем вместе с нуля')}

            <Text style={styles.label}>Бюджет: от {budgetMin / 1000} тыс. ₽ до {budgetMax === 100000 ? '100+ тыс. ₽' : (budgetMax / 1000) + ' тыс. ₽'}</Text>
            <View style={{marginTop: 15, marginBottom: 15, alignItems: 'center'}}>
              <MultiSlider
                values={[budgetMin, budgetMax]}
                optionsArray={BUDGET_OPTIONS}
                sliderLength={screenWidth - 80}
                onValuesChange={(values) => { setBudgetMin(values[0]); setBudgetMax(values[1]); }}
                selectedStyle={{ backgroundColor: colors.primary, height: 4 }}
                unselectedStyle={{ backgroundColor: '#DEE2E6', height: 4 }}
                markerStyle={{ backgroundColor: colors.primary, height: 24, width: 24, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 }}
                pressedMarkerStyle={{ height: 30, width: 30, borderRadius: 15 }}
                snapped={true}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.title}>Бытовой слой</Text>
            <Text style={styles.subtitle}>Эти параметры помогут найти людей, с которыми вам будет комфортно жить.</Text>

            <Text style={styles.label}>Ритм жизни</Text>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Жаворонок</Text>
              <Text style={styles.sliderLabel}>Сова</Text>
            </View>
            <Slider
              style={{width: '100%', height: 40, marginBottom: 20}}
              minimumValue={0}
              maximumValue={100}
              value={rhythm}
              onValueChange={setRhythm}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="#DEE2E6"
              thumbTintColor={colors.primary}
            />

            <Text style={styles.label}>Отношение к чистоте</Text>
            {renderOption('strict', setCleaning, cleaning, 'Идеальная (уборка по графику)')}
            {renderOption('normal', setCleaning, cleaning, 'Раз в неделю')}
            {renderOption('creative', setCleaning, cleaning, 'Творческий беспорядок')}

            <Text style={styles.label}>Гости и тусовки</Text>
            {renderOption('none', setGuests, guests, 'Мой дом — моя крепость')}
            {renderOption('rare', setGuests, guests, 'Иногда, предупреждая заранее')}
            {renderOption('party', setGuests, guests, 'Частые посиделки Ок')}

            <Text style={styles.label}>Отношение к курению</Text>
            {renderOption('negative', setSmoking, smoking, 'Не курю / Резко против')}
            {renderOption('neutral', setSmoking, smoking, 'Нейтрально')}
            {renderOption('positive', setSmoking, smoking, 'Курю')}

            <Text style={styles.label}>Алкоголь</Text>
            {renderOption('no', setAlcohol, alcohol, 'Не пью')}
            {renderOption('rarely', setAlcohol, alcohol, 'Иногда по выходным')}

            <Text style={styles.label}>Питомцы</Text>
            {renderOption('yes', setPets, pets, 'Есть питомец')}
            {renderOption('love', setPets, pets, 'Нет, но обожаю животных')}
            {renderOption('no', setPets, pets, 'Против / Аллергия')}

            <Text style={styles.label}>График работы/учебы</Text>
            {renderOption('remote', setSchedule, schedule, 'Удаленка 24/7')}
            {renderOption('office', setSchedule, schedule, 'Офис 5/2')}
            {renderOption('mixed', setSchedule, schedule, 'Плавающий график / Учеба')}
          </View>
        );
      case 3:
        return (
          <View style={[styles.layer3Container, { paddingTop: 0 }]}>
            <View style={styles.sunWheelWrapper}>
              <SunWheel tags={SOCIAL_TAGS} selectedTags={selectedTags} onToggleTag={toggleTag} />
            </View>
            
            <View style={styles.selectedTagsContainer}>
              <View style={styles.selectedTagsRow}>
                {selectedTags.length === 0 && <Text style={{color: '#A0A0A0', fontFamily: 'Involve-Medium', fontSize: 13, marginLeft: 10}}>Выберите увлечения на колесе сверху...</Text>}
                {selectedTags.map(t => (
                  <View key={t.label} style={[styles.miniTag, {backgroundColor: t.color}]}>
                    <Text style={styles.miniTagText}>{t.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Image source={require('../../assets/logo.png')} style={styles.logoSmall} resizeMode="contain" />
          <View style={{width: 38}}/>
        </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
      </View>
      
      {step === 3 ? (
         <View style={{flex: 1}}>
           {renderStepContent()}
         </View>
      ) : (
         <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
           {renderStepContent()}
         </ScrollView>
      )}

      <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.bottomBtn} 
        onPress={() => step < 3 ? setStep(step + 1) : handleFinish()}
      >
        <Text style={styles.btnText}>{step < 3 ? 'Продолжить' : 'Опубликовать анкету'}</Text>
      </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { padding: 5 },
  logoSmall: { width: 110, height: 30 },
  progressContainer: { height: 4, backgroundColor: '#EADFC7', marginHorizontal: 20, borderRadius: 2, marginBottom: 15 },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  content: { padding: 25, paddingBottom: 120 },
  layer3Container: { flex: 1, padding: 25, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textDark, marginBottom: 5, fontFamily: 'Involve-Black' },
  subtitle: { fontSize: 15, color: colors.textLight, marginBottom: 25, lineHeight: 22, fontFamily: 'Involve-Medium' },
  label: { fontSize: 16, fontWeight: '600', color: colors.textDark, marginBottom: 10, marginTop: 10, fontFamily: 'Involve-SemiBold' },
  input: { backgroundColor: colors.white, padding: 16, borderRadius: 16, marginBottom: 15, fontSize: 16, color: colors.textDark, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1, fontFamily: 'Involve-Medium' },
  pickerContainer: { backgroundColor: colors.white, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1, overflow: 'hidden' },
  picker: { width: '100%', height: 160 },
  row: { flexDirection: 'row' },
  selectable: { backgroundColor: colors.white, padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  selectableActive: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  selectableText: { fontSize: 15, color: colors.textLight, fontWeight: '500', textAlign: 'center', fontFamily: 'Involve-Medium' },
  selectableTextActive: { fontSize: 15, color: colors.primary, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Involve-Bold' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: -5 },
  sliderLabel: { fontSize: 13, color: colors.textLight, fontFamily: 'Involve-Medium' },
  sunWheelWrapper: { flex: 1, marginLeft: -25, marginRight: -25, marginTop: 10, marginBottom: 10, position: 'relative' },
  selectedTagsContainer: { minHeight: 80, backgroundColor: 'white', borderRadius: 20, padding: 16, marginTop: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  selectedTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  miniTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  miniTagText: { fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Involve-Medium' },
  bottomBtn: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: colors.primary, padding: 18, borderRadius: 30, alignItems: 'center', shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  btnText: { color: colors.white, fontSize: 18, fontWeight: 'bold', fontFamily: 'Involve-Bold' }
});
