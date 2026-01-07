import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../src/theme/colors'; // Path updated
import { storage } from '../../../src/utils/storage'; // Path updated

export default function DoctorDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // URL se ID li
    const [doctor, setDoctor] = useState<any>(null);

    useEffect(() => {
        loadDoctorData();
    }, [id]);

    const loadDoctorData = async () => {
        const allDoctors = await storage.getDoctors();
        const found = allDoctors.find((d: any) => d.id === id);
        if (found) setDoctor(found);
    };

    if (!doctor) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading Doctor Details...</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            "Delete Doctor",
            `Are you sure you want to permanently delete Dr. ${doctor.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const allDoctors = await storage.getDoctors();
                        const filteredDoctors = allDoctors.filter((d: any) => d.id !== doctor.id);
                        await storage.saveAllDoctors(filteredDoctors);
                        router.replace('/(admin)/doctor'); // Back to list
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        router.push({
            pathname: '/(admin)/doctor/add' as any,
            params: { editData: JSON.stringify(doctor) }
        });
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
            {/* Header - UI remains exact same as your code */}
            <View className="px-6 py-4 flex-row items-center justify-between bg-white border-b border-slate-50">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.push("/(admin)/doctor")} className="mr-4 p-2 rounded-full bg-slate-50">
                        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.darkText} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Doctor Profile</Text>
                </View>
                <TouchableOpacity onPress={handleEdit} className="bg-teal-50 p-2 rounded-xl">
                    <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
                {/* Profile Card & InfoRows (Keep your existing UI code here) */}
                <View className="bg-white p-6 rounded-[32px] items-center border border-slate-100 mb-6 shadow-sm">
                    <MaterialCommunityIcons name="account-circle" size={80} color={colors.primary} />
                    <Text className="text-2xl font-bold text-slate-800">{doctor.name}</Text>
                    <Text className="text-teal-600 font-bold mb-1">{doctor.specialization}</Text>

                    <View className="flex-row items-center mb-4 bg-slate-50 px-3 py-1 rounded-full">
                        <MaterialCommunityIcons name="at" size={14} color={colors.mutedText} />
                        <Text className="text-xs text-slate-500 font-medium ml-1">{doctor.username}</Text>
                    </View>

                    <View className="flex-row border-t border-slate-50 w-full pt-4 justify-around">
                        <View className="items-center">
                            <Text className="text-xs text-slate-400">Experience</Text>
                            <Text className="font-bold">{doctor.experience} Years</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-xs text-slate-400">Status</Text>
                            <Text className="font-bold text-green-600 uppercase text-[10px]">
                                {doctor.availability_status || 'Active'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Schedule Section */}

                <View className="bg-white p-6 rounded-[32px] border border-slate-100 mb-6">

                    <View className="flex-row items-center mb-4">

                        <MaterialCommunityIcons name="calendar-clock" size={22} color={colors.primary} />

                        <Text className="font-bold text-slate-800 ml-2 text-lg">Weekly Schedule</Text>

                    </View>

                    {Object.entries(doctor.schedule).map(([day, time]: any) => (

                        <View key={day} className="flex-row justify-between py-3 border-b border-slate-50">

                            <Text className="font-bold text-slate-600">{day}</Text>

                            <Text className="text-slate-500 text-sm">{time}</Text>

                        </View>

                    ))}

                </View>



                {/* Contact Info */}

                <View className="bg-white p-6 rounded-[32px] border border-slate-100 mb-6">

                    <Text className="font-bold text-slate-800 mb-4 text-lg">Contact Information</Text>

                    <InfoRow icon="email-outline" label="Email" text={doctor.email} />

                    <InfoRow icon="phone-outline" label="Phone" text={doctor.phone} />

                </View>

                <TouchableOpacity onPress={handleDelete} className="mb-10 p-5 flex-row justify-center items-center bg-red-50 rounded-[24px] border border-red-100">
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#EF4444" />
                    <Text className="ml-2 text-red-500 font-bold text-base">Delete Doctor Permanently</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}


const InfoRow = ({ icon, label, text }: any) => (

    <View className="flex-row items-center mb-4">

        <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center">

            <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />

        </View>

        <View className="ml-3">

            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</Text>

            <Text className="text-slate-700 font-semibold">{text}</Text>

        </View>

    </View>

);

