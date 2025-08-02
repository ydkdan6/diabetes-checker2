import { HealthData, RiskPrediction, HealthReport } from '@/types/health';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = 'AIzaSyBAGhhh2P-wdWJbrVMfCk74-LFIiSdU-34';

export class PreTrainedModelService {
  async analyzeDiabetesRisk(healthData: HealthData): Promise<HealthReport> {
    const prompt = this.createAnalysisPrompt(healthData);
    
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const analysisText = result.candidates[0].content.parts[0].text;
      
      return this.parseModelResponse(analysisText, healthData);
    } catch (error) {
      console.error('Error calling pre-trained model:', error);
      throw new Error('Failed to analyze health data. Please try again.');
    }
  }

  private createAnalysisPrompt(data: HealthData): string {
    const bmi = (data.weight / ((data.height / 100) ** 2)).toFixed(1);
    
    return `
You are a medical AI assistant specializing in diabetes risk assessment. Analyze the following patient data and provide a comprehensive diabetes risk evaluation.

PATIENT DATA:
- Age: ${data.age} years
- Gender: ${data.gender}
- BMI: ${bmi} (Weight: ${data.weight}kg, Height: ${data.height}cm)
- Ethnicity: ${data.ethnicity}
- Fasting Blood Glucose: ${data.bloodGlucoseFasting} mg/dL
- Post-Meal Blood Glucose: ${data.bloodGlucosePostMeal} mg/dL
- Sleep: ${data.sleepHours} hours/night
- Physical Activity: ${data.physicalActivityDays} days/week, ${data.physicalActivityIntensity} intensity
- Family History of Diabetes: ${data.familyHistory ? 'Yes' : 'No'}
- Existing Conditions: ${data.existingConditions.length > 0 ? data.existingConditions.join(', ') : 'None'}
- Current Medications: ${data.medications.length > 0 ? data.medications.join(', ') : 'None'}
- Diet (daily servings): Fruits/Vegetables: ${data.dietaryHabits.fruitsVegetables}, Processed Foods: ${data.dietaryHabits.processedFoods}, Sugary Drinks: ${data.dietaryHabits.sugaryDrinks}
- Stress Level: ${data.stressLevel}/10
- Current Symptoms: ${Object.entries(data.symptoms).filter(([_, value]) => value).map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ') || 'None reported'}

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "riskLevel": "low|moderate|high|very-high",
  "riskPercentage": number (0-100),
  "confidence": number (0-100),
  "keyFactors": [
    "list of 3-5 most significant risk factors specific to this patient"
  ],
  "dietAdvice": [
    "5-7 specific, actionable dietary recommendations"
  ],
  "exerciseAdvice": [
    "4-6 specific exercise recommendations with intensity and frequency"
  ],
  "lifestyleAdvice": [
    "4-6 lifestyle modifications for diabetes prevention"
  ],
  "monitoringAdvice": [
    "4-5 specific health monitoring recommendations"
  ],
  "nextSteps": [
    "3-5 prioritized action items for the patient"
  ]
}

Consider these factors in your analysis:
- Blood glucose levels (normal fasting <100, normal post-meal <140)
- BMI categories and diabetes risk
- Age and ethnicity risk factors
- Family history significance
- Existing conditions and medication effects
- Lifestyle factors (sleep, exercise, diet, stress)
- Current symptoms indicating diabetes risk

Provide practical, evidence-based recommendations tailored to this specific patient profile.
`;
  }

  private parseModelResponse(response: string, healthData: HealthData): HealthReport {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const jsonString = jsonMatch[0];
      const analysis = JSON.parse(jsonString);

      const prediction: RiskPrediction = {
        riskLevel: analysis.riskLevel || 'moderate',
        riskPercentage: analysis.riskPercentage || 50,
        confidence: analysis.confidence || 75,
        keyFactors: analysis.keyFactors || ['Unable to determine risk factors'],
        recommendations: analysis.keyFactors || []
      };

      const report: HealthReport = {
        patientData: healthData,
        prediction,
        personalizedAdvice: {
          diet: analysis.dietAdvice || ['Consult with a nutritionist for personalized dietary advice'],
          exercise: analysis.exerciseAdvice || ['Consult with a healthcare provider for exercise recommendations'],
          lifestyle: analysis.lifestyleAdvice || ['Maintain healthy lifestyle habits'],
          monitoring: analysis.monitoringAdvice || ['Regular health checkups recommended']
        },
        nextSteps: analysis.nextSteps || ['Consult with your healthcare provider'],
        disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment recommendations.',
        generatedAt: new Date().toISOString()
      };

      return report;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      
      // Fallback response if parsing fails
      return this.createFallbackReport(healthData);
    }
  }

  private createFallbackReport(healthData: HealthData): HealthReport {
    const bmi = healthData.weight / ((healthData.height / 100) ** 2);
    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high' = 'moderate';
    let riskPercentage = 50;

    // Simple rule-based fallback assessment
    if (healthData.bloodGlucoseFasting >= 126 || healthData.bloodGlucosePostMeal >= 200) {
      riskLevel = 'very-high';
      riskPercentage = 85;
    } else if (healthData.bloodGlucoseFasting >= 100 || healthData.bloodGlucosePostMeal >= 140 || bmi >= 30) {
      riskLevel = 'high';
      riskPercentage = 70;
    } else if (healthData.familyHistory || bmi >= 25 || healthData.age >= 45) {
      riskLevel = 'moderate';
      riskPercentage = 40;
    } else {
      riskLevel = 'low';
      riskPercentage = 20;
    }

    return {
      patientData: healthData,
      prediction: {
        riskLevel,
        riskPercentage,
        confidence: 70,
        keyFactors: [
          bmi >= 25 ? 'Elevated BMI' : null,
          healthData.familyHistory ? 'Family history of diabetes' : null,
          healthData.bloodGlucoseFasting >= 100 ? 'Elevated fasting glucose' : null,
          healthData.physicalActivityDays < 3 ? 'Low physical activity' : null,
          healthData.age >= 45 ? 'Age factor' : null
        ].filter(Boolean) as string[],
        recommendations: []
      },
      personalizedAdvice: {
        diet: [
          'Focus on whole grains, lean proteins, and vegetables',
          'Limit refined sugars and processed foods',
          'Control portion sizes',
          'Eat regular, balanced meals'
        ],
        exercise: [
          'Aim for 150 minutes of moderate exercise per week',
          'Include both cardio and strength training',
          'Start gradually and increase intensity over time'
        ],
        lifestyle: [
          'Maintain a healthy sleep schedule',
          'Manage stress through relaxation techniques',
          'Avoid smoking and limit alcohol consumption'
        ],
        monitoring: [
          'Regular blood glucose monitoring',
          'Annual comprehensive health checkups',
          'Monitor blood pressure and cholesterol'
        ]
      },
      nextSteps: [
        'Consult with your healthcare provider',
        'Consider diabetes prevention program',
        'Schedule regular health screenings'
      ],
      disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment recommendations.',
      generatedAt: new Date().toISOString()
    };
  }
}

export const createPreTrainedModelService = () => new PreTrainedModelService();