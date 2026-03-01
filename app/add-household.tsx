import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { SOCIO_ECONOMIC_CATEGORIES } from '@/mocks/vaccines';

export default function AddHouseholdScreen() {
  const router = useRouter();
  const { addHousehold } = useData();

  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [headOfFamily, setHeadOfFamily] = useState('');
  const [totalMembers, setTotalMembers] = useState('');
  const [maleCount, setMaleCount] = useState('');
  const [femaleCount, setFemaleCount] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [category, setCategory] = useState('');
  const [livingConditions, setLivingConditions] = useState('');

  const handleSave = () => {
    if (!headOfFamily.trim()) {
      Alert.alert('Required', 'Please enter head of family name.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Required', 'Please enter the address.');
      return;
    }

    const now = new Date().toISOString();
    addHousehold({
      id: Date.now().toString(),
      address: address.trim(),
      locality: locality.trim(),
      headOfFamily: headOfFamily.trim(),
      totalMembers: parseInt(totalMembers) || 0,
      maleCount: parseInt(maleCount) || 0,
      femaleCount: parseInt(femaleCount) || 0,
      contactNumber: contactNumber.trim(),
      socioEconomicCategory: category,
      livingConditions: livingConditions.trim(),
      createdAt: now,
      updatedAt: now,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <FormField label="Head of Family" value={headOfFamily} onChangeText={setHeadOfFamily} placeholder="Enter name" required />
      <FormField label="Address" value={address} onChangeText={setAddress} placeholder="House no, street" required />
      <FormField label="Locality / Area" value={locality} onChangeText={setLocality} placeholder="Ward, area name" />
      <FormField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile number" keyboardType="phone-pad" />
      <View style={styles.row}>
        <View style={styles.half}>
          <FormField label="Total Members" value={totalMembers} onChangeText={setTotalMembers} placeholder="0" keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <FormField label="Male Count" value={maleCount} onChangeText={setMaleCount} placeholder="0" keyboardType="numeric" />
        </View>
      </View>
      <FormField label="Female Count" value={femaleCount} onChangeText={setFemaleCount} placeholder="0" keyboardType="numeric" />
      <PickerField label="Socio-Economic Category" value={category} options={SOCIO_ECONOMIC_CATEGORIES} onSelect={setCategory} />
      <FormField label="Living Conditions Notes" value={livingConditions} onChangeText={setLivingConditions} placeholder="Any relevant notes..." multiline />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
        <Save size={18} color={Colors.white} />
        <Text style={styles.saveText}>Save Household</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    marginTop: 8, gap: 8,
  },
  saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
