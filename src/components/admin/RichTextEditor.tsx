import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your dental health post here...',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content</label>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col">
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Bold"
          >
            <span className="material-symbols-outlined text-[20px]">format_bold</span>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Italic"
          >
            <span className="material-symbols-outlined text-[20px]">format_italic</span>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Underline"
          >
            <span className="material-symbols-outlined text-[20px]">format_underlined</span>
          </button>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Numbered List"
          >
            <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
          </button>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Link"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Image"
          >
            <span className="material-symbols-outlined text-[20px]">image</span>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Quote"
          >
            <span className="material-symbols-outlined text-[20px]">format_quote</span>
          </button>
          <div className="flex-1"></div>
          <button
            type="button"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400"
            title="Preview"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
        </div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-6 py-6 border-none focus:ring-0 text-base min-h-[400px] bg-white dark:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none ${
            isFocused ? 'outline-none' : ''
          }`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
