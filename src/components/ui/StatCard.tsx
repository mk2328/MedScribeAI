import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../theme/colors'; // Theme import

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color?: string; // Optional: agar custom color na ho toh primary use karega
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const iconColor = color || colors.primary;

  return (
    <View 
      style={{ borderColor: colors.accent }}
      className="w-[48%] bg-white p-5 rounded-[28px] mb-4 border shadow-sm"
    >
      {/* Icon Container with subtle background using accent color */}
      <View 
        style={{ backgroundColor: colors.accent }} 
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
      >
        <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
      </View>
      
      <Text 
        style={{ color: colors.mutedText }}
        className="text-[11px] font-bold uppercase tracking-wider"
      >
        {title}
      </Text>
      
      <Text 
        style={{ color: colors.darkText }}
        className="text-xl font-bold mt-1"
      >
        {value}
      </Text>
    </View>
  );
};