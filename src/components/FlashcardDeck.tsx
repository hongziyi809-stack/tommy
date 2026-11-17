import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';
import { DISCIPLINES, FLASHCARDS } from '../data/curriculum';
import { Discipline, FlashcardStatus } from '../types/learning';

interface FlashcardDeckProps {
  statuses: Record<string, FlashcardStatus>;
  onSetStatus: (cardId: string, status: FlashcardStatus) => void;
}

export function FlashcardDeck({ statuses, onSetStatus }: FlashcardDeckProps) {
  const [discipline, setDiscipline] = useState<'全部學科' | Discipline>('全部學科');
  const [onlyReview, setOnlyReview] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    return FLASHCARDS.filter((card) => {
      const matchDisc = discipline === '全部學科' || card.discipline === discipline;
      const status = statuses[card.id] ?? 'new';
      const matchReview = !onlyReview || status !== 'mastered';
      return matchDisc && matchReview;
    });
  }, [discipline, onlyReview, statuses]);

  const safeIndex = cards.length > 0 ? Math.min(currentIndex, cards.length - 1) : 0;
  const currentCard = cards[safeIndex];

  useEffect(() => {
    setFlipped(false);
  }, [safeIndex, discipline, onlyReview]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (e.code === 'ArrowRight' && cards.length > 0) {
        setCurrentIndex((i) => (i + 1) % cards.length);
      } else if (e.code === 'ArrowLeft' && cards.length > 0) {
        setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cards.length]);

  const masteredTotal = FLASHCARDS.filter((c) => statuses[c.id] === 'mastered').length;

  const handleMark = (status: FlashcardStatus) => {
    if (!currentCard) return;
    onSetStatus(currentCard.id, status);
    if (cards.length > 1) {
      setFlipped(false);
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">概念記憶字卡</h1>
          <p className="text-sm text-slate-600 mt-1">
            點擊卡片或按空白鍵翻面檢視定義與實例，並標記您的精熟狀態。
          </p>
        </div>
        <div className="text-sm font-mono-tabular font-semibold text-slate-800">
          總精熟進度：{masteredTotal} / {FLASHCARDS.length} 張
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {DISCIPLINES.map((disc) => (
            <button
              key={disc}
              type="button"
              onClick={() => {
                setDiscipline(disc);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                discipline === disc ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyReview}
            onChange={(e) => {
              setOnlyReview(e.target.checked);
              setCurrentIndex(0);
            }}
            className="accent-sky-700 rounded cursor-pointer"
          />
          僅顯示待複習字卡
        </label>
      </div>

      {/* Flashcard Stage */}
      {!currentCard ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">此篩選分類的字卡已全數精熟</h2>
            <p className="text-sm text-slate-600">您可以取消「僅顯示待複習字卡」以重新瀏覽所有概念。</p>
          </div>
          <button
            type="button"
            onClick={() => setOnlyReview(false)}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
          >
            顯示全部字卡
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Info Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sky-700">{currentCard.discipline}</span>
              <span aria-hidden="true">·</span>
              <span>
                狀態：
                {statuses[currentCard.id] === 'mastered'
                  ? '已精熟'
                  : statuses[currentCard.id] === 'review'
                    ? '待加強複習'
                    : '尚未標記'}
              </span>
            </div>
            <span className="font-mono-tabular">
              第 {safeIndex + 1} / {cards.length} 張
            </span>
          </div>

          {/* 3D Flip Card */}
          <div className="perspective-1000">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              aria-label={flipped ? '點擊翻回正面概念名稱' : '點擊翻面檢視詳細定義'}
              className="w-full min-h-[300px] sm:min-h-[340px] relative transform-style-3d transition-transform duration-300 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
              style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>正面 · 核心術語</span>
                  <span className="inline-flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    點擊翻轉
                  </span>
                </div>

                <div className="text-center space-y-4 my-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                    {currentCard.term}
                  </h2>
                  {currentCard.formula && (
                    <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-serif-math text-base text-sky-800">
                      {currentCard.formula}
                    </div>
                  )}
                </div>

                <div className="text-center text-xs text-slate-400">按空白鍵或點擊卡片檢視解析</div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>背面 · 定義與應用</span>
                  <span className="inline-flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    點擊翻回
                  </span>
                </div>

                <div className="space-y-4 my-auto max-w-2xl mx-auto">
                  <div className="text-xs font-medium text-sky-300">{currentCard.term}</div>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-100">
                    {currentCard.definition}
                  </p>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <span className="font-semibold text-sky-300">實例連結：</span>
                    {currentCard.example}
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400">請於下方評定記憶程度</div>
              </div>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                上一張
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                下一張
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleMark('review')}
                className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
              >
                標記為需複習
              </button>
              <button
                type="button"
                onClick={() => handleMark('mastered')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                已完全熟悉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
