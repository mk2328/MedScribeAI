import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { KpiCard } from '../../src/components/ui/kpiCard';
import { getDoctorDashboard } from '../../src/services/doctorService';
import { useRouter } from 'expo-router'; 
import { colors } from '../../src/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DoctorDashboard() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDoctorDashboard().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

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
        // Adjusting padding for the new bottom tab bar and status bar
        contentContainerStyle={{ 
          paddingTop: Platform.OS === 'android' ? 50 : 20, 
          paddingBottom: 100 
        }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* CONSISTENT HEADER: Matches Admin Panel */}
        <View className="flex-row justify-between items-center mb-8">
          <View className="flex-row items-center">
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
              <Text style={{ color: colors.darkText }} className="text-xl font-bold">
                Hello, Dr. Mohsin!
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={{ backgroundColor: '#FEE2E2' }}
            className="w-10 h-10 rounded-xl items-center justify-center border border-red-100"
          >
             <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* KPI SECTION: Balanced with Admin colors */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <KpiCard 
            title="In Queue" 
            value={data.stats.totalInQueue} 
            icon="account-clock-outline" 
            iconColor="#f97316" 
          />
          <KpiCard 
            title="Completed" 
            value={data.stats.completedToday} 
            icon="check-decagram-outline" 
            iconColor="#16a34a" 
          />
          <KpiCard 
            title="This Week" 
            value={data.stats.weekConsultations} 
            icon="calendar-month-outline" 
            iconColor={colors.primary} 
          />
          <KpiCard 
            title="Avg Wait" 
            value={data.stats.avgWaitTime} 
            icon="timer-outline" 
            iconColor="#9333ea" 
          />
        </View>

        {/* PATIENT QUEUE HEADER */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text className="text-xl font-bold text-slate-900 tracking-tight">Current Patient Queue</Text>
          <TouchableOpacity onPress={() => router.push('/(doctor)/queue/patient_queue')}>
            <Text style={{ color: colors.primary }} className="font-bold text-sm">View all</Text>
          </TouchableOpacity>
        </View>

        {/* QUEUE LIST: Clean, modern cards */}
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
                <Text 
                  style={{ color: patient.status === 'Urgent' ? '#EF4444' : colors.primary }} 
                  className="text-[10px] font-bold uppercase"
                >
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