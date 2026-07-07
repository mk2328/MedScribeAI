import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PatientsPage = () => {
  const router = useRouter();
  
  const patients = [
    { name: 'Muhammad Ali', initial: 'MA', dept: 'Cardiology', age: '45y', pid: 'P-2024-001', phone: '0300-1234567', visits: '5 visits', date: '2024-01-15' },
    { name: 'Fatima Khan', initial: 'FK', dept: 'General Medicine', age: '32y', pid: 'P-2024-002', phone: '0321-9876543', visits: '2 visits', date: '2024-01-14' },
    { name: 'Ahmed Hassan', initial: 'AH', dept: 'General Medicine', age: '28y', pid: 'P-2024-003', phone: '0333-5555555', visits: '1 visits', date: '2024-01-13' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* HEADER */}
      <View className="px-6 py-6 bg-white border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-900">Patients</Text>
      </View>

      {/* SEARCH BAR */}
      <View className="px-6 py-4">
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
          <Feather name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search name, ID, or phone..." className="ml-3 flex-1" />
        </View>
      </View>

      {/* PATIENT LIST */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
        {patients.map((p, index) => (
          <View key={index} className="bg-white p-5 rounded-2xl border border-slate-100 mb-4 shadow-sm flex-row justify-between items-center">
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-teal-50 rounded-full items-center justify-center">
                <Text className="text-teal-700 font-bold">{p.initial}</Text>
              </View>
              <View className="ml-4">
                <Text className="font-bold text-slate-900">{p.name}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">{p.age} • {p.pid}</Text>
                <Text className="text-xs text-slate-400 mt-0.5">📞 {p.phone} • 📄 {p.visits}</Text>
              </View>
            </View>
            
            <View className="items-end">
              <View className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <Text className="text-[11px] font-bold text-slate-600">{p.dept}</Text>
              </View>
              <Text className="text-[10px] text-slate-400 mt-2">📅 {p.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View className="flex-row justify-around py-4 bg-white border-t border-slate-200" style={{ height: 80 }}>
        <TouchableOpacity onPress={() => router.push('/(receptionist)/dashboard')} className="items-center">
          <MaterialCommunityIcons name="view-grid-outline" size={24} color="#64748B" />
          <Text className="text-[10px] text-slate-500 mt-1">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialCommunityIcons name="account-group" size={24} color="#0D9488" />
          <Text className="text-[10px] text-teal-700 font-bold mt-1">Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(receptionist)/settings')} className="items-center">
          <MaterialCommunityIcons name="cog-outline" size={24} color="#64748B" />
          <Text className="text-[10px] text-slate-500 mt-1">Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PatientsPage;