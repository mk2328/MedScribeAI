import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  Platform,
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function VoiceRecordingScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
      if (!result.canceled) setSelectedFile(result.assets[0]);
    } catch (err) {
      Alert.alert("Error", "File select karne mein masla aya hai.");
    }
  };

  const handleTranscribe = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    // Mimicking processing time
    setTimeout(() => {
      setIsUploading(false);
      router.push('/(doctor)/record/soap-report'); 
    }, 2000); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Voice Recording</Text>
          <Text style={styles.subTitle}>Capture or upload clinical consultations</Text>
        </View>

        {/* MAIN CONSOLIDATED CARD (SOAP Style Border) */}
        <View style={styles.soapStyleCard}>
          {/* Section Header */}
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="microphone" size={18} color="#0D9488" />
            </View>
            <Text style={styles.sectionLabel}>NEW CONSULTATION</Text>
          </View>
          
          {/* Start Recording Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.recordActionBtn}>
            <MaterialCommunityIcons name="play-circle" size={22} color="white" />
            <Text style={styles.recordActionText}>Start New Recording</Text>
          </TouchableOpacity>

          {/* Divider with Text */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR UPLOAD FILE</Text>
            <View style={styles.line} />
          </View>

          {/* Upload Area */}
          <TouchableOpacity 
            onPress={handleUploadSelection}
            style={[styles.uploadBox, selectedFile && styles.uploadBoxActive]}
          >
            <MaterialCommunityIcons 
              name={selectedFile ? "check-circle" : "file-upload-outline"} 
              size={28} 
              color={selectedFile ? "#0D9488" : "#94a3b8"} 
            />
            <Text style={styles.uploadText}>
              {selectedFile ? "File Selected Successfully" : "Choose audio from system"}
            </Text>
            <Text style={styles.formatHint}>MP3, WAV, or M4A</Text>
          </TouchableOpacity>

          {/* File Name Display (Only when selected) */}
          {selectedFile && (
            <View style={styles.fileStrip}>
              <MaterialCommunityIcons name="file-music" size={20} color="#0D9488" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.fileNameText} numberOfLines={1}>{selectedFile.name}</Text>
                <Text style={styles.fileStatusText}>Ready for processing</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* GENERATE BUTTON (Matching the Teal Theme) */}
        {selectedFile && (
          <TouchableOpacity 
            disabled={isUploading}
            onPress={handleTranscribe}
            style={styles.generateBtn}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.generateBtnText}>Generate SOAP Report</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color="white" />
              </>
            )}
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'android' ? 45 : 10 },
  
  header: { marginBottom: 25 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1e293b' },
  subTitle: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  
  // THE CARD
  soapStyleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0F2F1', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#0D9488', letterSpacing: 0.5 },
  
  recordActionBtn: { backgroundColor: '#0D9488', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  recordActionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#F1F5F9' },
  dividerText: { marginHorizontal: 10, fontSize: 10, fontWeight: 'bold', color: '#CBD5E1', letterSpacing: 0.5 },
  
  uploadBox: { borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, padding: 18, alignItems: 'center', backgroundColor: '#FAFAFA' },
  uploadBoxActive: { borderColor: '#0D9488', borderStyle: 'solid', backgroundColor: '#F0FDFA' },
  uploadText: { fontSize: 14, color: '#64748B', fontWeight: '500', marginTop: 8 },
  formatHint: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  
  fileStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#0D9488', marginTop: 15 },
  fileNameText: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },
  fileStatusText: { fontSize: 10, color: '#0D9488' },
  
  // FIXED GENERATE BUTTON COLOR
  generateBtn: { 
    backgroundColor: '#0D9488', // Now matches Start Recording
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 20, 
    gap: 8,
    // Add a slight shadow to make it pop
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  generateBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});