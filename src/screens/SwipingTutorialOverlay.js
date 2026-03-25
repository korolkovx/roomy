import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function SwipingTutorialOverlay({ onDismiss }) {
  const [step, setStep] = useState(0); // 0 = right, 1 = left
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isActive = true;
    const animate = () => {
      translateX.setValue(0);
      opacity.setValue(1);
      
      Animated.sequence([
        Animated.timing(translateX, { toValue: step === 0 ? 120 : -120, duration: 1200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(300)
      ]).start((result) => {
        if (result.finished && isActive) animate();
      });
    };
    animate();
    return () => { isActive = false; translateX.stopAnimation(); opacity.stopAnimation(); };
  }, [step, translateX, opacity]);

  const handlePress = () => {
    if (step === 0) setStep(1);
    else onDismiss();
  };

  const isRight = step === 0;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.handContainer, { transform: [{ translateX }], opacity }]}>
          <FontAwesome5 name="hand-pointer" size={60} color="white" />
        </Animated.View>
        
        <Text style={styles.title}>
          {isRight ? 'СМАХНИ ВПРАВО' : 'СМАХНИ ВЛЕВО'}
        </Text>
        <View style={[styles.underline, { backgroundColor: isRight ? '#34C759' : '#FF3B30' }]} />
        <Text style={styles.subtitle}>
          {isRight 
            ? 'Отправить заявку соседу. Если он примет вашу заявку, вы получите контакты друг друга.' 
            : 'Взмахните влево, если хочешь пропустить анкету.'}
        </Text>
        
        <Text style={styles.tapText}>Коснись экрана, чтобы продолжить</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 1000,
    elevation: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  handContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Involve-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  underline: {
    width: 250,
    height: 3,
    backgroundColor: '#4CAF50',
    marginBottom: 20,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Involve-Medium',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  tapText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    fontFamily: 'Involve-SemiBold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  }
});
