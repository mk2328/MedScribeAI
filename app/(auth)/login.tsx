import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
        // Form aur Logo ko center karne ke liye
        contentContainerClassName="justify-center pb-10"
      >
        {/* 2. Optimized Logo Section for Login Page */}
        <View className="items-center mb-6"> 
          {/* mb-6 rakha hai taake LoginForm ke sath gap kam rahe */}
          <View className="w-full h-[160px] items-center justify-center">
            <Image 
              source={require("../../assets/images/LogoMedScribeAI_3.png")}
              className="w-[90%] h-full"
              resizeMode="contain"
            />
          </View>
          
          <Text className="text-[12px] text-slate-400 mt-[-10px] font-semibold tracking-widest uppercase">
            Smart Hospital Ecosystem
          </Text>
        </View>

        {/* 3. The Modular Form Component */}
        <LoginForm />

        {/* 4. Footer Help Text */}
        <Text className="text-center text-slate-400 text-[11px] mt-8">
          Secure HIPAA Compliant Login
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}