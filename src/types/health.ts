export interface HealthData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  bloodGlucoseFasting: number;
  bloodGlucosePostMeal: number;
  sleepHours: number;
  physicalActivityDays: number;
  physicalActivityIntensity: 'low' | 'moderate' | 'high';
  familyHistory: boolean;
  ethnicity: string;
  existingConditions: string[];
  medications: string[];
  dietaryHabits: {
    fruitsVegetables: number;
    processedFoods: number;
    sugaryDrinks: number;
  };
  stressLevel: number;
  symptoms: {
    increasedThirst: boolean;
    frequentUrination: boolean;
    unexplainedWeightLoss: boolean;
    fatigue: boolean;
    blurredVision: boolean;
    slowHealingSores: boolean;
    frequentInfections: boolean;
  };
}

export interface RiskPrediction {
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  riskPercentage: number;
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}

export interface HealthReport {
  patientData: HealthData;
  prediction: RiskPrediction;
  personalizedAdvice: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
    monitoring: string[];
  };
  nextSteps: string[];
  disclaimer: string;
  generatedAt: string;
}

export const ethnicityOptions = [
  'Caucasian',
  'African American',
  'Hispanic/Latino',
  'Asian',
  'Native American',
  'Pacific Islander',
  'Middle Eastern',
  'Mixed/Other'
];

export const conditionOptions = [
  'Hypertension',
  'High Cholesterol',
  'Heart Disease',
  'Kidney Disease',
  'PCOS',
  'Thyroid Disorders',
  'Depression/Anxiety',
  'Sleep Apnea',
  'Gestational Diabetes (Previous)',
  'Prediabetes'
];

export const medicationOptions = [
  'None',
  'Blood Pressure Medications',
  'Cholesterol Medications',
  'Insulin',
  'Metformin',
  'Steroids',
  'Antidepressants',
  'Thyroid Medications',
  'Birth Control',
  'Anti-inflammatory drugs'
];