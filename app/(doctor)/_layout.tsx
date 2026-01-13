import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

export default function DoctorLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          // FIXED: Height aur Padding ko buttons se upar karne ke liye adjust kiya
          height: Platform.OS === 'ios' ? 85 : 80, 
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20, 
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={26} color={color} />
          ),
        }}
      />
      
      {/* FIXED: Patient Queue Icon and Label */}
      <Tabs.Screen
        name="queue/index"
        options={{
          title: 'Queue',
          tabBarLabel: 'Patient Queue',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="human-queue" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="report/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="reports/index"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-edit-outline" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}