import { useEffect, useMemo, useState } from 'react';
import { Activity, Pause, Play, RotateCcw, StepForward } from 'lucide-react';

function calculateP50(ph: number, pco2: number, tempC: number): number {
  const baseP50 = 26.8;
  const phFactor = Math.pow(10, -0.48 * (ph - 7.4));
  const co2Factor = 1 + 0.0025 * (pco2 - 40);
  const tempFactor = 1 + 0.024 * (tempC - 37);
  return Math.max(12, Math.min(55, baseP50 * phFactor * co2Factor * tempFactor));
}

function hillSaturation(po2: number, p50: number): number {
  if (po2 <= 0) return 0;
  const n = 2.75;
  const po2n = Math.pow(po2, n);
  const p50n = Math.pow(p50, n);
  return (po2n / (po2n + p50n)) * 100;
}

export function BohrEffectSim() {
  const [ph, setPh] = useState(7.4);
  const [pco2, setPco2] = useState(40);
  const [tempC, setTempC] = useState(37.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setTick((prev) => (prev + 1) % 360);
    }, 60);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const p50 = useMemo(() => calculateP50(ph, pco2, tempC), [ph, pco2, tempC]);
  const standardP50 = 26.8;

  const alveolarSat = useMemo(() => hillSaturation(100, p50), [p50]);
  const restingTissueSat = useMemo(() => hillSaturation(40, p50), [p50]);
  const activeMuscleSat = useMemo(() => hillSaturation(20, p50), [p50]);
  const oxygenDelivered = useMemo(
    () => Math.max(0, alveolarSat - activeMuscleSat),
    [alveolarSat, activeMuscleSat]
  );

  const shiftDirection = useMemo(() => {
    const diff = p50 - standardP50;
    if (Math.abs(diff) < 1.2) {
      return { label: '標準平衡狀態', detail: '親和力與標準曲線一致', tone: 'nominal' as const };
    }
    if (diff > 0) {
      return {
        label: '曲線右移（釋氧加速）',
        detail: '低 pH 或高 CO₂ 促使血紅素加速卸載 O₂ 給組織',
        tone: 'elevated' as const,
      };
    }
    return {
      label: '曲線左移（緊密結合）',
      detail: '偏鹼或低溫使血紅素更緊密抓住 O₂',
      tone: 'left' as const,
    };
  }, [p50]);

  const chartWidth = 520;
  const chartHeight = 270;
  const padLeft = 52;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 42;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const toX = (po2: number) => padLeft + (po2 / 110) * plotW;
  const toY = (sat: number) => padTop + ((100 - sat) / 100) * plotH;

  const buildCurvePath = (targetP50: number) => {
    const points: string[] = [];
    for (let po2 = 0; po2 <= 110; po2 += 2) {
      const sat = hillSaturation(po2, targetP50);
      points.push(`${po2 === 0 ? 'M' : 'L'} ${toX(po2).toFixed(1)} ${toY(sat).toFixed(1)}`);
    }
    return points.join(' ');
  };

  const standardPath = useMemo(() => buildCurvePath(standardP50), []);
  const currentPath = useMemo(() => buildCurvePath(p50), [p50]);

  const applyPreset = (mode: 'rest' | 'sprint' | 'alkalosis') => {
    if (mode === 'rest') {
      setPh(7.4);
      setPco2(40);
      setTempC(37.0);
    } else if (mode === 'sprint') {
      setPh(7.15);
      setPco2(65);
      setTempC(39.2);
    } else {
      setPh(7.55);
      setPco2(26);
      setTempC(35.8);
    }
  };

  // Calculate flowing red blood cells along vessel
  const rbcOffsets = [0, 1, 2, 3].map((i) => ((tick * 1.4 + i * 90) % 360) / 360);
  const releaseFraction = Math.min(1, Math.max(0.15, oxygenDelivered / 85));

  return (
    <div className="space-y-6">
      {/* Preset & Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => applyPreset('rest')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              Math.abs(ph - 7.4) < 0.02 && pco2 === 40
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            靜止休息狀態
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sprint')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              ph <= 7.2 && pco2 >= 60
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            劇烈衝刺運動
          </button>
          <button
            type="button"
            onClick={() => applyPreset('alkalosis')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              ph >= 7.5 && pco2 <= 30
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            過度換氣偏鹼
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? '暫停血流' : '播放血流'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setTick((t) => (t + 18) % 360);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            單步前進
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rest')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重設參數
          </button>
        </div>
      </div>

      {/* Stage 1: Capillary Bloodstream Simulation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Activity className="w-4 h-4 text-sky-700" aria-hidden="true" />
            <span>微血管紅血球釋氧動態（動脈端 → 肌肉組織）</span>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              shiftDirection.tone === 'elevated'
                ? 'bg-amber-100 text-amber-900'
                : shiftDirection.tone === 'left'
                  ? 'bg-sky-100 text-sky-900'
                  : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {shiftDirection.tone === 'elevated' ? '▲ ' : '● '}
            {shiftDirection.label}
          </span>
        </div>

        <svg
          viewBox="0 0 640 120"
          className="w-full h-auto bg-white border border-slate-200 rounded-lg"
          role="img"
          aria-label="紅血球在微血管流動與釋放氧氣模擬圖"
        >
          {/* Vessel walls */}
          <rect x="0" y="18" width="640" height="6" fill="#e2e8f0" />
          <rect x="0" y="96" width="640" height="6" fill="#e2e8f0" />
          <text x="14" y="13" fontSize="10" fill="#475569">
            肺泡動脈端 (PO₂ = 100 mmHg)
          </text>
          <text x="455" y="13" fontSize="10" fill="#475569">
            肌肉微血管端 (PO₂ = 20 mmHg)
          </text>

          {/* Flow direction arrows */}
          <path d="M 180 60 L 210 60 M 204 55 L 210 60 L 204 65" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          <path d="M 410 60 L 440 60 M 434 55 L 440 60 L 434 65" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

          {/* Red blood cells and bound/released O2 */}
          {rbcOffsets.map((progress, idx) => {
            const cx = 40 + progress * 560;
            const cy = 60 + Math.sin(progress * Math.PI * 2 + idx) * 6;
            const boundCount = progress < 0.35 ? 4 : Math.max(0, Math.round(4 * (1 - releaseFraction * progress * 1.15)));
            const releasedCount = 4 - boundCount;
            return (
              <g key={idx}>
                <ellipse cx={cx} cy={cy} rx="22" ry="14" fill="#dc2626" opacity="0.88" />
                <ellipse cx={cx} cy={cy} rx="12" ry="6" fill="#991b1b" opacity="0.45" />
                {/* Bound O2 molecules */}
                {Array.from({ length: boundCount }).map((_, bIdx) => (
                  <circle
                    key={`b-${bIdx}`}
                    cx={cx - 8 + (bIdx % 2) * 16}
                    cy={cy - 4 + Math.floor(bIdx / 2) * 8}
                    r="3.2"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                ))}
                {/* Released O2 molecules diffusing toward tissue */}
                {Array.from({ length: releasedCount }).map((_, rIdx) => (
                  <circle
                    key={`r-${rIdx}`}
                    cx={cx + rIdx * 9 - 8}
                    cy={cy + (rIdx % 2 === 0 ? -24 : 26)}
                    r="3"
                    fill="#0284c7"
                    opacity="0.85"
                  />
                ))}
              </g>
            );
          })}
        </svg>
        <p className="text-xs text-slate-600 mt-2">{shiftDirection.detail}</p>
      </div>

      {/* Stage 2: Oxygen Dissociation Curve + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-900">氧血紅素解離曲線</h4>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-slate-400 inline-block" />
                標準曲線 (P50 26.8)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-sky-700">
                <span className="w-4 h-0.5 bg-sky-600 inline-block" />
                目前狀態 (P50 {p50.toFixed(1)})
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((sat) => (
              <g key={`y-${sat}`}>
                <line
                  x1={padLeft}
                  y1={toY(sat)}
                  x2={chartWidth - padRight}
                  y2={toY(sat)}
                  stroke="#e2e8f0"
                  strokeDasharray={sat === 50 ? '4 4' : undefined}
                />
                <text x={padLeft - 8} y={toY(sat) + 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {sat}%
                </text>
              </g>
            ))}
            {[0, 20, 40, 60, 80, 100].map((po2) => (
              <g key={`x-${po2}`}>
                <line x1={toX(po2)} y1={padTop} x2={toX(po2)} y2={chartHeight - padBottom} stroke="#f1f5f9" />
                <text x={toX(po2)} y={chartHeight - padBottom + 16} textAnchor="middle" fontSize="10" fill="#64748b">
                  {po2}
                </text>
              </g>
            ))}

            {/* Axis titles */}
            <text
              x={padLeft + plotW / 2}
              y={chartHeight - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#334155"
              fontWeight="500"
            >
              氧分壓 PO₂ (mmHg)
            </text>

            {/* Standard reference curve */}
            <path d={standardPath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />

            {/* Current Bohr-shifted curve */}
            <path d={currentPath} fill="none" stroke="#0284c7" strokeWidth="3" />

            {/* P50 Marker */}
            <line
              x1={toX(p50)}
              y1={toY(50)}
              x2={toX(p50)}
              y2={chartHeight - padBottom}
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle cx={toX(p50)} cy={toY(50)} r="4.5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
            <text x={toX(p50) + 7} y={toY(50) - 6} fontSize="10" fontWeight="600" fill="#0369a1">
              P50 = {p50.toFixed(1)}
            </text>

            {/* Tissue (20 mmHg) and Alveolar (100 mmHg) markers */}
            <circle cx={toX(20)} cy={toY(activeMuscleSat)} r="4" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
            <circle cx={toX(100)} cy={toY(alveolarSat)} r="4" fill="#059669" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Sliders & Live Readouts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <label htmlFor="bohr-ph">血液酸鹼值 (pH)</label>
                <span className="font-mono-tabular text-slate-900">pH {ph.toFixed(2)}</span>
              </div>
              <input
                id="bohr-ph"
                type="range"
                min={6.9}
                max={7.65}
                step={0.01}
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                <span>6.90 (酸中毒)</span>
                <span>7.40 (標準)</span>
                <span>7.65 (偏鹼)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <label htmlFor="bohr-co2">二氧化碳分壓 (PCO₂)</label>
                <span className="font-mono-tabular text-slate-900">{pco2} mmHg</span>
              </div>
              <input
                id="bohr-co2"
                type="range"
                min={20}
                max={80}
                step={1}
                value={pco2}
                onChange={(e) => setPco2(parseInt(e.target.value, 10))}
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                <span>20 mmHg</span>
                <span>40 mmHg (標準)</span>
                <span>80 mmHg</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <label htmlFor="bohr-temp">局部組織溫度 (°C)</label>
                <span className="font-mono-tabular text-slate-900">{tempC.toFixed(1)} °C</span>
              </div>
              <input
                id="bohr-temp"
                type="range"
                min={35.0}
                max={41.0}
                step={0.1}
                value={tempC}
                onChange={(e) => setTempC(parseFloat(e.target.value))}
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                <span>35.0 °C</span>
                <span>37.0 °C (標準)</span>
                <span>41.0 °C</span>
              </div>
            </div>
          </div>

          {/* Numeric Readout Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500">肺泡端飽和度 (100 mmHg)</div>
              <div className="text-xl font-semibold text-emerald-700 font-mono-tabular mt-1">
                {alveolarSat.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500">靜止組織 (40 mmHg)</div>
              <div className="text-xl font-semibold text-slate-900 font-mono-tabular mt-1">
                {restingTissueSat.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500">運動肌肉 (20 mmHg)</div>
              <div className="text-xl font-semibold text-amber-700 font-mono-tabular mt-1">
                {activeMuscleSat.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500">實際卸載氧氣量</div>
              <div className="text-xl font-semibold text-sky-700 font-mono-tabular mt-1">
                {oxygenDelivered.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
