import { useEffect, useState } from 'react';
import { useHezeerFlow, Note } from '@/store/use-hezeer-flow';
import { dbHelpers, NoteDB } from '@/lib/db-indexed';
import { v4 as uuidv4 } from 'uuid';

export function useNotes() {
  const { notes, setNotes, addNote, updateNote, deleteNote, updateGraph } =
    useHezeerFlow();
  const [loading, setLoading] = useState(true);

  // Load notes from IndexedDB on mount
  useEffect(() => {
    async function loadNotes() {
      try {
        const dbNotes = await dbHelpers.getAllNotes();
        const notes: Note[] = dbNotes.map((dbNote) => ({
          id: dbNote.id || uuidv4(),
          title: dbNote.title,
          content: dbNote.content,
          tags: dbNote.tags,
          createdAt: dbNote.createdAt,
          updatedAt: dbNote.updatedAt,
        }));
        setNotes(notes);
        setLoading(false);
      } catch (error) {
        console.error('Error loading notes:', error);
        setLoading(false);
      }
    }

    loadNotes();
  }, [setNotes]);

  // Create a new note
  const createNote = async (title: string, content: string = '', tags: string[] = []) => {
    const note: Note = {
      id: uuidv4(),
      title,
      content,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save to IndexedDB
    await dbHelpers.saveNote({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });

    // Update state
    addNote(note);
    return note;
  };

  // Update an existing note
  const editNote = async (id: string, updates: Partial<Note>) => {
    // Update in IndexedDB
    const existing = await dbHelpers.getNote(id);
    if (existing) {
      await dbHelpers.saveNote({
        ...existing,
        ...updates,
        updatedAt: Date.now(),
      });
    }

    // Update state
    updateNote(id, updates);
    updateGraph();
  };

  // Delete a note
  const removeNote = async (id: string) => {
    await dbHelpers.deleteNote(id);
    deleteNote(id);
    updateGraph();
  };

  // Search notes
  const searchNotes = async (query: string) => {
    const results = await dbHelpers.searchNotes(query);
    return results.map((dbNote) => ({
      id: dbNote.id || uuidv4(),
      title: dbNote.title,
      content: dbNote.content,
      tags: dbNote.tags,
      createdAt: dbNote.createdAt,
      updatedAt: dbNote.updatedAt,
    }));
  };

  // Get notes by tags
  const getNotesByTags = async (tagNames: string[]) => {
    const results = await dbHelpers.getNotesByTags(tagNames);
    return results.map((dbNote) => ({
      id: dbNote.id || uuidv4(),
      title: dbNote.title,
      content: dbNote.content,
      tags: dbNote.tags,
      createdAt: dbNote.createdAt,
      updatedAt: dbNote.updatedAt,
    }));
  };

  return {
    notes,
    loading,
    createNote,
    editNote,
    removeNote,
    searchNotes,
    getNotesByTags,
    setCurrentNote: useHezeerFlow((state) => state.setCurrentNote),
    currentNote: useHezeerFlow((state) => state.currentNote),
  };
}
