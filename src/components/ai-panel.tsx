'use client';

import { useState, useRef, useEffect } from 'react';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeyModal } from '@/components/api-key-modal';
import {
  MessageSquare,
  Mic,
  FileImage,
  FileText,
  Send,
  Upload,
  Loader2,
  Sparkles,
  AlertCircle,
  Settings,
} from 'lucide-react';

export function AIPanel() {
  const { t } = useTranslation();
  const {
    apiKey,
    aiPanelOpen,
    setAiPanelOpen,
    aiMessages,
    addAiMessage,
    clearAiMessages,
    aiMode,
    setAiMode,
    notes,
    language,
  } = useHezeerFlow();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Send message to AI
  const handleSend = async () => {
    if (!input.trim() && !uploadedFile) return;
    if (!apiKey) {
      alert('Please enter your API key in settings');
      return;
    }

    setLoading(true);

    // Add user message
    const userMessage: any = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: Date.now(),
    };

    addAiMessage(userMessage);
    setInput('');

    try {
      let response = '';
      const systemPrompt =
        language === 'es'
          ? 'Eres un asistente útil para la gestión de conocimientos personales. Responde en español.'
          : 'You are a helpful assistant for personal knowledge management. Respond in English.';

      // Prepare context based on mode
      let context = '';

      if (aiMode === 'rag' && notes.length > 0) {
        context = `Context from your notes:\n${notes
          .slice(0, 5)
          .map((n) => `## ${n.title}\n${n.content.slice(0, 500)}...`)
          .join('\n\n')}\n\n`;
      }

      // Call API
      const responseStream = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...aiMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: context + input },
          ],
          stream: true,
          apiKey: apiKey,
        }),
      });

      if (!responseStream.ok) {
        throw new Error('API request failed');
      }

      // Handle streaming response
      const reader = responseStream.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  response += parsed.choices[0].delta.content;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Add assistant message
      const assistantMessage: any = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: response || t.processing,
        timestamp: Date.now(),
      };

      addAiMessage(assistantMessage);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: any = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Error: Unable to process your request. Please check your API key.',
        timestamp: Date.now(),
      };
      addAiMessage(errorMessage);
    } finally {
      setLoading(false);
      setUploadedFile(null);
    }
  };

  if (!aiPanelOpen) {
    return null;
  }

  return (
    <div className="w-80 border-l flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t.aiAssistant}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAiPanelOpen(false)}
          >
            ×
          </Button>
        </div>

        <Tabs value={aiMode} onValueChange={(v) => setAiMode(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="chat" className="text-xs">
              {t.chat}
            </TabsTrigger>
            <TabsTrigger value="rag" className="text-xs">
              {t.ragChat}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* API Key Warning */}
      {!apiKey && (
        <div className="p-3 border-b bg-yellow-50 dark:bg-yellow-950/20">
          <Alert variant="default" className="border-yellow-200 dark:border-yellow-900">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium mb-1">API Key Required</p>
                  <p className="text-xs">
                    Configure your GLM API key to use AI features
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKeyModal(true)}
                  className="shrink-0"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {aiMessages.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{t.noAiMessages}</p>
            <p className="text-xs mt-1">{t.startConversation}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-lg p-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t space-y-2">
        {/* Upload buttons */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            {t.uploadImage}
          </Button>
        </div>

        {uploadedFile && (
          <Badge variant="secondary" className="text-xs">
            {uploadedFile.name}
          </Badge>
        )}

        {/* Text input */}
        <div className="flex gap-2">
          <Input
            placeholder={
              aiMode === 'rag' ? 'Ask about your notes...' : t.askQuestion
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading} size="icon">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Clear button */}
        {aiMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAiMessages}
            className="w-full text-xs"
          >
            Clear Conversation
          </Button>
        )}
      </div>

      {/* API Key Modal */}
      <ApiKeyModal open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />
    </div>
  );
}
