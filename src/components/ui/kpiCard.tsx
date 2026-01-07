import { View, Text } from 'react-native';

interface KpiCardProps {
  title: string;
  value: string | number;
  colorClass?: string;
}

export const KpiCard = ({ title, value, colorClass = "text-blue-600" }: KpiCardProps) => {
  return (
    <View className="bg-white p-4 rounded-2xl w-[48%] mb-4 shadow-sm border border-slate-100">
      <Text className="text-slate-500 text-xs font-semibold uppercase">{title}</Text>
      <Text className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</Text>
    </View>
  );
};