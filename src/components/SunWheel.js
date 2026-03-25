import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const R = HEIGHT * 0.55; // Radius of the wheel
const CX = -R * 0.7; // Center X, pushed off left screen
const CY = HEIGHT * 0.35; // Center Y slightly higher

export default function SunWheel({ tags, selectedTags, onToggleTag }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const lastRotation = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (evt, gestureState) => {
        // dy > 0 means drag down -> positive rotation
        const angleDelta = gestureState.dy / R;
        rotation.setValue(lastRotation.current + angleDelta);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const angleDelta = gestureState.dy / R;
        lastRotation.current += angleDelta;

        Animated.decay(rotation, {
          velocity: gestureState.vy / (R * 0.15), // Снизили скорость (было 0.05)
          deceleration: 0.992, // Чуть быстрее останавливается
          useNativeDriver: true,
        }).start();
      }
    })
  ).current;

  useEffect(() => {
    const id = rotation.addListener(({ value }) => {
      lastRotation.current = value;
    });
    return () => rotation.removeListener(id);
  }, [rotation]);

  const makeInterpolationRange = (baseAngle) => {
    const inputRange = [];
    const outputX = [];
    const outputY = [];
    // from -50 to +50 radians
    for (let r = -50; r <= 50; r += 0.5) {
      inputRange.push(r);
      const angle = baseAngle + r;
      outputX.push(CX + R * Math.cos(angle));
      outputY.push(CY + R * Math.sin(angle));
    }
    return { inputRange, outputX, outputY };
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Светящиеся кольца "солнца". Самое большое кольцо убрано, чтобы не затенять весь экран */}
      <View style={[styles.ring, { width: R*2.1, height: R*2.1, borderRadius: R*1.05, left: CX - R*1.05, top: CY - R*1.05, backgroundColor: '#FFE0B2', opacity: 0.8 }]} />
      <View style={[styles.ring, { width: R*1.7, height: R*1.7, borderRadius: R*0.85, left: CX - R*0.85, top: CY - R*0.85, backgroundColor: '#FFD54F', shadowColor: '#FF9500', shadowRadius: 30, shadowOpacity: 0.4, elevation: 10 }]} />
      
      {/* Острые, тонкие стрелочки на орбите кольца */}
      <View style={{ position: 'absolute', left: CX + R*1.05 - 12, top: CY - 60, opacity: 0.4 }}>
        <Feather name="chevron-up" size={24} color="#FF9500" strokeWidth={2.5} />
      </View>
      <View style={{ position: 'absolute', left: CX + R*1.05 - 12, top: CY + 60, opacity: 0.4 }}>
        <Feather name="chevron-down" size={24} color="#FF9500" strokeWidth={2.5} />
      </View>
      
      {tags.map((tag, index) => {
        // Распределяем теги по всему кругу (2 * PI). 
        // Это создаст эффект бесконечного колеса без пустых зон.
        const baseAngle = index * ((2 * Math.PI) / tags.length); 
        const { inputRange, outputX, outputY } = makeInterpolationRange(baseAngle);

        const animatedX = rotation.interpolate({ inputRange, outputRange: outputX });
        const animatedY = rotation.interpolate({ inputRange, outputRange: outputY });

        const isSelected = selectedTags.some(t => t.label === tag.label);

        return (
          <Animated.View
            key={tag.label}
            style={[
              styles.tagWrapper,
              { transform: [{ translateX: animatedX }, { translateY: animatedY }] }
            ]}
          >
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.tag, isSelected && styles.tagSelected]} 
              onPress={() => onToggleTag(tag)}
            >
              <View style={[styles.dot, { backgroundColor: tag.color || '#CCC' }]} />
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FEF6D9'
  },
  ring: {
    position: 'absolute',
  },
  tagWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  ring: {
    position: 'absolute',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffaed',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tagSelected: {
    borderColor: '#FF9500',
    backgroundColor: '#fff',
    borderWidth: 2,
    paddingVertical: 10, // компенсация бордера
    paddingHorizontal: 18,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  tagText: {
    fontSize: 16,
    color: '#49454F',
    fontFamily: 'Involve-Medium'
  },
  tagTextSelected: {
    color: '#1D1B20',
    fontFamily: 'Involve-Bold'
  }
});
