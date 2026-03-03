import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';

export default function MoreScreen() {
    const router = useRouter();
    const { lastSynced, syncData } = useData();

    const menuItems = [
        {
            title: 'Nutrition & Follow-up Alerts',
            subtitle: 'Upcoming ANC visits, vaccines & follow-ups',
            icon: 'bell-ring',
            color: '#F57F17',
            bg: '#FFFDE7',
            route: '/more/reminders',
        },
        {
            title: 'Reports & Summary',
            subtitle: 'Monthly progress and statistics',
            icon: 'chart-box-outline',
            color: '#1565C0',
            bg: '#E3F2FD',
            route: '/more/reports',
        },
        {
            title: 'Child Development Resources',
            subtitle: 'Reference material for counseling',
            icon: 'school',
            color: '#4527A0',
            bg: '#EDE7F6',
            route: '/more/education',
        },
        {
            title: 'Settings',
            subtitle: 'App configuration and preferences',
            icon: 'cog-outline',
            color: '#424242',
            bg: '#F5F5F5',
            route: '/more/settings',
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.syncCard}>
                <View style={styles.syncLeft}>
                    {lastSynced ? (
                        <MaterialCommunityIcons name="wifi" size={24} color={Colors.success} />
                    ) : (
                        <MaterialCommunityIcons name="wifi-off" size={24} color={Colors.warning} />
                    )}
                    <View>
                        <Text style={styles.syncTitle}>
                            {lastSynced ? 'Data Updated' : 'Working Offline'}
                        </Text>
                        <Text style={styles.syncSubtitle}>
                            {lastSynced
                                ? `Last: ${new Date(lastSynced).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                                : 'All data saved locally on device'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.syncButton}
                    onPress={() => {
                        Haptics.selectionAsync();
                        syncData();
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.syncButtonText}>Sync Now</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuSection}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        style={styles.menuCard}
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.push(item.route as never);
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.aboutSection}>
                <View style={styles.aboutIcon}>
                    <MaterialCommunityIcons name="information" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.aboutTitle}>Bal Vikas Mitra</Text>
                <Text style={styles.aboutSubtitle}>
                    Navi Mumbai Municipal Corporation{'\n'}
                    Digital Health Records System
                </Text>
                <Text style={styles.version}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, gap: 16 },
    syncCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: Colors.border,
    },
    syncLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    syncTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
    syncSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
    syncButton: {
        backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    },
    syncButtonText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
    menuSection: { gap: 10 },
    menuCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
        borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 14,
    },
    menuIcon: {
        width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    },
    menuContent: { flex: 1 },
    menuTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
    menuSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
    aboutSection: {
        alignItems: 'center', paddingVertical: 24, gap: 8,
    },
    aboutIcon: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primaryFaded,
        alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    aboutTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
    aboutSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
    version: { fontSize: 12, color: Colors.textMuted },
});
