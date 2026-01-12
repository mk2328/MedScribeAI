import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Patient } from "../../types/patient";
import { colors } from "../../theme/colors";

function statusBadge(status: Patient["status"]) {
  if (status === "IN_QUEUE") return { text: "In Queue", bg: "#FEF3C7", fg: "#92400E" };
  if (status === "ACTIVE") return { text: "Active", bg: "#D1FAE5", fg: "#065F46" };
  return { text: "Discharged", bg: "#E5E7EB", fg: "#374151" };
}

export function PatientCard({ patient }: { patient: Patient }) {
  const badge = statusBadge(patient.status);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 12,
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
      }}
    >
      {/* avatar */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: colors.accent + "30",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="account-outline" size={22} color={colors.primary} />
      </View>

      {/* main */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
            {patient.name}
          </Text>

          <View
            style={{
              backgroundColor: badge.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: badge.fg, fontWeight: "800", fontSize: 12 }}>
              {badge.text}
            </Text>
          </View>
        </View>

        <Text style={{ color: "#6B7280", marginTop: 2, fontWeight: "600" }}>
          {patient.patientNo} • {patient.age}y • {patient.gender}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
          <MaterialCommunityIcons name="stethoscope" size={16} color="#6B7280" />
          <Text style={{ color: "#6B7280", fontWeight: "700" }}>{patient.department}</Text>
        </View>
      </View>
    </View>
  );
}
