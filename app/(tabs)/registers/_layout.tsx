import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function RegistersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' as const },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Registers" }} />
      <Stack.Screen name="households" options={{ title: "Household Register" }} />
      <Stack.Screen name="pregnant" options={{ title: "Pregnant Women" }} />
      <Stack.Screen name="children" options={{ title: "Child Immunization" }} />
      <Stack.Screen name="couples" options={{ title: "Eligible Couples" }} />
      <Stack.Screen name="medicines" options={{ title: "Medicine Distribution" }} />
    </Stack>
  );
}
