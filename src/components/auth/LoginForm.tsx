import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
// 1. Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USERS } from '../../services/mockData';
import { colors } from '../../theme/colors';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => { // Added async
    if (!email || !password) {
      Alert.alert("Error", "Fields cannot be empty");
      return;
    }
    
    setLoading(true);

    // Simulate API delay
    setTimeout(async () => {
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (user) {
        try {
          // 2. Save user data to storage before navigating
          await AsyncStorage.setItem('user_data', JSON.stringify(user));
          
          setLoading(false);
          if (user.role === 'admin') {
            router.replace('/(admin)/dashboard');
          } else {
            router.replace('/(doctor)/dashboard');
          }
        } catch (error) {
          setLoading(false);
          Alert.alert("Login Error", "Could not save session.");
        }
      } else {
        setLoading(false);
        Alert.alert("Invalid Credentials", "Please check your email and password.");
      }
    }, 800);
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