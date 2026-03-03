import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import {
  Household,
  PregnantWoman,
  Child,
  DailyVisit,
  MedicineDistribution,
  EligibleCouple,
} from '@/types';

const STORAGE_KEYS = {
  households: 'bvm_households',
  pregnantWomen: 'bvm_pregnant_women',
  children: 'bvm_children',
  visits: 'bvm_visits',
  medicines: 'bvm_medicines',
  couples: 'bvm_couples',
};

async function loadData<T>(key: string): Promise<T[]> {
  try {
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.log('Error loading data for key:', key, e);
    return [];
  }
}

async function saveData<T>(key: string, data: T[]): Promise<T[]> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Saved data for key:', key, 'count:', data.length);
  } catch (e) {
    console.log('Error saving data for key:', key, e);
  }
  return data;
}

function persist(key: string, data: unknown[]) {
  saveData(key, data);
}

export const [DataProvider, useData] = createContextHook(() => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [pregnantWomen, setPregnantWomen] = useState<PregnantWoman[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [visits, setVisits] = useState<DailyVisit[]>([]);
  const [medicines, setMedicines] = useState<MedicineDistribution[]>([]);
  const [couples, setCouples] = useState<EligibleCouple[]>([]);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const householdsQuery = useQuery({
    queryKey: ['households'],
    queryFn: () => loadData<Household>(STORAGE_KEYS.households),
  });

  const pregnantQuery = useQuery({
    queryKey: ['pregnantWomen'],
    queryFn: () => loadData<PregnantWoman>(STORAGE_KEYS.pregnantWomen),
  });

  const childrenQuery = useQuery({
    queryKey: ['children'],
    queryFn: () => loadData<Child>(STORAGE_KEYS.children),
  });

  const visitsQuery = useQuery({
    queryKey: ['visits'],
    queryFn: () => loadData<DailyVisit>(STORAGE_KEYS.visits),
  });

  const medicinesQuery = useQuery({
    queryKey: ['medicines'],
    queryFn: () => loadData<MedicineDistribution>(STORAGE_KEYS.medicines),
  });

  const couplesQuery = useQuery({
    queryKey: ['couples'],
    queryFn: () => loadData<EligibleCouple>(STORAGE_KEYS.couples),
  });

  useEffect(() => {
    if (householdsQuery.data) setHouseholds(householdsQuery.data);
  }, [householdsQuery.data]);

  useEffect(() => {
    if (pregnantQuery.data) setPregnantWomen(pregnantQuery.data);
  }, [pregnantQuery.data]);

  useEffect(() => {
    if (childrenQuery.data) setChildren(childrenQuery.data);
  }, [childrenQuery.data]);

  useEffect(() => {
    if (visitsQuery.data) setVisits(visitsQuery.data);
  }, [visitsQuery.data]);

  useEffect(() => {
    if (medicinesQuery.data) setMedicines(medicinesQuery.data);
  }, [medicinesQuery.data]);

  useEffect(() => {
    if (couplesQuery.data) setCouples(couplesQuery.data);
  }, [couplesQuery.data]);

  useEffect(() => {
    AsyncStorage.getItem('asha_last_synced').then(val => setLastSynced(val));
  }, []);

  const addHousehold = useCallback((household: Household) => {
    setHouseholds(prev => {
      const updated = [...prev, household];
      persist(STORAGE_KEYS.households, updated);
      return updated;
    });
  }, []);

  const updateHousehold = useCallback((household: Household) => {
    setHouseholds(prev => {
      const updated = prev.map(h => h.id === household.id ? household : h);
      persist(STORAGE_KEYS.households, updated);
      return updated;
    });
  }, []);

  const deleteHousehold = useCallback((id: string) => {
    setHouseholds(prev => {
      const updated = prev.filter(h => h.id !== id);
      persist(STORAGE_KEYS.households, updated);
      return updated;
    });
  }, []);

  const addPregnantWoman = useCallback((woman: PregnantWoman) => {
    setPregnantWomen(prev => {
      const updated = [...prev, woman];
      persist(STORAGE_KEYS.pregnantWomen, updated);
      return updated;
    });
  }, []);

  const updatePregnantWoman = useCallback((woman: PregnantWoman) => {
    setPregnantWomen(prev => {
      const updated = prev.map(w => w.id === woman.id ? woman : w);
      persist(STORAGE_KEYS.pregnantWomen, updated);
      return updated;
    });
  }, []);

  const deletePregnantWoman = useCallback((id: string) => {
    setPregnantWomen(prev => {
      const updated = prev.filter(w => w.id !== id);
      persist(STORAGE_KEYS.pregnantWomen, updated);
      return updated;
    });
  }, []);

  const addChild = useCallback((child: Child) => {
    setChildren(prev => {
      const updated = [...prev, child];
      persist(STORAGE_KEYS.children, updated);
      return updated;
    });
  }, []);

  const updateChild = useCallback((child: Child) => {
    setChildren(prev => {
      const updated = prev.map(c => c.id === child.id ? child : c);
      persist(STORAGE_KEYS.children, updated);
      return updated;
    });
  }, []);

  const deleteChild = useCallback((id: string) => {
    setChildren(prev => {
      const updated = prev.filter(c => c.id !== id);
      persist(STORAGE_KEYS.children, updated);
      return updated;
    });
  }, []);

  const addVisit = useCallback((visit: DailyVisit) => {
    setVisits(prev => {
      const updated = [...prev, visit];
      persist(STORAGE_KEYS.visits, updated);
      return updated;
    });
  }, []);

  const updateVisit = useCallback((visit: DailyVisit) => {
    setVisits(prev => {
      const updated = prev.map(v => v.id === visit.id ? visit : v);
      persist(STORAGE_KEYS.visits, updated);
      return updated;
    });
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setVisits(prev => {
      const updated = prev.filter(v => v.id !== id);
      persist(STORAGE_KEYS.visits, updated);
      return updated;
    });
  }, []);

  const addMedicine = useCallback((medicine: MedicineDistribution) => {
    setMedicines(prev => {
      const updated = [...prev, medicine];
      persist(STORAGE_KEYS.medicines, updated);
      return updated;
    });
  }, []);

  const addCouple = useCallback((couple: EligibleCouple) => {
    setCouples(prev => {
      const updated = [...prev, couple];
      persist(STORAGE_KEYS.couples, updated);
      return updated;
    });
  }, []);

  const updateCouple = useCallback((couple: EligibleCouple) => {
    setCouples(prev => {
      const updated = prev.map(c => c.id === couple.id ? couple : c);
      persist(STORAGE_KEYS.couples, updated);
      return updated;
    });
  }, []);

  const deleteCouple = useCallback((id: string) => {
    setCouples(prev => {
      const updated = prev.filter(c => c.id !== id);
      persist(STORAGE_KEYS.couples, updated);
      return updated;
    });
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    setMedicines(prev => {
      const updated = prev.filter(m => m.id !== id);
      persist(STORAGE_KEYS.medicines, updated);
      return updated;
    });
  }, []);

  const syncData = useCallback(async () => {
    const now = new Date().toISOString();
    await AsyncStorage.setItem('asha_last_synced', now);
    setLastSynced(now);
    console.log('Data synced at:', now);
  }, []);

  const isLoading = householdsQuery.isLoading || pregnantQuery.isLoading ||
    childrenQuery.isLoading || visitsQuery.isLoading || medicinesQuery.isLoading || couplesQuery.isLoading;

  const todayVisits = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return visits.filter(v => v.date === today);
  }, [visits]);

  const pendingFollowUps = useMemo(() => {
    return visits.filter(v => !v.isCompleted && v.purpose === 'Follow-up');
  }, [visits]);

  const activePregnantWomen = useMemo(() => {
    return pregnantWomen.filter(w => w.status === 'active');
  }, [pregnantWomen]);

  const upcomingVaccinations = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming: { child: Child; vaccine: string; dueDate: string }[] = [];

    children.forEach(child => {
      child.vaccines.forEach(v => {
        if (v.status === 'pending') {
          const dueDate = new Date(v.dueDate);
          if (dueDate <= nextWeek) {
            upcoming.push({ child, vaccine: v.vaccineName, dueDate: v.dueDate });
          }
        }
      });
    });

    return upcoming;
  }, [children]);

  return {
    households,
    pregnantWomen,
    children,
    visits,
    medicines,
    couples,
    isLoading,
    lastSynced,
    todayVisits,
    pendingFollowUps,
    activePregnantWomen,
    upcomingVaccinations,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    addPregnantWoman,
    updatePregnantWoman,
    deletePregnantWoman,
    addChild,
    updateChild,
    deleteChild,
    addVisit,
    updateVisit,
    deleteVisit,
    addMedicine,
    deleteMedicine,
    addCouple,
    updateCouple,
    deleteCouple,
    syncData,
  };
});
