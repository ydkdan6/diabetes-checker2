import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import ApiKeyInput from '@/components/ApiKeyInput';
import HealthAssessmentForm from '@/components/HealthAssessmentForm';
import HealthResults from '@/components/HealthResults';
import { HealthData, HealthReport } from '@/types/health';
import { createGeminiService } from '@/services/geminiApi';
import { generateReportPDF } from '@/utils/reportGenerator';

type AppState = 'api-key' | 'assessment' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('api-key');
  const [apiKey, setApiKey] = useState<string>('');
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setAppState('assessment');
    toast({
      title: "API Key Accepted",
      description: "You can now proceed with your health assessment.",
    });
  };

  const handleHealthDataSubmit = async (healthData: HealthData) => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "API key is missing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const geminiService = createGeminiService(apiKey);
      const report = await geminiService.analyzeDiabetesRisk(healthData);
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
      case 'api-key':
        return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
      
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
        return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
    }
  };

  return renderCurrentState();
};

export default Index;
