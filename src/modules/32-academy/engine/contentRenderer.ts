// Content Renderer for Knowledge Base
// Renders markdown with custom blocks

interface RenderOptions {
  locale: 'ru' | 'en' | 'uk';
  clientSafe?: boolean;
}

// Parse callout blocks: > [!type] content
function parseCallouts(content: string): string {
  const calloutRegex = /> \[!(info|warning|danger|tip|note)\]\s*\n((?:>.*\n?)*)/gim;

  return content.replace(calloutRegex, (_, type, body) => {
    const cleanBody = body.replace(/^>\s?/gm, '').trim();
    const icons: Record<string, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      danger: '🚨',
      tip: '💡',
      note: '📝',
    };
    const colors: Record<string, string> = {
      info: 'blue',
      warning: 'amber',
      danger: 'rose',
      tip: 'emerald',
      note: 'stone',
    };

    return `<div class="callout callout-${colors[type] || 'stone'}">${icons[type] || ''} ${cleanBody}</div>`;
  });
}

// Parse step blocks: 1. [x] Step text
function parseSteps(content: string): string {
  const stepRegex = /^(\d+)\.\s*\[([ x])\]\s*(.+)$/gm;

  let hasSteps = false;
  let result = content;

  result = result.replace(stepRegex, (_, num, check, text) => {
    hasSteps = true;
    const checked = check === 'x' ? 'checked' : '';
    return `<div class="step-item"><span class="step-num">${num}</span><input type="checkbox" ${checked} disabled /><span class="step-text">${text}</span></div>`;
  });

  if (hasSteps) {
    result = `<div class="steps-container">${result}</div>`;
  }

  return result;
}

// Parse module links: [[module:slug]]
function parseModuleLinks(content: string): string {
  const linkRegex = /\[\[module:([a-z-]+)\]\]/g;

  return content.replace(linkRegex, (_, slug) => {
    return `<a href="/m/${slug}" class="module-link">→ ${slug}</a>`;
  });
}

// Parse screen links: [[screen:path|label]]
function parseScreenLinks(content: string): string {
  const linkRegex = /\[\[screen:([^\]|]+)\|?([^\]]*)\]\]/g;

  return content.replace(linkRegex, (_, path, label) => {
    const displayLabel = label || path;
    return `<a href="${path}" class="screen-link">${displayLabel}</a>`;
  });
}

// Simple markdown to HTML (basic)
function basicMarkdown(content: string): string {
  let result = content;

  // Headers
  result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code blocks
  result = result.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>');
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  result = result.replace(/^- (.+)$/gm, '<li>$1</li>');
  result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Numbered lists
  result = result.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Blockquotes (simple)
  result = result.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs
  result = result.replace(/\n\n/g, '</p><p>');
  result = `<p>${result}</p>`;

  // Clean up empty paragraphs
  result = result.replace(/<p>\s*<\/p>/g, '');
  result = result.replace(/<p>(<h[123]>)/g, '$1');
  result = result.replace(/(<\/h[123]>)<\/p>/g, '$1');

  return result;
}

// Main render function
export function renderContent(
  content: string,
  options: RenderOptions
): string {
  let result = content;

  // Apply transformations in order
  result = parseCallouts(result);
  result = parseSteps(result);
  result = parseModuleLinks(result);
  result = parseScreenLinks(result);
  result = basicMarkdown(result);

  // Wrap in container with premium typography
  return `<div class="kb-content prose prose-emerald">${result}</div>`;
}

// Extract plain text (for search indexing)
export function extractPlainText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links to text
    .replace(/\[\[.*?\]\]/g, '') // Remove custom links
    .replace(/[#*_>`~]/g, '') // Remove markdown chars
    .replace(/\n+/g, ' ') // Collapse newlines
    .trim();
}

// Get table of contents from content
export function extractToc(content: string): { level: number; text: string; id: string }[] {
  const toc: { level: number; text: string; id: string }[] = [];
  const headerRegex = /^(#{1,3})\s+(.+)$/gm;

  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
    toc.push({ level, text, id });
  }

  return toc;
}

// Get estimated reading time
export function getReadingTime(content: string): number {
  const plainText = extractPlainText(content);
  const wordCount = plainText.split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}

export type { RenderOptions };
