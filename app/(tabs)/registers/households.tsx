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
import { Plus, Search, MapPin, Phone, Users, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import EmptyState from '@/components/EmptyState';
import { Household } from '@/types';

export default function HouseholdsScreen() {
  const router = useRouter();
  const { households, deleteHousehold } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return households;
    const q = search.toLowerCase();
    return households.filter(
      h =>
        h.headOfFamily.toLowerCase().includes(q) ||
        h.locality.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
    );
  }, [households, search]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Household', `Remove ${name}'s household record?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHousehold(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Household }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/edit-household', params: { id: item.id } })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatarWrap}>
            <Users size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.cardName}>{item.headOfFamily}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text style={styles.cardLocality}>{item.locality}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.headOfFamily)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Members</Text>
          <Text style={styles.detailValue}>{item.totalMembers}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Male</Text>
          <Text style={styles.detailValue}>{item.maleCount}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Female</Text>
          <Text style={styles.detailValue}>{item.femaleCount}</Text>
        </View>
        {item.contactNumber ? (
          <>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Phone size={12} color={Colors.textMuted} />
              <Text style={styles.detailValue}>{item.contactNumber}</Text>
            </View>
          </>
        ) : null}
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
            placeholder="Search households..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-household')}
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
            icon={<Users size={48} color={Colors.textMuted} />}
            title="No Households"
            subtitle="Start by adding household survey records from your field visits."
            actionLabel="Add Household"
            onAction={() => router.push('/add-household')}
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
    marginBottom: 12,
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
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardLocality: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
});
