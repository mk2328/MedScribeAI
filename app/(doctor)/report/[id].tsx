import { getPatientReport } from '@/src/services/doctorService';
import { colors } from '@/src/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // for audio recording
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PatientReport() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Recording States
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [savedAudioUri, setSavedAudioUri] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPatientReport(id as string).then((data) => {
        setPatient(data);
        setLoading(false);
      });
    }
  }, [id]);

  // --- Recording Functions ---
  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required to record consultation.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    setSavedAudioUri(uri); // Filhal phone ki memory ka path save kar liya
    setRecording(null);
    
    console.log('Recording stopped and stored at:', uri);
    Alert.alert('Success', 'Consultation recorded successfully!');
  }

  // --- UI Components ---
  if (loading) return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary} />
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
          <Text style={{ color: colors.darkText }} className="text-3xl font-bold">{patient.name}</Text>
          <Text style={{ color: colors.mutedText }} className="text-base mt-1">
            {patient.age} years old • {patient.condition}
          </Text>
        </View>
        
        {/* Vitals Section */}
        <View style={{ backgroundColor: 'white', borderColor: colors.accent }} className="p-5 rounded-3xl border shadow-sm mb-6">
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

        {/* Reason for Visit */}
        <View style={{ backgroundColor: colors.accent }} className="p-5 rounded-3xl mb-8">
          <Text style={{ color: colors.primary }} className="font-bold mb-2 text-lg">Reason for Visit</Text>
          <Text style={{ color: colors.primary, opacity: 0.8 }} className="leading-5 font-medium">
            {patient.receptionNotes}
          </Text>
        </View>

        {/* --- RECORDING UI SECTION --- */}
        <View className="items-center mb-10">
          <TouchableOpacity 
            onPress={isRecording ? stopRecording : startRecording}
            style={{ 
              backgroundColor: isRecording ? '#EF4444' : colors.primary,
              width: 80, 
              height: 80, 
              borderRadius: 40 
            }} 
            className="items-center justify-center shadow-xl"
          >
            <MaterialCommunityIcons 
              name={isRecording ? "stop" : "microphone"} 
              size={40} 
              color="white" 
            />
          </TouchableOpacity>
          
          <Text className="mt-4 font-bold text-lg" style={{ color: isRecording ? '#EF4444' : colors.darkText }}>
            {isRecording ? "Recording Consultation..." : "Tap to Start Examination"}
          </Text>

          {savedAudioUri && !isRecording && (
            <Text className="mt-2 text-xs text-slate-400">Recording saved: {savedAudioUri.split('/').pop()}</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}