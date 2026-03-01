import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { FAMILY_PLANNING_METHODS } from '@/mocks/vaccines';

export default function AddCoupleScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { couples, addCouple, updateCouple, households } = useData();

    const existing = id ? couples.find(c => c.id === id) : null;
    const isEditing = !!existing;

    const [husbandName, setHusbandName] = useState('');
    const [wifeName, setWifeName] = useState('');
    const [husbandAge, setHusbandAge] = useState('');
    const [wifeAge, setWifeAge] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [method, setMethod] = useState('');
    const [counselingNotes, setCounselingNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [householdName, setHouseholdName] = useState('');

    const householdNames = households.map(h => h.headOfFamily);

    useEffect(() => {
        if (existing) {
            setHusbandName(existing.husbandName);
            setWifeName(existing.wifeName);
            setHusbandAge(String(existing.husbandAge));
            setWifeAge(String(existing.wifeAge));
            setContactNumber(existing.contactNumber);
            setMethod(existing.familyPlanningMethod);
            setCounselingNotes(existing.counselingNotes);
            setFollowUpDate(existing.followUpDate || '');
            if (existing.householdId) {
                const h = households.find(h => h.id === existing.householdId);
                if (h) setHouseholdName(h.headOfFamily);
            }
        }
    }, [existing]);

    const handleSave = () => {
        if (!husbandName.trim() || !wifeName.trim()) {
            Alert.alert('Required', 'Please enter both names.');
            return;
        }

        const now = new Date().toISOString();
        const selectedHousehold = households.find(h => h.headOfFamily === householdName);
        const data = {
            id: existing?.id || Date.now().toString(),
            householdId: selectedHousehold?.id,
            husbandName: husbandName.trim(),
            wifeName: wifeName.trim(),
            husbandAge: parseInt(husbandAge) || 0,
            wifeAge: parseInt(wifeAge) || 0,
            contactNumber: contactNumber.trim(),
            familyPlanningMethod: method,
            counselingNotes: counselingNotes.trim(),
            followUpDate: followUpDate.trim() || undefined,
            createdAt: existing?.createdAt || now,
            updatedAt: now,
        };

        if (isEditing) {
            updateCouple(data);
        } else {
            addCouple(data);
        }

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <FormField label="Husband's Name" value={husbandName} onChangeText={setHusbandName} placeholder="Enter name" required />
            <FormField label="Wife's Name" value={wifeName} onChangeText={setWifeName} placeholder="Enter name" required />

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
                    <FormField label="Husband's Age" value={husbandAge} onChangeText={setHusbandAge} placeholder="Age" keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                    <FormField label="Wife's Age" value={wifeAge} onChangeText={setWifeAge} placeholder="Age" keyboardType="numeric" />
                </View>
            </View>
            <FormField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile" keyboardType="phone-pad" />
            <PickerField label="Family Planning Method" value={method} options={FAMILY_PLANNING_METHODS} onSelect={setMethod} />
            <FormField label="Counseling Notes" value={counselingNotes} onChangeText={setCounselingNotes} placeholder="Session details, advice given..." multiline />
            <FormField label="Follow-up Date" value={followUpDate} onChangeText={setFollowUpDate} placeholder="DD/MM/YYYY (optional)" />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveText}>{isEditing ? 'Update Record' : 'Save Record'}</Text>
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
