import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'due' | 'overdue' | 'active' | 'delivered' | 'closed' | 'given' | 'high-risk' | 'Normal' | 'MAM' | 'SAM';
  label?: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: Colors.warningLight, text: '#E65100', label: 'Pending' },
  completed: { bg: Colors.successLight, text: '#2E7D32', label: 'Completed' },
  due: { bg: Colors.infoLight, text: '#1565C0', label: 'Due' },
  overdue: { bg: Colors.dangerLight, text: '#C62828', label: 'Overdue' },
  active: { bg: Colors.primaryFaded, text: Colors.primaryDark, label: 'Active' },
  delivered: { bg: Colors.successLight, text: '#2E7D32', label: 'Delivered' },
  closed: { bg: '#ECEFF1', text: '#546E7A', label: 'Closed' },
  given: { bg: Colors.successLight, text: '#2E7D32', label: 'Given' },
  'high-risk': { bg: Colors.dangerLight, text: '#C62828', label: 'High Risk' },
  Normal: { bg: Colors.successLight, text: '#2E7D32', label: 'Normal' },
  MAM: { bg: Colors.warningLight, text: '#E65100', label: 'MAM' },
  SAM: { bg: Colors.dangerLight, text: '#C62828', label: 'SAM' },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>
        {label ?? config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  text: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
});
