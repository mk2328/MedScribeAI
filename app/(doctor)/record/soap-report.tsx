import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors'; // Apne theme colors check karlein

export default function SoapReportScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Dummy Data for Presentation
  const [soapNotes, setSoapNotes] = useState({
    subjective: 'Patient reports chest pain for 2 days, localized to left side with occasional radiation to left arm. Pain is described as pressure-like, rated 6/10.',
    objective: 'Vitals: BP 140/90 mmHg, HR 88 bpm, Temp 98.6°F, SpO2 97%. Patient appears anxious but not in acute distress.',
    assessment: 'Suspected stable angina pectoris. Differential includes musculoskeletal pain and anxiety.',
    plan: '1. Order ECG to rule out acute ischemic changes\n2. Follow-up in 1 week',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1e293b" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>SOAP Report</Text>
          <Text style={styles.headerSubtitle}>Review and edit as needed</Text>
        </View>

        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="auto-fix" size={14} color="#0D9488" />
          <Text style={styles.aiBadgeText}>AI Generated</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* SOAP Sections */}
        {[
          { label: 'S - SUBJECTIVE', key: 'subjective' },
          { label: 'O - OBJECTIVE', key: 'objective' },
          { label: 'A - ASSESSMENT', key: 'assessment' },
          { label: 'P - PLAN', key: 'plan' },
        ].map((item) => (
          <View key={item.key} style={styles.card}>
            <Text style={styles.sectionLabel}>{item.label}</Text>
            <TextInput
              style={[styles.input, isEditing && styles.inputActive]}
              multiline
              editable={isEditing}
              value={soapNotes[item.key as keyof typeof soapNotes]}
              onChangeText={(txt) => setSoapNotes({...soapNotes, [item.key]: txt})}
            />
          </View>
        ))}

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.mainBtn, isEditing ? styles.saveBtn : styles.editBtn]} 
          onPress={() => setIsEditing(!isEditing)}
        >
          <MaterialCommunityIcons 
            name={isEditing ? "check-circle" : "pencil-outline"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.mainBtnText}>
            {isEditing ? "Save Report" : "Edit Report"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
    textAlignVertical: 'top',
  },
  inputActive: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 5,
  },
  mainBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  editBtn: {
    backgroundColor: '#0D9488',
  },
  saveBtn: {
    backgroundColor: '#0D9488',
  },
  mainBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});