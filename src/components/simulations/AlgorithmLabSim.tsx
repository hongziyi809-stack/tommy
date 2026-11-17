import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle, StepForward } from 'lucide-react';

type AlgoMode = 'bubble' | 'insertion' | 'binary';

interface AlgoStep {
  array: number[];
  activeIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  low?: number;
  mid?: number;
  high?: number;
  foundIndex?: number;
  comparisons: number;
  swaps: number;
  message: string;
}

function generateBubbleSteps(initial: number[]): AlgoStep[] {
  const arr = [...initial];
  const steps: AlgoStep[] = [
    {
      array: [...arr],
      activeIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      message: '氣泡排序就緒：準備從索引 0 開始進行相鄰比較。',
    },
  ];
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    let swappedInPass = false;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        swappedIndices: [],
        sortedIndices: [...sorted],
        comparisons,
        swaps,
        message: `比較索引 ${j}（數值 ${arr[j]}）與索引 ${j + 1}（數值 ${arr[j + 1]}）`,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swappedInPass = true;
        steps.push({
          array: [...arr],
          activeIndices: [],
          swappedIndices: [j, j + 1],
          sortedIndices: [...sorted],
          comparisons,
          swaps,
          message: `交換數值 ${arr[j + 1]} 與 ${arr[j]}，將較大值向右推進`,
        });
      }
    }
    sorted.push(arr.length - 1 - i);
    if (!swappedInPass) {
      for (let k = 0; k < arr.length - 1 - i; k++) sorted.push(k);
      break;
    }
  }
  const allSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  steps.push({
    array: [...arr],
    activeIndices: [],
    swappedIndices: [],
    sortedIndices: allSorted,
    comparisons,
    swaps,
    message: `排序完成！共進行 ${comparisons} 次比較與 ${swaps} 次交換。`,
  });
  return steps;
}

function generateInsertionSteps(initial: number[]): AlgoStep[] {
  const arr = [...initial];
  const steps: AlgoStep[] = [
    {
      array: [...arr],
      activeIndices: [0],
      swappedIndices: [],
      sortedIndices: [0],
      comparisons: 0,
      swaps: 0,
      message: '插入排序就緒：索引 0 視為初始已排序區間。',
    },
  ];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    const sorted = Array.from({ length: i }, (_, idx) => idx);
    steps.push({
      array: [...arr],
      activeIndices: [i],
      swappedIndices: [],
      sortedIndices: sorted,
      comparisons,
      swaps,
      message: `取出索引 ${i} 的待插入元素（數值 ${key}）`,
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        swappedIndices: [],
        sortedIndices: sorted,
        comparisons,
        swaps,
        message: `比較待插入值 ${key} 與已排序元素 ${arr[j]}`,
      });
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        arr[j] = key;
        swaps++;
        steps.push({
          array: [...arr],
          activeIndices: [],
          swappedIndices: [j, j + 1],
          sortedIndices: sorted,
          comparisons,
          swaps,
          message: `將 ${arr[j + 1]} 右移一格，為 ${key} 騰出位置`,
        });
        j--;
      } else {
        break;
      }
    }
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, idx) => idx),
    comparisons,
    swaps,
    message: `插入排序完成！共進行 ${comparisons} 次比較與 ${swaps} 次位移。`,
  });
  return steps;
}

function generateBinarySearchSteps(sortedArr: number[], target: number): AlgoStep[] {
  const steps: AlgoStep[] = [
    {
      array: [...sortedArr],
      activeIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      low: 0,
      high: sortedArr.length - 1,
      comparisons: 0,
      swaps: 0,
      message: `二分搜尋就緒：在已排序陣列搜尋目標值 ${target}（區間 0 ~ ${sortedArr.length - 1}）。`,
    },
  ];
  let low = 0;
  let high = sortedArr.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    comparisons++;
    steps.push({
      array: [...sortedArr],
      activeIndices: [mid],
      swappedIndices: [],
      sortedIndices: [],
      low,
      mid,
      high,
      comparisons,
      swaps: 0,
      message: `第 ${comparisons} 次比較：中位索引 mid = ${mid}（數值 ${sortedArr[mid]}）`,
    });

    if (sortedArr[mid] === target) {
      steps.push({
        array: [...sortedArr],
        activeIndices: [],
        swappedIndices: [],
        sortedIndices: [mid],
        low,
        mid,
        high,
        foundIndex: mid,
        comparisons,
        swaps: 0,
        message: `成功找到目標值 ${target}！位於索引 ${mid}，僅使用 ${comparisons} 次比較。`,
      });
      return steps;
    } else if (sortedArr[mid] < target) {
      low = mid + 1;
      steps.push({
        array: [...sortedArr],
        activeIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        low,
        high,
        comparisons,
        swaps: 0,
        message: `${sortedArr[mid]} < ${target}：捨棄左半部，將左邊界更新為 low = ${low}`,
      });
    } else {
      high = mid - 1;
      steps.push({
        array: [...sortedArr],
        activeIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        low,
        high,
        comparisons,
        swaps: 0,
        message: `${sortedArr[mid]} > ${target}：捨棄右半部，將右邊界更新為 high = ${high}`,
      });
    }
  }

  steps.push({
    array: [...sortedArr],
    activeIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    low,
    high,
    comparisons,
    swaps: 0,
    message: `搜尋結束：陣列中不存在目標值 ${target}（總比較次數 ${comparisons} 次）。`,
  });
  return steps;
}

