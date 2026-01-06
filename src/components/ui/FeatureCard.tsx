import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

// TypeScript interface taake errors na aayen
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <View className="flex-row items-center p-3.5 mb-3 rounded-[20px] bg-white border border-slate-200">
      <View className="w-[42px] h-[42px] rounded-[14px] bg-background items-center justify-center mr-3.5">
        <MaterialCommunityIcons
          name={icon as any}
          size={22}
          color="#0D9488"
        />
      </View>

      <View className="flex-1">
        <Text className="text-[15px] font-bold text-slate-800">
          {title}
        </Text>
        <Text className="text-[12px] text-mutedText mt-0.5">
          {description}
        </Text>
      </View>
    </View>
  );
};