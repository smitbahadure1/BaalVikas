import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Users, Heart, Baby, ClipboardList, Pill, UserCheck, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';

export default function ReportsScreen() {
  const { households, pregnantWomen, children, visits, medicines, couples } = useData();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyVisits = useMemo(() => {
    return visits.filter(v => {
      const d = new Date(v.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [visits, currentMonth, currentYear]);

  const completedThisMonth = useMemo(() => {
    return monthlyVisits.filter(v => v.isCompleted).length;
  }, [monthlyVisits]);

  const totalVaccinesGiven = useMemo(() => {
    return children.reduce((sum, c) => sum + c.vaccines.filter(v => v.status === 'given').length, 0);
  }, [children]);

  const activePregnant = useMemo(() => {
    return pregnantWomen.filter(w => w.status === 'active').length;
  }, [pregnantWomen]);

  const deliveredThisMonth = useMemo(() => {
    return pregnantWomen.filter(w => {
      if (!w.deliveryDate) return false;
      const d = new Date(w.deliveryDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }, [pregnantWomen, currentMonth, currentYear]);

  const visitsByPurpose = useMemo(() => {
    const counts: Record<string, number> = {};
    monthlyVisits.forEach(v => {
      counts[v.purpose] = (counts[v.purpose] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [monthlyVisits]);

  const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const stats = [
    { label: 'Households', value: households.length, icon: Users, color: '#1565C0', bg: '#E3F2FD' },
    { label: 'Active Pregnancies', value: activePregnant, icon: Heart, color: '#C62828', bg: '#FFEBEE' },
    { label: 'Deliveries (Month)', value: deliveredThisMonth, icon: Heart, color: '#2E7D32', bg: '#E8F5E9' },
    { label: 'Children Tracked', value: children.length, icon: Baby, color: '#00695C', bg: '#E0F2F1' },
    { label: 'Vaccines Given', value: totalVaccinesGiven, icon: TrendingUp, color: '#4527A0', bg: '#EDE7F6' },
    { label: 'Eligible Couples', value: couples.length, icon: UserCheck, color: '#6A1B9A', bg: '#F3E5F5' },
    { label: 'Medicines Distributed', value: medicines.length, icon: Pill, color: '#E65100', bg: '#FFF3E0' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{monthName}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{monthlyVisits.length}</Text>
            <Text style={styles.summaryLabel}>Total Visits</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedThisMonth}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{monthlyVisits.length - completedThisMonth}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {visitsByPurpose.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visits by Purpose</Text>
          {visitsByPurpose.map(([purpose, count]) => {
            const maxCount = visitsByPurpose[0][1] as number;
            const percentage = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;

            return (
              <View key={purpose} style={styles.barRow}>
                <Text style={styles.barLabel}>{purpose}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.barValue}>{count}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text style={styles.gridTitle}>Overall Statistics</Text>
      <View style={styles.statsGrid}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
              <stat.icon size={18} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16 },
  summaryCard: {
    backgroundColor: Colors.primary, borderRadius: 18, padding: 20,
  },
  summaryTitle: {
    fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 28, fontWeight: '700', color: Colors.white },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 14 },
  barRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10,
  },
  barLabel: { width: 100, fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  barTrack: {
    flex: 1, height: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 4, overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  barValue: { width: 30, fontSize: 13, fontWeight: '600', color: Colors.text, textAlign: 'right' },
  gridTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 4 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  statCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 6,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
});
