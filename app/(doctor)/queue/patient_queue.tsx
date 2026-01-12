import React, { useEffect, useState } from 'react';
// 1. Added Platform import
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';
import { getFullQueue } from '@/src/services/doctorService';
// 2. Added StatusBar import
import { StatusBar } from 'expo-status-bar';

export default function FullQueue() {
  const router = useRouter();
  const [fullQueue, setFullQueue] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFullQueue().then((data: any) => {
      setFullQueue(data);
      setLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* 3. Added StatusBar to keep mobile icons visible */}
      <StatusBar style="dark" />

      {/* 4. Wrapped content in a View with conditional Top Margin for Android/Notch safety */}
      <View 
        className="px-6 flex-1" 
        style={{ marginTop: Platform.OS === 'android' ? 45 : 10 }}
      >
        
        {/* Navigation */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="flex-row items-center py-2 mb-6"
        >
          <View style={{ backgroundColor: colors.accent }} className="w-8 h-8 rounded-full items-center justify-center">
            <Text style={{ color: colors.primary }} className="text-lg font-bold">←</Text>
          </View>
          <Text style={{ color: colors.primary }} className="ml-3 font-bold text-base">Dashboard</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.darkText }} className="text-3xl font-bold mb-6">Patient Queue</Text>
        
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" className="mt-10" />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {fullQueue.map((patient) => (
              <TouchableOpacity 
                key={patient.id}
                onPress={() => router.push(`/(doctor)/report/${patient.id}`)}
                style={{ backgroundColor: 'white', borderColor: colors.accent }} 
                className="p-5 rounded-3xl border shadow-sm mb-4 flex-row justify-between items-center"
              >
                <View className="flex-1 mr-2">
                  <Text style={{ color: colors.darkText }} className="font-bold text-lg">{patient.name}</Text>
                  <Text style={{ color: colors.mutedText }} className="text-sm mt-1">
                    {patient.age}y • {patient.condition}
                  </Text>
                </View>
                
                <View style={{ backgroundColor: colors.accent }} className="px-3 py-1 rounded-full">
                  <Text style={{ color: colors.primary }} className="text-[10px] font-bold uppercase">
                    {patient.status || 'Waiting'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}