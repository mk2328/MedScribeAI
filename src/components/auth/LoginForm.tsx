import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MOCK_USERS } from '../../services/mockData';
import { colors } from '../../theme/colors'; // Theme import

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Fields cannot be empty");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      setLoading(false);
      if (user) {
        user.role === 'admin' ? router.replace('/(admin)/dashboard') : router.replace('/(doctor)/dashboard');
      } else {
        alert("Invalid Credentials");
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