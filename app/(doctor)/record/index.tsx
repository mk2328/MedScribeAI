import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@/src/theme/colors';

export default function VoiceRecordingScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "File select karne mein masla aya hai.");
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    // Future Backend Connection for MedScribeAI
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert("Success", "Transcription process start ho gaya hai.");
    }, 2000);
  };

  return (
    <ScrollView 
      className="flex-1 bg-white" 
      contentContainerStyle={{ 
        paddingHorizontal: 24, 
        paddingTop: Platform.OS === 'android' ? 60 : 40, 
        paddingBottom: 40 
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Area */}
      <View className="mb-8">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="bg-slate-50 w-10 h-10 rounded-full items-center justify-center mb-4 border border-slate-100"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-slate-900 tracking-tight">Voice Recording</Text>
        <Text className="text-slate-400 text-base font-medium">Capture or upload clinical consultations</Text>
      </View>

      {/* Main Container */}
      <View className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 mb-6">
        <View className="flex-row items-center mb-8">
          <View style={{ backgroundColor: colors.accent }} className="p-2 rounded-xl mr-3">
            <MaterialCommunityIcons name="microphone" size={24} color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-slate-800">New Consultation</Text>
        </View>

        {/* 1. START RECORDING (Static Button) */}
        <TouchableOpacity 
          activeOpacity={0.7}
          className="bg-teal-600 p-5 rounded-2xl flex-row items-center justify-center mb-6 shadow-sm"
        >
          <MaterialCommunityIcons name="play-circle" size={26} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Start New Recording</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="mx-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Or upload file</Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        {/* 2. UPLOAD RECORDING */}
        <TouchableOpacity 
          onPress={handleUploadSelection}
          style={{ borderStyle: 'dashed', borderColor: colors.primary }}
          className="p-8 rounded-2xl flex-col items-center justify-center border-2 bg-white"
        >
          <View style={{ backgroundColor: colors.accent }} className="p-3 rounded-full mb-3">
            <MaterialCommunityIcons name="cloud-upload" size={30} color={colors.primary} />
          </View>
          <Text style={{ color: colors.primary }} className="font-bold text-lg text-center">
            {selectedFile ? "File Selected" : "Choose Audio from System"}
          </Text>
          <Text className="text-slate-400 text-xs mt-1 font-medium">MP3, WAV, or M4A</Text>
        </TouchableOpacity>

        {/* Selected File Details */}
        {selectedFile && (
          <View className="mt-6 p-4 bg-white rounded-2xl border border-teal-100 flex-row items-center">
            <MaterialCommunityIcons name="file-music" size={24} color={colors.primary} />
            <View className="ml-3 flex-1">
              <Text className="text-slate-800 font-bold text-sm" numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text className="text-slate-400 text-[10px]">Ready for processing</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <MaterialCommunityIcons name="close-circle" size={22} color="#f87171" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Button */}
      {selectedFile && (
        <TouchableOpacity 
          disabled={isUploading}
          onPress={handleTranscribe}
          style={{ backgroundColor: colors.primary }}
          className="p-5 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95"
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="texta-white font-bold text-lg">Generate SOAP Report</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}