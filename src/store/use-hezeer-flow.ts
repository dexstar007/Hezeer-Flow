import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations } from '@/lib/i18n';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface GraphNode {
  id: string;
  name: string;
  value: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppState {
  // UI State
  language: Language;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  currentView: 'editor' | 'graph';
  showOnboarding: boolean;

  // Notes State
  notes: Note[];
  currentNote: Note | null;
  selectedTags: string[];

  // AI State
  apiKey: string;
  aiMessages: AIMessage[];
  aiMode: 'chat' | 'meeting' | 'ocr' | 'rag';

  // Graph State
  graphNodes: GraphNode[];
  graphLinks: GraphLink[];

  // Actions
  setLanguage: (lang: Language) => void;
  setSidebarOpen: (open: boolean) => void;
  setAiPanelOpen: (open: boolean) => void;
  setCurrentView: (view: 'editor' | 'graph') => void;
  setShowOnboarding: (show: boolean) => void;

  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  setSelectedTags: (tags: string[]) => void;

  setApiKey: (key: string) => void;
  setAiMessages: (messages: AIMessage[]) => void;
  addAiMessage: (message: AIMessage) => void;
  clearAiMessages: () => void;
  setAiMode: (mode: 'chat' | 'meeting' | 'ocr' | 'rag') => void;

  setGraphNodes: (nodes: GraphNode[]) => void;
  setGraphLinks: (links: GraphLink[]) => void;
  updateGraph: () => void;
}

const getTranslation = (key: keyof typeof translations.en, lang: Language = 'en') => {
  return translations[lang][key];
};

export const useHezeerFlow = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      language: 'en',
      sidebarOpen: true,
      aiPanelOpen: true,
      currentView: 'editor',
      showOnboarding: true,

      // Notes State
      notes: [],
      currentNote: null,
      selectedTags: [],

      // AI State
      apiKey: '',
      aiMessages: [],
      aiMode: 'chat',

      // Graph State
      graphNodes: [],
      graphLinks: [],

      // Actions
      setLanguage: (lang) => set({ language: lang }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),

      setCurrentView: (view) => set({ currentView: view }),

      setShowOnboarding: (show) => set({ showOnboarding: show }),

      setNotes: (notes) => set({ notes }),

      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
          ),
          currentNote:
            state.currentNote?.id === id
              ? { ...state.currentNote, ...updates, updatedAt: Date.now() }
              : state.currentNote,
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
        })),

      setCurrentNote: (note) => set({ currentNote: note }),

      setSelectedTags: (tags) => set({ selectedTags: tags }),

      setApiKey: (key) => set({ apiKey: key }),

      setAiMessages: (messages) => set({ aiMessages: messages }),

      addAiMessage: (message) =>
        set((state) => ({ aiMessages: [...state.aiMessages, message] })),

      clearAiMessages: () => set({ aiMessages: [] }),

      setAiMode: (mode) => set({ aiMode: mode }),

      setGraphNodes: (nodes) => set({ graphNodes: nodes }),

      setGraphLinks: (links) => set({ graphLinks: links }),

      updateGraph: () => {
        const { notes } = get();
        const linkRegex = /\[\[([^\]]+)\]\]/g;

        // Create nodes from notes
        const nodes: GraphNode[] = notes.map((note) => ({
          id: note.id,
          name: note.title,
          value: 0,
        }));

        // Create links from wikilinks
        const links: GraphLink[] = [];
        const linkCounts: Record<string, number> = {};

        notes.forEach((note) => {
          const matches = note.content.matchAll(linkRegex);
          for (const match of matches) {
            const linkedTitle = match[1];
            const linkedNote = notes.find((n) => n.title === linkedTitle);

            if (linkedNote && linkedNote.id !== note.id) {
              links.push({
                source: note.id,
                target: linkedNote.id,
              });

              // Count backlinks for node size
              linkCounts[linkedNote.id] = (linkCounts[linkedNote.id] || 0) + 1;
            }
          }
        });

        // Update node values based on backlink count
        nodes.forEach((node) => {
          node.value = linkCounts[node.id] || 0;
        });

        set({ graphNodes: nodes, graphLinks: links });
      },
    }),
    {
      name: 'hezeer-flow-storage',
      partialize: (state) => ({
        language: state.language,
        apiKey: state.apiKey,
        showOnboarding: state.showOnboarding,
        notes: state.notes,
      }),
    }
  )
);
