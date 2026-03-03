import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save, CheckCircle, Clock, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField } from '@/components/FormField';
import StatusBadge from '@/components/StatusBadge';
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
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [growthNotes, setGrowthNotes] = useState('');
  const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);

  const growthStatus = React.useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || h <= 0) return undefined;
    const bmi = w / ((h / 100) * (h / 100));
    if (bmi < 13) return 'SAM';
    if (bmi >= 13 && bmi < 15) return 'MAM';
    return 'Normal';
  }, [weight, height]);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setFatherName(child.fatherName);
      setMotherName(child.motherName);
      setContactNumber(child.contactNumber);
      setWeight(child.weight || '');
      setHeight(child.height || '');
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
      weight: weight.trim(),
      height: height.trim(),
      growthStatus: growthStatus,
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

      <View style={styles.row}>
        <View style={styles.half}>
          <FormField label="Weight (kg)" value={weight} onChangeText={setWeight} placeholder="e.g. 12.5" keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <FormField label="Height (cm)" value={height} onChangeText={setHeight} placeholder="e.g. 90" keyboardType="numeric" />
        </View>
      </View>

      {growthStatus && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: Colors.textSecondary, marginBottom: 6 }}>Automated Growth Category:</Text>
          <StatusBadge status={growthStatus as any} />
        </View>
      )}

      <FormField label="Growth Notes" value={growthNotes} onChangeText={setGrowthNotes} placeholder="Weight, height, observations..." multiline />

      <Text style={styles.sectionTitle}>Immunization Record</Text>
      <Text style={styles.sectionSubtitle}>Tap a vaccine to mark as given/pending</Text>

      {(() => {
        // Group vaccines by identical due dates
        const grouped: Record<string, VaccineRecord[]> = {};
        vaccines.forEach(v => {
          const dateKey = v.dueDate;
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(v);
        });

        const groupKeys = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        return groupKeys.map((dateStr, index) => {
          const wks = Math.round((new Date(dateStr).getTime() - new Date(child.dateOfBirth).getTime()) / (7 * 24 * 60 * 60 * 1000));
          let groupLabel = 'At Birth';
          if (wks > 0 && wks <= 8) groupLabel = '6 Weeks';
          else if (wks > 8 && wks <= 12) groupLabel = '10 Weeks';
          else if (wks > 12 && wks <= 16) groupLabel = '14 Weeks';
          else if (wks >= 36 && wks <= 52) groupLabel = '9-12 Months';
          else if (wks > 52) groupLabel = '16-24 Months';

          const allGivenInGroup = grouped[dateStr].every(v => v.status === 'given');

          return (
            <View key={dateStr} style={{ marginTop: index > 0 ? 12 : 0 }}>
              <Text style={styles.groupHeader}>{groupLabel} Timeline</Text>
              {grouped[dateStr].map(vaccine => (
                <TouchableOpacity
                  key={vaccine.id}
                  style={[styles.vaccineCard, { borderLeftColor: vaccine.status === 'given' ? Colors.success : vaccine.status === 'overdue' ? Colors.danger : Colors.warning, opacity: allGivenInGroup ? 0.7 : 1 }]}
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
            </View>
          );
        });
      })()}

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
  sectionSubtitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  groupHeader: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5, backgroundColor: Colors.surface, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' },
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
