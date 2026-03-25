import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export const NavIconFilter = ({ size = 30, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>
  </Svg>
);

export const NavIconChat = ({ size = 30, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 10C18.7614 10 21 11.7909 21 14C21 15.1587 20.4552 16.1963 19.5739 16.9238L20 20L17.423 19.1411C16.9737 19.2789 16.4952 19.3582 16 19.3582C13.2386 19.3582 11 17.5673 11 15.4087C11 12.4214 13.2386 10 16 10Z" />
    <Path d="M13 14.5C13 17.5376 10.3137 20 7 20C6.29828 20 5.626 19.8942 5.00762 19.7027L2 21L2.58245 17.5056C1.60098 16.6669 1 15.3976 1 14C1 10.6863 4 8 8 8C11.3137 8 14 10.6863 14 14" />
  </Svg>
);

export const NavIconHome = ({ size = 30, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" />
    <Path d="M10 14H14V21H10V14Z" />
  </Svg>
);

export const NavIconProfile = ({ size = 30, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="8" r="4.5" />
    <Path d="M20 21C20 16.5 16.5 14 12 14C7.5 14 4 16.5 4 21" />
  </Svg>
);
