import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(doctor)/dashboard'); 
  };

  return (
    <View className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200">
      <View className="mb-8 items-center">
        <Text className="text-2xl font-bold text-slate-900">Welcome Back</Text>
        <Text className="text-slate-500 mt-1">Login to your workspace</Text>
      </View>

      {/* Email Input */}
      <View className="mb-5">
        <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Email</Text>
        <TextInput 
          className="h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-base focus:border-[#0D9488]"
          placeholder="doctor@medscribeai.com"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Password</Text>
        <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl pr-4">
          <TextInput 
            className="flex-1 h-14 px-4 text-base"
            secureTextEntry={!showPassword}
            placeholder="••••••••"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={22} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password moved here */}
      <TouchableOpacity className="items-end mb-8 px-1">
        <Text className="text-sm font-bold text-[#0D9488]">Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-[#0D9488] h-16 rounded-2xl items-center justify-center shadow-lg shadow-[#0D9488]/20 active:opacity-90"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;