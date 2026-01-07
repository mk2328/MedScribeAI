import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../src/theme/colors';
import { storage } from '../../../src/utils/storage';

const SPECIALIZATIONS = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "General Physician", "Surgeon"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AddDoctor() {
    const router = useRouter();
    const { editData } = useLocalSearchParams(); 
    const isEditMode = !!editData;

    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        experience: '',
        schedule: {} as Record<string, string>,
    });

    // --- FORM RESET LOGIC ---
    // Jab bhi screen focus mein aayegi, agar editData nahi hai to form reset ho jayega
    useFocusEffect(
        useCallback(() => {
            if (editData) {
                try {
                    const data = JSON.parse(editData as string);
                    setForm(data);
                } catch (e) {
                    console.error("Failed to parse editData", e);
                }
            } else {
                // Naya doctor add karne ke liye form ko empty karein
                setForm({
                    name: '',
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                    specialization: '',
                    experience: '',
                    schedule: {},
                });
            }
        }, [editData])
    );

    const toggleDay = (day: string) => {
        const newSchedule = { ...form.schedule };
        if (newSchedule[day]) {
            delete newSchedule[day];
        } else {
            newSchedule[day] = "09:00 AM - 05:00 PM";
        }
        setForm({ ...form, schedule: newSchedule });
    };

    const updateDayTime = (day: string, timeStr: string) => {
        setForm({ ...form, schedule: { ...form.schedule, [day]: timeStr } });
    };

    const handleRegisterOrUpdate = async () => {
        if (!form.name || !form.username || !form.email || (!isEditMode && !form.password) || !form.phone || Object.keys(form.schedule).length === 0) {
            Alert.alert("Required", "Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            const existingDoctors = await storage.getDoctors();
            const doctorToEdit = isEditMode ? JSON.parse(editData as string) : null;

            if (isEditMode && doctorToEdit) {
                const updatedList = existingDoctors.map((doc: any) => {
                    if (doc.id === doctorToEdit.id) {
                        return {
                            ...doc,
                            ...form,
                            password: form.password || doc.password
                        };
                    }
                    return doc;
                });
                
                await storage.saveAllDoctors(updatedList);
                setLoading(false);
                Alert.alert("Updated", "Doctor profile updated!", [{ text: "OK", onPress: () => router.push('/(admin)/doctor') }]);
            } else {
                const isDuplicate = existingDoctors.some((doc: any) =>
                    (doc?.email?.toLowerCase() === form.email.toLowerCase()) ||
                    (doc?.username?.toLowerCase() === form.username.toLowerCase()) ||
                    (doc?.phone === form.phone)
                );

                if (isDuplicate) {
                    setLoading(false);
                    Alert.alert("Error", "Email, Username, or Phone already exists.");
                    return;
                }

                const newDoc = {
                    id: Date.now().toString(),
                    ...form,
                    role: 'doctor',
                    availability_status: 'available',
                    created_at: new Date().toISOString()
                };

                await storage.saveDoctor(newDoc);
                setLoading(false);
                Alert.alert("Success", "Doctor registered!", [{ text: "OK", onPress: () => router.push('/(admin)/doctor') }]);
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <View className="px-6 py-4 flex-row items-center border-b border-slate-100 bg-white">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-slate-50">
                        <MaterialCommunityIcons name="chevron-left" size={28} color={colors.darkText} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">{isEditMode ? 'Edit Doctor' : 'Register Doctor'}</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-4">
                    <View className="bg-white p-6 rounded-[32px] border border-slate-100 gap-y-5">
                        <FormInput label="Full Name" icon="account-circle-outline" placeholder="Dr. Sarah Ahmed" value={form.name} onChange={(v:string) => setForm({ ...form, name: v })} />
                        
                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">Specialization</Text>
                            <TouchableOpacity onPress={() => setShowPicker(true)} className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 flex-row justify-between items-center">
                                <MaterialCommunityIcons name="stethoscope" size={20} color={colors.primary} style={{ position: 'absolute', left: 16 }} />
                                <Text style={{ color: form.specialization ? colors.darkText : '#CBD5E1' }}>{form.specialization || "Select Specialization"}</Text>
                                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.mutedText} />
                            </TouchableOpacity>
                        </View>

                        <FormInput label="Years of Experience" icon="briefcase-outline" placeholder="e.g. 10" keyboardType="numeric" value={form.experience} onChange={(v:string) => setForm({ ...form, experience: v })} />

                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">Select Working Days</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {DAYS.map(day => (
                                    <TouchableOpacity key={day} onPress={() => toggleDay(day)}
                                        style={{ backgroundColor: form.schedule[day] ? colors.primary : '#F8FAFC' }}
                                        className="px-3 py-2 rounded-xl border border-slate-200">
                                        <Text style={{ color: form.schedule[day] ? 'white' : colors.darkText }} className="text-xs font-bold">{day}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {Object.keys(form.schedule).length > 0 && (
                            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <Text className="text-[10px] font-bold mb-3 uppercase tracking-widest text-slate-400">Set Timing Per Day</Text>
                                {Object.keys(form.schedule).map(day => (
                                    <View key={day} className="flex-row items-center mb-3 justify-between">
                                        <Text className="font-bold text-slate-700 w-10">{day}:</Text>
                                        <TextInput
                                            className="bg-white flex-1 ml-2 p-2 px-4 rounded-xl border border-slate-200 text-xs text-slate-600"
                                            placeholder="e.g. 09:00 AM - 12:00 PM"
                                            value={form.schedule[day]}
                                            onChangeText={(v) => updateDayTime(day, v)}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}

                        <FormInput label="Contact Number" icon="phone-outline" placeholder="+92 300 1234567" keyboardType="phone-pad" value={form.phone} onChange={(v:string) => setForm({ ...form, phone: v })} />
                        <FormInput label="Email Address" icon="email-outline" placeholder="doctor@clinic.com" keyboardType="email-address" value={form.email} onChange={(v:string) => setForm({ ...form, email: v })} />
                        <FormInput label="Login Username" icon="at" placeholder="sarah_ahmed123" value={form.username} onChange={(v:string) => setForm({ ...form, username: v })} />

                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">{isEditMode ? 'Update Password (Optional)' : 'Assign Password'}</Text>
                            <View className="relative">
                                <TextInput secureTextEntry={!showPassword} value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 text-slate-800" placeholder={isEditMode ? "Leave blank to keep same" : "Set password"} />
                                <View className="absolute left-4 top-4"><MaterialCommunityIcons name="lock-outline" size={20} color={colors.primary} /></View>
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-4"><MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.mutedText} /></TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleRegisterOrUpdate} disabled={loading} style={{ backgroundColor: colors.primary }} className="mt-4 p-5 rounded-2xl items-center shadow-lg active:opacity-90">
                            <Text className="text-white text-lg font-bold">{loading ? 'Saving...' : (isEditMode ? 'Update Profile' : 'Register Doctor')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={showPicker} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[40px] p-6 h-1/2">
                        <Text className="text-lg font-bold mb-4">Select Specialization</Text>
                        <FlatList data={SPECIALIZATIONS} keyExtractor={(i) => i} renderItem={({ item }) => (
                            <TouchableOpacity className="py-4 border-b border-slate-50" onPress={() => { setForm({ ...form, specialization: item }); setShowPicker(false) }}>
                                <Text className="text-base text-slate-700">{item}</Text>
                            </TouchableOpacity>
                        )} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const FormInput = ({ label, icon, value, onChange, placeholder, ...props }: any) => (
    <View>
        <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">{label}</Text>
        <View className="relative">
            <TextInput value={value} onChangeText={(text) => onChange(text)} placeholder={placeholder} placeholderTextColor="#CBD5E1" className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 text-slate-800" {...props} />
            <View className="absolute left-4 top-4"><MaterialCommunityIcons name={icon} size={20} color={colors.primary} /></View>
        </View>
    </View>
);