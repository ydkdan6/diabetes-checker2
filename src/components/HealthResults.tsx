import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { HealthReport } from '@/types/health';
import { 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Heart, 
  Activity, 
  Apple, 
  Clock,
  Target,
  Shield,
  TrendingUp
} from 'lucide-react';

interface HealthResultsProps {
  report: HealthReport;
  onDownload: () => void;
  onStartOver: () => void;
}

const HealthResults: React.FC<HealthResultsProps> = ({ report, onDownload, onStartOver }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-gradient-health text-white';
      case 'moderate': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'very-high': return 'bg-destructive text-destructive-foreground animate-pulse';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="h-5 w-5" />;
      case 'moderate': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'very-high': return <AlertTriangle className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  const bmi = (report.patientData.weight / ((report.patientData.height / 100) ** 2)).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
          Your Health Assessment Results
        </h1>
        <p className="text-xl text-muted-foreground">
          Generated on {new Date(report.generatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Risk Assessment */}
      <Card className="shadow-glow border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins text-2xl">
            {getRiskIcon(report.prediction.riskLevel)}
            Diabetes Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <Badge className={`${getRiskColor(report.prediction.riskLevel)} text-lg px-6 py-2`}>
              {report.prediction.riskLevel.toUpperCase().replace('-', ' ')} RISK
            </Badge>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-poppins">
                {report.prediction.riskPercentage}% Risk Level
              </div>
              <Progress 
                value={report.prediction.riskPercentage} 
                className="w-full h-3"
              />
            </div>
            <p className="text-lg text-muted-foreground">
              Confidence Level: {report.prediction.confidence}%
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Risk Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.prediction.keyFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                  <span className="text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Health Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Heart className="h-5 w-5 text-primary" />
            Your Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold font-poppins">{bmi}</div>
              <div className="text-sm text-muted-foreground">BMI</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold font-poppins">{report.patientData.bloodGlucoseFasting}</div>
              <div className="text-sm text-muted-foreground">Fasting Glucose (mg/dL)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold font-poppins">{report.patientData.bloodGlucosePostMeal}</div>
              <div className="text-sm text-muted-foreground">Post-Meal Glucose (mg/dL)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Apple className="h-5 w-5 text-accent" />
              Dietary Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.personalizedAdvice.diet.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Activity className="h-5 w-5 text-primary" />
              Exercise Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.personalizedAdvice.exercise.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Clock className="h-5 w-5 text-warning" />
              Lifestyle Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.personalizedAdvice.lifestyle.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Target className="h-5 w-5 text-destructive" />
              Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.personalizedAdvice.monitoring.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Target className="h-5 w-5 text-primary" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {report.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-warning">Important Disclaimer</h3>
              <p className="text-sm text-muted-foreground">{report.disclaimer}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onDownload} 
          className="flex-1 h-12 text-lg font-poppins bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Full Report
        </Button>
        <Button 
          onClick={onStartOver} 
          variant="outline" 
          className="flex-1 h-12 text-lg font-poppins"
        >
          Take Another Assessment
        </Button>
      </div>
    </div>
  );
};

export default HealthResults;