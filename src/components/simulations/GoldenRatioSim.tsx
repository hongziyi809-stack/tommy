import { useMemo, useState } from 'react';
import { Compass, GitBranch, RotateCcw } from 'lucide-react';

interface FibSquare {
  n: number;
  size: number;
  x: number;
  y: number;
  arcPath: string;
  ratio: number | null;
}

const PHI = (1 + Math.sqrt(5)) / 2;

function buildFibonacciGeometry(count: number): {
  squares: FibSquare[];
  viewBox: string;
} {
  const fibs: number[] = [];
  for (let i = 0; i < count; i++) {
    fibs.push(i < 2 ? 1 : fibs[i - 1] + fibs[i - 2]);
  }

  let minX = 0;
  let minY = 0;
  let maxX = 1;
  let maxY = 1;

  const squares: FibSquare[] = [];

  fibs.forEach((size, index) => {
    let x = 0;
    let y = 0;
    let arcPath = '';

    if (index === 0) {
      x = 0;
      y = 0;
      minX = 0;
      minY = 0;
      maxX = 1;
      maxY = 1;
      // Quarter circle from bottom-right to top-left
      arcPath = `M ${x + size} ${y + size} A ${size} ${size} 0 0 1 ${x} ${y}`;
    } else {
      const dir = index % 4;
      if (dir === 1) {
        // Right
        x = maxX;
        y = minY;
        maxX += size;
        arcPath = `M ${x} ${y + size} A ${size} ${size} 0 0 0 ${x + size} ${y}`;
      } else if (dir === 2) {
        // Top
        x = minX;
        y = minY - size;
        minY -= size;
        arcPath = `M ${x + size} ${y + size} A ${size} ${size} 0 0 0 ${x} ${y}`;
      } else if (dir === 3) {
        // Left
        x = minX - size;
        y = minY;
        minX -= size;
        arcPath = `M ${x + size} ${y} A ${size} ${size} 0 0 0 ${x} ${y + size}`;
      } else {
        // Bottom
        x = minX;
        y = maxY;
        maxY += size;
        arcPath = `M ${x} ${y} A ${size} ${size} 0 0 0 ${x + size} ${y + size}`;
      }
    }

    squares.push({
      n: index + 1,
      size,
      x,
      y,
      arcPath,
      ratio: index > 0 ? size / fibs[index - 1] : null,
    });
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const pad = Math.max(width, height) * 0.08;

  return {
    squares,
    viewBox: `${minX - pad} ${minY - pad} ${width + pad * 2} ${height + pad * 2}`,
  };
}

export function GoldenRatioSim() {
  const [mode, setMode] = useState<'golden' | 'bayes'>('golden');

  // Golden Ratio Explorer state
  const [termsCount, setTermsCount] = useState(8);
  const [showSpiral, setShowSpiral] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Probability Tree state (Bayesian medical/diagnostic model)
  const [prevalencePct, setPrevalencePct] = useState(2);
  const [sensitivityPct, setSensitivityPct] = useState(95);
  const [specificityPct, setSpecificityPct] = useState(95);

  const geometry = useMemo(() => buildFibonacciGeometry(termsCount), [termsCount]);

  // Bayes calculation on cohort of 10,000
  const bayes = useMemo(() => {
    const pop = 10000;
    const pD = prevalencePct / 100;
    const sens = sensitivityPct / 100;
    const spec = specificityPct / 100;

    const diseased = pop * pD;
    const healthy = pop * (1 - pD);
    const truePos = diseased * sens;
    const falseNeg = diseased * (1 - sens);
    const trueNeg = healthy * spec;
    const falsePos = healthy * (1 - spec);
    const totalPos = truePos + falsePos;
    const ppv = totalPos > 0 ? (truePos / totalPos) * 100 : 0;

    return { pop, diseased, healthy, truePos, falseNeg, trueNeg, falsePos, totalPos, ppv };
  }, [prevalencePct, sensitivityPct, specificityPct]);

  return (
    <div className="space-y-6">
      {/* Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('golden')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'golden' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            費氏螺旋與黃金比例
          </button>
          <button
            type="button"
            onClick={() => setMode('bayes')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'bayes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            貝氏機率決策樹
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mode === 'golden') {
              setTermsCount(8);
              setShowSpiral(true);
              setShowLabels(true);
            } else {
              setPrevalencePct(2);
              setSensitivityPct(95);
              setSpecificityPct(95);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重設模型
        </button>
      </div>

      {mode === 'golden' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive SVG Canvas */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-900">
                巢狀費氏正方形構造（N = {termsCount} 階）
              </span>
              <span className="text-xs font-mono-tabular text-sky-700 font-medium">
                φ = {PHI.toFixed(6)}
              </span>
            </div>

            <svg
              viewBox={geometry.viewBox}
              className="w-full h-[320px] bg-slate-50 border border-slate-200 rounded-lg"
              role="img"
              aria-label="費氏數列正方形與黃金螺線幾何圖"
            >
              {geometry.squares.map((sq, idx) => (
                <g key={sq.n}>
                  <rect
                    x={sq.x}
                    y={sq.y}
                    width={sq.size}
                    height={sq.size}
                    fill={idx === geometry.squares.length - 1 ? '#e0f2fe' : '#ffffff'}
                    stroke="#334155"
                    strokeWidth={Math.max(0.06, sq.size * 0.015)}
                  />
                  {showSpiral && (
                    <path
                      d={sq.arcPath}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth={Math.max(0.1, geometry.squares[geometry.squares.length - 1].size * 0.025)}
                    />
                  )}
                  {showLabels && sq.size >= 2 && (
                    <text
                      x={sq.x + sq.size / 2}
                      y={sq.y + sq.size / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={Math.max(0.8, sq.size * 0.34)}
                      fill="#0f172a"
                      fontWeight="600"
                    >
                      {sq.size}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="fib-n">費氏數列階數 (N)</label>
                  <span className="font-mono-tabular text-slate-900">{termsCount} 項</span>
                </div>
                <input
                  id="fib-n"
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={termsCount}
                  onChange={(e) => setTermsCount(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSpiral}
                    onChange={(e) => setShowSpiral(e.target.checked)}
                    className="accent-sky-700 rounded cursor-pointer"
                  />
                  顯示四分之一圓弧螺線
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="accent-sky-700 rounded cursor-pointer"
                  />
                  顯示正方形邊長數值
                </label>
              </div>
            </div>
          </div>

          {/* Convergence Table */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">收斂數表（相鄰兩項比值）</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-2 font-medium">階數 n</th>
                    <th className="py-2 px-2 font-medium text-right">數值 Fₙ</th>
                    <th className="py-2 px-2 font-medium text-right">比值 Fₙ / Fₙ₋₁</th>
                    <th className="py-2 pl-2 font-medium text-right">與 φ 誤差</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {geometry.squares.map((sq) => {
                    const err = sq.ratio !== null ? Math.abs(sq.ratio - PHI) : null;
                    return (
                      <tr key={sq.n} className={sq.n === termsCount ? 'bg-sky-50 font-semibold' : ''}>
                        <td className="py-2 pr-2 text-slate-700">{sq.n}</td>
                        <td className="py-2 px-2 text-right text-slate-900">{sq.size}</td>
                        <td className="py-2 px-2 text-right text-sky-700">
                          {sq.ratio !== null ? sq.ratio.toFixed(5) : '—'}
                        </td>
                        <td className="py-2 pl-2 text-right text-slate-500">
                          {err !== null ? err.toFixed(5) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Decision Tree Visualization */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900">
                樣本樹狀展開（母體 N = 10,000 人）
              </h4>
              <span className="text-xs font-semibold text-sky-700 font-mono-tabular">
                陽性預測值 PPV = {bayes.ppv.toFixed(1)}%
              </span>
            </div>

            <svg viewBox="0 0 560 270" className="w-full h-auto bg-slate-50 border border-slate-200 rounded-lg">
              {/* Root to Diseased / Healthy */}
              <line x1="75" y1="135" x2="210" y2="70" stroke="#64748b" strokeWidth="1.5" />
              <line x1="75" y1="135" x2="210" y2="200" stroke="#64748b" strokeWidth="1.5" />

              {/* Branch 2 edges */}
              <line x1="290" y1="70" x2="430" y2="38" stroke="#0284c7" strokeWidth="2" />
              <line x1="290" y1="70" x2="430" y2="100" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="290" y1="200" x2="430" y2="168" stroke="#d97706" strokeWidth="2" />
              <line x1="290" y1="200" x2="430" y2="232" stroke="#94a3b8" strokeWidth="1.2" />

              {/* Root node */}
              <rect x="12" y="114" width="84" height="42" rx="6" fill="#0f172a" />
              <text x="54" y="132" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                總樣本
              </text>
              <text x="54" y="148" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                10,000 人
              </text>

              {/* Diseased node */}
              <rect x="200" y="48" width="110" height="44" rx="6" fill="#fff" stroke="#0284c7" strokeWidth="1.5" />
              <text x="255" y="66" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">
                實際患病 ({prevalencePct}%)
              </text>
              <text x="255" y="82" textAnchor="middle" fill="#0369a1" fontSize="10">
                {Math.round(bayes.diseased).toLocaleString()} 人
              </text>

              {/* Healthy node */}
              <rect x="200" y="178" width="110" height="44" rx="6" fill="#fff" stroke="#64748b" strokeWidth="1.5" />
              <text x="255" y="196" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">
                實際健康 ({100 - prevalencePct}%)
              </text>
              <text x="255" y="212" textAnchor="middle" fill="#475569" fontSize="10">
                {Math.round(bayes.healthy).toLocaleString()} 人
              </text>

              {/* Leaf 1: True Positive */}
              <rect x="415" y="18" width="132" height="40" rx="6" fill="#e0f2fe" stroke="#0284c7" />
              <text x="481" y="34" textAnchor="middle" fill="#0c4a6e" fontSize="10.5" fontWeight="600">
                真陽性 (TP)
              </text>
              <text x="481" y="49" textAnchor="middle" fill="#0369a1" fontSize="10">
                {bayes.truePos.toFixed(0)} 人
              </text>

              {/* Leaf 2: False Negative */}
              <rect x="415" y="80" width="132" height="40" rx="6" fill="#ffffff" stroke="#cbd5e1" />
              <text x="481" y="96" textAnchor="middle" fill="#475569" fontSize="10.5">
                偽陰性 (FN)
              </text>
              <text x="481" y="111" textAnchor="middle" fill="#64748b" fontSize="10">
                {bayes.falseNeg.toFixed(0)} 人
              </text>

              {/* Leaf 3: False Positive */}
              <rect x="415" y="148" width="132" height="40" rx="6" fill="#fef3c7" stroke="#d97706" />
              <text x="481" y="164" textAnchor="middle" fill="#78350f" fontSize="10.5" fontWeight="600">
                偽陽性 (FP)
              </text>
              <text x="481" y="179" textAnchor="middle" fill="#92400e" fontSize="10">
                {bayes.falsePos.toFixed(0)} 人
              </text>

              {/* Leaf 4: True Negative */}
              <rect x="415" y="212" width="132" height="40" rx="6" fill="#ffffff" stroke="#cbd5e1" />
              <text x="481" y="228" textAnchor="middle" fill="#475569" fontSize="10.5">
                真陰性 (TN)
              </text>
              <text x="481" y="243" textAnchor="middle" fill="#64748b" fontSize="10">
                {bayes.trueNeg.toFixed(0)} 人
              </text>
            </svg>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="bayes-prev">群體基礎盛行率 P(D)</label>
                  <span className="font-mono-tabular text-slate-900">{prevalencePct}%</span>
                </div>
                <input
                  id="bayes-prev"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={prevalencePct}
                  onChange={(e) => setPrevalencePct(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="bayes-sens">檢測敏感度（真陽性率）</label>
                  <span className="font-mono-tabular text-slate-900">{sensitivityPct}%</span>
                </div>
                <input
                  id="bayes-sens"
                  type="range"
                  min={70}
                  max={99}
                  step={1}
                  value={sensitivityPct}
                  onChange={(e) => setSensitivityPct(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <label htmlFor="bayes-spec">檢測特異度（真陰性率）</label>
                  <span className="font-mono-tabular text-slate-900">{specificityPct}%</span>
                </div>
                <input
                  id="bayes-spec"
                  type="range"
                  min={70}
                  max={99}
                  step={1}
                  value={specificityPct}
                  onChange={(e) => setSpecificityPct(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs text-slate-500">當篩檢呈陽性時，真實患病機率</div>
              <div className="text-2xl font-semibold text-sky-700 font-mono-tabular">
                {bayes.ppv.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                全部陽性人數共 <span className="font-mono-tabular font-medium">{bayes.totalPos.toFixed(0)}</span> 人，
                其中包含 <span className="font-mono-tabular font-medium text-sky-700">{bayes.truePos.toFixed(0)}</span> 位真陽性
                與 <span className="font-mono-tabular font-medium text-amber-700">{bayes.falsePos.toFixed(0)}</span> 位偽陽性。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
