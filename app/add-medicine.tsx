import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/providers/DataProvider';
import { FormField, PickerField } from '@/components/FormField';
import { MEDICINE_LIST } from '@/mocks/vaccines';

export default function AddMedicineScreen() {
    const router = useRouter();
    const { addMedicine, households, pregnantWomen, children, couples } = useData();

    const [medicineName, setMedicineName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [remainingStock, setRemainingStock] = useState('');

    const potentialBeneficiaries = Array.from(new Set([
        ...households.map(h => h.headOfFamily),
        ...pregnantWomen.map(w => w.name),
        ...children.map(c => c.name),
        ...couples.map(c => c.wifeName)
    ])).filter(Boolean);

    const handleSave = () => {
        if (!medicineName) {
            Alert.alert('Required', 'Please select a medicine.');
            return;
        }
        if (!beneficiaryName.trim()) {
            Alert.alert('Required', 'Please enter beneficiary name.');
            return;
        }

        addMedicine({
            id: Date.now().toString(),
            medicineName,
            quantity: parseInt(quantity) || 0,
            beneficiaryName: beneficiaryName.trim(),
            date: new Date().toISOString().split('T')[0],
            remainingStock: remainingStock.trim(),
            createdAt: new Date().toISOString(),
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <PickerField label="Medicine / Supply" value={medicineName} options={MEDICINE_LIST} onSelect={setMedicineName} required />
            <FormField label="Quantity Distributed" value={quantity} onChangeText={setQuantity} placeholder="Number of units" keyboardType="numeric" required />

            {potentialBeneficiaries.length > 0 ? (
                <PickerField
                    label="Beneficiary Name"
                    value={beneficiaryName}
                    options={potentialBeneficiaries}
                    onSelect={setBeneficiaryName}
                    required
                />
            ) : (
                <FormField label="Beneficiary Name" value={beneficiaryName} onChangeText={setBeneficiaryName} placeholder="Who received it" required />
            )}

            <FormField label="Remaining Stock" value={remainingStock} onChangeText={setRemainingStock} placeholder="Units remaining (optional)" />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveText}>Save Distribution</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 40 },
    saveButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
        marginTop: 8, gap: 8,
    },
    saveText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
