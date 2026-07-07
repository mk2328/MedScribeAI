import { supabase } from '@/src/lib/supabase';
import { colors } from '@/src/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BACKEND_URL = 'https://YOUR-BACKEND.onrender.com';

// ── All possible pipeline statuses ──
type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'cleaning'
  | 'transcribing'
  | 'labeling'
  | 'correcting'
  | 'generating'
  | 'auditing'
  | 'completed'
  | 'error';

// ── Pipeline steps in order (for progress bar) ──
const PIPELINE_STEPS: UploadStatus[] = [
  'cleaning',
  'transcribing',
  'labeling',
  'correcting',
  'generating',
  'auditing',
];

const STEP_LABELS: Record<string, string> = {
  cleaning:     'Cleaning Audio',
  transcribing: 'Transcribing',
  labeling:     'Labeling Speakers',
  correcting:   'Medical Correction',
  generating:   'Generating SOAP Note',
  auditing:     'Clinical Audit',
};

const STEP_ICONS: Record<string, string> = {
  cleaning:     'waveform',
  transcribing: 'microphone-message',
  labeling:     'account-multiple',
  correcting:   'stethoscope',
  generating:   'file-document-edit',
  auditing:     'shield-check',
};

const STATUS_MESSAGES: Record<UploadStatus, string> = {
  idle:         '',
  uploading:    'Uploading audio to storage...',
  queued:       'Queued — pipeline starting soon...',
  processing:   'Pipeline is running...',
  cleaning:     'Cleaning & converting audio...',
  transcribing: 'Transcribing speech to text (Whisper)...',
  labeling:     'Identifying Doctor & Patient speakers...',
  correcting:   'Fixing medical terminology...',
  generating:   'Generating SOAP note (MedGemma AI)...',
  auditing:     'Clinical audit & endorsement (Llama)...',
  completed:    'SOAP Note ready! ✅',
  error:        'Processing failed ❌',
};

function getStepIndex(status: UploadStatus): number {
  return PIPELINE_STEPS.indexOf(status);
}

function isActiveStep(step: UploadStatus, currentStatus: UploadStatus): boolean {
  return step === currentStatus;
}

function isCompletedStep(step: UploadStatus, currentStatus: UploadStatus): boolean {
  const stepIdx = getStepIndex(step);
  const currentIdx = getStepIndex(currentStatus);
  if (currentStatus === 'completed') return true;
  return stepIdx < currentIdx && currentIdx >= 0;
}

