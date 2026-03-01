import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function SettingsScreen() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const user = auth.currentUser;

    const displayName = user?.email ? user.email.split('@')[0] : 'ASHA Worker';
    const initial = displayName.charAt(0).toUpperCase();

    const settingItems = [
        {
            group: 'Preferences',
            items: [
                {
                    title: 'Dark Mode',
                    icon: 'moon-waning-crescent',
                    color: '#4527A0',
                    bg: '#EDE7F6',
                    type: 'toggle',
                    value: darkModeEnabled,
                    onValueChange: (val: boolean) => {
                        Haptics.selectionAsync();
                        setDarkModeEnabled(val);
                    }
                }
            ]
        },
        {
            group: 'Data & Sync',
            items: [
                {
                    title: 'Auto-Sync Data',
                    icon: 'cloud-sync-outline',
                    color: '#2E7D32',
                    bg: '#E8F5E9',
                    type: 'toggle',
                    value: autoSyncEnabled,
                    onValueChange: (val: boolean) => {
                        Haptics.selectionAsync();
                        setAutoSyncEnabled(val);
                    }
                }
            ]
        },
        {
            group: 'Notifications',
            items: [
                {
                    title: 'Push Notifications',
                    icon: 'bell-outline',
                    color: '#C62828',
                    bg: '#FFEBEE',
                    type: 'toggle',
                    value: notificationsEnabled,
                    onValueChange: (val: boolean) => {
                        Haptics.selectionAsync();
                        setNotificationsEnabled(val);
                    }
                }
            ]
        },
        {
            group: 'About',
            items: [
                {
                    title: 'Help & Support',
                    icon: 'help-circle-outline',
                    color: '#00695C',
                    bg: '#E0F2F1',
                    type: 'link',
                    onPress: () => {
                        Haptics.selectionAsync();
                        Linking.openURL('mailto:support@ashamitra.gov.in');
                    }
                },
                {
                    title: 'Privacy Policy',
                    icon: 'shield-check-outline',
                    color: '#37474F',
                    bg: '#ECEFF1',
                    type: 'link',
                    onPress: () => {
                        Haptics.selectionAsync();
                        Linking.openURL('https://nhm.gov.in/');
                    }
                }
            ]
        }
    ];

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        Haptics.selectionAsync();
                        await signOut(auth);
                        // Let React unmount cleanly, then navigate
                        setTimeout(() => {
                            router.replace('/');
                        }, 150);
                    } catch (error: any) {
                        console.error("Logout Error:", error);
                        Alert.alert('Logout Error', error.message || 'Could not log out. Please try again.');
                    }
                }
            }
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{displayName}</Text>
                    <Text style={styles.profileRole}>{user?.email}</Text>
                    <Text style={styles.profileId}>ID: {user?.uid.substring(0, 8).toUpperCase()}</Text>
                </View>
            </View>

            {settingItems.map((group, groupIdx) => (
                <View key={groupIdx} style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{group.group}</Text>
                    <View style={styles.groupContent}>
                        {group.items.map((item: any, itemIdx: number) => (
                            <View key={itemIdx}>
                                {item.type === 'link' ? (
                                    <TouchableOpacity
                                        style={styles.settingRow}
                                        onPress={item.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.settingLeft}>
                                            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
                                                <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                                            </View>
                                            <Text style={styles.settingTitle}>{item.title}</Text>
                                        </View>
                                        <View style={styles.settingRight}>
                                            {item.value && <Text style={styles.settingValueText}>{item.value}</Text>}
                                            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.settingRow}>
                                        <View style={styles.settingLeft}>
                                            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
                                                <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                                            </View>
                                            <Text style={styles.settingTitle}>{item.title}</Text>
                                        </View>
                                        <Switch
                                            value={item.value}
                                            onValueChange={item.onValueChange}
                                            trackColor={{ false: '#E0E0E0', true: Colors.primary }}
                                            thumbColor={'#FFF'}
                                        />
                                    </View>
                                )}
                                {itemIdx < group.items.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons name="logout" size={22} color="#D32F2F" />
                <Text style={styles.logoutText}>Log Out Account</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    profileRole: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    profileId: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primaryFaded,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupContainer: {
        marginBottom: 24,
    },
    groupTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    groupContent: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingTitle: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValueText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginLeft: 60,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEBEE',
        borderRadius: 14,
        paddingVertical: 16,
        marginTop: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    logoutText: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 30,
    },
});
