import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignupForm = () => {
  const [role, setRole] = useState('doctor');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const roles = [
    { id: 'doctor', label: 'Doctor', icon: 'stethoscope' },
    { id: 'receptionist', label: 'Reception', icon: 'account-tie' },
    { id: 'admin', label: 'Admin', icon: 'shield-check' },
  ];

  return (
    <View className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200">
      <View className="mb-6 items-center">
        <Text className="text-2xl font-bold text-slate-900">Create Account</Text>
        <Text className="text-slate-500 mt-1">Enter your details to get started</Text>
      </View>

      {/* Full Name */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-slate-800 mb-2 ml-1">Full Name</Text>
        <TextInput 
          className="h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-base focus:border-[#0D9488]"
          placeholder="Dr. John Doe"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-slate-800 mb-2 ml-1">Email</Text>
        <TextInput 
          className="h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-base focus:border-[#0D9488]"
          placeholder="name@hospital.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-slate-800 mb-2 ml-1">Password</Text>
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl pr-4">
          <TextInput 
            className="flex-1 h-14 px-4 text-base"
            secureTextEntry={!showPassword}
            placeholder="Create a password"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye-outline"} size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-slate-800 mb-2 ml-1">Confirm Password</Text>
        <TextInput 
          className="h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-base focus:border-[#0D9488]"
          secureTextEntry={true}
          placeholder="Confirm your password"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Role Selection */}
      <Text className="text-sm font-bold text-slate-800 mb-3 ml-1">Select your role</Text>
      <View className="flex-row justify-between mb-8 gap-2">
        {roles.map((item) => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => setRole(item.id)}
            className={`flex-1 p-3 rounded-2xl items-center border-2 ${
              role === item.id ? 'border-[#0D9488] bg-[#F0FDFA]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <MaterialCommunityIcons 
              name={item.icon as any} 
              size={22} 
              color={role === item.id ? '#0D9488' : '#64748B'} 
            />
            <Text className={`text-[10px] mt-1 font-bold ${role === item.id ? 'text-[#0D9488]' : 'text-slate-500'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Register Button */}
      <TouchableOpacity 
        className="bg-[#0D9488] h-14 rounded-2xl items-center justify-center shadow-lg shadow-[#0D9488]/20"
        onPress={() => router.replace(`/(doctor)/dashboard`)} 
      >
        <Text className="text-white text-lg font-bold">Register Now</Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-slate-500">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-[#0D9488] font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupForm;