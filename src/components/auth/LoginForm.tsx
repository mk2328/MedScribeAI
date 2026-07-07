import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

const API_URL = "https://medscribeai-pzqu.onrender.com";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  // checking | ready | offline

  // Wake up Render server when login screen opens
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        setServerStatus('checking');
        await fetch(`${API_URL}/doctors`);
        setServerStatus('ready');
      } catch (e) {
        setServerStatus('offline');
      }
    };
    wakeUpServer();
  }, []);

  const handleLogin = async () => {
    // ⚡ TEMPORARY TESTING BYPASS ⚡
    // Is line ki wajah se bager server checking ke direct receptionist dashboard khul jayega!
    router.replace('/(receptionist)/dashboard');
    return;

  };

  return (
    <View className="w-full gap-y-4">

      {/* Server Status Banner */}
      {serverStatus === 'checking' && (
        <View className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex-row items-center gap-x-2">
          <ActivityIndicator size="small" color="#F97316" />
          <Text className="text-orange-500 text-xs font-semibold">
            Connecting to server... please wait
          </Text>
        </View>
      )}

      {serverStatus === 'ready' && (
        <View className="bg-green-50 border border-green-200 rounded-2xl p-3 flex-row items-center gap-x-2">
          <MaterialCommunityIcons name="check-circle" size={16} color="#22C55E" />
          <Text className="text-green-500 text-xs font-semibold">
            Server connected ✅
          </Text>
        </View>
      )}

      {serverStatus === 'offline' && (
        <View className="bg-red-50 border border-red-200 rounded-2xl p-3 flex-row items-center gap-x-2">
          <MaterialCommunityIcons name="wifi-off" size={16} color="#EF4444" />
          <Text className="text-red-500 text-xs font-semibold">
            Server offline. Check internet connection.
          </Text>
        </View>
      )}

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
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4"
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20} color={colors.mutedText}
          />
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: colors.primary }}
        className="w-full h-[58px] rounded-2xl items-center justify-center shadow-md mt-2 active:opacity-90"
      >
        <Text className="text-white text-lg font-bold">
          Sign In
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginForm;