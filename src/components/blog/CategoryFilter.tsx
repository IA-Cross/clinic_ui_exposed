import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-10 pb-2 border-b border-slate-200 dark:border-slate-800">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
          selectedCategory === null
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
        }`}
      >
        Todos
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            selectedCategory === category
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
          }`}
        >
          {category}
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>
      ))}
    </div>
  );
};