export default function VoiceRecordingScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [soapNote, setSoapNote] = useState('');
  const [transcript, setTranscript] = useState('');
  const [consultationId, setConsultationId] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleUploadSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setUploadStatus('idle');
        setSoapNote('');
        setTranscript('');
        setConsultationId(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not select file.');
    }
  };

  // ── Poll backend every 5s — fast enough to feel live ──
  const startPolling = (id: number) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/consultation/${id}/status`);
        const data = await res.json();

        console.log('📡 Status poll:', data.status);
        setUploadStatus(data.status as UploadStatus);

        if (data.status === 'completed') {
          setSoapNote(data.soap_note ?? '');
          setTranscript(data.transcript ?? '');
          clearInterval(pollingRef.current!);
        } else if (data.status === 'error') {
          clearInterval(pollingRef.current!);
          Alert.alert('Processing Error', data.error_message || 'Something went wrong');
        }
      } catch (e) {
        console.warn('Polling error:', e);
      }
    }, 5000); // 5 second polling
  };

  const handleUploadAudio = async () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    setSoapNote('');
    setTranscript('');

    try {
      const fileExt = selectedFile.name.split('.').pop() ?? 'mp3';
      const fileName = `${Date.now()}_consultation.${fileExt}`;
      const filePath = `consultations/${fileName}`;
      const mimeType = selectedFile.mimeType || 'audio/mpeg';

      // Convert to ArrayBuffer for Supabase upload
      const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: 'base64',
      });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('📦 File size:', bytes.buffer.byteLength, 'bytes');

      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('clinical-audios')
        .upload(filePath, bytes.buffer, { contentType: mimeType, upsert: true });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinical-audios')
        .getPublicUrl(filePath);

      console.log('✅ Storage upload done:', publicUrl);

      // Notify backend — it queues Colab processing
      setUploadStatus('queued');
      const backendRes = await fetch(`${BACKEND_URL}/consultation/process-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_url: publicUrl,
          audio_file_path: filePath,
          file_name: selectedFile.name,
          doctor_id: null,
        }),
      });

      if (!backendRes.ok) {
        const err = await backendRes.json();
        throw new Error(err.detail || 'Backend call failed');
      }

      const backendData = await backendRes.json();
      const newConsultationId = backendData.consultation_id;
      setConsultationId(newConsultationId);
      console.log('✅ Queued, consultation_id:', newConsultationId);

      // Start polling for step-by-step updates
      startPolling(newConsultationId);

    } catch (err: any) {
      console.error('Error:', err);
      setUploadStatus('error');
      Alert.alert('Upload Failed', err.message || 'Something went wrong');
    }
  };

  const isActive = uploadStatus !== 'idle' && uploadStatus !== 'completed' && uploadStatus !== 'error';
  const isPipelineRunning = PIPELINE_STEPS.includes(uploadStatus as any) ||
    uploadStatus === 'queued' || uploadStatus === 'processing';

  const resetAll = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setSoapNote('');
    setTranscript('');
    setConsultationId(null);
    setShowTranscript(false);
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 60 : 40,
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View className="mb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-50 w-10 h-10 rounded-full items-center justify-center mb-4 border border-slate-100"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-slate-900 tracking-tight">Voice Recording</Text>
        <Text className="text-slate-400 text-base font-medium">
          Capture or upload clinical consultations
        </Text>
      </View>

      {/* ── File Upload Card (only when not processing) ── */}
      {!isPipelineRunning && uploadStatus !== 'completed' && (
        <View className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 mb-6">
          <View className="flex-row items-center mb-8">
            <View style={{ backgroundColor: colors.accent }} className="p-2 rounded-xl mr-3">
              <MaterialCommunityIcons name="microphone" size={24} color={colors.primary} />
            </View>
            <Text className="text-lg font-bold text-slate-800">New Consultation</Text>
          </View>

          {/* Start Recording (future feature) */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-teal-600 p-5 rounded-2xl flex-row items-center justify-center mb-6 shadow-sm"
          >
            <MaterialCommunityIcons name="play-circle" size={26} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Start New Recording</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-slate-200" />
            <Text className="mx-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Or upload file
            </Text>
            <View className="flex-1 h-[1px] bg-slate-200" />
          </View>

          {/* File picker */}
          <TouchableOpacity
            onPress={handleUploadSelection}
            style={{ borderStyle: 'dashed', borderColor: colors.primary }}
            className="p-8 rounded-2xl flex-col items-center justify-center border-2 bg-white"
          >
            <View style={{ backgroundColor: colors.accent }} className="p-3 rounded-full mb-3">
              <MaterialCommunityIcons name="cloud-upload" size={30} color={colors.primary} />
            </View>
            <Text style={{ color: colors.primary }} className="font-bold text-lg text-center">
              {selectedFile ? 'File Selected ✓' : 'Choose Audio from System'}
            </Text>
            <Text className="text-slate-400 text-xs mt-1 font-medium">MP3, WAV, or M4A</Text>
          </TouchableOpacity>

          {/* Selected file info */}
          {selectedFile && (
            <View className="mt-6 p-4 bg-white rounded-2xl border border-teal-100 flex-row items-center">
              <MaterialCommunityIcons name="file-music" size={24} color={colors.primary} />
              <View className="ml-3 flex-1">
                <Text className="text-slate-800 font-bold text-sm" numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text className="text-slate-400 text-[10px]">Ready to upload</Text>
              </View>
              <TouchableOpacity onPress={() => { setSelectedFile(null); setUploadStatus('idle'); }}>
                <MaterialCommunityIcons name="close-circle" size={22} color="#f87171" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ── Upload Button ── */}
      {selectedFile && uploadStatus === 'idle' && (
        <TouchableOpacity
          onPress={handleUploadAudio}
          style={{ backgroundColor: colors.primary }}
          className="p-5 rounded-2xl flex-row items-center justify-center shadow-lg mb-6"
        >
          <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Upload & Process</Text>
        </TouchableOpacity>
      )}

      {/* ── Uploading indicator ── */}
      {uploadStatus === 'uploading' && (
        <View className="mb-6 p-5 bg-teal-50 rounded-2xl border border-teal-100">
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color={colors.primary} />
            <Text className="ml-3 text-teal-700 font-semibold text-sm">
              Uploading audio to storage...
            </Text>
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════
           PIPELINE PROGRESS — visible when processing
         ══════════════════════════════════════════════════════ */}
      {(isPipelineRunning || uploadStatus === 'completed' || uploadStatus === 'error') && (
        <View className="mb-6">
          {/* Header */}
          <View className="flex-row items-center mb-4">
            <View style={{ backgroundColor: colors.accent }} className="p-2 rounded-xl mr-3">
              <MaterialCommunityIcons name="brain" size={22} color={colors.primary} />
            </View>
            <View>
              <Text className="text-base font-bold text-slate-800">AI Pipeline</Text>
              <Text className="text-slate-400 text-xs">
                {uploadStatus === 'completed' ? 'Processing complete' :
                 uploadStatus === 'error' ? 'Processing failed' :
                 'Processing your consultation...'}
              </Text>
            </View>
            {consultationId && (
              <Text className="ml-auto text-slate-300 text-[10px]">
                #{consultationId}
              </Text>
            )}
          </View>

          {/* Step-by-step progress list */}
          <View className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
            {PIPELINE_STEPS.map((step, idx) => {
              const active = isActiveStep(step, uploadStatus);
              const done = isCompletedStep(step, uploadStatus);
              const pending = !active && !done;

              return (
                <View key={step}>
                  <View className="flex-row items-center px-4 py-3">
                    {/* Step icon / indicator */}
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: done
                          ? '#10b981'
                          : active
                          ? colors.primary
                          : '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      {active ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : done ? (
                        <MaterialCommunityIcons name="check" size={18} color="white" />
                      ) : (
                        <MaterialCommunityIcons
                          name={STEP_ICONS[step] as any}
                          size={16}
                          color="#94a3b8"
                        />
                      )}
                    </View>

                    {/* Step label */}
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-sm"
                        style={{
                          color: done ? '#10b981' : active ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {STEP_LABELS[step]}
                      </Text>
                      {active && (
                        <Text className="text-xs text-teal-500 mt-0.5">
                          {STATUS_MESSAGES[step]}
                        </Text>
                      )}
                    </View>

                    {/* Step number */}
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: done ? '#10b981' : active ? colors.primary : '#cbd5e1' }}
                    >
                      {idx + 1}/6
                    </Text>
                  </View>

                  {/* Connector line (not after last) */}
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: done ? '#d1fae5' : '#f1f5f9',
                        marginLeft: 58,
                        marginRight: 16,
                      }}
                    />
                  )}
                </View>
              );
            })}

            {/* Final status row */}
            {(uploadStatus === 'completed' || uploadStatus === 'error') && (
              <View
                style={{
                  backgroundColor: uploadStatus === 'completed' ? '#f0fdf4' : '#fef2f2',
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name={uploadStatus === 'completed' ? 'check-circle' : 'alert-circle'}
                  size={22}
                  color={uploadStatus === 'completed' ? '#10b981' : '#f87171'}
                />
                <Text
                  className="ml-3 font-bold text-sm"
                  style={{ color: uploadStatus === 'completed' ? '#065f46' : '#991b1b' }}
                >
                  {STATUS_MESSAGES[uploadStatus]}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════
           SOAP NOTE DISPLAY
         ══════════════════════════════════════════════════════ */}
      {soapNote ? (
        <View className="mb-6">
          {/* SOAP Note Card */}
          <View className="p-5 bg-teal-50 rounded-2xl border border-teal-100 mb-3">
            <View className="flex-row items-center mb-4">
              <MaterialCommunityIcons name="file-document" size={22} color="#0d9488" />
              <Text className="text-teal-800 font-bold text-base ml-2">📋 SOAP Note</Text>
              <View className="ml-auto bg-teal-100 px-2 py-1 rounded-lg">
                <Text className="text-teal-700 text-[10px] font-bold">AI GENERATED</Text>
              </View>
            </View>
            <ScrollView style={{ maxHeight: 500 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              <Text className="text-slate-700 text-sm leading-6 font-mono">{soapNote}</Text>
            </ScrollView>
          </View>

          {/* Transcript toggle */}
          {transcript ? (
            <TouchableOpacity
              onPress={() => setShowTranscript(!showTranscript)}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex-row items-center"
            >
              <MaterialCommunityIcons name="text" size={18} color="#64748b" />
              <Text className="ml-2 text-slate-600 font-semibold text-sm flex-1">
                {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
              </Text>
              <MaterialCommunityIcons
                name={showTranscript ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          ) : null}

          {showTranscript && transcript ? (
            <View className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
                Corrected Clinical Transcript
              </Text>
              <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                <Text className="text-slate-600 text-xs leading-5 font-mono">{transcript}</Text>
              </ScrollView>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* ── New Consultation Button ── */}
      {(uploadStatus === 'completed' || uploadStatus === 'error') && (
        <TouchableOpacity
          onPress={resetAll}
          style={{ backgroundColor: colors.primary }}
          className="p-5 rounded-2xl flex-row items-center justify-center shadow-lg"
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">New Consultation</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}