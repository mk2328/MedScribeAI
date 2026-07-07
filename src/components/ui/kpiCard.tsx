import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Built-in with Expo
import { colors } from '../../theme/colors';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Type-safety for icons
  iconColor?: string;
}

export const KpiCard = ({ title, value, icon, iconColor }: KpiCardProps) => {
  return (
    <View 
      style={{ backgroundColor: 'white', borderColor: colors.accent }} 
      className="w-[48%] p-4 rounded-3xl mb-4 border shadow-sm flex-row items-center"
    >
      <View 
        style={{ backgroundColor: colors.accent }} 
        className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
      >
        <MaterialCommunityIcons name={icon} size={22} color={iconColor || colors.primary} />
      </View>
      
      <View>
        <Text style={{ color: colors.mutedText }} className="text-[10px] font-bold uppercase tracking-wider">
          {title}
        </Text>
        <Text style={{ color: colors.darkText }} className="text-lg font-bold">
          {value}
        </Text>
      </View>
    </View>
  );
};