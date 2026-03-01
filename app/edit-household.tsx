import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { SOCIO_ECONOMIC_CATEGORIES } from '@/mocks/vaccines';

export default function EditHouseholdScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { households, updateHousehold } = useData();

  const household = households.find(h => h.id === id);

  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [headOfFamily, setHeadOfFamily] = useState('');
  const [totalMembers, setTotalMembers] = useState('');
  const [maleCount, setMaleCount] = useState('');
  const [femaleCount, setFemaleCount] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [category, setCategory] = useState('');
  const [livingConditions, setLivingConditions] = useState('');

  useEffect(() => {
    if (household) {
      setAddress(household.address);
      setLocality(household.locality);
      setHeadOfFamily(household.headOfFamily);
      setTotalMembers(String(household.totalMembers));
      setMaleCount(String(household.maleCount));
      setFemaleCount(String(household.femaleCount));
      setContactNumber(household.contactNumber);
      setCategory(household.socioEconomicCategory);
      setLivingConditions(household.livingConditions);
    }
  }, [household]);

  if (!household) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Household not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!headOfFamily.trim()) {
      Alert.alert('Required', 'Please enter head of family name.');
      return;
    }

    updateHousehold({
      ...household,
      address: address.trim(),
      locality: locality.trim(),
      headOfFamily: headOfFamily.trim(),
      totalMembers: parseInt(totalMembers) || 0,
      maleCount: parseInt(maleCount) || 0,
      femaleCount: parseInt(femaleCount) || 0,
      contactNumber: contactNumber.trim(),
      socioEconomicCategory: category,
      livingConditions: livingConditions.trim(),
      updatedAt: new Date().toISOString(),
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
        <Text style={styles.saveText}>Update Household</Text>
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.textSecondary },
});
