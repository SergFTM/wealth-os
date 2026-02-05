'use client';

import React, { useState } from 'react';
import { ApiDoc, apiDocCategoryLabels } from '../schema/apiDoc';

interface ApiDocsViewProps {
  docs: ApiDoc[];
}

export function ApiDocsView({ docs }: ApiDocsViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<ApiDoc | null>(docs[0] || null);

  // Group docs by category
  const docsByCategory = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, ApiDoc[]>);

  const categories = Object.keys(docsByCategory).sort((a, b) => {
    const order = ['overview', 'authentication', 'endpoints', 'webhooks', 'errors', 'examples'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {apiDocCategoryLabels[category as ApiDoc['category']]?.ru || category}
              </h3>
              <ul className="space-y-1">
                {docsByCategory[category]
                  .sort((a, b) => a.order - b.order)
                  .map((doc) => (
                    <li key={doc.id}>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className={`
                          w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                          ${selectedDoc?.id === doc.id
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        {doc.titleRu || doc.title}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {selectedDoc ? (
          <article className="prose prose-emerald max-w-none">
            <h1>{selectedDoc.titleRu || selectedDoc.title}</h1>
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(selectedDoc.contentMdRu || selectedDoc.contentMd),
              }}
            />
          </article>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Выберите раздел документации</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple markdown renderer (in production use a proper library)
function renderMarkdown(md: string): string {
  return md
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="language-$1"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-3]>)/g, '$1')
    .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
    .replace(/<p>(<pre)/g, '$1')
    .replace(/(<\/pre>)<\/p>/g, '$1')
    .replace(/<p>(<li>)/g, '<ul>$1')
    .replace(/(<\/li>)<\/p>/g, '$1</ul>');
}
