export function extractWikilinks(content: string): string[] {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

export function replaceWikilinks(
  content: string,
  onClick: (title: string) => void
): string {
  return content.replace(
    /\[\[([^\]]+)\]\]/g,
    (match, title) => {
      return `[[${title}]]`;
    }
  );
}

export function getBacklinks(
  noteId: string,
  noteTitle: string,
  allNotes: Array<{ id: string; title: string; content: string }>
): Array<{ id: string; title: string; excerpt: string }> {
  const backlinks: Array<{ id: string; title: string; excerpt: string }> = [];

  allNotes.forEach((note) => {
    if (note.id === noteId) return;

    const linkRegex = new RegExp(`\\[\\[${noteTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\]`, 'g');
    const match = linkRegex.exec(note.content);

    if (match) {
      // Get a brief excerpt around the match
      const start = Math.max(0, match.index - 50);
      const end = Math.min(note.content.length, match.index + match[0].length + 50);
      const excerpt = '...' + note.content.slice(start, end) + '...';

      backlinks.push({
        id: note.id,
        title: note.title,
        excerpt,
      });
    }
  });

  return backlinks;
}
