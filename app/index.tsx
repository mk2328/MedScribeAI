import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Import the new component
import { FeatureCard } from "../src/components/ui/FeatureCard";

export default function WelcomeScreen() {
  const router = useRouter();

  const features = [
    {
      title: "AI-Powered",
      description: "Smart SOAP notes from consultations",
      icon: "auto-fix",
    },
    {
      title: "Secure",
      description: "HIPAA compliant data protection",
      icon: "shield-check",
    },
    {
      title: "Efficient",
      description: "Reduce patient waiting time",
      icon: "clock-fast",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-5"
      >
        <View className="flex-1 justify-center">
          {/* Background Accent */}
          <View className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full bg-accent opacity-60" />

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

          {/* Hero */}
          <View className="items-center mb-7">
            <Text className="text-[24px] font-bold text-center text-slate-800">
              Modernizing <Text className="text-primary">Healthcare</Text> with AI
            </Text>

            <Text className="text-center text-mutedText mt-2.5 text-[14px] leading-[21px]">
              The all-in-one solution for OPD management and automated patient records.
            </Text>
          </View>

          {/* Features Section - Using the Modular Component */}
          <View className="mb-7">
            {features.map((item, index) => (
              <FeatureCard 
                key={index} 
                title={item.title} 
                description={item.description} 
                icon={item.icon} 
              />
            ))}
          </View>

          {/* Buttons */}
          <View className="gap-2.5 items-center">
            <Pressable
              onPress={() => router.push("/login")}
              className="w-full h-[52px] bg-primary rounded-[16px] flex-row items-center justify-center shadow-sm active:opacity-90"
            >
              <Text className="text-white text-[16px] font-bold">
                Login to your account
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="white"
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            {/* <Pressable
              onPress={() => router.push("/signup")}
              className="w-full h-[52px] rounded-[16px] border border-slate-300 items-center justify-center active:bg-accent"
            >
              <Text className="text-slate-600 text-[15px] font-semibold">
                Create Account
              </Text>
            </Pressable> */}
          </View>

          {/* Footer */}
          <Text className="text-center text-slate-400 text-[12px] mt-6">
            Trusted by hospitals worldwide
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}