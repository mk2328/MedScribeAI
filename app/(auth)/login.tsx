import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "../../src/components/auth/LoginForm";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F0FDFA]">
      {/* 1. Header with Back Button */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        // NativeWind v4 layout centering
        contentContainerClassName="justify-center pb-10"
      >
        {/* Logo */}
          <View className="items-center mb-7">
            <View className="w-[72px] h-[72px] rounded-[22px] bg-primary items-center justify-center mb-3 shadow-md">
              <MaterialCommunityIcons
                name="stethoscope"
                size={36}
                color="white"
              />
            </View>

            <Text className="text-[28px] font-extrabold text-darkText">
              MedScribeAI
            </Text>
            <Text className="text-[13px] text-mutedText mt-1 font-medium">
              Smart Hospital Ecosystem
            </Text>
          </View>

        {/* 3. The Modular Form Component */}
        <LoginForm />

        {/* 4. Help Text or Footer (Optional) */}
        <Text className="text-center text-slate-400 text-[12px] mt-10">
          Secure HIPAA Compliant Login
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}