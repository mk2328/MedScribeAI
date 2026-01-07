import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getPatientReport } from '@/src/services/doctorService';
import { colors } from '@/src/theme/colors';

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
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Patient Profile Header */}
        <View className="mb-6">
          <Text style={{ color: colors.mutedText }} className="text-xs font-bold uppercase tracking-wider mb-1">
            Patient ID: {id}
          </Text>
          <Text style={{ color: colors.darkText }} className="text-3xl font-bold">
            {patient.name}
          </Text>
          <Text style={{ color: colors.mutedText }} className="text-base mt-1">
            {patient.age} years old • {patient.condition}
          </Text>
        </View>
        
        {/* Vitals Section - Using Accent and Primary Teal */}
        <View 
          style={{ backgroundColor: 'white', borderColor: colors.accent }} 
          className="p-5 rounded-3xl border shadow-sm mb-6"
        >
          <Text style={{ color: colors.primary }} className="font-bold mb-4 text-lg">Reception Vitals</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text style={{ color: colors.mutedText }} className="text-[10px] uppercase font-bold mb-1">BP</Text>
              <Text style={{ color: colors.darkText }} className="text-base font-bold">{patient.vitals?.bp}</Text>
            </View>
            <View className="w-[1px] h-10 bg-teal-50" />
            <View className="items-center">
              <Text style={{ color: colors.mutedText }} className="text-[10px] uppercase font-bold mb-1">Temp</Text>
              <Text style={{ color: colors.darkText }} className="text-base font-bold">{patient.vitals?.temp}</Text>
            </View>
            <View className="w-[1px] h-10 bg-teal-50" />
            <View className="items-center">
              <Text style={{ color: colors.mutedText }} className="text-[10px] uppercase font-bold mb-1">Weight</Text>
              <Text style={{ color: colors.darkText }} className="text-base font-bold">{patient.vitals?.weight}</Text>
            </View>
          </View>
        </View>

        {/* Reason for Visit Section */}
        <View style={{ backgroundColor: colors.accent }} className="p-5 rounded-3xl mb-8">
          <Text style={{ color: colors.primary }} className="font-bold mb-2 text-lg">Reason for Visit</Text>
          <Text style={{ color: colors.primary, opacity: 0.8 }} className="leading-5 font-medium">
            {patient.receptionNotes}
          </Text>
        </View>

        {/* Start Consultation Button */}
        <TouchableOpacity 
          style={{ backgroundColor: colors.primary }} 
          className="p-5 rounded-2xl items-center shadow-lg mb-10"
        >
          <Text className="text-white font-bold text-lg">Start Examination</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}