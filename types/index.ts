export interface Household {
    id: string;
    address: string;
    locality: string;
    headOfFamily: string;
    totalMembers: number;
    maleCount: number;
    femaleCount: number;
    contactNumber: string;
    socioEconomicCategory: string;
    livingConditions: string;
    createdAt: string;
    updatedAt: string;
}

export interface PregnantWoman {
    id: string;
    name: string;
    age: number;
    householdId?: string;
    contactNumber: string;
    lmpDate: string;
    expectedDeliveryDate: string;
    trimester: 1 | 2 | 3;
    isHighRisk: boolean;
    highRiskReason: string;
    ancVisits: ANCVisit[];
    deliveryOutcome?: string;
    deliveryDate?: string;
    postnatalVisits: PostnatalVisit[];
    status: 'active' | 'delivered' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface ANCVisit {
    id: string;
    date: string;
    visitNumber: number;
    weight?: string;
    bp?: string;
    notes: string;
}

export interface PostnatalVisit {
    id: string;
    date: string;
    visitNumber: number;
    notes: string;
}

export interface Child {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    fatherName: string;
    motherName: string;
    contactNumber: string;
    householdId?: string;
    vaccines: VaccineRecord[];
    growthNotes: string;
    weight?: string;
    height?: string;
    growthStatus?: 'Normal' | 'MAM' | 'SAM';
    createdAt: string;
    updatedAt: string;
}

export interface VaccineRecord {
    id: string;
    vaccineName: string;
    dueDate: string;
    givenDate?: string;
    status: 'pending' | 'given' | 'overdue';
}

export interface DailyVisit {
    id: string;
    householdId?: string;
    householdName?: string;
    date: string;
    time: string;
    purpose: 'Home Visit' | 'Counseling' | 'Growth Check' | 'Distribution' | 'ANC' | 'Vaccination' | 'Follow-up' | 'Survey' | 'Medicine Distribution' | 'Other';
    notes: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface MedicineDistribution {
    id: string;
    medicineName: string;
    quantity: number;
    beneficiaryName: string;
    date: string;
    remainingStock: string;
    createdAt: string;
}

export interface EligibleCouple {
    id: string;
    householdId?: string;
    husbandName: string;
    wifeName: string;
    husbandAge: number;
    wifeAge: number;
    contactNumber: string;
    familyPlanningMethod: string;
    counselingNotes: string;
    followUpDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type RegisterType = 'household' | 'pregnant' | 'child' | 'couple' | 'medicine';
