import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
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

          {/* Optimized Logo Section */}
          <View className="items-center mb-5">
            {/* Logo container size increased for better visibility */}
            <View className="w-full h-[200px] items-center justify-center">
              <Image 
                // Ensure file name matches exactly
                source={require("../assets/images/LogoMedScribeAI_3.png")}
                className="w-[100%] h-full"
                resizeMode="contain"
              />
            </View>
            
            {/* Tagline below the logo */}
            <Text className="text-[13px] text-mutedText mt-[-10px] font-semibold tracking-wider uppercase">
              Smart Hospital Ecosystem
            </Text>
          </View>

          {/* Hero Section */}
          <View className="items-center mb-8">
            <Text className="text-[26px] font-bold text-center text-slate-800 leading-tight">
              Modernizing <Text className="text-primary">Healthcare</Text> with AI
            </Text>

            <Text className="text-center text-mutedText mt-3 text-[15px] leading-[22px] px-2">
              The all-in-one solution for OPD management and automated patient records.
            </Text>
          </View>

          {/* Features Section */}
          <View className="mb-8">
            {features.map((item, index) => (
              <FeatureCard 
                key={index} 
                title={item.title} 
                description={item.description} 
                icon={item.icon} 
              />
            ))}
          </View>

          {/* Action Button */}
          <View className="items-center">
            <Pressable
              onPress={() => router.push("/login")}
              className="w-full h-[58px] bg-primary rounded-[18px] flex-row items-center justify-center shadow-lg active:opacity-95"
            >
              <Text className="text-white text-[17px] font-bold">
                Login to your account
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </View>

          {/* Footer */}
          <Text className="text-center text-slate-400 text-[12px] mt-8">
            Trusted by hospitals worldwide
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}