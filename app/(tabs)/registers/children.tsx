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
import { Plus, Search, Baby, Trash2, Syringe } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import { Child } from '@/types';

export default function ChildrenScreen() {
  const router = useRouter();
  const { children, deleteChild } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return children;
    const q = search.toLowerCase();
    return children.filter(c => c.name.toLowerCase().includes(q) || c.motherName.toLowerCase().includes(q));
  }, [children, search]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Record', `Remove ${name}'s record?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteChild(id) },
    ]);
  };

  const getAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 1) return 'Newborn';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}y ${rem}m` : `${years} years`;
  };

  const renderItem = ({ item }: { item: Child }) => {
    const givenCount = item.vaccines.filter(v => v.status === 'given').length;
    const pendingCount = item.vaccines.filter(v => v.status === 'pending').length;
    const overdueCount = item.vaccines.filter(v => v.status === 'overdue').length;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/edit-child', params: { id: item.id } })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.avatarWrap, { backgroundColor: item.gender === 'male' ? '#E3F2FD' : '#FCE4EC' }]}>
              <Baby size={18} color={item.gender === 'male' ? '#1565C0' : '#C2185B'} />
            </View>
            <View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardAge}>{getAge(item.dateOfBirth)} | {item.gender}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.name)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.parentText}>Mother: {item.motherName}</Text>
        </View>
        <View style={styles.vaccineRow}>
          <View style={styles.vaccineChip}>
            <Syringe size={12} color="#2E7D32" />
            <Text style={[styles.vaccineText, { color: '#2E7D32' }]}>{givenCount} Given</Text>
          </View>
          {pendingCount > 0 && (
            <View style={[styles.vaccineChip, { backgroundColor: Colors.warningLight }]}>
              <Text style={[styles.vaccineText, { color: '#E65100' }]}>{pendingCount} Pending</Text>
            </View>
          )}
          {overdueCount > 0 && (
            <View style={[styles.vaccineChip, { backgroundColor: Colors.dangerLight }]}>
              <Text style={[styles.vaccineText, { color: '#C62828' }]}>{overdueCount} Overdue</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          onPress={() => router.push('/add-child')}
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
            icon={<Baby size={48} color={Colors.textMuted} />}
            title="No Children"
            subtitle="Add child profiles to track immunization records."
            actionLabel="Add Child"
            onAction={() => router.push('/add-child')}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  cardDetails: {
    marginBottom: 8,
  },
  parentText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  vaccineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vaccineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  vaccineText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
