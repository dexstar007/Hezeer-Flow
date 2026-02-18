'use client';

import { useEffect } from 'react';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { Sidebar } from '@/components/sidebar';
import { MarkdownEditor } from '@/components/markdown-editor';
import { AIPanel } from '@/components/ai-panel';
import { KnowledgeGraph } from '@/components/knowledge-graph';
import { OnboardingModal } from '@/components/onboarding-modal';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useNotes } from '@/hooks/use-notes';
import { Network, FileText } from 'lucide-react';

export default function Home() {
  const { currentView, setCurrentView, apiKey, showOnboarding, setShowOnboarding, updateGraph } =
    useHezeerFlow();
  const { notes, loading } = useNotes();

  // Update graph when notes change
  useEffect(() => {
    if (!loading && notes.length > 0) {
      updateGraph();
    }
  }, [notes, loading, updateGraph]);

  // Show onboarding if no API key is configured
  useEffect(() => {
    if (!apiKey && !showOnboarding) {
      setShowOnboarding(true);
    }
  }, [apiKey, showOnboarding, setShowOnboarding]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Panel */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Editor / Graph Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              {/* View Toggle */}
              <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                <div className="flex items-center gap-2 px-2">
                  <Button
                    variant={currentView === 'editor' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('editor')}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Editor
                  </Button>
                  <Button
                    variant={currentView === 'graph' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('graph')}
                    className="gap-2"
                  >
                    <Network className="h-4 w-4" />
                    Graph
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {currentView === 'editor' ? (
                  <MarkdownEditor />
                ) : (
                  <KnowledgeGraph />
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right AI Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <AIPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal />
    </div>
  );
}
