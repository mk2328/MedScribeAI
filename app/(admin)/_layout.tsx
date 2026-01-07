import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';

export default function AdminLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.mutedText,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginBottom: Platform.OS === 'android' ? 12 : 0,
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: colors.accent,
                    // Height ko optimize kiya gaya hai taake screen se chipke nahi
                    height: Platform.OS === 'ios' ? 65 + insets.bottom : 70,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                // Har icon ke darmiyan behtar space ke liye
                tabBarItemStyle: {
                    paddingVertical: 5,
                }
            }}
        >
            {/* 1. Dashboard Tab */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={(focused ? "home" : "home-outline") as any}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* 2. Add Doctor Tab */}
            <Tabs.Screen
                name="add_doctor"
                options={{
                    title: 'Add',
                    tabBarLabel: 'Add Doctor',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={(focused ? "account-plus" : "account-plus-outline") as any}
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarButton: (props: BottomTabBarButtonProps) => {
                        const { children, onPress, accessibilityState, style } = props;

                        return (
                            <TouchableOpacity
                                accessibilityState={accessibilityState}
                                style={style}
                                activeOpacity={0.7}
                                onPress={(e) => {
                                    router.push({
                                        pathname: '/(admin)/add_doctor',
                                        params: { editData: null },
                                    });
                                    onPress?.(e);
                                }}
                            >
                                {children}
                            </TouchableOpacity>
                        );
                    },


                }}
            />

            {/* 3. Doctors List Tab */}
            <Tabs.Screen
                name="doctors"
                options={{
                    title: 'Doctors',
                    tabBarLabel: 'Doctors',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={(focused ? "account-group" : "account-group-outline") as any}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* 4. Reports Tab */}
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarLabel: 'Reports',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={(focused ? "file-chart" : "file-chart-outline") as any}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* 5. Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={(focused ? "account-circle" : "account-circle-outline") as any}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Hidden Screens */}
            <Tabs.Screen
                name="doctor_details"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}