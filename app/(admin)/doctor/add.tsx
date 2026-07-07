import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../src/theme/colors';

const API_URL = "https://medscribeai-pzqu.onrender.com";
const SPECIALIZATIONS = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "General Physician", "Surgeon"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

<<<<<<< HEAD
=======
// ---- Validation regexes ----
const NAME_REGEX = /^[A-Za-z.\s]{3,50}$/;
const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+92|0)[0-9]{10}$/; // e.g. 03001234567 or +923001234567
const TIME_RANGE_REGEX = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s*-\s*(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

type Errors = {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    specialization?: string;
    experience?: string;
    schedule?: string;
};

>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
export default function AddDoctor() {
    const router = useRouter();
    const { editData } = useLocalSearchParams();
    const isEditMode = !!editData;

    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [serverReady, setServerReady] = useState(false);
<<<<<<< HEAD
=======
    const [errors, setErrors] = useState<Errors>({});
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12

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

    useEffect(() => {
        const wakeUpServer = async () => {
            try {
                await fetch(`${API_URL}/doctors`);
                setServerReady(true);
            } catch (e) {
                setServerReady(false);
            }
        };
        wakeUpServer();
    }, []);

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
<<<<<<< HEAD
=======
            setErrors({});
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
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
<<<<<<< HEAD
=======
        if (errors.schedule) setErrors({ ...errors, schedule: undefined });
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
    };

    const updateDayTime = (day: string, timeStr: string) => {
        setForm({ ...form, schedule: { ...form.schedule, [day]: timeStr } });
<<<<<<< HEAD
    };

    const handleRegisterOrUpdate = async () => {
        if (!form.name || !form.username || !form.email || (!isEditMode && !form.password) || !form.phone || Object.keys(form.schedule).length === 0) {
            Alert.alert("Required", "Please fill all required fields, including working days.");
            return;
        }

        if (!form.specialization) {
            Alert.alert("Required", "Please select a specialization.");
=======
        if (errors.schedule) setErrors({ ...errors, schedule: undefined });
    };

    // ---- Field-level validators ----
    const validateName = (v: string) => {
        if (!v.trim()) return "Full name is required.";
        if (!NAME_REGEX.test(v.trim())) return "Name must be 3-50 letters (no numbers/symbols).";
        return undefined;
    };

    const validateUsername = (v: string) => {
        if (!v.trim()) return "Username is required.";
        if (!USERNAME_REGEX.test(v.trim())) return "3-20 chars: lowercase letters, numbers, underscore only.";
        return undefined;
    };

    const validateEmail = (v: string) => {
        if (!v.trim()) return "Email is required.";
        if (!EMAIL_REGEX.test(v.trim())) return "Enter a valid email address.";
        return undefined;
    };

    const validatePhone = (v: string) => {
        const cleaned = v.trim().replace(/[\s-]/g, '');
        if (!cleaned) return "Contact number is required.";
        if (!PHONE_REGEX.test(cleaned)) return "Use format 03XXXXXXXXX or +92XXXXXXXXXX.";
        return undefined;
    };

    const validatePassword = (v: string) => {
        if (!isEditMode) {
            if (!v) return "Password is required.";
            if (v.length < 6) return "Password must be at least 6 characters.";
        } else {
            if (v && v.length < 6) return "Password must be at least 6 characters.";
        }
        return undefined;
    };

    const validateSpecialization = (v: string) => {
        if (!v) return "Please select a specialization.";
        return undefined;
    };

    const validateExperience = (v: string) => {
        if (!v.trim()) return undefined; // optional field, defaults to 0
        const num = Number(v);
        if (Number.isNaN(num)) return "Experience must be a number.";
        if (num < 0 || num > 60) return "Enter a realistic value (0-60).";
        if (!Number.isInteger(num)) return "Experience must be a whole number.";
        return undefined;
    };

    const validateSchedule = (schedule: Record<string, string>) => {
        const days = Object.keys(schedule);
        if (days.length === 0) return "Select at least one working day.";
        for (const day of days) {
            const time = schedule[day];
            if (!time || !time.trim()) return `Set a timing for ${day}.`;
            if (!TIME_RANGE_REGEX.test(time.trim())) {
                return `Invalid time format for ${day}. Use e.g. 09:00 AM - 05:00 PM.`;
            }
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {
            name: validateName(form.name),
            username: validateUsername(form.username),
            email: validateEmail(form.email),
            phone: validatePhone(form.phone),
            password: validatePassword(form.password),
            specialization: validateSpecialization(form.specialization),
            experience: validateExperience(form.experience),
            schedule: validateSchedule(form.schedule),
        };

        setErrors(newErrors);

        const firstError = Object.values(newErrors).find(Boolean);
        if (firstError) {
            Alert.alert("Please fix the following", firstError);
            return false;
        }
        return true;
    };

    const handleRegisterOrUpdate = async () => {
        if (!validateForm()) {
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
            return;
        }

        setLoading(true);

        try {
<<<<<<< HEAD
            
            const payload = {
                user_data: {
                    name: form.name,
                    username: form.username,
                    email: form.email,
                    phone: form.phone,
=======

            const payload = {
                user_data: {
                    name: form.name.trim(),
                    username: form.username.trim().toLowerCase(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim(),
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                    password: form.password,
                    role: "doctor",
                },
                specialization: form.specialization,
                experience_years: parseInt(form.experience) || 0,
<<<<<<< HEAD
                schedule: form.schedule, 
=======
                schedule: form.schedule,
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
            };

            console.log("Sending payload:", JSON.stringify(payload));

            const response = await fetch(`${API_URL}/admin/add-doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log("Raw response:", responseText);

            let data: any = {};
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                setLoading(false);
                Alert.alert("Error", responseText || "Unknown error");
                return;
            }

            if (response.ok) {
                setLoading(false);
                Alert.alert(
                    "Success! ✅",
                    "Doctor registered successfully!",
                    [{ text: "OK", onPress: () => router.push('/(admin)/doctor') }]
                );
            } else {
                setLoading(false);
                let errorMsg = "Something went wrong.";

                if (data.detail) {
                    if (typeof data.detail === 'string') {
                        errorMsg = data.detail;
                    } else if (Array.isArray(data.detail)) {
                        errorMsg = data.detail
                            .map((e: any) => {
                                const field = e.loc ? e.loc.join(' → ') : '';
                                const msg = e.msg || e.message || JSON.stringify(e);
                                return field ? `${field}: ${msg}` : msg;
                            })
                            .join('\n');
                    } else {
                        errorMsg = JSON.stringify(data.detail);
                    }
                } else if (data.message) {
                    errorMsg = data.message;
                }

                Alert.alert("Error", errorMsg);
            }

        } catch (error: any) {
            setLoading(false);
            console.log("Fetch error:", error);
            Alert.alert(
                "Connection Error",
                "Cannot connect to server. Please check internet and try again."
            );
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <View className="px-6 py-4 flex-row items-center border-b border-slate-100 bg-white">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-slate-50">
                        <MaterialCommunityIcons name="chevron-left" size={28} color={colors.darkText} />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-xl font-bold">{isEditMode ? 'Edit Doctor' : 'Register Doctor'}</Text>
                        {!serverReady && (
                            <Text className="text-xs text-orange-400">⏳ Connecting to server...</Text>
                        )}
                        {serverReady && (
                            <Text className="text-xs text-green-500">✅ Server connected</Text>
                        )}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-4">
                    <View className="bg-white p-6 rounded-[32px] border border-slate-100 gap-y-5">

                        <FormInput
                            label="Full Name"
                            icon="account-circle-outline"
                            placeholder="Dr. Sarah Ahmed"
                            value={form.name}
<<<<<<< HEAD
                            onChange={(v: string) => setForm({ ...form, name: v })}
=======
                            error={errors.name}
                            onChange={(v: string) => {
                                setForm({ ...form, name: v });
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            onBlur={() => setErrors({ ...errors, name: validateName(form.name) })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        />

                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">Specialization</Text>
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
<<<<<<< HEAD
=======
                                style={{ borderColor: errors.specialization ? '#EF4444' : undefined }}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                                className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 flex-row justify-between items-center"
                            >
                                <MaterialCommunityIcons name="stethoscope" size={20} color={colors.primary} style={{ position: 'absolute', left: 16 }} />
                                <Text style={{ color: form.specialization ? colors.darkText : '#CBD5E1' }}>
                                    {form.specialization || "Select Specialization"}
                                </Text>
                                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.mutedText} />
                            </TouchableOpacity>
<<<<<<< HEAD
=======
                            {!!errors.specialization && (
                                <Text className="text-[11px] text-red-500 mt-1 ml-1">{errors.specialization}</Text>
                            )}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        </View>

                        <FormInput
                            label="Years of Experience"
                            icon="briefcase-outline"
                            placeholder="e.g. 10"
                            keyboardType="numeric"
                            value={form.experience}
<<<<<<< HEAD
                            onChange={(v: string) => setForm({ ...form, experience: v })}
=======
                            error={errors.experience}
                            onChange={(v: string) => {
                                setForm({ ...form, experience: v });
                                if (errors.experience) setErrors({ ...errors, experience: undefined });
                            }}
                            onBlur={() => setErrors({ ...errors, experience: validateExperience(form.experience) })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        />

                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">Select Working Days</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {DAYS.map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => toggleDay(day)}
                                        style={{ backgroundColor: form.schedule[day] ? colors.primary : '#F8FAFC' }}
                                        className="px-3 py-2 rounded-xl border border-slate-200"
                                    >
                                        <Text style={{ color: form.schedule[day] ? 'white' : colors.darkText }} className="text-xs font-bold">
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
<<<<<<< HEAD
=======
                            {!!errors.schedule && (
                                <Text className="text-[11px] text-red-500 mt-1 ml-1">{errors.schedule}</Text>
                            )}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        </View>

                        {Object.keys(form.schedule).length > 0 && (
                            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <Text className="text-[10px] font-bold mb-3 uppercase tracking-widest text-slate-400">Set Timing Per Day</Text>
<<<<<<< HEAD
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
=======
                                <Text className="text-[10px] text-slate-400 mb-3">Format: 09:00 AM - 05:00 PM</Text>
                                {Object.keys(form.schedule).map(day => {
                                    const dayValid = TIME_RANGE_REGEX.test((form.schedule[day] || '').trim());
                                    return (
                                        <View key={day} className="mb-3">
                                            <View className="flex-row items-center justify-between">
                                                <Text className="font-bold text-slate-700 w-10">{day}:</Text>
                                                <TextInput
                                                    style={{ borderColor: !dayValid ? '#EF4444' : undefined }}
                                                    className="bg-white flex-1 ml-2 p-2 px-4 rounded-xl border border-slate-200 text-xs text-slate-600"
                                                    placeholder="e.g. 09:00 AM - 12:00 PM"
                                                    value={form.schedule[day]}
                                                    onChangeText={(v) => updateDayTime(day, v)}
                                                    onBlur={() => setErrors({ ...errors, schedule: validateSchedule(form.schedule) })}
                                                />
                                            </View>
                                            {!dayValid && (
                                                <Text className="text-[11px] text-red-500 mt-1 ml-12">Invalid format for {day}.</Text>
                                            )}
                                        </View>
                                    );
                                })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                            </View>
                        )}

                        <FormInput
                            label="Contact Number"
                            icon="phone-outline"
                            placeholder="+92 300 1234567"
                            keyboardType="phone-pad"
                            value={form.phone}
<<<<<<< HEAD
                            onChange={(v: string) => setForm({ ...form, phone: v })}
=======
                            error={errors.phone}
                            onChange={(v: string) => {
                                setForm({ ...form, phone: v });
                                if (errors.phone) setErrors({ ...errors, phone: undefined });
                            }}
                            onBlur={() => setErrors({ ...errors, phone: validatePhone(form.phone) })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        />

                        <FormInput
                            label="Email Address"
                            icon="email-outline"
                            placeholder="doctor@clinic.com"
                            keyboardType="email-address"
                            value={form.email}
<<<<<<< HEAD
                            onChange={(v: string) => setForm({ ...form, email: v })}
=======
                            error={errors.email}
                            onChange={(v: string) => {
                                setForm({ ...form, email: v });
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            onBlur={() => setErrors({ ...errors, email: validateEmail(form.email) })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        />

                        <FormInput
                            label="Login Username"
                            icon="at"
                            placeholder="sarah_ahmed123"
                            value={form.username}
<<<<<<< HEAD
                            onChange={(v: string) => setForm({ ...form, username: v.toLowerCase().trim().replace(/\s+/g, '_') })}
=======
                            error={errors.username}
                            onChange={(v: string) => {
                                const cleaned = v.toLowerCase().trim().replace(/\s+/g, '_');
                                setForm({ ...form, username: cleaned });
                                if (errors.username) setErrors({ ...errors, username: undefined });
                            }}
                            onBlur={() => setErrors({ ...errors, username: validateUsername(form.username) })}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        />

                        <View>
                            <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">
                                {isEditMode ? 'Update Password (Optional)' : 'Assign Password'}
                            </Text>
                            <View className="relative">
                                <TextInput
                                    secureTextEntry={!showPassword}
                                    value={form.password}
<<<<<<< HEAD
                                    onChangeText={(v) => setForm({ ...form, password: v })}
=======
                                    onChangeText={(v) => {
                                        setForm({ ...form, password: v });
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    onBlur={() => setErrors({ ...errors, password: validatePassword(form.password) })}
                                    style={{ borderColor: errors.password ? '#EF4444' : undefined }}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                                    className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 text-slate-800"
                                    placeholder={isEditMode ? "Leave blank to keep same" : "Set password"}
                                    placeholderTextColor="#CBD5E1"
                                />
                                <View className="absolute left-4 top-4">
                                    <MaterialCommunityIcons name="lock-outline" size={20} color={colors.primary} />
                                </View>
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-4">
                                    <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.mutedText} />
                                </TouchableOpacity>
                            </View>
<<<<<<< HEAD
=======
                            {!!errors.password && (
                                <Text className="text-[11px] text-red-500 mt-1 ml-1">{errors.password}</Text>
                            )}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                        </View>

                        <TouchableOpacity
                            onPress={handleRegisterOrUpdate}
                            disabled={loading}
                            style={{ backgroundColor: loading ? colors.mutedText : colors.primary }}
                            className="mt-4 p-5 rounded-2xl items-center shadow-lg active:opacity-90"
                        >
                            <Text className="text-white text-lg font-bold">
                                {loading ? 'Saving...' : (isEditMode ? 'Update Profile' : 'Register Doctor')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={showPicker} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[40px] p-6 h-1/2">
                        <Text className="text-lg font-bold mb-4">Select Specialization</Text>
                        <FlatList
                            data={SPECIALIZATIONS}
                            keyExtractor={(i) => i}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="py-4 border-b border-slate-50"
<<<<<<< HEAD
                                    onPress={() => { setForm({ ...form, specialization: item }); setShowPicker(false); }}
=======
                                    onPress={() => {
                                        setForm({ ...form, specialization: item });
                                        setErrors({ ...errors, specialization: undefined });
                                        setShowPicker(false);
                                    }}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                                >
                                    <Text className="text-base text-slate-700">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

<<<<<<< HEAD
const FormInput = ({ label, icon, value, onChange, placeholder, ...props }: any) => (
=======
const FormInput = ({ label, icon, value, onChange, onBlur, placeholder, error, ...props }: any) => (
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
    <View>
        <Text className="text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest text-slate-400">{label}</Text>
        <View className="relative">
            <TextInput
                value={value}
                onChangeText={(text) => onChange(text)}
<<<<<<< HEAD
                placeholder={placeholder}
                placeholderTextColor="#CBD5E1"
=======
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#CBD5E1"
                style={{ borderColor: error ? '#EF4444' : undefined }}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
                className="bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 text-slate-800"
                {...props}
            />
            <View className="absolute left-4 top-4">
                <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
            </View>
        </View>
<<<<<<< HEAD
=======
        {!!error && (
            <Text className="text-[11px] text-red-500 mt-1 ml-1">{error}</Text>
        )}
>>>>>>> b7fb5d66391df368e161b2bc915cc5d588327e12
    </View>
);