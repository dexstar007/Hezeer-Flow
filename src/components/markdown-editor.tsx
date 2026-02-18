'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { useHezeerFlow } from '@/store/use-hezeer-flow';
import { useTranslation } from '@/hooks/use-translation';
import { extractWikilinks, getBacklinks } from '@/lib/wikilinks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Edit3, Eye, Plus, Save, Trash2, Link as LinkIcon } from 'lucide-react';

interface MarkdownEditorProps {
  noteId?: string;
  onSave?: (note: any) => void;
  readOnly?: boolean;
}

export function MarkdownEditor({ noteId, onSave, readOnly = false }: MarkdownEditorProps) {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const {
    currentNote,
    notes,
    setCurrentNote,
    updateNote,
    deleteNote,
  } = useHezeerFlow();

  const [isPreview, setIsPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localContent, setLocalContent] = useState(currentNote?.content || '');
  const [localTitle, setLocalTitle] = useState(currentNote?.title || '');
  const [currentNoteId, setCurrentNoteId] = useState(currentNote?.id);

  // Sync local state when note changes (not on every render)
  if (currentNote?.id !== currentNoteId && currentNote) {
    setCurrentNoteId(currentNote.id);
    setLocalContent(currentNote.content);
    setLocalTitle(currentNote.title);
  }

  // Handle content change
  const handleContentChange = (value: string) => {
    setLocalContent(value);
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Handle wikilink click
  const handleWikilinkClick = (linkedTitle: string) => {
    const linkedNote = notes.find((n) => n.title === linkedTitle);

    if (linkedNote) {
      setCurrentNote(linkedNote);
    } else {
      // Create new note if it doesn't exist
      const newNote = {
        id: `note-${Date.now()}`,
        title: linkedTitle,
        content: '',
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updateNote(newNote.id, newNote);
      setCurrentNote(newNote);
    }
  };

  // Get backlinks for current note
  const backlinks = currentNote
    ? getBacklinks(currentNote.id, currentNote.title, notes)
    : [];

  // Custom markdown renderer
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

      return !inline && match ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a: ({ href, children }: any) => {
      // Handle wikilinks
      if (href?.startsWith('wikilink:')) {
        const title = href.replace('wikilink:', '');
        return (
          <button
            onClick={() => handleWikilinkClick(title)}
            className="text-primary hover:underline font-medium"
          >
            {children}
          </button>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
  };

  // Process wikilinks in markdown
  const processMarkdown = (text: string) => {
    return text.replace(
      /\[\[([^\]]+)\]\]/g,
      (match, title) => `[${title}](wikilink:${title})`
    );
  };

  // Save note
  const handleSave = () => {
    if (!currentNote) return;

    updateNote(currentNote.id, {
      title: localTitle,
      content: localContent,
    });

    if (onSave) {
      onSave(currentNote);
    }
  };

  // Delete note
  const handleDelete = () => {
    if (!currentNote) return;
    if (confirm(t.confirmDelete)) {
      deleteNote(currentNote.id);
      setCurrentNote(null);
    }
  };

  // Insert template
  const insertTemplate = (template: string) => {
    let templateContent = '';

    switch (template) {
      case 'daily':
        templateContent = `# Daily Note - ${new Date().toLocaleDateString()}

## Tasks
- [ ] 

## Notes


## Reflection

`;
        break;
      case 'meeting':
        templateContent = `# Meeting

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 
- 

## Agenda
1. 
2. 
3. 

## Discussion

## Action Items
- [ ] 

## Decisions

`;
        break;
      case 'project':
        templateContent = `# Project Plan

## Overview

## Goals

## Timeline

## Resources

## Milestones
1. 
2. 
3. 

## Notes

`;
        break;
    }

    setLocalContent((prev) => prev + templateContent);
    setShowTemplates(false);
  };

  // Handle slash command
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '/') {
      const textarea = e.currentTarget;
      const value = textarea.value;
      const start = textarea.selectionStart;

      // Check if / is at the start of a new line
      const beforeCursor = value.substring(0, start);
      const lastNewline = beforeCursor.lastIndexOf('\n');
      const afterNewline = beforeCursor.substring(lastNewline + 1).trim();

      if (afterNewline === '/') {
        e.preventDefault();
        setShowTemplates(true);
      }
    }
  };

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">{t.noNotesYet}</p>
          <p className="text-sm">{t.clickPlusToStart}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder={t.untitledNote}
          className="text-2xl font-bold bg-transparent border-none outline-none flex-1"
          disabled={readOnly}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={readOnly}
          >
            <Save className="h-4 w-4 mr-2" />
            {t.save}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={readOnly}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Templates Menu */}
      {showTemplates && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-2 z-50">
          <button
            onClick={() => insertTemplate('daily')}
            className="w-full text-left px-3 py-2 hover:bg-accent rounded"
          >
            {t.dailyNote}
          </button>
          <button
            onClick={() => insertTemplate('meeting')}
            className="w-full text-left px-3 py-2 hover:bg-accent rounded"
          >
            {t.meetingTemplate}
          </button>
          <button
            onClick={() => insertTemplate('project')}
            className="w-full text-left px-3 py-2 hover:bg-accent rounded"
          >
            {t.projectPlan}
          </button>
        </div>
      )}

      {/* Editor or Preview */}
      <ScrollArea className="flex-1 p-6">
        {isPreview ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={components}
              remarkPlugins={[]}
            >
              {processMarkdown(localContent)}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.typeSlashForTemplates}
            className="min-h-[500px] font-mono text-sm resize-none border-none focus:ring-0 p-0"
            disabled={readOnly}
          />
        )}
      </ScrollArea>

      {/* Backlinks Section */}
      {backlinks.length > 0 && (
        <>
          <Separator />
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t.mentionedIn}</span>
            </div>
            <div className="space-y-2">
              {backlinks.map((backlink) => (
                <button
                  key={backlink.id}
                  onClick={() => {
                    const note = notes.find((n) => n.id === backlink.id);
                    if (note) setCurrentNote(note);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
                >
                  <div className="font-medium text-sm">{backlink.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {backlink.excerpt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
