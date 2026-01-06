import { View, Text } from "react-native";

export default function DoctorDashboard() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold text-teal-600">Doctor Dashboard</Text>
      <Text className="text-slate-500">Welcome, Dr. Khalid</Text>
    </View>
  );
}