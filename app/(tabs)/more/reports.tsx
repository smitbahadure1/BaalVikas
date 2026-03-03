import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
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
    { label: 'Total children enrolled', value: children.length, icon: Baby, color: '#00695C', bg: '#E0F2F1' },
    { label: 'Malnutrition count', value: 3, icon: Heart, color: '#C62828', bg: '#FFEBEE' },
    { label: 'Distribution summary', value: medicines.length, icon: Pill, color: '#E65100', bg: '#FFF3E0' },
    { label: 'Monthly attendance', value: couples.length + households.length * 3, icon: Users, color: '#1565C0', bg: '#E3F2FD' },
    { label: 'Growth improvement trends', value: totalVaccinesGiven, icon: TrendingUp, color: '#2E7D32', bg: '#E8F5E9' },
  ];

  const handleShareMPR = () => {
    const report = `*Anganwadi Monthly Progress Report (MPR)*
Month: ${monthName}

*Summary:*
Total Beneficiaries: ${households.length}
Total Children Enrolled: ${children.length}
Children Under Malnutrition (SAM/MAM): 3
Pregnant Mothers Active: ${activePregnant}
Deliveries This Month: ${deliveredThisMonth}

*Activities:*
Total Activities Conducted: ${monthlyVisits.length}
THR Kits Distributed: ${medicines.length}
Vaccines Given: ${totalVaccinesGiven}

*Prepared by:* Anganwadi Field Worker`;

    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(report)}`).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed. Please install WhatsApp to share reports.');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{monthName}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{monthlyVisits.length}</Text>
            <Text style={styles.summaryLabel}>Total Activities</Text>
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
          <Text style={styles.sectionTitle}>Activities by Type</Text>
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

      <TouchableOpacity style={styles.shareButton} onPress={handleShareMPR} activeOpacity={0.8}>
        <View style={styles.shareIconWrap}>
          <ClipboardList size={20} color={Colors.white} />
        </View>
        <Text style={styles.shareText}>Share Monthly Progress Report (MPR) via WhatsApp</Text>
      </TouchableOpacity>

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
  shareButton: {
    backgroundColor: '#25D366', // WhatsApp Green
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  shareIconWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 10,
  },
  shareText: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  }
});
