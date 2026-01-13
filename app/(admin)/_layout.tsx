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
                    fontWeight: '700',
                    // Label ko thoda aur upar kiya
                    marginBottom: Platform.OS === 'android' ? 12 : 5,
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopColor: colors.accent,
                    // Height ko 85 tak barhaya taake buttons ke liye clear space mil jaye
                    height: Platform.OS === 'ios' ? 88 : 85,
                    paddingTop: 10,
                    // Android buttons ke liye kafi sari jagah niche chor di
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 25,
                    elevation: 30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    position: 'absolute', // Isse layout overlap issues aksar hal ho jate hain
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarItemStyle: {
                    // Content ko center se thoda upar rakha
                    height: 50,
                }
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "home" : "home-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="doctor/index"
                options={{
                    title: 'Doctors',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-group" : "account-group-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="doctor/add"
                options={{
                    title: 'Add',
                    tabBarLabel: 'Add Doctor',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-plus" : "account-plus-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => {
                        // 1. Props ko destructure karein taake unnecessary null values filter ho jayein
                        const { children, onPress, accessibilityState, style, ...rest } = props;

                        return (
                            <TouchableOpacity
                                // accessibilityState aur style ko lazmi pass karein tab bar ki alignment ke liye
                                accessibilityState={accessibilityState}
                                style={style}
                                activeOpacity={0.7}
                                onPress={(e) => {
                                    // Pehle apna custom navigation chalayein
                                    router.push({
                                        pathname: "/(admin)/doctor/add",
                                        params: { editData: null }
                                    });
                                    // Phir tab bar ka default onPress (agar koi hai)
                                    onPress?.(e);
                                }}
                            >
                                {children}
                            </TouchableOpacity>
                        );
                    },
                }}
            />

            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "file-chart" : "file-chart-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "account-circle" : "account-circle-outline"}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen name="doctor/[id]" options={{ href: null }} />
            <Tabs.Screen name="patients/index" options={{ href: null }} />
            <Tabs.Screen name="patients/[id]" options={{ href: null }} />
        </Tabs>
    );
}