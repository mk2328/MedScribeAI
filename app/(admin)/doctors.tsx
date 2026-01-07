import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router'; // useFocusEffect zaroori hai
import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { storage } from '../../src/utils/storage';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const router = useRouter();

  // useFocusEffect har baar chalta hai jab screen focus mein aati hai (e.g. Back aane par)
  useFocusEffect(
    useCallback(() => {
      const loadDoctors = async () => {
        const data = await storage.getDoctors();
        setDoctors(data);
      };
      loadDoctors();
    }, [])
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-50">
        <Text className="text-2xl font-extrabold text-slate-800">Doctors List</Text>
        <View className="bg-teal-100 px-3 py-1 rounded-full">
          <Text className="text-teal-700 font-bold">{doctors.length}</Text>
        </View>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}
        ListEmptyComponent={() => (
            <View className="items-center mt-20">
                <MaterialCommunityIcons name="account-off-outline" size={60} color="#CBD5E1" />
                <Text className="text-slate-400 mt-4">No doctors found.</Text>
            </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.push({
                pathname: '/(admin)/doctor_details',
                params: { doctorData: JSON.stringify(item) }
            })}
            className="bg-white p-5 rounded-[28px] mb-4 border border-slate-100 shadow-sm flex-row items-center"
          >
            <View className="w-14 h-14 rounded-2xl bg-teal-50 items-center justify-center mr-4">
              <MaterialCommunityIcons name="account-tie-voice-outline" size={30} color={colors.primary} />
            </View>
            
            <View className="flex-1">
              <Text className="font-bold text-lg text-slate-800">{item.name}</Text>
              <Text className="text-xs text-slate-400 font-medium mb-1">{item.specialization}</Text>
              
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${item.availability_status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {item.availability_status || 'Active'}
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}