import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Heart, Syringe, Calendar, AlertTriangle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';

export default function RemindersScreen() {
  const router = useRouter();
  const { activePregnantWomen, upcomingVaccinations, visits } = useData();

  const ancDue = useMemo(() => {
    return activePregnantWomen.filter(w => {
      const lastVisit = w.ancVisits[w.ancVisits.length - 1];
      if (!lastVisit) return true;
      const daysSince = (Date.now() - new Date(lastVisit.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 28;
    });
  }, [activePregnantWomen]);

  const pendingFollowUps = useMemo(() => {
    return visits.filter(v => !v.isCompleted && v.purpose === 'Follow-up');
  }, [visits]);

  const highRisk = useMemo(() => {
    return activePregnantWomen.filter(w => w.isHighRisk);
  }, [activePregnantWomen]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {highRisk.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={18} color="#C62828" />
            <Text style={styles.sectionTitle}>High Risk Pregnancies</Text>
            <View style={[styles.countBadge, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.countText, { color: '#C62828' }]}>{highRisk.length}</Text>
            </View>
          </View>
          {highRisk.map(w => (
            <TouchableOpacity
              key={w.id}
              style={styles.reminderCard}
              onPress={() => router.push({ pathname: '/edit-pregnant', params: { id: w.id } })}
              activeOpacity={0.7}
            >
              <View style={[styles.reminderDot, { backgroundColor: '#C62828' }]} />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderName}>{w.name}</Text>
                <Text style={styles.reminderDetail}>
                  {w.highRiskReason || 'Requires close monitoring'}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart size={18} color="#C62828" />
          <Text style={styles.sectionTitle}>ANC Visits Due</Text>
          <View style={[styles.countBadge, { backgroundColor: '#FFEBEE' }]}>
            <Text style={[styles.countText, { color: '#C62828' }]}>{ancDue.length}</Text>
          </View>
        </View>
        {ancDue.length === 0 ? (
          <Text style={styles.emptyText}>All ANC visits are up to date</Text>
        ) : (
          ancDue.map(w => (
            <TouchableOpacity
              key={w.id}
              style={styles.reminderCard}
              onPress={() => router.push({ pathname: '/edit-pregnant', params: { id: w.id } })}
              activeOpacity={0.7}
            >
              <View style={[styles.reminderDot, { backgroundColor: '#E65100' }]} />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderName}>{w.name}</Text>
                <Text style={styles.reminderDetail}>
                  Trimester {w.trimester} | {w.ancVisits.length} ANC visits completed
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Syringe size={18} color="#E65100" />
          <Text style={styles.sectionTitle}>Vaccines Due (7 days)</Text>
          <View style={[styles.countBadge, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.countText, { color: '#E65100' }]}>{upcomingVaccinations.length}</Text>
          </View>
        </View>
        {upcomingVaccinations.length === 0 ? (
          <Text style={styles.emptyText}>No vaccines due this week</Text>
        ) : (
          upcomingVaccinations.map((item, idx) => (
            <TouchableOpacity
              key={`${item.child.id}-${idx}`}
              style={styles.reminderCard}
              onPress={() => router.push({ pathname: '/edit-child', params: { id: item.child.id } })}
              activeOpacity={0.7}
            >
              <View style={[styles.reminderDot, { backgroundColor: '#FFA726' }]} />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderName}>{item.child.name}</Text>
                <Text style={styles.reminderDetail}>
                  {item.vaccine} | Due: {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={18} color="#1565C0" />
          <Text style={styles.sectionTitle}>Pending Follow-ups</Text>
          <View style={[styles.countBadge, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.countText, { color: '#1565C0' }]}>{pendingFollowUps.length}</Text>
          </View>
        </View>
        {pendingFollowUps.length === 0 ? (
          <Text style={styles.emptyText}>No pending follow-ups</Text>
        ) : (
          pendingFollowUps.slice(0, 10).map(v => (
            <View key={v.id} style={styles.reminderCard}>
              <View style={[styles.reminderDot, { backgroundColor: '#42A5F5' }]} />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderName}>{v.householdName || 'Visit'}</Text>
                <Text style={styles.reminderDetail}>
                  {v.purpose} | {new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16 },
  section: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, flex: 1 },
  countBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  countText: { fontSize: 13, fontWeight: '700' },
  reminderCard: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, gap: 10,
  },
  reminderDot: { width: 8, height: 8, borderRadius: 4 },
  reminderContent: { flex: 1 },
  reminderName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  reminderDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  emptyText: {
    fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', paddingTop: 4,
  },
});
