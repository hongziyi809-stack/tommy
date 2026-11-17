import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward, Waves } from 'lucide-react';

export function WaveInterferenceSim() {
  const [freq1, setFreq1] = useState(2.0);
  const [freq2, setFreq2] = useState(2.0);
  const [amp1, setAmp1] = useState(1.0);
  const [amp2, setAmp2] = useState(1.0);
  const [phaseDeg, setPhaseDeg] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setTime((t) => t + 0.03);
    }, 40);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const width = 640;
  const height = 270;
  const padX = 24;
  const plotW = width - padX * 2;
  const midY1 = 55;
  const midY2 = 125;
  const midYSum = 212;
  const scaleY = 22;

  const phaseRad = (phaseDeg * Math.PI) / 180;

  const { path1, path2, pathSum, maxObservedAmp } = useMemo(() => {
    const pts1: string[] = [];
    const pts2: string[] = [];
    const ptsSum: string[] = [];
    let peak = 0;

    const samples = 160;
    for (let i = 0; i <= samples; i++) {
      const u = i / samples; // 0 to 1 spatial position
      const x = padX + u * plotW;

      const y1Val = amp1 * Math.sin(2 * Math.PI * freq1 * u - time * 3.0);
      const y2Val = amp2 * Math.sin(2 * Math.PI * freq2 * u - time * 3.0 + phaseRad);
      const ySumVal = y1Val + y2Val;

      peak = Math.max(peak, Math.abs(ySumVal));

      pts1.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(midY1 - y1Val * scaleY).toFixed(1)}`);
      pts2.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(midY2 - y2Val * scaleY).toFixed(1)}`);
      ptsSum.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(midYSum - ySumVal * scaleY * 0.72).toFixed(1)}`);
    }

    return {
      path1: pts1.join(' '),
      path2: pts2.join(' '),
      pathSum: ptsSum.join(' '),
      maxObservedAmp: peak,
    };
  }, [freq1, freq2, amp1, amp2, phaseRad, time, plotW]);

  const beatFreq = Math.abs(freq1 - freq2);

  const interferenceState = useMemo(() => {
    if (beatFreq > 0.05) {
      return {
        label: `產生拍頻調變 (f_beat = ${beatFreq.toFixed(1)} Hz)`,
        detail: '兩波頻率略有差異，合成波外框出現週期性的強弱起伏。',
        tone: 'beat' as const,
      };
    }
    if (phaseDeg === 180 && Math.abs(amp1 - amp2) < 0.05) {
      return {
        label: '完全破壞性干涉（振幅相消歸零）',
        detail: '波峰與波谷精準反相重疊，介質各點位移相互抵銷。',
        tone: 'destructive' as const,
      };
    }
    if (phaseDeg === 0 || phaseDeg === 360) {
      return {
        label: '完全建設性干涉（波幅加成極大）',
        detail: '兩列同頻同相波峰對波峰疊加，合成振幅達 A₁ + A₂。',
        tone: 'constructive' as const,
      };
    }
    return {
      label: `部分干涉狀態（相位差 Δφ = ${phaseDeg}°）`,
      detail: '合成振幅介於 |A₁ − A₂| 與 A₁ + A₂ 之間。',
      tone: 'partial' as const,
    };
  }, [beatFreq, phaseDeg, amp1, amp2]);

  const applyPreset = (type: 'constructive' | 'destructive' | 'beats') => {
    if (type === 'constructive') {
      setFreq1(2.0);
      setFreq2(2.0);
      setAmp1(1.0);
      setAmp2(1.0);
      setPhaseDeg(0);
    } else if (type === 'destructive') {
      setFreq1(2.0);
      setFreq2(2.0);
      setAmp1(1.0);
      setAmp2(1.0);
      setPhaseDeg(180);
    } else {
      setFreq1(2.0);
      setFreq2(2.6);
      setAmp1(1.0);
      setAmp2(1.0);
      setPhaseDeg(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Presets & Playback */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => applyPreset('constructive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              freq1 === freq2 && phaseDeg === 0
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            建設性干涉 (0°)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('destructive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              freq1 === freq2 && phaseDeg === 180
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            破壞性干涉 (180°)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('beats')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              Math.abs(freq1 - freq2) > 0.3
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            拍頻共振示範
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? '暫停波動' : '播放波動'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setTime((t) => t + 0.18);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            單步前進
          </button>
          <button
            type="button"
            onClick={() => applyPreset('constructive')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重設波動
          </button>
        </div>
      </div>

      {/* Wave Plot Stage */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Waves className="w-4 h-4 text-sky-700" aria-hidden="true" />
            <span>即時波形疊加視覺化：y_total = y₁ + y₂</span>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              interferenceState.tone === 'destructive'
                ? 'bg-amber-100 text-amber-900'
                : interferenceState.tone === 'constructive'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-sky-100 text-sky-900'
            }`}
          >
            {interferenceState.label}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto bg-white border border-slate-200 rounded-lg"
          role="img"
          aria-label="簡諧波 y1, y2 與合成波 y_total 的干涉圖"
        >
          {/* Baseline axes */}
          <line x1={padX} y1={midY1} x2={width - padX} y2={midY1} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={padX} y1={midY2} x2={width - padX} y2={midY2} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={padX} y1={midYSum} x2={width - padX} y2={midYSum} stroke="#cbd5e1" />

          {/* Labels */}
          <text x={padX} y={24} fontSize="10.5" fill="#0369a1" fontWeight="600">
            波源 y₁ (f₁ = {freq1.toFixed(1)} Hz, A₁ = {amp1.toFixed(1)})
          </text>
          <text x={padX} y={96} fontSize="10.5" fill="#475569" fontWeight="600">
            波源 y₂ (f₂ = {freq2.toFixed(1)} Hz, A₂ = {amp2.toFixed(1)}, Δφ = {phaseDeg}°)
          </text>
          <text x={padX} y={168} fontSize="11" fill="#0f172a" fontWeight="700">
            合成波 y₁ + y₂（瞬時峰值 {maxObservedAmp.toFixed(2)}）
          </text>

          <path d={path1} fill="none" stroke="#0284c7" strokeWidth="2" />
          <path d={path2} fill="none" stroke="#64748b" strokeWidth="2" />
          <path d={pathSum} fill="none" stroke="#0f172a" strokeWidth="2.8" />
        </svg>
        <p className="text-xs text-slate-600 mt-2">{interferenceState.detail}</p>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="wave-f1">波源 1 頻率 (f₁)</label>
            <span className="font-mono-tabular text-slate-900">{freq1.toFixed(1)} Hz</span>
          </div>
          <input
            id="wave-f1"
            type="range"
            min={1.0}
            max={5.0}
            step={0.2}
            value={freq1}
            onChange={(e) => setFreq1(parseFloat(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="wave-f2">波源 2 頻率 (f₂)</label>
            <span className="font-mono-tabular text-slate-900">{freq2.toFixed(1)} Hz</span>
          </div>
          <input
            id="wave-f2"
            type="range"
            min={1.0}
            max={5.0}
            step={0.2}
            value={freq2}
            onChange={(e) => setFreq2(parseFloat(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="wave-phase">相位差 (Δφ)</label>
            <span className="font-mono-tabular text-slate-900">{phaseDeg}°</span>
          </div>
          <input
            id="wave-phase"
            type="range"
            min={0}
            max={360}
            step={15}
            value={phaseDeg}
            onChange={(e) => setPhaseDeg(parseInt(e.target.value, 10))}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="wave-a1">波源 1 振幅 (A₁)</label>
            <span className="font-mono-tabular text-slate-900">{amp1.toFixed(1)} m</span>
          </div>
          <input
            id="wave-a1"
            type="range"
            min={0.2}
            max={1.5}
            step={0.1}
            value={amp1}
            onChange={(e) => setAmp1(parseFloat(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="wave-a2">波源 2 振幅 (A₂)</label>
            <span className="font-mono-tabular text-slate-900">{amp2.toFixed(1)} m</span>
          </div>
          <input
            id="wave-a2"
            type="range"
            min={0.2}
            max={1.5}
            step={0.1}
            value={amp2}
            onChange={(e) => setAmp2(parseFloat(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>

        <div className="flex flex-col justify-center bg-white border border-slate-200 rounded-lg px-3 py-2">
          <span className="text-[11px] text-slate-500">理論拍頻 |f₁ − f₂|</span>
          <span className="text-base font-semibold text-slate-900 font-mono-tabular">
            {beatFreq.toFixed(1)} Hz
          </span>
        </div>
      </div>
    </div>
  );
}
