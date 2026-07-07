import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';

const { height: screenHeight } = Dimensions.get('window');
const API_URL = "https://medscribeai-pzqu.onrender.com";

interface QueuePatient {
  patient_id: number;
  patient_code: string | null;
  name: string;
  age: number | null;
  gender: string | null;
  department: string | null;
  status: string | null; // "waiting" | "assigned"
  doctor_name: string | null;
  created_at: string | null;
}

const PatientQueue = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [queueData, setQueueData] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Waiting', 'In Progress', 'Done'];

  // Map DB status -> UI label
  const statusLabel = (status: string | null) => {
    if (status === 'assigned') return 'In Progress';
    if (status === 'waiting') return 'Waiting';
    return 'Waiting';
  };

  const getWaitMinutes = (createdAt: string | null) => {
    if (!createdAt) return null;
    const diffMs = Date.now() - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/patients/queue`);
      setQueueData(response.data);
    } catch (error: any) {
      console.error("Failed to fetch queue:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQueue();
    }, [])
  );

  const filteredQueue = queueData.filter((item) => {
    const label = statusLabel(item.status);
    const matchesTab = activeTab === 'All' || label === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.patient_code || '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const waitingCount = queueData.filter((p) => statusLabel(p.status) === 'Waiting').length;

  return (
    <SafeAreaView style={{ flex: 1, height: screenHeight }} className="bg-white">
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
        style={{ flex: 1 }}
      >
        {/* HEADER SECTION */}
        <View className="px-6 pt-6 pb-4 bg-white flex-row justify-between items-start">
          <View>
            <View className="flex-row items-center gap-x-2">
              <Text className="text-lg font-bold text-slate-900">MedScribe AI</Text>
              <View className="bg-purple-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-purple-600">Receptionist</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-x-3">
            <TouchableOpacity className="p-2 bg-slate-50 rounded-full relative border border-slate-100">
              <MaterialCommunityIcons name="bell-outline" size={20} color="#64748B" />
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-teal-50 rounded-full items-center justify-center border border-teal-100">
              <Text className="text-sm font-bold text-teal-600">AH</Text>
            </View>
          </View>
        </View>

        {/* TITLE BAR */}
        <View className="px-6 mt-4 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-slate-900">Patient Queue</Text>
            <View className="h-1 bg-teal-600 w-24 mt-1 rounded-full" />
          </View>
          <View className="bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-teal-700">{waitingCount} waiting</Text>
          </View>
        </View>

        {/* SEARCH & FILTER BAR */}
        <View className="px-6 mt-5 flex-row justify-between items-center gap-x-3">
          <View className="flex-1 bg-slate-50/80 border border-slate-200 rounded-2xl flex-row items-center px-4 py-1">
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
            <TextInput
              placeholder="Search patient name or ID..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 p-2 text-slate-800 text-sm"
            />
          </View>

          <TouchableOpacity onPress={fetchQueue} className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl">
            <MaterialCommunityIcons name="refresh" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* SEGMENTED TABS */}
        <View className="mx-6 mt-5 bg-slate-50 border border-slate-100 p-1 rounded-2xl flex-row justify-between">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                activeTab === tab ? 'bg-white shadow-sm border border-slate-100' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === tab ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* QUEUE CARDS LIST */}
        <View className="px-6 mt-6 gap-y-4">
          {loading && queueData.length === 0 ? (
            <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 20 }} />
          ) : filteredQueue.length > 0 ? (
            filteredQueue.map((item) => {
              const label = statusLabel(item.status);
              const waitMins = getWaitMinutes(item.created_at);
              return (
                <View
                  key={item.patient_id}
                  className="w-full bg-white border border-slate-100 p-4 rounded-2xl flex-row justify-between items-start shadow-sm"
                >
                  {/* Left Section: Token & Details */}
                  <View className="flex-row items-start gap-x-4 flex-1">
                    <View className="bg-teal-50/70 border border-teal-100 px-3 py-2 rounded-xl items-center justify-center min-w-[55px]">
                      <Text className="text-xs font-black text-teal-600 tracking-wide">
                        {item.patient_code || '—'}
                      </Text>
                    </View>

                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-slate-800">{item.name}</Text>

                      <Text className="text-xs text-slate-400 font-medium mt-0.5">
                        {item.age ? `${item.age}y` : '—'} • {item.gender || '—'}
                      </Text>

                      <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1.5 mt-3">
                        <View className="bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-lg">
                          <Text className="text-[10px] font-bold text-teal-700">
                            {item.department || 'Unassigned'}
                          </Text>
                        </View>
                        {item.doctor_name && (
                          <Text className="text-[11px] font-medium text-slate-400">
                            {item.doctor_name}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Right Section: Status & Waiting Time */}
                  <View className="items-end justify-between min-h-[75px]">
                    <View
                      className={`flex-row items-center gap-x-1 px-2.5 py-1 rounded-full border ${
                        label === 'In Progress'
                          ? 'bg-teal-50 border-teal-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <MaterialCommunityIcons
                        name={label === 'In Progress' ? 'play-circle-outline' : 'clock-outline'}
                        size={13}
                        color={label === 'In Progress' ? '#0D9488' : '#F59E0B'}
                      />
                      <Text
                        className={`text-[10px] font-bold ${
                          label === 'In Progress' ? 'text-teal-600' : 'text-amber-600'
                        }`}
                      >
                        {label}
                      </Text>
                    </View>

                    {label === 'Waiting' && waitMins !== null ? (
                      <Text className="text-[10px] font-medium text-slate-400 mt-1">
                        {waitMins} min wait
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialCommunityIcons name="account-clock-outline" size={48} color="#94A3B8" />
              <Text className="text-sm font-bold text-slate-400 mt-2">No patients in this section</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <View
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        className="bg-white border-t border-slate-100 py-3 flex-row justify-around items-center shadow-lg"
      >
        <TouchableOpacity onPress={() => router.push('/(receptionist)/dashboard')} className="items-center justify-center p-2">
          <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(receptionist)/register')} className="items-center justify-center p-2">
          <MaterialCommunityIcons name="account-plus-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(receptionist)/patients')} className="items-center justify-center p-2">
          <MaterialCommunityIcons name="account-group-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(receptionist)/settings')} className="items-center justify-center p-2">
          <MaterialCommunityIcons name="cog-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatientQueue;