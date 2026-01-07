import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Directory based imports
import { StatCard } from '../../src/components/ui/StatCard';
import { colors } from '../../src/theme/colors';
import { storage } from '../../src/utils/storage';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 124, 
        avgConsultation: '12m',
        activeDepartments: 5
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const doctors = await storage.getDoctors();
            setStats(prev => ({
                ...prev,
                totalDoctors: doctors.length,
            }));
        } catch (error) {
            console.error("Dashboard load error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Logout Function
    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive", 
                    onPress: () => router.replace('/(auth)/login') 
                }
            ]
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
            <StatusBar barStyle="dark-content" />

            <ScrollView showsVerticalScrollIndicator={false} className="px-6">

                {/* 1. Header with Profile & Logout */}
                <View className="flex-row items-center justify-between mt-6 mb-8">
                    {/* Profile Section (Left) */}
                    <TouchableOpacity 
                        className="flex-row items-center"
                        onPress={() => router.push('/(admin)/profile')} // Profile screen path
                    >
                        <View 
                            className="w-12 h-12 rounded-full items-center justify-center border-2 border-white shadow-sm"
                            style={{ backgroundColor: colors.accent + '40', borderColor: colors.accent }}
                        >
                            <MaterialCommunityIcons name="account-tie" size={28} color={colors.primary} />
                        </View>
                        <View className="ml-3">
                            <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-tighter">
                                MedScribeAI Admin
                            </Text>
                            <Text style={{ color: colors.darkText }} className="text-xl font-extrabold">
                                Hello, Admin!
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Logout Button (Right) */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="w-11 h-11 rounded-2xl items-center justify-center bg-red-50 border border-red-100 shadow-sm"
                    >
                        <MaterialCommunityIcons name="logout-variant" size={22} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                {/* 2. Dynamic Stats Grid */}
                <View className="flex-row flex-wrap justify-between">
                    <StatCard
                        title="Total Doctors"
                        value={stats.totalDoctors.toString()}
                        icon="doctor"
                        color={colors.primary}
                    />
                    <StatCard
                        title="Total Patients"
                        value={stats.totalPatients.toString()}
                        icon="account-group"
                        color="#4CAF50"
                    />
                    <StatCard
                        title="Avg. Time (AI)"
                        value={stats.avgConsultation}
                        icon="timer-outline"
                        color="#FF9800"
                    />
                    <StatCard
                        title="Depts"
                        value={stats.activeDepartments.toString()}
                        icon="hospital-building"
                        color="#E91E63"
                    />
                </View>

                {/* 3. AI Insights Card */}
                <View className="mt-6 p-5 rounded-[32px] bg-blue-50 border border-blue-100">
                    <View className="flex-row items-center mb-2">
                        <MaterialCommunityIcons name="auto-fix" size={20} color={colors.primary} />
                        <Text className="ml-2 font-bold text-blue-800">AI System Health</Text>
                    </View>
                    <Text className="text-blue-600 text-sm">
                        All AI Agents (Transcription, RAG, SOAP Generator) are online and performing at 98% accuracy.
                    </Text>
                </View>

                {/* 4. Quick Management */}
                <View className="mt-6">
                    <Text style={{ color: colors.darkText }} className="text-lg font-bold mb-4">Quick Actions</Text>
                    <View className="bg-white rounded-[32px] p-2 shadow-sm border" style={{ borderColor: colors.accent }}>
                        <ActionItem
                            icon="account-plus-outline"
                            title="Add New Doctor"
                            onPress={() => router.push({
                                pathname: "/(admin)/doctor/add",
                                params: { editData: null }
                            })}
                        />
                        <View className="h-[0.5px] mx-5" style={{ backgroundColor: colors.accent }} />
                        <ActionItem
                            icon="shield-account-outline"
                            title="Manage Staff"
                            onPress={() => { }}
                        />
                        <View className="h-[0.5px] mx-5" style={{ backgroundColor: colors.accent }} />
                        <ActionItem
                            icon="file-chart-outline"
                            title="System Analytics"
                            onPress={() => router.push('/(admin)/reports')}
                        />
                    </View>
                </View>

                {/* 5. Recent Activity */}
                <View className="mt-6 mb-10">
                    <Text style={{ color: colors.darkText }} className="text-lg font-bold mb-4">Live OPD Flow</Text>
                    <View className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs">
                        <ActivityRow title="Dr. Ali" sub="Generated SOAP for Patient #201" time="2m ago" />
                        <ActivityRow title="Reception" sub="New Patient assigned to Cardiology" time="5m ago" />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// --- Local Helper Components ---

const ActionItem = ({ icon, title, onPress }: ActionItemProps) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 active:opacity-60">
        <View style={{ backgroundColor: colors.background }} className="w-11 h-11 rounded-2xl items-center justify-center mr-4">
            <MaterialCommunityIcons name={icon as any} size={22} color={colors.primary} />
        </View>
        <Text style={{ color: colors.darkText }} className="flex-1 font-bold text-[15px]">{title}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.mutedText} />
    </TouchableOpacity>
);

const ActivityRow = ({ title, sub, time }: { title: string; sub: string; time: string }) => (
    <View className="flex-row justify-between items-center py-3 border-b border-slate-50 last:border-0">
        <View>
            <Text className="font-bold text-slate-800">{title}</Text>
            <Text className="text-xs text-slate-500">{sub}</Text>
        </View>
        <Text className="text-[10px] text-slate-400 font-bold uppercase">{time}</Text>
    </View>
);

interface ActionItemProps {
    icon: string;
    title: string;
    onPress: () => void;
}