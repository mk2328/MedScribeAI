import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
// 1. Added Platform import
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { getPatientReport } from '@/src/services/doctorService';
import { colors } from '@/src/theme/colors';
// 2. Added StatusBar import
import { StatusBar } from 'expo-status-bar';

export default function PatientReport() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatientReport(id as string).then((data) => {
        setPatient(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!patient) return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center p-6">
      <Text style={{ color: colors.darkText }} className="text-lg font-bold">Patient not found.</Text>
      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text style={{ color: colors.primary }}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* 3. Ensure system icons are visible and dark */}
      <StatusBar style="dark" />

      {/* 4. Navigation Bar - Added conditional marginTop to avoid status bar overlap */}
      <View 
        className="px-6" 
        style={{ marginTop: Platform.OS === 'android' ? 40 : 10 }}
      >
        <TouchableOpacity 
          onPress={() => router.replace("/(doctor)/dashboard")} 
          className="flex-row items-center py-2"
        >
          <View style={{ backgroundColor: colors.accent }} className="w-8 h-8 rounded-full items-center justify-center">
            <Text style={{ color: colors.primary }} className="text-lg font-bold">←</Text>
          </View>
          <Text style={{ color: colors.primary }} className="ml-3 font-bold text-base">Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Patient Header - Reduced mt to keep it visually connected but safe */}
      <View className="px-6 mt-8 mb-8">
        <Text style={{ color: colors.mutedText }} className="text-xs font-bold uppercase tracking-wider mb-1">
          Patient ID: {id}
        </Text>
        <Text style={{ color: colors.darkText }} className="text-4xl font-bold">{patient.name}</Text>
        <Text style={{ color: colors.mutedText }} className="text-lg mt-1">
          {patient.age} years old • {patient.condition}
        </Text>
      </View>

      {/* 6. Content Area */}
      <View className="flex-1 px-6 pb-12">
        <View 
          style={{ backgroundColor: 'white', borderColor: colors.accent }} 
          className="p-6 rounded-3xl border shadow-sm mb-6"
        >
          <Text style={{ color: colors.primary }} className="font-bold mb-4 text-lg">Clinical Summary</Text>
          <View className="space-y-3">
            <Text style={{ color: colors.darkText }} className="font-medium text-base">• Primary Symptom: {patient.condition}</Text>
            <Text style={{ color: colors.darkText }} className="font-medium text-base">• Duration: 2-3 Days</Text>
            <View className="mt-4 pt-4 border-t border-teal-50">
              <Text className="text-red-500 font-bold text-sm uppercase tracking-tight">No Known Drug Allergies</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: colors.accent }} className="p-6 rounded-3xl mb-10">
          <Text style={{ color: colors.primary }} className="font-bold mb-2 text-lg">Reason for Visit</Text>
          <Text style={{ color: colors.primary, opacity: 0.8 }} className="leading-6 text-base font-medium">
            {patient.receptionNotes}
          </Text>
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: colors.primary }} 
          className="p-5 rounded-2xl items-center shadow-lg mt-auto mb-4"
        >
          <Text className="text-white font-bold text-xl">Start Examination</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}