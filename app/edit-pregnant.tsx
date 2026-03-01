import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save, Plus, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, SwitchField, PickerField } from '@/components/FormField';
import StatusBadge from '@/components/StatusBadge';
import { ANCVisit } from '@/types';

const STATUS_OPTIONS = ['active', 'delivered', 'closed'] as const;

export default function EditPregnantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pregnantWomen, updatePregnantWoman } = useData();

  const woman = pregnantWomen.find(w => w.id === id);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [lmpDate, setLmpDate] = useState('');
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [highRiskReason, setHighRiskReason] = useState('');
  const [status, setStatus] = useState('active');
  const [deliveryOutcome, setDeliveryOutcome] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [ancVisits, setAncVisits] = useState<ANCVisit[]>([]);
  const [newVisitNotes, setNewVisitNotes] = useState('');
  const [newVisitBP, setNewVisitBP] = useState('');
  const [newVisitWeight, setNewVisitWeight] = useState('');

  useEffect(() => {
    if (woman) {
      setName(woman.name);
      setAge(String(woman.age));
      setContactNumber(woman.contactNumber);
      setLmpDate(woman.lmpDate);
      setIsHighRisk(woman.isHighRisk);
      setHighRiskReason(woman.highRiskReason);
      setStatus(woman.status);
      setDeliveryOutcome(woman.deliveryOutcome || '');
      setDeliveryDate(woman.deliveryDate || '');
      setAncVisits(woman.ancVisits);
    }
  }, [woman]);

  if (!woman) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Record not found</Text>
      </View>
    );
  }

  const addANCVisit = () => {
    const newVisit: ANCVisit = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      visitNumber: ancVisits.length + 1,
      weight: newVisitWeight.trim() || undefined,
      bp: newVisitBP.trim() || undefined,
      notes: newVisitNotes.trim(),
    };
    setAncVisits([...ancVisits, newVisit]);
    setNewVisitNotes('');
    setNewVisitBP('');
    setNewVisitWeight('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the name.');
      return;
    }

    updatePregnantWoman({
      ...woman,
      name: name.trim(),
      age: parseInt(age) || 0,
      contactNumber: contactNumber.trim(),
      lmpDate: lmpDate.trim(),
      isHighRisk,
      highRiskReason: highRiskReason.trim(),
      status: status as 'active' | 'delivered' | 'closed',
      deliveryOutcome: deliveryOutcome.trim() || undefined,
      deliveryDate: deliveryDate.trim() || undefined,
      ancVisits,
      updatedAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Enter name" required />
      <View style={styles.row}>
        <View style={styles.half}>
          <FormField label="Age" value={age} onChangeText={setAge} placeholder="Years" keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <FormField label="Contact" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile" keyboardType="phone-pad" />
        </View>
      </View>
      <FormField label="LMP Date" value={lmpDate} onChangeText={setLmpDate} placeholder="DD/MM/YYYY" />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Expected Delivery</Text>
        <Text style={styles.infoValue}>
          {new Date(woman.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        <Text style={styles.infoTrimester}>Trimester {woman.trimester}</Text>
      </View>

      <PickerField label="Status" value={status} options={STATUS_OPTIONS} onSelect={setStatus} />

      {status === 'delivered' && (
        <>
          <FormField label="Delivery Date" value={deliveryDate} onChangeText={setDeliveryDate} placeholder="DD/MM/YYYY" />
          <FormField label="Delivery Outcome" value={deliveryOutcome} onChangeText={setDeliveryOutcome} placeholder="Normal / Cesarean / Complications..." />
        </>
      )}

      <SwitchField label="High Risk Pregnancy" value={isHighRisk} onToggle={setIsHighRisk} />
      {isHighRisk && (
        <FormField label="High Risk Reason" value={highRiskReason} onChangeText={setHighRiskReason} placeholder="Risk factors..." multiline />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ANC Visits ({ancVisits.length})</Text>
      </View>

      {ancVisits.map((visit) => (
        <View key={visit.id} style={styles.visitCard}>
          <View style={styles.visitHeader}>
            <Calendar size={14} color={Colors.primary} />
            <Text style={styles.visitDate}>Visit {visit.visitNumber} - {visit.date}</Text>
          </View>
          {visit.bp && <Text style={styles.visitDetail}>BP: {visit.bp}</Text>}
          {visit.weight && <Text style={styles.visitDetail}>Weight: {visit.weight}</Text>}
          {visit.notes ? <Text style={styles.visitNotes}>{visit.notes}</Text> : null}
        </View>
      ))}

      <View style={styles.addVisitSection}>
        <Text style={styles.addVisitTitle}>Add ANC Visit</Text>
        <View style={styles.row}>
          <View style={styles.half}>
            <FormField label="BP" value={newVisitBP} onChangeText={setNewVisitBP} placeholder="120/80" />
          </View>
          <View style={styles.half}>
            <FormField label="Weight (kg)" value={newVisitWeight} onChangeText={setNewVisitWeight} placeholder="55" keyboardType="numeric" />
          </View>
        </View>
        <FormField label="Notes" value={newVisitNotes} onChangeText={setNewVisitNotes} placeholder="Visit observations..." multiline />
        <TouchableOpacity style={styles.addVisitButton} onPress={addANCVisit} activeOpacity={0.7}>
          <Plus size={16} color={Colors.primary} />
          <Text style={styles.addVisitText}>Add Visit Record</Text>
        </TouchableOpacity>
      </View>

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
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  infoCard: {
    backgroundColor: Colors.primaryFaded, borderRadius: 12, padding: 14, marginBottom: 16,
  },
  infoTitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '600', color: Colors.primaryDark },
  infoTrimester: { fontSize: 13, color: Colors.primary, marginTop: 4, fontWeight: '500' },
  sectionHeader: { marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },
  visitCard: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  visitHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  visitDate: { fontSize: 13, fontWeight: '600', color: Colors.text },
  visitDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  visitNotes: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  addVisitSection: {
    backgroundColor: Colors.surfaceAlt, borderRadius: 14, padding: 14, marginTop: 8, marginBottom: 16,
  },
  addVisitTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 10 },
  addVisitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary, borderRadius: 10,
    paddingVertical: 10, gap: 6, borderStyle: 'dashed',
  },
  addVisitText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, gap: 8,
  },
  saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
