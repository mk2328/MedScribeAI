import React from "react";
import { Pressable, Text } from "react-native";
import { colors } from "../../theme/colors";

export function StatusChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: active ? colors.primary : "#E5E7EB",
        backgroundColor: active ? colors.primary : "white",
        opacity: pressed ? 0.8 : 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      })}
    >
      <Text style={{ fontWeight: "800", color: active ? "white" : "#111827" }}>
        {label}
      </Text>

      <Text
        style={{
          fontWeight: "800",
          color: active ? colors.primary : "#111827",
          backgroundColor: active ? "white" : "#F3F4F6",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {count}
      </Text>
    </Pressable>
  );
}
