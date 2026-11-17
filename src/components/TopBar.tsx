import { AppView } from '../types/learning';

interface TopBarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onResumeLearning: () => void;
  hasProgress: boolean;
}

const NAV_ITEMS: Array<{ view: AppView; label: string }> = [
  { view: 'catalog', label: '課程探索' },
  { view: 'workspace', label: '互動實驗室' },
  { view: 'flashcards', label: '記憶字卡' },
  { view: 'notes', label: '學習筆記' },
];

export function TopBar({ activeView, onNavigate, onResumeLearning, hasProgress }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
        >
          知研學苑
        </button>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav aria-label="主要導覽" className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${
                  isActive
                    ? 'border-sky-700 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onResumeLearning}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            {hasProgress ? '繼續學習' : '開始學習'}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Row */}
      <nav
        aria-label="行動版導覽"
        className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-5 overflow-x-auto text-xs font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              className={`py-1 border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive ? 'border-sky-700 text-slate-900 font-semibold' : 'border-transparent text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
