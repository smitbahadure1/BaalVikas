import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DataProvider } from "@/providers/DataProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import "../firebaseConfig";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    const router = useRouter();
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setIsAuthReady(true);

            // Expo requires Splash screen to map to navigation mount
            SplashScreen.hideAsync();

            if (!authUser) {
                router.replace('/' as any);
            }
        });
        return unsubscribe;
    }, []);
    return (
        <Stack screenOptions={{ headerBackTitle: "Back" }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="add-household"
                options={{ presentation: "modal", title: "Add Household" }}
            />
            <Stack.Screen
                name="edit-household"
                options={{ presentation: "modal", title: "Edit Household" }}
            />
            <Stack.Screen
                name="add-pregnant"
                options={{ presentation: "modal", title: "Add Pregnant Woman" }}
            />
            <Stack.Screen
                name="edit-pregnant"
                options={{ presentation: "modal", title: "Edit Record" }}
            />
            <Stack.Screen
                name="add-child"
                options={{ presentation: "modal", title: "Add Child" }}
            />
            <Stack.Screen
                name="edit-child"
                options={{ presentation: "modal", title: "Edit Child" }}
            />
            <Stack.Screen
                name="add-visit"
                options={{ presentation: "modal", title: "New Visit" }}
            />
            <Stack.Screen
                name="add-medicine"
                options={{ presentation: "modal", title: "Add Distribution" }}
            />
            <Stack.Screen
                name="add-couple"
                options={{ presentation: "modal", title: "Add Couple" }}
            />
            <Stack.Screen
                name="health-article"
                options={{ title: "Health Education" }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
                <DataProvider>
                    <RootLayoutNav />
                </DataProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
