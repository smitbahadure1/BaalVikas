import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { VACCINE_SCHEDULE } from '@/mocks/vaccines';
import { VaccineRecord } from '@/types';

const GENDER_OPTIONS = ['male', 'female'] as const;

export default function AddChildScreen() {
    const router = useRouter();
    const { addChild, households } = useData();

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [growthNotes, setGrowthNotes] = useState('');
    const [householdName, setHouseholdName] = useState('');

    const householdNames = households.map(h => h.headOfFamily);

    const parseDOB = (dobStr: string): Date | null => {
        if (!dobStr || dobStr.length < 10) return null;
        const parts = dobStr.split('/');
        if (parts.length === 3) {
            const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            return isNaN(d.getTime()) ? null : d;
        }
        const d = new Date(dobStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const generateVaccines = (dob: Date): VaccineRecord[] => {
        return VACCINE_SCHEDULE.map((v, idx) => {
            const dueDate = new Date(dob.getTime() + v.dueWeeks * 7 * 24 * 60 * 60 * 1000);
            const today = new Date();
            let status: 'pending' | 'given' | 'overdue' = 'pending';
            if (dueDate < today) status = 'overdue';

            return {
                id: `vax-${idx}-${Date.now()}`,
                vaccineName: v.name,
                dueDate: dueDate.toISOString().split('T')[0],
                status,
            };
        });
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter the child name.');
            return;
        }
        if (!dateOfBirth.trim()) {
            Alert.alert('Required', 'Please enter date of birth (DD/MM/YYYY).');
            return;
        }

        const dob = parseDOB(dateOfBirth);
        if (!dob) {
            Alert.alert('Invalid Date', 'Please enter a valid date (DD/MM/YYYY).');
            return;
        }

        const now = new Date().toISOString();
        const selectedHousehold = households.find(h => h.headOfFamily === householdName);

        addChild({
            id: Date.now().toString(),
            name: name.trim(),
            dateOfBirth: dob.toISOString().split('T')[0],
            gender: (gender || 'male') as 'male' | 'female',
            fatherName: fatherName.trim(),
            motherName: motherName.trim(),
            contactNumber: contactNumber.trim(),
            householdId: selectedHousehold?.id,
            vaccines: generateVaccines(dob),
            growthNotes: growthNotes.trim(),
            createdAt: now,
            updatedAt: now,
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <FormField label="Child's Name" value={name} onChangeText={setName} placeholder="Enter name" required />

            {householdNames.length > 0 && (
                <PickerField
                    label="Link to Household (Optional)"
                    value={householdName}
                    options={householdNames}
                    onSelect={setHouseholdName}
                />
            )}
            <View style={styles.row}>
                <View style={styles.half}>
                    <FormField label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="DD/MM/YYYY" required />
                </View>
                <View style={styles.half}>
                    <PickerField label="Gender" value={gender} options={GENDER_OPTIONS} onSelect={setGender} required />
                </View>
            </View>
            <FormField label="Father's Name" value={fatherName} onChangeText={setFatherName} placeholder="Enter name" />
            <FormField label="Mother's Name" value={motherName} onChangeText={setMotherName} placeholder="Enter name" />
            <FormField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile number" keyboardType="phone-pad" />
            <FormField label="Growth Monitoring Notes" value={growthNotes} onChangeText={setGrowthNotes} placeholder="Weight, height observations..." multiline />

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    Vaccine schedule will be automatically generated based on the date of birth as per India&apos;s Universal Immunization Programme.
                </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveText}>Save Child Record</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 40 },
    row: { flexDirection: 'row', gap: 12 },
    half: { flex: 1 },
    infoCard: {
        backgroundColor: Colors.infoLight, borderRadius: 12, padding: 14, marginBottom: 16,
    },
    infoText: { fontSize: 13, color: '#1565C0', lineHeight: 19 },
    saveButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, gap: 8,
    },
    saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
