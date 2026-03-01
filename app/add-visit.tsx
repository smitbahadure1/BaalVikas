import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { VISIT_PURPOSES } from '@/mocks/vaccines';

export default function AddVisitScreen() {
    const router = useRouter();
    const { addVisit, households, pregnantWomen, children, couples } = useData();

    const [purpose, setPurpose] = useState('');
    const [householdName, setHouseholdName] = useState('');
    const [notes, setNotes] = useState('');

    const potentialBeneficiaries = Array.from(new Set([
        ...households.map(h => h.headOfFamily),
        ...pregnantWomen.map(w => w.name),
        ...children.map(c => c.name),
        ...couples.map(c => c.wifeName)
    ])).filter(Boolean);

    const handleSave = () => {
        if (!purpose) {
            Alert.alert('Required', 'Please select a visit purpose.');
            return;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        addVisit({
            id: Date.now().toString(),
            householdName: householdName || undefined,
            householdId: households.find(h => h.headOfFamily === householdName)?.id,
            date: now.toISOString().split('T')[0],
            time: timeStr,
            purpose: purpose as 'ANC' | 'Vaccination' | 'Counseling' | 'Follow-up' | 'Survey' | 'Medicine Distribution' | 'Other',
            notes: notes.trim(),
            isCompleted: false,
            createdAt: now.toISOString(),
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <PickerField label="Purpose of Visit" value={purpose} options={VISIT_PURPOSES} onSelect={setPurpose} required />

            {potentialBeneficiaries.length > 0 ? (
                <PickerField
                    label="Household / Beneficiary Name"
                    value={householdName}
                    options={potentialBeneficiaries}
                    onSelect={setHouseholdName}
                />
            ) : (
                <FormField
                    label="Household / Beneficiary Name"
                    value={householdName}
                    onChangeText={setHouseholdName}
                    placeholder="Enter name (optional)"
                />
            )}

            <FormField label="Visit Notes" value={notes} onChangeText={setNotes} placeholder="Observations, details..." multiline />

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    Date and time will be recorded automatically. You can mark the visit as completed later from the Visit Diary.
                </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveText}>Record Visit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 40 },
    infoCard: {
        backgroundColor: Colors.primaryFaded, borderRadius: 12, padding: 14, marginBottom: 16,
    },
    infoText: { fontSize: 13, color: Colors.primaryDark, lineHeight: 19 },
    saveButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, gap: 8,
    },
    saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
