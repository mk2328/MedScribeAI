import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform, Alert } from 'react-native';
import { KpiCard } from '../../src/components/ui/kpiCard';
import { getDoctorDashboard } from '../../src/services/doctorService';
import { useRouter } from 'expo-router'; 
import { colors } from '../../src/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DoctorDashboard() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          setDoctorName(user.name || 'Doctor');
        }

        const res = await getDoctorDashboard();
        setData(res);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem('user_data');
          router.replace('/(auth)/login'); 
        }
      }
    ]);
  };

  if (loading) return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.mutedText }} className="mt-4 font-medium">Fetching Dashboard...</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar style="dark" />
      
      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ 
          paddingTop: Platform.OS === 'android' ? 50 : 20, 
          paddingBottom: 100 
        }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER SECTION: Clickable Profile Area */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.push('/(doctor)/profile')}
            className="flex-row items-center"
          >
            <View 
              style={{ backgroundColor: colors.accent }} 
              className="w-12 h-12 rounded-full items-center justify-center border-2 border-white shadow-sm"
            >
              <MaterialCommunityIcons name="doctor" size={26} color={colors.primary} />
            </View>
            <View className="ml-3">
              <Text style={{ color: colors.primary }} className="text-[10px] font-bold uppercase tracking-widest">
                MedScribeAI Doctor
              </Text>
              <View className="flex-row items-center">
                <Text style={{ color: colors.darkText }} className="text-xl font-bold">
                  Hello, {doctorName}!
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.mutedText} style={{ marginLeft: 2 }} />
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ backgroundColor: '#FEE2E2' }}
            className="w-10 h-10 rounded-xl items-center justify-center border border-red-100"
          >
             <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* KPI SECTION */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <KpiCard title="In Queue" value={data.stats.totalInQueue} icon="account-clock-outline" iconColor="#f97316" />
          <KpiCard title="Completed" value={data.stats.completedToday} icon="check-decagram-outline" iconColor="#16a34a" />
          <KpiCard title="This Week" value={data.stats.weekConsultations} icon="calendar-month-outline" iconColor={colors.primary} />
          <KpiCard title="Avg Wait" value={data.stats.avgWaitTime} icon="timer-outline" iconColor="#9333ea" />
        </View>

        {/* PATIENT QUEUE HEADER */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text className="text-xl font-bold text-slate-900 tracking-tight">Current Patient Queue</Text>
          <TouchableOpacity onPress={() => router.push('/(doctor)/queue/patient_queue')}>
            <Text style={{ color: colors.primary }} className="font-bold text-sm">View all</Text>
          </TouchableOpacity>
        </View>

        {/* QUEUE LIST */}
        {data.queue.map((patient: any) => (
          <TouchableOpacity 
            key={patient.id} 
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: "/(doctor)/report/[id]",
              params: { id: patient.id }
            })}
            style={{ borderColor: colors.accent }}
            className="bg-white p-5 rounded-[28px] mb-3 flex-row items-center shadow-sm border"
          >
            <View className="flex-1">
              <Text style={{ color: colors.darkText }} className="font-bold text-lg">{patient.name}</Text>
              <View className="flex-row items-center mt-1">
                <Text style={{ color: colors.mutedText }} className="text-sm">{patient.age}y • </Text>
                <Text style={{ color: colors.mutedText }} className="text-sm">{patient.condition}</Text>
              </View>
            </View>
            
            <View className="items-end">
              <View 
                style={{ backgroundColor: patient.status === 'Urgent' ? '#FEE2E2' : colors.accent }} 
                className="px-3 py-1 rounded-full"
              >
                <Text style={{ color: patient.status === 'Urgent' ? '#EF4444' : colors.primary }} className="text-[10px] font-bold uppercase">
                  {patient.status}
                </Text>
              </View>
              <Text style={{ color: colors.mutedText }} className="text-[10px] mt-2 font-medium">
                {patient.arrivalTime}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}