const DEFAULT_UNSORTED = [42, 18, 75, 29, 64, 12, 88, 53, 35];
const DEFAULT_SORTED = [12, 18, 29, 35, 42, 53, 64, 75, 88];

export function AlgorithmLabSim() {
  const [mode, setMode] = useState<AlgoMode>('bubble');
  const [unsortedBase, setUnsortedBase] = useState<number[]>(DEFAULT_UNSORTED);
  const [targetValue, setTargetValue] = useState<number>(64);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(450);

  const steps = useMemo(() => {
    if (mode === 'bubble') return generateBubbleSteps(unsortedBase);
    if (mode === 'insertion') return generateInsertionSteps(unsortedBase);
    return generateBinarySearchSteps(DEFAULT_SORTED, targetValue);
  }, [mode, unsortedBase, targetValue]);

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [mode, unsortedBase, targetValue]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speedMs]);

  const shuffleArray = () => {
    const next = [...unsortedBase];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setUnsortedBase(next);
  };

  return (
    <div className="space-y-6">
      {/* Mode & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('bubble')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'bubble' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            氣泡排序 O(n²)
          </button>
          <button
            type="button"
            onClick={() => setMode('insertion')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'insertion' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            插入排序 O(n²)
          </button>
          <button
            type="button"
            onClick={() => setMode('binary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'binary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            二分搜尋 O(log n)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (stepIdx >= steps.length - 1) setStepIdx(0);
              setIsPlaying((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-700 text-white hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? '暫停執行' : '自動播放'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
            }}
            disabled={stepIdx >= steps.length - 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            單步前進
          </button>
          {mode !== 'binary' && (
            <button
              type="button"
              onClick={shuffleArray}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              隨機洗牌
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx(0);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            回到第 0 步
          </button>
        </div>
      </div>

      {/* Main Visualization Stage */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="text-xs font-medium text-slate-700">
            狀態追蹤：<span className="text-slate-900 font-semibold">{currentStep.message}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono-tabular text-slate-600">
            <span>步驟 {stepIdx} / {steps.length - 1}</span>
            <span>比較：{currentStep.comparisons} 次</span>
            {mode !== 'binary' && <span>交換/位移：{currentStep.swaps} 次</span>}
          </div>
        </div>

        {/* Array Bar Stage */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="grid grid-cols-9 gap-2.5 items-end h-52 pt-4">
            {currentStep.array.map((val, idx) => {
              const isActive = currentStep.activeIndices.includes(idx);
              const isSwapped = currentStep.swappedIndices.includes(idx);
              const isSorted = currentStep.sortedIndices.includes(idx);
              const isOutOfBounds =
                mode === 'binary' &&
                currentStep.low !== undefined &&
                currentStep.high !== undefined &&
                (idx < currentStep.low || idx > currentStep.high);

              let barColor = 'bg-slate-700';
              let stateTag = '';
              if (currentStep.foundIndex === idx || isSorted) {
                barColor = 'bg-emerald-600';
                stateTag = mode === 'binary' ? '命中' : '已定';
              } else if (isSwapped) {
                barColor = 'bg-amber-600';
                stateTag = '交換';
              } else if (isActive) {
                barColor = 'bg-sky-600';
                stateTag = mode === 'binary' ? 'MID' : '比較';
              } else if (isOutOfBounds) {
                barColor = 'bg-slate-200';
              }

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end">
                  <span className="text-[11px] font-medium text-slate-700 mb-1 h-4">
                    {stateTag}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-200 flex items-start justify-center pt-1.5 ${barColor}`}
                    style={{ height: `${Math.max(22, val)}%` }}
                  >
                    <span
                      className={`text-xs font-mono-tabular font-semibold ${
                        isOutOfBounds ? 'text-slate-500' : 'text-white'
                      }`}
                    >
                      {val}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-tabular text-slate-500 mt-1.5">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Binary Search Pointers Legend */}
          {mode === 'binary' && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-4 font-mono-tabular">
                <span>Low = {currentStep.low ?? '—'}</span>
                <span>Mid = {currentStep.mid ?? '—'}</span>
                <span>High = {currentStep.high ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="bs-target" className="font-medium text-slate-700">
                  搜尋目標值：
                </label>
                <select
                  id="bs-target"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseInt(e.target.value, 10))}
                  className="border border-slate-300 rounded-md px-2 py-1 text-xs font-mono-tabular bg-white text-slate-900 cursor-pointer"
                >
                  {DEFAULT_SORTED.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  <option value={50}>50（不存在示範）</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Speed Control */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <label htmlFor="algo-speed">動畫步進間隔</label>
              <span className="font-mono-tabular text-slate-900">{speedMs} ms</span>
            </div>
            <input
              id="algo-speed"
              type="range"
              min={150}
              max={900}
              step={50}
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-600 inline-block" />
              目前比較
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-600 inline-block" />
              元素交換
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              已定位／命中
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
