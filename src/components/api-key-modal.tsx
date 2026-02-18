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
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Settings } from 'lucide-react';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const { t } = useTranslation();
  const { apiKey, setApiKey } = useHezeerFlow();
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(inputKey);
    onOpenChange(false);
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-5 w-5 text-primary" />
            <DialogTitle>API Key Configuration</DialogTitle>
          </div>
          <DialogDescription>
            Enter your GLM API key to enable AI features. Your key is stored
            locally and never shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              placeholder="glm-xxxxxxxxxxxxxxxx"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from the GLM platform
            </p>
          </div>

          {apiKey && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ✓ API key is configured
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {apiKey && (
            <Button variant="outline" onClick={handleClear}>
              Clear Key
            </Button>
          )}
          <Button onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ApiKeyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-2 mt-2"
      >
        <Settings className="h-4 w-4" />
        API Settings
      </Button>
      <ApiKeyModal open={open} onOpenChange={setOpen} />
    </>
  );
}
