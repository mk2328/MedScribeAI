import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height: screenHeight } = Dimensions.get('window');

const RegisterPatient = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [chiefComplaint, setChiefComplaint] = useState('');

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
            <Text className="text-2xl font-black text-slate-900">Register Patient</Text>
            <View className="h-1 bg-teal-600 w-28 mt-1 rounded-full" />
          </View>
          <View className="bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-teal-700">P-2024-685</Text>
          </View>
        </View>

        {/* FORM CONTAINER */}
        <View className="mx-6 mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center gap-x-2 mb-6">
            <MaterialCommunityIcons name="account-outline" size={20} color="#0D9488" />
            <Text className="text-base font-bold text-slate-800">Patient Information</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-700 mb-2">Full Name *</Text>
            <TextInput
              placeholder="Enter patient name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
              className="w-full bg-slate-50/50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 text-sm"
            />
          </View>

          <View className="flex-row justify-between mb-5">
            <View className="w-[47%]">
              <Text className="text-xs font-bold text-slate-700 mb-2">Age *</Text>
              <TextInput
                placeholder="Years"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                className="w-full bg-slate-50/50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 text-sm"
              />
            </View>
            <View className="w-[47%]">
              <Text className="text-xs font-bold text-slate-700 mb-2">Phone</Text>
              <TextInput
                placeholder="03XX-XXXXXXX"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                className="w-full bg-slate-50/50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 text-sm"
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-700 mb-2.5">Gender *</Text>
            <View className="flex-row gap-x-6">
              {['Male', 'Female', 'Other'].map((item) => (
                <TouchableOpacity key={item} onPress={() => setGender(item)} className="flex-row items-center gap-x-2">
                  <MaterialCommunityIcons name={gender === item ? "radiobox-marked" : "radiobox-blank"} size={20} color={gender === item ? "#0D9488" : "#94A3B8"} />
                  <Text className="text-sm font-medium text-slate-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-700 mb-2.5">Marital Status</Text>
            <View className="flex-row gap-x-6">
              {['Single', 'Married'].map((item) => (
                <TouchableOpacity key={item} onPress={() => setMaritalStatus(item)} className="flex-row items-center gap-x-2">
                  <MaterialCommunityIcons name={maritalStatus === item ? "radiobox-marked" : "radiobox-blank"} size={20} color={maritalStatus === item ? "#0D9488" : "#94A3B8"} />
                  <Text className="text-sm font-medium text-slate-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xs font-bold text-slate-700 mb-2">Chief Complaint *</Text>
            <TextInput
              placeholder="Describe the patient's main complaint..."
              placeholderTextColor="#94A3B8"
              multiline={true}
              numberOfLines={4}
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
              textAlignVertical="top"
              className="w-full bg-slate-50/50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 text-sm min-h-[100px]"
            />
          </View>

          <TouchableOpacity className="w-full bg-teal-600/80 p-4 rounded-2xl flex-row justify-center items-center gap-x-2 active:opacity-90">
            <Text className="text-white font-bold text-base">Continue</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} className="bg-white border-t border-slate-100 py-3 flex-row justify-around items-center shadow-lg">
        <TouchableOpacity onPress={() => router.push('/(receptionist)/dashboard')} className="items-center justify-center p-2">
          <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center justify-center">
          <View className="bg-teal-600 px-4 py-2 rounded-xl flex-row items-center gap-x-1.5">
            <MaterialCommunityIcons name="account-plus" size={18} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Register</Text>
          </View>
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

export default RegisterPatient;