import Dexie, { Table } from 'dexie';

export interface NoteDB {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TagDB {
  id?: string;
  name: string;
  color?: string;
  createdAt: number;
}

export interface GraphMetadataDB {
  id?: string;
  noteId: string;
  links: string[];
  backlinks: string[];
  updatedAt: number;
}

export class HezeerFlowDB extends Dexie {
  notes!: Table<NoteDB>;
  tags!: Table<TagDB>;
  graphMetadata!: Table<GraphMetadataDB>;

  constructor() {
    super('HezeerFlowDB');

    // Define schema
    this.version(1).stores({
      notes: 'id, title, *tags, createdAt, updatedAt',
      tags: 'id, name, createdAt',
      graphMetadata: 'id, noteId, updatedAt',
    });
  }
}

export const db = new HezeerFlowDB();

// Database helper functions
export const dbHelpers = {
  async getAllNotes(): Promise<NoteDB[]> {
    return await db.notes.toArray();
  },

  async getNote(id: string): Promise<NoteDB | undefined> {
    return await db.notes.get(id);
  },

  async saveNote(note: NoteDB): Promise<string> {
    if (note.id) {
      await db.notes.put(note);
      return note.id;
    } else {
      return await db.notes.add(note);
    }
  },

  async deleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
    await db.graphMetadata.where('noteId').equals(id).delete();
  },

  async getAllTags(): Promise<TagDB[]> {
    return await db.tags.toArray();
  },

  async saveTag(tag: TagDB): Promise<string> {
    if (tag.id) {
      await db.tags.put(tag);
      return tag.id;
    } else {
      return await db.tags.add(tag);
    }
  },

  async deleteTag(id: string): Promise<void> {
    await db.tags.delete(id);
  },

  async searchNotes(query: string): Promise<NoteDB[]> {
    const allNotes = await db.notes.toArray();
    const lowerQuery = query.toLowerCase();

    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  async getNotesByTags(tagNames: string[]): Promise<NoteDB[]> {
    const allNotes = await db.notes.toArray();

    return allNotes.filter((note) =>
      tagNames.every((tagName) => note.tags.includes(tagName))
    );
  },

  async updateGraphMetadata(noteId: string, links: string[], backlinks: string[]): Promise<void> {
    const existing = await db.graphMetadata.where('noteId').equals(noteId).first();

    if (existing) {
      await db.graphMetadata.put({
        ...existing,
        links,
        backlinks,
        updatedAt: Date.now(),
      });
    } else {
      await db.graphMetadata.add({
        id: `graph-${noteId}`,
        noteId,
        links,
        backlinks,
        updatedAt: Date.now(),
      });
    }
  },

  async getBacklinks(noteId: string): Promise<GraphMetadataDB | undefined> {
    return await db.graphMetadata.where('noteId').equals(noteId).first();
  },

  async exportAllData(): Promise<Blob> {
    const notes = await db.notes.toArray();
    const tags = await db.tags.toArray();
    const graphMetadata = await db.graphMetadata.toArray();

    const data = {
      notes,
      tags,
      graphMetadata,
      exportedAt: new Date().toISOString(),
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  },

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);

    if (data.notes && Array.isArray(data.notes)) {
      await db.notes.clear();
      await db.notes.bulkAdd(data.notes);
    }

    if (data.tags && Array.isArray(data.tags)) {
      await db.tags.clear();
      await db.tags.bulkAdd(data.tags);
    }

    if (data.graphMetadata && Array.isArray(data.graphMetadata)) {
      await db.graphMetadata.clear();
      await db.graphMetadata.bulkAdd(data.graphMetadata);
    }
  },
};
