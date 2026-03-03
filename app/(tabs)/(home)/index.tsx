import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';

export default function HomeScreen() {
    const router = useRouter();
    const {
        households,
        todayVisits,
        pendingFollowUps,
        activePregnantWomen,
        upcomingVaccinations,
        children,
        visits,
        lastSynced,
        syncData,
    } = useData();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        Haptics.selectionAsync();
        setRefreshing(true);
        await syncData();
        setRefreshing(false);
    }, [syncData]);

    const todayDate = useMemo(() => {
        const d = new Date();
        return d.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    const completedToday = useMemo(() => {
        return todayVisits.filter(v => v.isCompleted).length;
    }, [todayVisits]);

    const highRiskCount = useMemo(() => {
        return activePregnantWomen.filter(w => w.isHighRisk).length;
    }, [activePregnantWomen]);

    const quickActions = [
        { label: 'Beneficiaries', icon: 'home-group', color: '#FFF', bg: '#4285F4', route: '/registers/households' },
        { label: 'Pregnant Mothers', icon: 'human-pregnant', color: '#FFF', bg: '#E91E63', route: '/registers/pregnant' },
        { label: 'Child Growth', icon: 'baby-carriage', color: '#FFF', bg: '#4CAF50', route: '/registers/children' },
        { label: 'Lactating Mothers', icon: 'human-male-female', color: '#FFF', bg: '#9C27B0', route: '/registers/couples' },
        { label: 'Daily Activities', icon: 'clipboard-text-clock', color: '#FFF', bg: '#FF9800', route: '/visits' },
        { label: 'Nutrition Distribution', icon: 'medical-bag', color: '#FFF', bg: '#009688', route: '/registers/medicines' },
        { label: 'Alerts', icon: 'bell-ring', color: '#FFF', bg: '#F44336', route: '/more/reminders' },
        { label: 'Learning Resources', icon: 'school', color: '#FFF', bg: '#3F51B5', route: '/more/education' },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
            }
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Namaste!</Text>
                        <Text style={styles.dateText}>{todayDate}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="#1565C0" />
                    <Text style={[styles.statNumber, { color: '#1565C0' }]}>{todayVisits.length}</Text>
                    <Text style={styles.statLabel}>{"Today's Activities"}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <MaterialCommunityIcons name="calendar-check-outline" size={24} color="#2E7D32" />
                    <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{completedToday}</Text>
                    <Text style={styles.statLabel}>Children Attended</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#E65100" />
                    <Text style={[styles.statNumber, { color: '#E65100' }]}>{pendingFollowUps.length}</Text>
                    <Text style={styles.statLabel}>Nutrition Follow-ups</Text>
                </View>
            </View>

            {(highRiskCount > 0 || upcomingVaccinations.length > 0) && (
                <View style={styles.alertsSection}>
                    {highRiskCount > 0 && (
                        <TouchableOpacity
                            style={styles.alertCard}
                            onPress={() => {
                                Haptics.selectionAsync();
                                router.push('/registers/pregnant');
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.alertIconWrap}>
                                <MaterialCommunityIcons name="alert-circle" size={22} color="#C62828" />
                            </View>
                            <View style={styles.alertContent}>
                                <Text style={styles.alertTitle}>⚠️ {highRiskCount} Underweight Children</Text>
                                <Text style={styles.alertSubtitle}>Require nutrition monitoring</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                        </TouchableOpacity>
                    )}
                    {upcomingVaccinations.length > 0 && (
                        <TouchableOpacity
                            style={styles.alertCard}
                            onPress={() => {
                                Haptics.selectionAsync();
                                router.push('/registers/children');
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.alertIconWrap, { backgroundColor: '#FFF3E0' }]}>
                                <MaterialCommunityIcons name="needle" size={22} color="#E65100" />
                            </View>
                            <View style={styles.alertContent}>
                                <Text style={styles.alertTitle}>{upcomingVaccinations.length} Vaccines Due</Text>
                                <Text style={styles.alertSubtitle}>Within the next 7 days</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.label}
                        style={styles.quickItem}
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.push(action.route as never);
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickIcon, { backgroundColor: action.bg }]}>
                            <MaterialCommunityIcons name={action.icon as any} size={30} color={action.color} />
                        </View>
                        <Text style={styles.quickLabel}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewSection}>
                <TouchableOpacity
                    style={styles.overviewRow}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push('/registers/households');
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.overviewLeft}>
                        <MaterialCommunityIcons name="home-group" size={22} color={Colors.primary} />
                        <Text style={styles.overviewLabel}>Total Beneficiaries Registered</Text>
                    </View>
                    <Text style={styles.overviewValue}>{households.length}</Text>
                </TouchableOpacity>
                <View style={styles.overviewDivider} />
                <TouchableOpacity
                    style={styles.overviewRow}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push('/registers/pregnant');
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.overviewLeft}>
                        <MaterialCommunityIcons name="heart-pulse" size={22} color={Colors.danger} />
                        <Text style={styles.overviewLabel}>Active Pregnant Mothers</Text>
                    </View>
                    <Text style={styles.overviewValue}>{activePregnantWomen.length}</Text>
                </TouchableOpacity>
                <View style={styles.overviewDivider} />
                <TouchableOpacity
                    style={styles.overviewRow}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push('/registers/children');
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.overviewLeft}>
                        <MaterialCommunityIcons name="baby-face-outline" size={22} color={Colors.success} />
                        <Text style={styles.overviewLabel}>Children Under Monitoring</Text>
                    </View>
                    <Text style={styles.overviewValue}>{children.length}</Text>
                </TouchableOpacity>
                <View style={styles.overviewDivider} />
                <TouchableOpacity
                    style={styles.overviewRow}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push('/more/reports');
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.overviewLeft}>
                        <MaterialCommunityIcons name="chart-box-outline" size={22} color={Colors.info} />
                        <Text style={styles.overviewLabel}>{"This Month's Activities"}</Text>
                    </View>
                    <Text style={styles.overviewValue}>
                        {visits.filter(v => {
                            const visitDate = new Date(v.date);
                            const now = new Date();
                            return visitDate.getMonth() === now.getMonth() &&
                                visitDate.getFullYear() === now.getFullYear();
                        }).length}
                    </Text>
                </TouchableOpacity>
            </View>

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
        paddingBottom: 20,
    },
    header: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 4,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 2,
    },
    dateText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    syncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    syncText: {
        fontSize: 12,
        color: Colors.white,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: -1,
        paddingTop: 16,
        gap: 10,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 6,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    alertsSection: {
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 8,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 14,
        padding: 14,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    alertIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    alertSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 1,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text,
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        gap: 12,
    },
    quickItem: {
        width: '22%',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    quickLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    overviewSection: {
        marginHorizontal: 16,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    overviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    overviewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    overviewLabel: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '500',
    },
    overviewValue: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.primary,
    },
    overviewDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginHorizontal: 16,
    },
    bottomSpacer: {
        height: 20,
    },
});
