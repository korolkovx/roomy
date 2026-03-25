import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, StyleSheet, Dimensions } from 'react-native';
import colors from '../theme/colors';

const { width: w, height: h } = Dimensions.get('window');

const blue = '#0600A3';
const orange = colors.primary;

export default function BackgroundWaves() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* TOP WAVES */}
        {/* Layer 1 - Thin Blue */}
        <Path 
          d={`M ${w*0.1} ${-50} Q ${w*0.05} ${h*0.3} ${w*0.5} ${h*0.3} T ${w+50} ${-50}`} 
          fill="none" stroke={blue} strokeWidth="3" 
        />
        {/* Layer 2 - Thick Orange */}
        <Path 
          d={`M ${-50} ${h*0.12} Q ${w*0.15} ${h*0.38} ${w*0.55} ${h*0.38} T ${w+50} ${h*0.05}`} 
          fill="none" stroke={orange} strokeWidth="6" 
        />
        {/* Layer 3 - Thick Blue */}
        <Path 
          d={`M ${-50} ${h*0.22} Q ${w*0.25} ${h*0.48} ${w*0.65} ${h*0.48} T ${w+50} ${h*0.15}`} 
          fill="none" stroke={blue} strokeWidth="12" 
        />
        {/* Layer 4 - Thick Orange */}
        <Path 
          d={`M ${-50} ${h*0.28} Q ${w*0.35} ${h*0.57} ${w*0.75} ${h*0.57} T ${w+50} ${h*0.25}`} 
          fill="none" stroke={orange} strokeWidth="18" 
        />
        {/* Layer 5 - Very Thick Orange */}
        <Path 
          d={`M ${-50} ${h*0.35} Q ${w*0.35} ${h*0.68} ${w*0.8} ${h*0.68} T ${w+50} ${h*0.35}`} 
          fill="none" stroke={orange} strokeWidth="26" 
        />

        {/* BOTTOM WAVES */}
        {/* Layer 1 - Thin Blue */}
        <Path 
          d={`M ${-50} ${h*0.6} Q ${w*0.5} ${h*0.65} ${w+50} ${h*0.75}`} 
          fill="none" stroke={blue} strokeWidth="2" 
        />
        {/* Layer 2 - Thin Orange */}
        <Path 
          d={`M ${-50} ${h*0.64} Q ${w*0.5} ${h*0.7} ${w+50} ${h*0.8}`} 
          fill="none" stroke={orange} strokeWidth="4" 
        />
        {/* Layer 3 - Thick Blue */}
        <Path 
          d={`M ${-50} ${h*0.68} Q ${w*0.5} ${h*0.77} ${w+50} ${h*0.83}`} 
          fill="none" stroke={blue} strokeWidth="8" 
        />
        {/* Layer 4 - Thick Orange */}
        <Path 
          d={`M ${-50} ${h*0.72} Q ${w*0.5} ${h*0.82} ${w+50} ${h*0.88}`} 
          fill="none" stroke={orange} strokeWidth="12" 
        />
        {/* Layer 5 - Very Thick Orange */}
        <Path 
          d={`M ${-50} ${h*0.75} Q ${w*0.5} ${h*0.88} ${w+50} ${h*0.93}`} 
          fill="none" stroke={orange} strokeWidth="20" 
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF9E6',
  }
});
