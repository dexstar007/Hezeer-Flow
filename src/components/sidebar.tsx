'use client';

import { useState, useMemo, useCallback } from 'react';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { useTranslation } from '@/hooks/use-translation';
import { useNotes } from '@/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ApiKeyButton } from '@/components/api-key-modal';
import {
  FileText,
  Tag,
  Plus,
  Search,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Folder,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Sidebar() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { notes, currentNote, setCurrentNote, createNote, searchNotes } =
    useNotes();
  const { selectedTags, setSelectedTags, sidebarOpen, setSidebarOpen } =
    useHezeerFlow();

  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique tags using useMemo
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notes]);

  // Filter notes based on search and selected tags using useMemo
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, selectedTags, notes]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Create new note
  const handleNewNote = async () => {
    const newNote = await createNote(`${t.untitledNote} ${notes.length + 1}`);
    setCurrentNote(newNote);
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="w-72 border-r flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Folder className="h-5 w-5" />
            {t.appName}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* New Note Button */}
        <Button onClick={handleNewNote} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t.newNote}
        </Button>
      </div>

      {/* Language Toggle */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{language === 'en' ? 'EN' : 'ES'}</span>
        </div>
        <Switch checked={language === 'es'} onCheckedChange={toggleLanguage} />
      </div>

      {/* Theme Toggle */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-3 pb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <FileText className="h-4 w-4" />
            {t.documents}
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {searchQuery || selectedTags.length > 0
                ? 'No matching notes'
                : t.noDocuments}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setCurrentNote(note)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    currentNote?.id === note.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="font-medium text-sm truncate">
                    {note.title || t.untitledNote}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          +{note.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <Separator />

      {/* Tags List */}
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <Tag className="h-4 w-4" />
          {t.tags}
        </div>

        {allTags.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            {t.noTags}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* API Settings */}
      <div className="p-3">
        <ApiKeyButton />
      </div>
    </div>
  );
}
