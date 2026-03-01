import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { HEALTH_ARTICLES } from '@/mocks/healthEducation';

export default function HealthArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = HEALTH_ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.summary}>{article.summary}</Text>
      </View>

      <View style={styles.contentCard}>
        {article.content.split('\n').map((paragraph, idx) => (
          <Text key={idx} style={[styles.paragraph, paragraph.startsWith('-') && styles.listItem]}>
            {paragraph}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <BookOpen size={16} color={Colors.textMuted} />
        <Text style={styles.footerText}>
          Reference material for community health counseling
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.textSecondary },
  header: {
    backgroundColor: Colors.primary, padding: 20, paddingTop: 8,
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10,
  },
  categoryText: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  summary: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },
  contentCard: {
    backgroundColor: Colors.surface, margin: 16, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  paragraph: {
    fontSize: 15, color: Colors.text, lineHeight: 24, marginBottom: 8,
  },
  listItem: {
    paddingLeft: 8, color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16,
  },
  footerText: { fontSize: 12, color: Colors.textMuted },
});
