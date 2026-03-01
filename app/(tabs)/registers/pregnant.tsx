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
import { Plus, Search, Heart, Trash2, AlertTriangle, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { PregnantWoman } from '@/types';

export default function PregnantScreen() {
  const router = useRouter();
  const { pregnantWomen, deletePregnantWoman } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return pregnantWomen;
    const q = search.toLowerCase();
    return pregnantWomen.filter(w => w.name.toLowerCase().includes(q));
  }, [pregnantWomen, search]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Record', `Remove ${name}'s record?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePregnantWoman(id) },
    ]);
  };

  const getTrimesterLabel = (trimester: number) => {
    switch (trimester) {
      case 1: return '1st Trimester';
      case 2: return '2nd Trimester';
      case 3: return '3rd Trimester';
      default: return '';
    }
  };

  const renderItem = ({ item }: { item: PregnantWoman }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/edit-pregnant', params: { id: item.id } })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.avatarWrap, item.isHighRisk && styles.highRiskAvatar]}>
            <Heart size={18} color={item.isHighRisk ? '#C62828' : Colors.primary} />
          </View>
          <View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardAge}>Age: {item.age} yrs</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          {item.isHighRisk && <StatusBadge status="high-risk" />}
          <StatusBadge status={item.status} />
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.name)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.detailChip}>
          <Calendar size={12} color={Colors.textSecondary} />
          <Text style={styles.chipText}>EDD: {new Date(item.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.chipText}>{getTrimesterLabel(item.trimester)}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.chipText}>ANC: {item.ancVisits.length} visits</Text>
        </View>
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
            placeholder="Search by name..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-pregnant')}
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
            icon={<Heart size={48} color={Colors.textMuted} />}
            title="No Records"
            subtitle="Add pregnant women records for antenatal care tracking."
            actionLabel="Add Record"
            onAction={() => router.push('/add-pregnant')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highRiskAvatar: {
    backgroundColor: '#FFEBEE',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  cardAge: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
