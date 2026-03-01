import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { auth } from '@/firebaseConfig';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/(tabs)/(home)' as any);
            }
        });
        return unsubscribe;
    }, []);

    const handleAuth = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Required', 'Please enter your email and password.');
            return;
        }

        Haptics.selectionAsync();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            } else {
                await createUserWithEmailAndPassword(auth, email.trim(), password);
            }
            // On success, the root layout navigates based on global auth state automatically
        } catch (error: any) {
            setLoading(false);
            let errorMessage = 'An error occurred during authentication.';
            if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMessage = 'Incorrect email or password.';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered.';
            if (error.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters.';

            Alert.alert(isLogin ? 'Login Failed' : 'Sign Up Failed', errorMessage);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={['#1565C0', '#0D47A1']} // Deep Blue tones mapping the splash screen vibe
                style={styles.blueBackground}
            >
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="medical-bag" size={64} color="#F57F17" style={styles.iconSpaced} />
                    <Text style={styles.appTitle}>ASHA Mitra</Text>
                    <Text style={styles.appSubtitle}>Digital Health Records System</Text>
                </View>

                <View style={styles.bottomSheet}>
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                        <Text style={styles.loginTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                        <Text style={styles.loginSubtitle}>{isLogin ? 'Sign in with your ASHA credentials' : 'Register a new ASHA worker account'}</Text>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>

                        {isLogin && (
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.loginButton, !isLogin && { marginTop: 24 }]}
                            onPress={handleAuth}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toggleAuth}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setIsLogin(!isLogin);
                            }}
                        >
                            <Text style={styles.toggleAuthText}>
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.supportContainer}>
                            <MaterialCommunityIcons name="lifebuoy" size={16} color={Colors.textMuted} />
                            <Text style={styles.supportText}>Need help? Contact NMMC Support</Text>
                        </View>
                    </ScrollView>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blueBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1565C0',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconSpaced: {
        marginBottom: 16,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    appSubtitle: {
        fontSize: 14,
        color: '#BBDEFB',
        marginTop: 6,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        minHeight: '55%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    scrollContent: {
        flexGrow: 1,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    loginSubtitle: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1E293B',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: '#F57F17', // Orange to contrast the blue
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#1565C0',
        borderRadius: 14,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#1565C0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    toggleAuth: {
        alignItems: 'center',
        marginBottom: 24,
    },
    toggleAuthText: {
        color: '#1565C0',
        fontSize: 14,
        fontWeight: '600',
    },
    supportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        gap: 6,
    },
    supportText: {
        color: Colors.textMuted,
        fontSize: 13,
    },
});
