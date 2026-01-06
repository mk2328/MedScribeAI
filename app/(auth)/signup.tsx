import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignupForm from '../../src/components/auth/SignupForm';

export default function SignupScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F0FDFA]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }} 
        className="px-6"
        // NativeWind v4 mein center alignment ke liye
        contentContainerClassName="justify-center py-10"
      >
        <View className="mb-10">
           <SignupForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}