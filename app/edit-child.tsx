import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save, CheckCircle, Clock, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField } from '@/components/FormField';
import { VaccineRecord } from '@/types';

export default function EditChildScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children, updateChild } = useData();

  const child = children.find(c => c.id === id);

  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [growthNotes, setGrowthNotes] = useState('');
  const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setFatherName(child.fatherName);
      setMotherName(child.motherName);
      setContactNumber(child.contactNumber);
      setGrowthNotes(child.growthNotes);
      setVaccines(child.vaccines);
    }
  }, [child]);

  if (!child) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Child not found</Text>
      </View>
    );
  }

  const toggleVaccine = (vaccineId: string) => {
    setVaccines(prev =>
      prev.map(v => {
        if (v.id !== vaccineId) return v;
        if (v.status === 'given') {
          return { ...v, status: 'pending' as const, givenDate: undefined };
        }
        return { ...v, status: 'given' as const, givenDate: new Date().toISOString().split('T')[0] };
      })
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the child name.');
      return;
    }

    updateChild({
      ...child,
      name: name.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      contactNumber: contactNumber.trim(),
      growthNotes: growthNotes.trim(),
      vaccines,
      updatedAt: new Date().toISOString(),
    });

    router.back();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'given':
        return <CheckCircle size={18} color={Colors.success} />;
      case 'overdue':
        return <AlertTriangle size={18} color={Colors.danger} />;
      default:
        return <Clock size={18} color={Colors.warning} />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'given': return Colors.successLight;
      case 'overdue': return Colors.dangerLight;
      default: return Colors.warningLight;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.headerCard}>
        <Text style={styles.headerName}>{child.name}</Text>
        <Text style={styles.headerDob}>
          DOB: {new Date(child.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <FormField label="Child's Name" value={name} onChangeText={setName} placeholder="Enter name" required />
      <View style={styles.row}>
        <View style={styles.half}>
          <FormField label="Father's Name" value={fatherName} onChangeText={setFatherName} placeholder="Name" />
        </View>
        <View style={styles.half}>
          <FormField label="Mother's Name" value={motherName} onChangeText={setMotherName} placeholder="Name" />
        </View>
      </View>
      <FormField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile" keyboardType="phone-pad" />
      <FormField label="Growth Notes" value={growthNotes} onChangeText={setGrowthNotes} placeholder="Weight, height, observations..." multiline />

      <Text style={styles.sectionTitle}>Immunization Record</Text>
      <Text style={styles.sectionSubtitle}>Tap a vaccine to mark as given/pending</Text>

      {vaccines.map((vaccine) => (
        <TouchableOpacity
          key={vaccine.id}
          style={[styles.vaccineCard, { borderLeftColor: vaccine.status === 'given' ? Colors.success : vaccine.status === 'overdue' ? Colors.danger : Colors.warning }]}
          onPress={() => toggleVaccine(vaccine.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.vaccineStatusIcon, { backgroundColor: getStatusBg(vaccine.status) }]}>
            {getStatusIcon(vaccine.status)}
          </View>
          <View style={styles.vaccineContent}>
            <Text style={[styles.vaccineName, vaccine.status === 'given' && styles.vaccineGiven]}>
              {vaccine.vaccineName}
            </Text>
            <Text style={styles.vaccineDate}>
              Due: {new Date(vaccine.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {vaccine.givenDate && ` | Given: ${new Date(vaccine.givenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
        <Save size={18} color={Colors.white} />
        <Text style={styles.saveText}>Update Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.textSecondary },
  headerCard: {
    backgroundColor: Colors.primary, borderRadius: 14, padding: 16, marginBottom: 16,
  },
  headerName: { fontSize: 18, fontWeight: '700', color: Colors.white },
  headerDob: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 16, marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 12 },
  vaccineCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 10, padding: 12, marginBottom: 6, borderLeftWidth: 3,
    borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  vaccineStatusIcon: {
    width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  vaccineContent: { flex: 1 },
  vaccineName: { fontSize: 14, fontWeight: '500', color: Colors.text },
  vaccineGiven: { textDecorationLine: 'line-through', color: Colors.textMuted },
  vaccineDate: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    marginTop: 16, gap: 8,
  },
  saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
