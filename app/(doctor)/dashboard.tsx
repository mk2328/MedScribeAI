import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KpiCard } from '../../src/components/ui/kpiCard';
import { getDoctorDashboard } from '../../src/services/doctorService';
import { useRouter } from 'expo-router'; 
import { colors } from '../../src/theme/colors';

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
    <ScrollView 
      style={{ backgroundColor: colors.background }} 
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: colors.darkText }} className="text-2xl font-bold mb-6">Doctor Dashboard</Text>

      {/* KPI Section */}
      <View className="flex-row flex-wrap justify-between mb-2">
        <KpiCard title="In Queue" value={data.stats.totalInQueue} colorClass="text-orange-500" />
        <KpiCard title="Completed" value={data.stats.completedToday} colorClass="text-green-600" />
        <KpiCard title="This Week" value={data.stats.weekConsultations} />
        <KpiCard title="Avg Wait" value={data.stats.avgWaitTime} colorClass="text-purple-600" />
      </View>

      {/* Patient Queue */}
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ color: colors.darkText }} className="text-lg font-bold">Current Patient Queue</Text>
        <TouchableOpacity>
          <Text style={{ color: colors.primary }} className="text-sm font-semibold">View all</Text>
        </TouchableOpacity>
      </View>

      {data.queue.map((patient: any) => (
        <TouchableOpacity 
          key={patient.id} 
          activeOpacity={0.8}
          onPress={() => router.push({
            pathname: "/(doctor)/report/[id]",
            params: { id: patient.id }
          })}
          style={{ borderColor: colors.accent }}
          className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border"
        >
          <View className="flex-1">
            <Text style={{ color: colors.darkText }} className="font-bold text-base">{patient.name}</Text>
            <View className="flex-row items-center mt-1">
              <Text style={{ color: colors.mutedText }} className="text-xs">{patient.age}y • </Text>
              <Text style={{ color: colors.mutedText }} className="text-xs">{patient.condition}</Text>
            </View>
          </View>
          
          <View className="items-end">
            <View 
              style={{ backgroundColor: patient.status === 'Urgent' ? '#FEE2E2' : colors.accent }} 
              className="px-3 py-1 rounded-full"
            >
              <Text 
                style={{ color: patient.status === 'Urgent' ? '#EF4444' : colors.primary }} 
                className="text-[10px] font-bold"
              >
                {patient.status.toUpperCase()}
              </Text>
            </View>
            <Text style={{ color: colors.mutedText }} className="text-[10px] mt-2 font-medium">
              {patient.arrivalTime}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      
      {/* Bottom Padding for Scroll */}
      <View className="h-10" />
    </ScrollView>
  );
}