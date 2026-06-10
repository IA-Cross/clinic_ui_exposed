import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Editor Markdown: la barra inserta la sintaxis en el cursor y la pestaña
// "Vista previa" renderiza el resultado tal como se verá en el blog.
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe aquí el contenido del artículo…',
}) => {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insert = (before: string, after = '', placeholderText = 'texto') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const tools = [
    { icon: 'format_bold', title: 'Negrita', action: () => insert('**', '**') },
    { icon: 'format_italic', title: 'Cursiva', action: () => insert('*', '*') },
    { icon: 'title', title: 'Subtítulo', action: () => insert('\n## ', '\n', 'Subtítulo') },
    { icon: 'format_list_bulleted', title: 'Lista', action: () => insert('\n- ', '', 'elemento') },
    { icon: 'format_list_numbered', title: 'Lista numerada', action: () => insert('\n1. ', '', 'elemento') },
    { icon: 'link', title: 'Enlace', action: () => insert('[', '](https://)', 'texto del enlace') },
    { icon: 'format_quote', title: 'Cita', action: () => insert('\n> ', '\n', 'cita') },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contenido</label>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col">
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          {tools.map((t) => (
            <button
              key={t.icon}
              type="button"
              onClick={t.action}
              disabled={tab === 'preview'}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 disabled:opacity-40"
              title={t.title}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
            </button>
          ))}
          <div className="flex-1"></div>
          <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === 'write' ? 'bg-white dark:bg-slate-900 text-primary' : 'text-slate-500'
              }`}
            >
              Escribir
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                tab === 'preview' ? 'bg-white dark:bg-slate-900 text-primary' : 'text-slate-500'
              }`}
            >
              Vista previa
            </button>
          </div>
        </div>
        {tab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-6 py-6 border-none focus:ring-0 text-base min-h-[400px] bg-white dark:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-y font-mono text-sm"
            placeholder={placeholder}
          />
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none px-6 py-6 min-h-[400px] bg-white dark:bg-slate-900">
            {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-slate-400">Nada que previsualizar aún.</p>}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">
        Se admite formato Markdown: <code>**negrita**</code>, <code>*cursiva*</code>, <code>## subtítulos</code>, listas y enlaces.
      </p>
    </div>
  );
};
