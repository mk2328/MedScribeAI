import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AppointmentsPage = () => {
  const router = useRouter();

  const appointments = [
    { id: 1, name: 'Zainab Abbas', time: '10:00 AM', dept: 'Cardiology', status: 'Confirmed' },
    { id: 2, name: 'Bilal Ahmed', time: '10:30 AM', dept: 'Orthopedics', status: 'Pending' },
    { id: 3, name: 'Maria Khan', time: '11:15 AM', dept: 'General Medicine', status: 'Confirmed' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* HEADER */}
      <View className="px-6 py-4 flex-row items-center border-b border-slate-100 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4 text-slate-800">Appointments</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* DATE HEADER */}
        <Text className="text-sm font-bold text-slate-500 mb-4 uppercase">Today, July 7</Text>

        {appointments.map((app) => (
          <View key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 mb-4 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-sky-50 rounded-full items-center justify-center">
                <MaterialCommunityIcons name="calendar-clock" size={22} color="#0284C7" />
              </View>
              <View className="ml-4">
                <Text className="font-bold text-slate-900">{app.name}</Text>
                <Text className="text-xs text-slate-500">{app.dept} • {app.time}</Text>
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${app.status === 'Confirmed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <Text className={`text-[10px] font-bold ${app.status === 'Confirmed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {app.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* NAVIGATION BAR - (Wahi same nav bar jo baaki pages par hai) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-3 flex-row justify-around items-center">
        <TouchableOpacity onPress={() => router.push('/(receptionist)/dashboard')} className="items-center">
          <MaterialCommunityIcons name="view-grid-outline" size={24} color="#94A3B8" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialCommunityIcons name="calendar-month" size={24} color="#0D9488" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(receptionist)/settings')} className="items-center">
          <MaterialCommunityIcons name="cog-outline" size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AppointmentsPage;