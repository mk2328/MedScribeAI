import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

const API_URL = "https://medscribeai-pzqu.onrender.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  // checking | ready | offline

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    if (serverStatus === 'checking') {
      Alert.alert("Please Wait", "Server is starting up, please wait a moment and try again.");
      return;
    }

    if (serverStatus === 'offline') {
      Alert.alert("Server Offline", "Cannot reach the server. Check your internet connection and try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim().toLowerCase(),
        password: password
      });

      setLoading(false);

      if (response.data.status === "success") {
        const userData = response.data.user;

        await AsyncStorage.setItem('user_data', JSON.stringify(userData));

        const role = userData.role.toLowerCase();

        if (role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else if (role === 'doctor') {
          router.replace('/(doctor)/dashboard');
        } else if (role === 'receptionist') {
          router.replace('/(receptionist)/dashboard');
        } else {
          Alert.alert("Access Denied", "Unauthorized role.");
        }
      } else {
        // Backend responded with 200 OK but status !== "success"
        // (e.g. { status: "fail", message: "Invalid credentials" })
        const failMessage =
          response.data.message || response.data.detail || "Invalid email or password.";
        Alert.alert("Login Failed", failMessage);
      }
    } catch (error: any) {
      setLoading(false);

      // Log the raw error so we can see exactly what the backend sends back
      console.log("Login error status:", error.response?.status);
      console.log("Login error data:", JSON.stringify(error.response?.data, null, 2));

      const errorDetail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (error.response?.status === 401 || error.response?.status === 403
          ? "Invalid email or password."
          : "Server is waking up. Please try again in 30 seconds.");

      Alert.alert("Login Failed", errorDetail);
    }
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
      <View>
        <View className="relative">
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            style={{ borderColor: errors.email ? '#EF4444' : colors.accent, color: colors.darkText }}
            className="bg-white p-4 pl-12 rounded-2xl border"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <View className="absolute left-4 top-4">
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.mutedText} />
          </View>
        </View>
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
        )}
      </View>

      {/* Password Input */}
      <View>
        <View className="relative">
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutedText}
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry={!showPassword}
            style={{ borderColor: errors.password ? '#EF4444' : colors.accent, color: colors.darkText }}
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
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
        )}
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading || serverStatus === 'checking'}
        style={{ backgroundColor: serverStatus === 'checking' ? colors.mutedText : colors.primary }}
        className="w-full h-[58px] rounded-2xl items-center justify-center shadow-md mt-2 active:opacity-90"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">
            {serverStatus === 'checking' ? 'Connecting...' : 'Sign In'}
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default LoginForm;