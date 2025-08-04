import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { HealthData, ethnicityOptions, conditionOptions, medicationOptions } from '@/types/health';
import { Activity, Heart, Scale, Users, Apple, Brain, Stethoscope } from 'lucide-react';

interface HealthAssessmentFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
}

const HealthAssessmentForm: React.FC<HealthAssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<HealthData>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 170,
    bloodGlucoseFasting: 90,
    bloodGlucosePostMeal: 140,
    sleepHours: 7,
    physicalActivityDays: 3,
    physicalActivityIntensity: 'moderate',
    familyHistory: false,
    ethnicity: 'Caucasian',
    existingConditions: [],
    medications: [],
    dietaryHabits: {
      fruitsVegetables: 3,
      processedFoods: 2,
      sugaryDrinks: 1
    },
    stressLevel: 5,
    symptoms: {
      increasedThirst: false,
      frequentUrination: false,
      unexplainedWeightLoss: false,
      fatigue: false,
      blurredVision: false,
      slowHealingSores: false,
      frequentInfections: false
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof HealthData] as any),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof HealthData] as string[], value]
        : (prev[field as keyof HealthData] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
          AI Diabetes Risk Predictor
        </h1>
        <p className="text-xl text-muted-foreground">AI-Powered Diabetes Risk Assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Users className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  min="18"
                  max="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ethnicityOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Scale className="h-5 w-5 text-primary" />
              Physical Measurements
            </CardTitle>
            <CardDescription>Your current physical metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                  min="30"
                  max="200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                  min="120"
                  max="220"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Glucose Levels */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Stethoscope className="h-5 w-5 text-primary" />
              Blood Glucose Levels
            </CardTitle>
            <CardDescription>Recent blood glucose measurements (mg/dL)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fastingGlucose">Fasting Blood Glucose</Label>
                <Input
                  id="fastingGlucose"
                  type="number"
                  value={formData.bloodGlucoseFasting}
                  onChange={(e) => handleInputChange('bloodGlucoseFasting', parseInt(e.target.value))}
                  min="60"
                  max="300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postMealGlucose">Post-Meal Blood Glucose</Label>
                <Input
                  id="postMealGlucose"
                  type="number"
                  value={formData.bloodGlucosePostMeal}
                  onChange={(e) => handleInputChange('bloodGlucosePostMeal', parseInt(e.target.value))}
                  min="80"
                  max="400"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Factors */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Activity className="h-5 w-5 text-primary" />
              Lifestyle Factors
            </CardTitle>
            <CardDescription>Your daily habits and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Hours of Sleep per Night</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value))}
                  min="3"
                  max="12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityDays">Physical Activity Days per Week</Label>
                <Input
                  id="activityDays"
                  type="number"
                  value={formData.physicalActivityDays}
                  onChange={(e) => handleInputChange('physicalActivityDays', parseInt(e.target.value))}
                  min="0"
                  max="7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityIntensity">Physical Activity Intensity</Label>
              <Select value={formData.physicalActivityIntensity} onValueChange={(value) => handleInputChange('physicalActivityIntensity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (light walking, household chores)</SelectItem>
                  <SelectItem value="moderate">Moderate (brisk walking, cycling)</SelectItem>
                  <SelectItem value="high">High (running, sports, intense workouts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Diet & Nutrition */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Apple className="h-5 w-5 text-primary" />
              Diet & Nutrition
            </CardTitle>
            <CardDescription>Your eating habits (servings per day)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fruits & Vegetables: {formData.dietaryHabits.fruitsVegetables} servings/day</Label>
                <Slider
                  value={[formData.dietaryHabits.fruitsVegetables]}
                  onValueChange={(value) => handleNestedChange('dietaryHabits', 'fruitsVegetables', value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Processed Foods: {formData.dietaryHabits.processedFoods} servings/day</Label>
                <Slider
                  value={[formData.dietaryHabits.processedFoods]}
                  onValueChange={(value) => handleNestedChange('dietaryHabits', 'processedFoods', value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Sugary Drinks: {formData.dietaryHabits.sugaryDrinks} servings/day</Label>
                <Slider
                  value={[formData.dietaryHabits.sugaryDrinks]}
                  onValueChange={(value) => handleNestedChange('dietaryHabits', 'sugaryDrinks', value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Brain className="h-5 w-5 text-primary" />
              Stress Level
            </CardTitle>
            <CardDescription>How would you rate your overall stress level?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Stress Level: {formData.stressLevel}/10</Label>
              <Slider
                value={[formData.stressLevel]}
                onValueChange={(value) => handleInputChange('stressLevel', value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Low stress</span>
                <span>High stress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Heart className="h-5 w-5 text-primary" />
              Medical History
            </CardTitle>
            <CardDescription>Your health background and family history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyHistory"
                checked={formData.familyHistory}
                onCheckedChange={(checked) => handleInputChange('familyHistory', checked)}
              />
              <Label htmlFor="familyHistory">Family history of diabetes</Label>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-medium">Existing Conditions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conditionOptions.map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition}`}
                      checked={formData.existingConditions.includes(condition)}
                      onCheckedChange={(checked) => handleArrayChange('existingConditions', condition, checked as boolean)}
                    />
                    <Label htmlFor={`condition-${condition}`} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-medium">Current Medications</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medicationOptions.map(medication => (
                  <div key={medication} className="flex items-center space-x-2">
                    <Checkbox
                      id={`medication-${medication}`}
                      checked={formData.medications.includes(medication)}
                      onCheckedChange={(checked) => handleArrayChange('medications', medication, checked as boolean)}
                    />
                    <Label htmlFor={`medication-${medication}`} className="text-sm">{medication}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Stethoscope className="h-5 w-5 text-primary" />
              Current Symptoms
            </CardTitle>
            <CardDescription>Have you experienced any of these symptoms recently?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.symptoms).map(([symptom, value]) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={`symptom-${symptom}`}
                    checked={value}
                    onCheckedChange={(checked) => handleNestedChange('symptoms', symptom, checked)}
                  />
                  <Label htmlFor={`symptom-${symptom}`} className="text-sm">
                    {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-poppins bg-gradient-primary hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing Your Health Data...' : 'Get My Diabetes Risk Assessment'}
        </Button>
      </form>
    </div>
  );
};

export default HealthAssessmentForm;