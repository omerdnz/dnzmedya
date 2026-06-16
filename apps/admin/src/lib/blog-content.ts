type ContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string };

function parseBlocks(content: unknown): ContentBlock[] {
  if (!content || typeof content !== 'object') return [];

  const obj = content as { blocks?: ContentBlock[]; content?: unknown[] };

  if (Array.isArray(obj.blocks)) return obj.blocks;

  if (Array.isArray(obj.content)) {
    return obj.content.flatMap((node) => {
      if (!node || typeof node !== 'object') return [];
      const n = node as { type?: string; content?: { type?: string; text?: string }[] };
      if (n.type === 'paragraph' && Array.isArray(n.content)) {
        const text = n.content.map((c) => c.text ?? '').join('');
        return text ? [{ type: 'paragraph' as const, text }] : [];
      }
      return [];
    });
  }

  return [];
}

export function blocksToEditorText(content: unknown): string {
  const blocks = parseBlocks(content);
  if (blocks.length === 0) return '';

  return blocks
    .map((block) => {
      if (block.type === 'heading') {
        const prefix = '#'.repeat(block.level);
        return `${prefix} ${block.text}`;
      }
      if (block.type === 'paragraph') return block.text;
      if (block.type === 'quote') return `> ${block.text}`;
      if (block.type === 'list') return block.items.map((item) => `- ${item}`).join('\n');
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

export function editorTextToBlocks(text: string): { blocks: ContentBlock[] } {
  const chunks = text.split(/\n\n+/).map((chunk) => chunk.trim()).filter(Boolean);
  const blocks: ContentBlock[] = [];

  for (const chunk of chunks) {
    const headingMatch = chunk.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    if (chunk.startsWith('> ')) {
      blocks.push({ type: 'quote', text: chunk.slice(2).trim() });
      continue;
    }

    const lines = chunk.split('\n');
    if (lines.every((line) => line.startsWith('- '))) {
      blocks.push({
        type: 'list',
        items: lines.map((line) => line.slice(2).trim()).filter(Boolean),
      });
      continue;
    }

    blocks.push({ type: 'paragraph', text: chunk });
  }

  if (blocks.length === 0 && text.trim()) {
    blocks.push({ type: 'paragraph', text: text.trim() });
  }

  return { blocks };
}
