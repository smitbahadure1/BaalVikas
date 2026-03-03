import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function MoreLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.white,
                headerTitleStyle: { fontWeight: '700' as const },
            }}
        >
            <Stack.Screen name="index" options={{ title: "More" }} />
            <Stack.Screen name="reminders" options={{ title: "Nutrition & Follow-up Alerts" }} />
            <Stack.Screen name="reports" options={{ title: "Reports & Summary" }} />
            <Stack.Screen name="education" options={{ title: "Child Development Resources" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
    );
}
