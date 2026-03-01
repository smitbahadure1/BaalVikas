import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, SwitchField, PickerField } from '@/components/FormField';

export default function AddPregnantScreen() {
    const router = useRouter();
    const { addPregnantWoman, households } = useData();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [lmpDate, setLmpDate] = useState('');
    const [isHighRisk, setIsHighRisk] = useState(false);
    const [highRiskReason, setHighRiskReason] = useState('');
    const [householdName, setHouseholdName] = useState('');

    const householdNames = households.map(h => h.headOfFamily);

    const eddAndTrimester = useMemo(() => {
        if (!lmpDate || lmpDate.length < 10) return { edd: '', trimester: 1 as const };
        try {
            const parts = lmpDate.split('/');
            let lmp: Date;
            if (parts.length === 3) {
                lmp = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
                lmp = new Date(lmpDate);
            }
            if (isNaN(lmp.getTime())) return { edd: '', trimester: 1 as const };

            const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
            const weeks = Math.floor((Date.now() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000));
            let trimester: 1 | 2 | 3 = 1;
            if (weeks >= 28) trimester = 3;
            else if (weeks >= 13) trimester = 2;

            return {
                edd: edd.toISOString().split('T')[0],
                trimester,
            };
        } catch {
            return { edd: '', trimester: 1 as const };
        }
    }, [lmpDate]);

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter the name.');
            return;
        }
        if (!lmpDate.trim()) {
            Alert.alert('Required', 'Please enter the LMP date (DD/MM/YYYY).');
            return;
        }

        const now = new Date().toISOString();
        const selectedHousehold = households.find(h => h.headOfFamily === householdName);

        addPregnantWoman({
            id: Date.now().toString(),
            householdId: selectedHousehold?.id,
            name: name.trim(),
            age: parseInt(age) || 0,
            contactNumber: contactNumber.trim(),
            lmpDate: lmpDate.trim(),
            expectedDeliveryDate: eddAndTrimester.edd || now,
            trimester: eddAndTrimester.trimester,
            isHighRisk,
            highRiskReason: highRiskReason.trim(),
            ancVisits: [],
            postnatalVisits: [],
            status: 'active',
            createdAt: now,
            updatedAt: now,
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Enter name" required />

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
                    <FormField label="Age" value={age} onChangeText={setAge} placeholder="Years" keyboardType="numeric" />
                </View>
                <View style={styles.half}>
                    <FormField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Mobile" keyboardType="phone-pad" />
                </View>
            </View>
            <FormField label="LMP Date" value={lmpDate} onChangeText={setLmpDate} placeholder="DD/MM/YYYY" required />

            {eddAndTrimester.edd ? (
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Expected Delivery Date</Text>
                        <Text style={styles.infoValue}>
                            {new Date(eddAndTrimester.edd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Current Trimester</Text>
                        <Text style={styles.infoValue}>Trimester {eddAndTrimester.trimester}</Text>
                    </View>
                </View>
            ) : null}

            <SwitchField label="High Risk Pregnancy" value={isHighRisk} onToggle={setIsHighRisk} />
            {isHighRisk && (
                <FormField label="High Risk Reason" value={highRiskReason} onChangeText={setHighRiskReason} placeholder="Describe the risk factors..." multiline />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveText}>Save Record</Text>
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
        backgroundColor: Colors.primaryFaded, borderRadius: 12, padding: 14, marginBottom: 16, gap: 8,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoLabel: { fontSize: 13, color: Colors.textSecondary },
    infoValue: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
    saveButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
        marginTop: 8, gap: 8,
    },
    saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
