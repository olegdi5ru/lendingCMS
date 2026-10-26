// Landing-MD v3.0 Parser
// Parses Landing Markdown into structured HTML with variable substitution

export interface ParsedPage {
  frontmatter: Record<string, string>;
  html: string;
  deferredHtml: string;
  blocks: ParsedBlock[];
}

export interface ParsedBlock {
  name: string;
  attrs: Record<string, string>;
  content: string;
  html: string;
}

// Parse YAML frontmatter
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const fmRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];
  const frontmatter: Record<string, string> = {};

  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

// Apply variable substitutions
function applySubstitutions(content: string, table: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\|([^}]*)\}\}/g, (_, key, fallback) => {
    return table[key] || fallback;
  });
}

// Parse container blocks (::: block_name {attrs})
function parseBlocks(content: string): { blocks: ParsedBlock[]; mainContent: string; deferredContent: string } {
  const blocks: ParsedBlock[] = [];
  const lines = content.split('\n');
  let currentBlock: ParsedBlock | null = null;
  let blockContent: string[] = [];
  let inFold = false;
  let foldContent: string[] = [];
  let mainContent: string[] = [];
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const blockStart = line.match(/^:::\s+(\w+)(?:\s+\{([^}]*)\})?/);
    const blockEnd = line.match(/^:::\s*$/);

    if (blockStart && !currentBlock) {
      const name = blockStart[1];
      const attrsStr = blockStart[2] || '';
      const attrs: Record<string, string> = {};

      // Parse attributes
      const attrRegex = /(\w+)="([^"]*)"/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
        attrs[attrMatch[1]] = attrMatch[2];
      }

      currentBlock = { name, attrs, content: '', html: '' };
      blockContent = [];
      depth++;

      if (name === 'fold') {
        inFold = true;
      }
    } else if (blockEnd && currentBlock) {
      depth--;
      currentBlock.content = blockContent.join('\n');
      currentBlock.html = renderBlock(currentBlock);
      blocks.push(currentBlock);

      if (inFold) {
        foldContent.push(currentBlock.html);
        inFold = false;
      } else {
        mainContent.push(currentBlock.html);
      }

      currentBlock = null;
      blockContent = [];
    } else if (currentBlock) {
      blockContent.push(line);
    } else {
      mainContent.push(line);
    }
  }

  return {
    blocks,
    mainContent: mainContent.join('\n'),
    deferredContent: foldContent.join('\n'),
  };
}

// Render a block to HTML
function renderBlock(block: ParsedBlock): string {
  const { name, attrs, content } = block;
  const parsedContent = parseInlineMarkdown(content);

  switch (name) {
    case 'hero':
      return `<section class="block-hero block-hero--${attrs.variant || 'default'}">
        <div class="hero-inner">${parsedContent}</div>
      </section>`;

    case 'pains':
      return `<section class="block-pains">
        <h2 class="pains-title">${attrs.title || ''}</h2>
        <div class="pains-grid pains-grid--${attrs.columns || '3'}">${parsedContent}</div>
      </section>`;

    case 'stats':
      return `<section class="block-stats">
        <div class="stats-grid stats-grid--${attrs.columns || '3'}">${parsedContent}</div>
      </section>`;

    case 'form':
      return `<section class="block-form">
        <h2 class="form-title">${attrs.title || ''}</h2>
        <div class="form-body">${parsedContent}</div>
      </section>`;

    case 'fold':
      return `<div class="block-fold" data-trigger="${attrs.trigger || 'scroll'}">${parsedContent}</div>`;

    default:
      return `<section class="block-${name}">${parsedContent}</section>`;
  }
}

// Parse inline markdown (headings, bold, links, lists)
function parseInlineMarkdown(content: string): string {
  let html = content;

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Links with attrs: [text]{.class #id}
  html = html.replace(/\[([^\]]+)\]\{([^}]*)\}/g, (_, text, attrStr) => {
    const classes: string[] = [];
    const id: string[] = [];
    const dataAttrs: string[] = [];

    attrStr.split(/\s+/).forEach((attr: string) => {
      if (attr.startsWith('.')) classes.push(attr.slice(1));
      else if (attr.startsWith('#')) id.push(attr.slice(1));
      else if (attr.includes('=')) {
        const [key, val] = attr.split('=');
        dataAttrs.push(`${key}="${val.replace(/"/g, '')}"`);
      }
    });

    const classStr = classes.length ? ` class="${classes.join(' ')}"` : '';
    const idStr = id.length ? ` id="${id[0]}"` : '';
    const dataStr = dataAttrs.length ? ` ${dataAttrs.join(' ')}` : '';

    return `<a href="#"${classStr}${idStr}${dataStr}>${text}</a>`;
  });

  // Simple links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  // Fix nested uls
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Tables (simple pipe format)
  const tableLines = html.split('\n').filter(l => l.includes('|'));
  if (tableLines.length > 0) {
    const rows = tableLines.map(line => {
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
      return cells;
    });
    if (rows.length > 0) {
      const tableHtml = `<table>${rows.map(row =>
        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
      ).join('')}</table>`;
      // Replace table lines
      tableLines.forEach(line => {
        html = html.replace(line, '');
      });
      html += tableHtml;
    }
  }

  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<')) return p;
    return `<p>${p}</p>`;
  }).join('\n');

  return html;
}

// Main parse function
export function parseLandingMD(rawContent: string, substitutionTable?: Record<string, string>): ParsedPage {
  // 1. Parse frontmatter
  const { frontmatter, body } = parseFrontmatter(rawContent);

  // 2. Apply substitutions
  const table = substitutionTable || {};
  const substituted = applySubstitutions(body, table);

  // 3. Parse blocks
  const { blocks, mainContent, deferredContent } = parseBlocks(substituted);

  // 4. Render main content
  const html = parseInlineMarkdown(mainContent);

  return {
    frontmatter,
    html,
    deferredHtml: deferredContent,
    blocks,
  };
}

// Semantic search simulation (cosine similarity)
export function semanticSearch(
  query: string,
  keywords: Array<{ keyword: string; substitutionTableId: string; embedding: number[] }>
): Array<{ keyword: string; substitutionTableId: string; similarity: number }> {
  // Simulate embedding for query
  const queryEmbedding = generateSimpleEmbedding(query);

  return keywords
    .map(k => ({
      keyword: k.keyword,
      substitutionTableId: k.substitutionTableId,
      similarity: cosineSimilarity(queryEmbedding, k.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

function generateSimpleEmbedding(text: string): number[] {
  const vec = new Array(32).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % 32] += text.charCodeAt(i) / 255;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => v / (norm || 1));
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}
