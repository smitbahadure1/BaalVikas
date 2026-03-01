export const VACCINE_SCHEDULE = [
  { name: 'BCG', dueWeeks: 0 },
  { name: 'OPV-0', dueWeeks: 0 },
  { name: 'Hepatitis B - Birth Dose', dueWeeks: 0 },
  { name: 'OPV-1', dueWeeks: 6 },
  { name: 'Pentavalent-1', dueWeeks: 6 },
  { name: 'Rotavirus-1', dueWeeks: 6 },
  { name: 'IPV-1', dueWeeks: 6 },
  { name: 'PCV-1', dueWeeks: 6 },
  { name: 'OPV-2', dueWeeks: 10 },
  { name: 'Pentavalent-2', dueWeeks: 10 },
  { name: 'Rotavirus-2', dueWeeks: 10 },
  { name: 'OPV-3', dueWeeks: 14 },
  { name: 'Pentavalent-3', dueWeeks: 14 },
  { name: 'Rotavirus-3', dueWeeks: 14 },
  { name: 'IPV-2', dueWeeks: 14 },
  { name: 'PCV-2', dueWeeks: 14 },
  { name: 'Measles/MR-1', dueWeeks: 39 },
  { name: 'Vitamin A - 1st Dose', dueWeeks: 39 },
  { name: 'JE-1', dueWeeks: 39 },
  { name: 'PCV - Booster', dueWeeks: 39 },
  { name: 'DPT Booster-1', dueWeeks: 70 },
  { name: 'OPV Booster', dueWeeks: 70 },
  { name: 'Measles/MR-2', dueWeeks: 70 },
  { name: 'JE-2', dueWeeks: 70 },
  { name: 'Vitamin A - 2nd Dose', dueWeeks: 70 },
];

export const VISIT_PURPOSES = [
  'ANC',
  'Vaccination',
  'Counseling',
  'Follow-up',
  'Survey',
  'Medicine Distribution',
  'Other',
] as const;

export const SOCIO_ECONOMIC_CATEGORIES = [
  'APL (Above Poverty Line)',
  'BPL (Below Poverty Line)',
  'Antyodaya',
  'Other',
] as const;

export const FAMILY_PLANNING_METHODS = [
  'None',
  'Oral Contraceptive Pills',
  'Condom',
  'IUD/Copper-T',
  'Injectable',
  'Sterilization - Male',
  'Sterilization - Female',
  'Natural Methods',
  'Other',
] as const;

export const MEDICINE_LIST = [
  'Iron Folic Acid (IFA) Tablets',
  'Calcium Tablets',
  'Albendazole',
  'ORS Packets',
  'Zinc Tablets',
  'Paracetamol',
  'Chloroquine',
  'Contraceptive Pills',
  'Condoms',
  'Sanitary Napkins',
  'Pregnancy Test Kit',
  'Other',
] as const;
