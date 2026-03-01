export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: '1',
    title: 'Importance of Antenatal Care',
    category: 'Pregnancy Care',
    summary: 'Regular ANC visits help ensure healthy pregnancy outcomes.',
    content: 'Antenatal care (ANC) is the care a woman receives during pregnancy. Regular ANC visits help identify and manage potential complications early. Every pregnant woman should have at least 4 ANC visits during pregnancy.\n\nFirst Visit: Within 12 weeks\nSecond Visit: 14-26 weeks\nThird Visit: 28-34 weeks\nFourth Visit: 36 weeks to delivery\n\nDuring each visit, check: Blood pressure, Weight, Hemoglobin level, Urine test, Fetal heart rate.',
  },
  {
    id: '2',
    title: 'Child Nutrition Guidelines',
    category: 'Child Nutrition',
    summary: 'Proper nutrition in the first 1000 days is critical for child development.',
    content: 'The first 1000 days of life (from conception to age 2) are the most critical for nutrition and development.\n\nKey Points:\n- Exclusive breastfeeding for first 6 months\n- Start complementary feeding at 6 months\n- Continue breastfeeding up to 2 years\n- Give age-appropriate foods\n- Ensure adequate iron, zinc, and vitamin A\n- Monitor growth regularly\n- Give ORS and Zinc for diarrhea management.',
  },
  {
    id: '3',
    title: 'National Immunization Schedule',
    category: 'Immunization',
    summary: 'Complete immunization protects children from preventable diseases.',
    content: 'India\'s Universal Immunization Programme (UIP) provides free vaccines against 12 diseases.\n\nAt Birth: BCG, OPV-0, Hepatitis B\n6 Weeks: OPV-1, Pentavalent-1, Rotavirus-1, IPV-1, PCV-1\n10 Weeks: OPV-2, Pentavalent-2, Rotavirus-2\n14 Weeks: OPV-3, Pentavalent-3, Rotavirus-3, IPV-2, PCV-2\n9 Months: MR-1, JE-1, Vitamin A, PCV Booster\n16-24 Months: DPT Booster-1, OPV Booster, MR-2, JE-2',
  },
  {
    id: '4',
    title: 'High Risk Pregnancy Signs',
    category: 'Pregnancy Care',
    summary: 'Identify danger signs early for timely referral.',
    content: 'Danger signs during pregnancy that need immediate medical attention:\n\n- Severe headache with blurred vision\n- Vaginal bleeding\n- Severe abdominal pain\n- High fever\n- Fits or convulsions\n- Swelling of hands/face\n- Reduced fetal movement\n- Water breaking before due date\n\nHigh risk factors: Age <18 or >35, Previous complications, Anemia, Hypertension, Diabetes, Multiple pregnancy.',
  },
  {
    id: '5',
    title: 'Family Planning Methods',
    category: 'Family Planning',
    summary: 'Counsel couples on available contraceptive methods.',
    content: 'Available family planning methods:\n\nSpacing Methods:\n- Condoms\n- Oral Contraceptive Pills\n- IUD (Copper-T)\n- Injectable (Antara)\n\nLimiting Methods:\n- Male Sterilization (NSV)\n- Female Sterilization (Tubectomy)\n\nEmergency Contraception:\n- Available within 72 hours\n\nCounsel couples about all available methods and help them make informed choices.',
  },
  {
    id: '6',
    title: 'Janani Suraksha Yojana (JSY)',
    category: 'Government Schemes',
    summary: 'Cash incentive scheme for institutional deliveries.',
    content: 'Janani Suraksha Yojana (JSY) is a government scheme to promote institutional deliveries.\n\nBenefits:\n- Cash assistance for pregnant women delivering at health facilities\n- Additional amount for ASHA workers who facilitate the delivery\n\nEligibility:\n- All pregnant women in BPL families\n- SC/ST women regardless of income\n- Age 19 years and above\n\nASHA Role:\n- Identify pregnant women\n- Facilitate registration\n- Accompany to health facility\n- Ensure postnatal visits',
  },
  {
    id: '7',
    title: 'Diarrhea Management with ORS & Zinc',
    category: 'Child Health',
    summary: 'ORS and Zinc can prevent deaths from childhood diarrhea.',
    content: 'Diarrhea is a leading cause of death in children under 5. Proper management can save lives.\n\nTreatment:\n1. Give ORS after every loose stool\n2. Give Zinc tablets for 14 days\n3. Continue breastfeeding\n4. Increase fluid intake\n\nPreparing ORS:\n- Wash hands with soap\n- Mix one packet in 1 liter clean water\n- Stir well and give frequently in small sips\n\nRefer to hospital if: Blood in stool, persistent vomiting, fever, or no improvement in 2 days.',
  },
  {
    id: '8',
    title: 'Nutrition During Pregnancy',
    category: 'Pregnancy Care',
    summary: 'Adequate nutrition is essential for healthy mother and baby.',
    content: 'A pregnant woman needs extra nutrition for herself and the growing baby.\n\nKey Nutrients:\n- Iron: Green leafy vegetables, jaggery, dates\n- Folic Acid: Take IFA tablets daily\n- Calcium: Milk, curd, ragi\n- Protein: Pulses, eggs, nuts\n\nDiet Tips:\n- Eat small frequent meals\n- Include all food groups\n- Drink plenty of water\n- Avoid raw/undercooked food\n- Take IFA tablets after meals\n- Rest adequately',
  },
];

export const EDUCATION_CATEGORIES = [
  'Pregnancy Care',
  'Child Nutrition',
  'Immunization',
  'Child Health',
  'Family Planning',
  'Government Schemes',
];
