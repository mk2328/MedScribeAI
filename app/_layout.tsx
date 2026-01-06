import { Stack } from "expo-router";
import "../src/theme/global.css"; // Path update kiya

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Index screen (Welcome) */}
      <Stack.Screen name="index" />
      
      {/* Auth Group */}
      <Stack.Screen name="(auth)" />
      
      {/* Role Groups (Future screens) */}
      <Stack.Screen name="(doctor)" />
      <Stack.Screen name="(receptionist)" />
    </Stack>
  );
}