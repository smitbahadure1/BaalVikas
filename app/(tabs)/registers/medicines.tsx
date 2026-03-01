import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Pill, Trash2, Package } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import { MedicineDistribution } from '@/types';

export default function MedicinesScreen() {
  const router = useRouter();
  const { medicines, deleteMedicine } = useData();

  const sorted = useMemo(() => {
    return [...medicines].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [medicines]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Remove this distribution record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMedicine(id) },
    ]);
  };

  const renderItem = ({ item }: { item: MedicineDistribution }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatarWrap}>
            <Pill size={18} color="#00695C" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.medicineName}</Text>
            <Text style={styles.cardBeneficiary}>To: {item.beneficiaryName}</Text>
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
        <View style={styles.chip}>
          <Package size={12} color={Colors.textSecondary} />
          <Text style={styles.chipText}>Qty: {item.quantity}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        {item.remainingStock ? (
          <View style={[styles.chip, { backgroundColor: Colors.warningLight }]}>
            <Text style={[styles.chipText, { color: '#E65100' }]}>Stock: {item.remainingStock}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{medicines.length} distribution records</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-medicine')}
          activeOpacity={0.7}
        >
          <Plus size={18} color={Colors.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<Pill size={48} color={Colors.textMuted} />}
            title="No Records"
            subtitle="Track medicine and supply distribution to beneficiaries."
            actionLabel="Add Distribution"
            onAction={() => router.push('/add-medicine')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerText: { fontSize: 14, color: Colors.textSecondary },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4,
  },
  addButtonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
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
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#E0F2F1',
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  cardBeneficiary: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4,
  },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
});
