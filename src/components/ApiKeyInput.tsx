import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink, Shield } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }
    if (!apiKey.startsWith('AIza')) {
      setError('Invalid Gemini API key format. API keys should start with "AIza"');
      return;
    }
    setError('');
    onApiKeySubmit(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
            Glucose Guardian
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Diabetes Risk Prediction & Health Advisor
          </p>
          <p className="text-lg text-muted-foreground">
            Get personalized health insights and prevention strategies
          </p>
        </div>

        <Card className="shadow-glow border-2">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 font-poppins text-2xl">
              <Key className="h-6 w-6 text-primary" />
              Gemini API Key Required
            </CardTitle>
            <CardDescription className="text-base">
              To provide accurate AI-powered health analysis, please enter your Google Gemini API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-base font-medium">
                  Gemini API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key (AIza...)"
                  className="h-12 text-lg"
                  required
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-poppins bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Start Health Assessment
              </Button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Your API key is secure and never stored</span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">How to get your Gemini API key:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Visit Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Create a new API key</li>
                  <li>Copy and paste the key above</li>
                </ol>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="w-full"
                >
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Get Gemini API Key
                  </a>
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Privacy Notice:</strong> Your API key and health data are processed locally in your browser. 
                  We do not store or transmit your personal information to any third-party servers.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Powered by Google Gemini AI • Built with medical best practices
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;