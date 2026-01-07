import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
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
                    height: Platform.OS === 'ios' ? 65 + insets.bottom : 70,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
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
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "home" : "home-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* 2. Doctors List Tab  */}
            <Tabs.Screen
                name="doctor/index"
                options={{
                    title: 'Doctors',
                    tabBarLabel: 'Doctors',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-group" : "account-group-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* 3. Add Doctor Tab */}
            <Tabs.Screen
                name="doctor/add"
                options={{
                    title: 'Add',
                    tabBarLabel: 'Add Doctor',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-plus" : "account-plus-outline"}
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
                                        pathname: "/(admin)/doctor/add",
                                        params: { editData: null }
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

            {/* 4. Reports Tab */}
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "file-chart" : "file-chart-outline"}
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
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-circle" : "account-circle-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Hidden Screens */}
            <Tabs.Screen
                name="doctor/[id]"
                options={{
                    href: null, // Ye tab bar mein show nahi hoga
                }}
            />
        </Tabs>
    );
}