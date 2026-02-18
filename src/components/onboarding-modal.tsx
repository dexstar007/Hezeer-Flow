'use client';

import { useState } from 'react';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Key } from 'lucide-react';

export function OnboardingModal() {
  const { t, language, setLanguage } = useTranslation();
  const { showOnboarding, setShowOnboarding, apiKey, setApiKey } =
    useHezeerFlow();

  const [inputKey, setInputKey] = useState(apiKey);

  const handleGetStarted = () => {
    setApiKey(inputKey);
    setShowOnboarding(false);
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{t.welcome}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {t.welcomeDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">Language</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
              <Button
                variant={language === 'es' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('es')}
              >
                ES
              </Button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              {t.enterApiKey}
            </label>
            <Input
              type="password"
              placeholder={t.apiKeyPlaceholder}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleSkip}>
            {t.skipForNow}
          </Button>
          <Button onClick={handleGetStarted}>
            {t.getStarted}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
