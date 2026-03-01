import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { HEALTH_ARTICLES, EDUCATION_CATEGORIES, HealthArticle } from '@/mocks/healthEducation';

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  'Pregnancy Care': { color: '#C62828', bg: '#FFEBEE' },
  'Child Nutrition': { color: '#2E7D32', bg: '#E8F5E9' },
  'Immunization': { color: '#E65100', bg: '#FFF3E0' },
  'Child Health': { color: '#00695C', bg: '#E0F2F1' },
  'Family Planning': { color: '#6A1B9A', bg: '#F3E5F5' },
  'Government Schemes': { color: '#1565C0', bg: '#E3F2FD' },
};

export default function EducationScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = selectedCategory
    ? HEALTH_ARTICLES.filter(a => a.category === selectedCategory)
    : HEALTH_ARTICLES;

  const renderItem = ({ item }: { item: HealthArticle }) => {
    const catColor = CATEGORY_COLORS[item.category] || { color: Colors.textSecondary, bg: Colors.surfaceAlt };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/health-article', params: { id: item.id } })}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryDot, { backgroundColor: catColor.color }]} />
        <View style={styles.cardContent}>
          <View style={[styles.categoryChip, { backgroundColor: catColor.bg }]}>
            <Text style={[styles.categoryText, { color: catColor.color }]}>{item.category}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSummary} numberOfLines={2}>{item.summary}</Text>
        </View>
        <ChevronRight size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
              onPress={() => setSelectedCategory(null)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            {EDUCATION_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16, gap: 10 },
  categoryRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  categoryDot: { width: 4, height: 40, borderRadius: 2 },
  cardContent: { flex: 1, gap: 4 },
  categoryChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  categoryText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  cardSummary: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
});
