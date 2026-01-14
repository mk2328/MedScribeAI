import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Axios import kiya
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

// Apne PC ka IPv4 address yahan likhein (ipconfig se check karein)
const API_URL = "http://192.168.100.4:8001"; 

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Fields cannot be empty");
      return;
    }
    
    setLoading(true);

    try {
      // Real API Call using Axios
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });

      if (response.data.status === "success") {
        const userData = response.data.user;

        // 1. Save Real User Data (ID, Name, Role) to AsyncStorage
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        
        setLoading(false);

        // 2. Role-based Navigation as per ERD [cite: 1]
        const role = userData.role.toLowerCase();
        
        if (role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else if (role === 'doctor') {
          router.replace('/(doctor)/dashboard');
        } else {
          Alert.alert("Access Denied", "Unauthorized role.");
        }
      }
    } catch (error: any) {
      setLoading(false);
      // Backend se aane wala error message dikhane ke liye
      const errorDetail = error.response?.data?.detail || "Something went wrong. Check connection.";
      Alert.alert("Login Failed", errorDetail);
      console.error("Login Error:", error);
    }
  };

  return (
    <View className="w-full gap-y-4">
      {/* Email Input */}
      <View className="relative">
        <TextInput
          placeholder="Email Address"
          placeholderTextColor={colors.mutedText}
          value={email}
          onChangeText={setEmail}
          style={{ borderColor: colors.accent, color: colors.darkText }}
          className="bg-white p-4 pl-12 rounded-2xl border"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View className="absolute left-4 top-4">
          <MaterialCommunityIcons name="email-outline" size={20} color={colors.mutedText} />
        </View>
      </View>

      {/* Password Input */}
      <View className="relative">
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.mutedText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ borderColor: colors.accent, color: colors.darkText }}
          className="bg-white p-4 pl-12 rounded-2xl border"
        />
        <View className="absolute left-4 top-4">
          <MaterialCommunityIcons name="lock-outline" size={20} color={colors.mutedText} />
        </View>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-4">
          <MaterialCommunityIcons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} color={colors.mutedText} 
          />
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        style={{ backgroundColor: colors.primary }}
        className="w-full h-[58px] rounded-2xl items-center justify-center shadow-md mt-2 active:opacity-90"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;