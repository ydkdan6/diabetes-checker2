import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import HealthAssessmentForm from '@/components/HealthAssessmentForm';
import HealthResults from '@/components/HealthResults';
import { HealthData, HealthReport } from '@/types/health';
import { createPreTrainedModelService } from '@/services/geminiApi';
import { generateReportPDF } from '@/utils/reportGenerator';

type AppState = 'assessment' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('assessment');
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleHealthDataSubmit = async (healthData: HealthData) => {
    setIsLoading(true);
    try {
      const modelService = createPreTrainedModelService();
      const report = await modelService.analyzeDiabetesRisk(healthData);
      setHealthReport(report);
      setAppState('results');
      
      toast({
        title: "Analysis Complete",
        description: "Your diabetes risk assessment has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating health report:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (healthReport) {
      generateReportPDF(healthReport);
      toast({
        title: "Report Downloaded",
        description: "Your health assessment report has been downloaded successfully.",
      });
    }
  };

  const handleStartOver = () => {
    setAppState('assessment');
    setHealthReport(null);
    toast({
      title: "New Assessment Started",
      description: "You can now take another health assessment.",
    });
  };

  const renderCurrentState = () => {
    switch (appState) {
      case 'assessment':
        return (
          <div className="min-h-screen bg-gradient-bg font-poppins">
            <HealthAssessmentForm 
              onSubmit={handleHealthDataSubmit} 
              isLoading={isLoading}
            />
          </div>
        );
      
      case 'results':
        return healthReport ? (
          <div className="min-h-screen bg-gradient-bg font-poppins">
            <HealthResults 
              report={healthReport}
              onDownload={handleDownloadReport}
              onStartOver={handleStartOver}
            />
          </div>
        ) : null;
      
      default:
        return (
          <div className="min-h-screen bg-gradient-bg font-poppins">
            <HealthAssessmentForm 
              onSubmit={handleHealthDataSubmit} 
              isLoading={isLoading}
            />
          </div>
        );
    }
  };

  return renderCurrentState();
};

export default Index;
