import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  ClipboardList,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { DailyVisit } from '@/types';

export default function VisitsScreen() {
  const router = useRouter();
  const { visits, deleteVisit, updateVisit } = useData();
  const [filter, setFilter] = useState<'all' | 'today' | 'pending'>('today');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filtered = useMemo(() => {
    let list = [...visits].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

    switch (filter) {
      case 'today':
        return list.filter(v => v.date === today);
      case 'pending':
        return list.filter(v => !v.isCompleted);
      default:
        return list;
    }
  }, [visits, filter, today]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Visit', 'Remove this visit record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteVisit(id) },
    ]);
  };

  const toggleComplete = (visit: DailyVisit) => {
    updateVisit({ ...visit, isCompleted: !visit.isCompleted });
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'ANC': return { bg: '#FFEBEE', text: '#C62828' };
      case 'Vaccination': return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'Counseling': return { bg: '#E3F2FD', text: '#1565C0' };
      case 'Follow-up': return { bg: '#FFF3E0', text: '#E65100' };
      case 'Survey': return { bg: '#F3E5F5', text: '#6A1B9A' };
      case 'Medicine Distribution': return { bg: '#E0F2F1', text: '#00695C' };
      default: return { bg: Colors.surfaceAlt, text: Colors.textSecondary };
    }
  };

  const filters = [
    { key: 'today' as const, label: 'Today' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'all' as const, label: 'All' },
  ];

  const renderItem = ({ item }: { item: DailyVisit }) => {
    const purposeColor = getPurposeColor(item.purpose);

    return (
      <View style={[styles.card, item.isCompleted && styles.completedCard]}>
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={[styles.checkButton, item.isCompleted && styles.checkedButton]}
            onPress={() => toggleComplete(item)}
            activeOpacity={0.7}
          >
            {item.isCompleted ? (
              <CheckCircle size={22} color={Colors.success} />
            ) : (
              <View style={styles.uncheckedCircle} />
            )}
          </TouchableOpacity>
          <View style={styles.cardContent}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.purposeChip, { backgroundColor: purposeColor.bg }]}>
                <Text style={[styles.purposeText, { color: purposeColor.text }]}>{item.purpose}</Text>
              </View>
              <StatusBadge status={item.isCompleted ? 'completed' : 'pending'} />
            </View>
            {item.householdName && (
              <View style={styles.locationRow}>
                <MapPin size={12} color={Colors.textMuted} />
                <Text style={styles.householdText}>{item.householdName}</Text>
              </View>
            )}
            {item.notes ? <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text> : null}
            <View style={styles.timeRow}>
              <Clock size={12} color={Colors.textMuted} />
              <Text style={styles.timeText}>
                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {item.time}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-visit')}
          activeOpacity={0.7}
        >
          <Plus size={18} color={Colors.white} />
          <Text style={styles.addButtonText}>New Visit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<ClipboardList size={48} color={Colors.textMuted} />}
            title="No Visits"
            subtitle={filter === 'today' ? "No visits recorded today. Start adding your field visits." : "No matching visits found."}
            actionLabel="New Visit"
            onAction={() => router.push('/add-visit')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  filterRow: { flexDirection: 'row', gap: 6, flex: 1 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4,
  },
  addButtonText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20, flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  completedCard: { opacity: 0.75 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkButton: { paddingTop: 2 },
  checkedButton: {},
  uncheckedCircle: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border,
  },
  cardContent: { flex: 1, gap: 6 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  purposeChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  purposeText: { fontSize: 12, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  householdText: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  notesText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, color: Colors.textMuted },
});
