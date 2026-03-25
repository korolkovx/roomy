import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Исходный IP был 192.168.1.14, но у вас теперь 192.168.1.12.
const API_BASE = 'http://localhost:3000/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [feedProfiles, setFeedProfiles] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('roomy_jwt');
        if (storedToken) setToken(storedToken);
      } catch (e) {
        console.error('Error loading token', e);
      } finally {
        setAuthLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (phone, code, profileData = null) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      const data = await res.json();
      if (data.token) {
        await SecureStore.setItemAsync('roomy_jwt', data.token);
        
        if (profileData) {
          await fetch(`${API_BASE}/profiles/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.token}` },
            body: JSON.stringify(profileData)
          });
        }
        
        setToken(data.token);
      }
    } catch (e) {
      console.error('Login error', e);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('roomy_jwt');
    await AsyncStorage.clear();
    setToken(null);
    setFeedProfiles([]);
    setIncoming([]);
    setOutgoing([]);
    setMatches([]);
  };

  const fetchAll = async () => {
    try {
      const pRes = await fetch(`${API_BASE}/profiles/feed`);
      const iRes = await fetch(`${API_BASE}/requests/incoming`);
      const oRes = await fetch(`${API_BASE}/requests/outgoing`);
      const mRes = await fetch(`${API_BASE}/requests/matches`);

      if (pRes.ok) setFeedProfiles(await pRes.json());
      if (iRes.ok) setIncoming(await iRes.json());
      if (oRes.ok) setOutgoing(await oRes.json());
      if (mRes.ok) setMatches(await mRes.json());
    } catch (err) {
      console.warn('API Error: ', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
      registerForPushNotificationsAsync().then(pushToken => {
        if (pushToken) {
          fetch(`${API_BASE}/auth/push-token`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pushToken })
          }).catch(err => console.error('Push token error', err));
        }
      });
    }
  }, [token]);

  async function registerForPushNotificationsAsync() {
    let pushToken;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      pushToken = (await Notifications.getExpoPushTokenAsync({ projectId: 'roomy-local' })).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }
    return pushToken;
  }

  const filteredFeedProfiles = activeFilters.length === 0 
    ? feedProfiles 
    : feedProfiles.filter(profile => 
        profile.bubbles?.some(b => activeFilters.includes(b.label))
      );

  const swipeRight = async (profile, customText) => {
    setFeedProfiles((prev) => prev.filter(p => p.id !== profile.id));
    const outgoingProfile = { ...profile, text: customText || 'Ожидает ответа...' };
    setOutgoing((prev) => [outgoingProfile, ...prev]);

    try {
      await fetch(`${API_BASE}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id, message: customText })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateOutgoingMessage = async (profileId, newText) => {
    setOutgoing((prev) => prev.map(p => p.id === profileId ? { ...p, text: newText } : p));
    try {
      await fetch(`${API_BASE}/requests/outgoing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, message: newText })
      });
    } catch (e) { console.error(e); }
  };

  const swipeLeft = async (profile) => {
    setFeedProfiles((prev) => prev.filter(p => p.id !== profile.id));
    try {
      await fetch(`${API_BASE}/swipe/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      });
    } catch (e) { console.error(e); }
  };

  const acceptIncoming = async (profile) => {
    setIncoming((prev) => prev.filter(p => p.id !== profile.id));
    const matchedProfile = { ...profile, text: 'Контакт открыт, можно общаться' };
    setMatches((prev) => [matchedProfile, ...prev]);

    try {
      await fetch(`${API_BASE}/requests/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      });
    } catch (e) { console.error(e); }
  };

  const rejectIncoming = async (profile) => {
    setIncoming((prev) => prev.filter(p => p.id !== profile.id));
    try {
      await fetch(`${API_BASE}/requests/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      });
    } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{
      token,
      authLoading,
      login,
      logout,
      feedProfiles: filteredFeedProfiles, 
      incoming,
      outgoing,
      matches,
      swipeRight,
      swipeLeft,
      acceptIncoming,
      rejectIncoming,
      updateOutgoingMessage,
      activeFilters,
      setActiveFilters,
      totalFeedCount: filteredFeedProfiles.length
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
