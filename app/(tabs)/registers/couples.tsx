import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search, UserCheck, Trash2, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import { EligibleCouple } from '@/types';

export default function CouplesScreen() {
  const router = useRouter();
  const { couples, deleteCouple } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return couples;
    const q = search.toLowerCase();
    return couples.filter(
      c => c.husbandName.toLowerCase().includes(q) || c.wifeName.toLowerCase().includes(q)
    );
  }, [couples, search]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Remove this couple record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCouple(id) },
    ]);
  };

  const renderItem = ({ item }: { item: EligibleCouple }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/add-couple', params: { id: item.id } })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatarWrap}>
            <UserCheck size={18} color="#6A1B9A" />
          </View>
          <View>
            <Text style={styles.cardName}>{item.husbandName} & {item.wifeName}</Text>
            <Text style={styles.cardAge}>Ages: {item.husbandAge} / {item.wifeAge} yrs</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.chipRow}>
        {item.familyPlanningMethod && item.familyPlanningMethod !== 'None' && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item.familyPlanningMethod}</Text>
          </View>
        )}
        {item.followUpDate && (
          <View style={[styles.chip, { backgroundColor: Colors.warningLight }]}>
            <Calendar size={12} color="#E65100" />
            <Text style={[styles.chipText, { color: '#E65100' }]}>
              Follow-up: {new Date(item.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search couples..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-couple')}
          activeOpacity={0.7}
        >
          <Plus size={22} color={Colors.white} />
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
            icon={<UserCheck size={48} color={Colors.textMuted} />}
            title="No Couples"
            subtitle="Add eligible couple records for family planning tracking."
            actionLabel="Add Couple"
            onAction={() => router.push('/add-couple')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, alignItems: 'center',
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: Colors.text },
  addButton: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 20, flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatarWrap: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#F3E5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  cardAge: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4,
  },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
});
