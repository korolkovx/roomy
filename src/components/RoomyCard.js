import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import colors from '../theme/colors';
import Bubble from './Bubble';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

export default function RoomyCard({ profile, isTop, onSwipeLeft, onSwipeRight, onPress }) {
  const position = useRef(new Animated.ValueXY()).current;
  
  const visibleBubbles = useMemo(() => {
    let charCount = 0;
    const maxChars = 85; // Allow accurately ~3 rows
    const result = [];
    let hiddenCount = 0;

    for (const b of profile.bubbles) {
      if (charCount > maxChars) {
        hiddenCount++;
        continue;
      }
      charCount += b.label.length + 3; // +3 to account for padding
      if (charCount > maxChars && result.length > 0) {
        hiddenCount++;
      } else {
        result.push(b);
      }
    }
    return { list: result, hiddenCount };
  }, [profile.bubbles]);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
          if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
            onPress();
          }
        }
      }
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH + 50 : -SCREEN_WIDTH - 50;
    Animated.timing(position, {
      toValue: { x, y: direction === 'right' ? 50 : -50 },
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      if (direction === 'right') onSwipeRight();
      else onSwipeLeft();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false
    }).start();
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const animatedCardStyle = {
    transform: position.getTranslateTransform().concat({ rotate })
  };

  return (
    <Animated.View 
      style={[styles.cardWrapper, isTop && animatedCardStyle]} 
      {...panResponder.panHandlers}
    >
      <View style={styles.card}>
        <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFillObject} />
        
        <View style={styles.imageContainer}>
          <Image source={profile.image} style={styles.image} contentFit="cover" transition={200} />

          <View style={styles.topBadgeContainer}>
              <View style={styles.matchBadge}>
                <Feather name="sun" size={18} color="#FFECAA" />
                <Text style={styles.matchText}>{profile.matchScore} %</Text>
              </View>
            </View>

            {/* Edge Highlighting */}
          <Animated.View style={[styles.edgeHighlight, { borderColor: '#4CAF50', opacity: isTop ? likeOpacity : 0 }]} />
          <Animated.View style={[styles.edgeHighlight, { borderColor: '#F44336', opacity: isTop ? nopeOpacity : 0 }]} />
          
          {/* Center Icons */}
          <Animated.View style={[styles.centerIconContainer, { opacity: isTop ? likeOpacity : 0 }]}>
            <FontAwesome5 name="door-open" size={100} color="white" style={styles.iconShadow} />
          </Animated.View>
          <Animated.View style={[styles.centerIconContainer, { opacity: isTop ? nopeOpacity : 0 }]}>
            <Feather name="x" size={120} color="white" style={styles.iconShadow} />
          </Animated.View>
        </View>

        <View style={styles.contentHalf}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.age}>{profile.age} лет</Text>
            </View>
            <View style={styles.bubblesContainer}>
              {visibleBubbles.list.map((b, i) => (
                <Bubble key={i} label={b.label} color={b.color} />
              ))}
              {visibleBubbles.hiddenCount > 0 && (
                <Bubble key="more" label={`+${visibleBubbles.hiddenCount}`} color="#F3F4F6" />
              )}
            </View>
          </View>
        </View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { flex: 1, width: '100%', shadowColor: '#FF9500', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  card: { flex: 1, backgroundColor: '#FFD494', borderRadius: 24, padding: 18, overflow: 'hidden' }, 
  imageContainer: { flex: 1, width: '100%', borderRadius: 20, overflow: 'hidden', backgroundColor: '#e1e4e8', position: 'relative' },
  image: { width: '100%', height: '100%' },
  contentHalf: { marginTop: 16, paddingBottom: 4, width: '100%' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 32, fontFamily: 'Involve-Medium', color: '#3A2300', marginRight: 12, lineHeight: 36 },
  age: { fontSize: 22, fontFamily: 'Involve-Medium', color: 'rgba(58, 35, 0, 0.6)', lineHeight: 26 },
  bubblesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  topBadgeContainer: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  matchBadge: { backgroundColor: '#FF9500', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 30, shadowColor: '#FF9500', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  matchText: { color: '#FFECAA', fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  
  // Swipe Interactions Styles
  edgeHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 6,
    borderRadius: 20,
  },
  centerIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  }
});
