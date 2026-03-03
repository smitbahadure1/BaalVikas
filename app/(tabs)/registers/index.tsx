import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';

interface RegisterItem {
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    bg: string;
    route: string;
    count: number;
}

export default function RegistersScreen() {
    const router = useRouter();
    const { households, pregnantWomen, children, couples, medicines } = useData();

    const activePregnant = pregnantWomen.filter(w => w.status === 'active').length;

    const registers: RegisterItem[] = [
        {
            title: 'Beneficiary Register',
            subtitle: 'Child + mother details',
            icon: 'home-group',
            color: '#1565C0',
            bg: '#E3F2FD',
            route: '/registers/households',
            count: households.length,
        },
        {
            title: 'Pregnant & Lactating Mothers',
            subtitle: 'ANC visit tracking',
            icon: 'human-pregnant',
            color: '#C62828',
            bg: '#FFEBEE',
            route: '/registers/pregnant',
            count: activePregnant,
        },
        {
            title: 'Child Growth Monitoring',
            subtitle: 'Growth history',
            icon: 'baby-carriage',
            color: '#2E7D32',
            bg: '#E8F5E9',
            route: '/registers/children',
            count: children.length,
        },
        {
            title: 'Pre-School Attendance',
            subtitle: 'Daily attendance',
            icon: 'human-male-female',
            color: '#6A1B9A',
            bg: '#F3E5F5',
            route: '/registers/couples',
            count: couples.length,
        },
        {
            title: 'Nutrition Distribution Register',
            subtitle: 'THR (Take Home Ration)',
            icon: 'medical-bag',
            color: '#00695C',
            bg: '#E0F2F1',
            route: '/registers/medicines',
            count: medicines.length,
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerText}>All digital registers for field work</Text>
            {registers.map((reg) => (
                <TouchableOpacity
                    key={reg.title}
                    style={styles.card}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push(reg.route as never);
                    }}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconWrap, { backgroundColor: reg.bg }]}>
                        <MaterialCommunityIcons name={reg.icon} size={28} color={reg.color} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{reg.title}</Text>
                        <Text style={styles.cardSubtitle}>{reg.subtitle}</Text>
                    </View>
                    <View style={styles.cardRight}>
                        <Text style={[styles.countBadge, { color: reg.color }]}>{reg.count}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
            ))}
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
        gap: 10,
    },
    headerText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 6,
        paddingHorizontal: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 14,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    cardSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countBadge: {
        fontSize: 18,
        fontWeight: '700',
    },
});
