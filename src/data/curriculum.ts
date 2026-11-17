import { Course, Discipline, Flashcard } from '../types/learning';

export const DISCIPLINES: Array<'全部學科' | Discipline> = [
  '全部學科',
  '自然科學',
  '數學幾何',
  '資訊工程',
  '物理波動',
];

export const COURSES: Course[] = [
  {
    id: 'bio-bohr-effect',
    title: '血紅素與波耳效應：呼吸氣體交換動力學',
    subtitle: '從肺泡到肌肉微血管，透過即時氧解離曲線觀察 pH 值與二氧化碳如何精準調控氧氣釋放。',
    discipline: '自然科學',
    level: '進階',
    estimatedMinutes: 35,
    coverImage: '/src/assets/images/course_biology_bohr_1794897687655.jpg',
    coverAlt: '微血管與紅血球攜帶氧氣分子的科學剖面插圖',
    instructor: '林致遠 生理學研究室',
    lessons: [
      {
        id: 'bio-lesson-1',
        courseId: 'bio-bohr-effect',
        order: 1,
        title: '01. 氧血紅素解離曲線與協同結合',
        durationMinutes: 12,
        summary: '理解為何血紅素的氧氣結合曲線呈現 S 型，以及 P50 在臨床與運動生理上的意義。',
        simulationKind: 'bohr-effect',
        simulationFocus: '觀察標準狀態（pH 7.40、PCO₂ 40 mmHg）下，S 型曲線在不同氧分壓下的飽和度變化。',
        principles: [
          {
            heading: '四聚體結構與協同效應',
            summary:
              '每個血紅素分子由四個次單元組成，當第一個氧分子結合後，會誘導蛋白質構形由緊張態（T-state）轉為鬆弛態（R-state），使後續氧分子的親和力大幅提升。',
            formula: 'Hb(O₂)₄ + H⁺ ⇌ HbH⁺ + 4O₂',
          },
          {
            heading: 'P50 親和力指標',
            summary:
              'P50 指血紅素達到 50% 氧飽和度時所需的氧分壓（標準值約 26.8 mmHg）。P50 數值愈大，代表血紅素對氧氣親和力愈低，氧氣愈容易釋放給周邊組織。',
          },
        ],
        keyTakeaways: [
          '肺泡高氧分壓環境（約 100 mmHg）使血紅素維持 97% 以上飽和度。',
          '周邊靜止組織（約 40 mmHg）約釋放 25% 氧氣，保留充分安全緩衝。',
        ],
        quiz: [
          {
            id: 'bio-q1',
            question: '在標準生理條件（pH 7.40, 37°C）下，當 P50 數值上升時，代表血紅素發生了什麼變化？',
            options: [
              '對氧氣的親和力下降，更容易將氧氣釋放給組織',
              '對氧氣的親和力上升，更難釋放氧氣',
              '血紅素完全失去與氧氣結合的能力',
              '紅血球體積縮小導致載氧上限歸零',
            ],
            correctIndex: 0,
            explanation: 'P50 上升代表需要更高的氧分壓才能達到 50% 飽和，亦即曲線右移、親和力降低，有助於組織取氧。',
          },
          {
            id: 'bio-q2',
            question: '為何氧血紅素解離曲線呈 S 型（Sigmoid）而非直線？',
            options: [
              '血液黏滯度隨流速呈指數增加',
              '血紅素四個次單元之間具有正協同結合效應',
              '紅血球細胞膜阻礙氧氣擴散',
              '肺泡表面張力隨吸氣深度改變',
            ],
            correctIndex: 1,
            explanation: '第一個 O₂ 結合誘導蛋白質構形改變，讓第 2 至第 4 個 O₂ 更容易結合，形成典型的 S 型曲線。',
          },
        ],
      },
      {
        id: 'bio-lesson-2',
        courseId: 'bio-bohr-effect',
        order: 2,
        title: '02. 波耳效應：劇烈運動時的酸性調控',
        durationMinutes: 13,
        summary: '模擬肌肉衝刺產生乳酸與 CO₂ 時，血液微環境如何將解離曲線向右推移以加速供氧。',
        simulationKind: 'bohr-effect',
        simulationFocus: '切換「劇烈衝刺運動」預設或調降 pH 至 7.15、升高 PCO₂ 至 65 mmHg，觀察曲線右移與組織氧氣卸載量。',
        principles: [
          {
            heading: 'H⁺ 離子與胺基酸殘基的作用',
            summary:
              '代謝旺盛的肌肉產生大量 CO₂ 與乳酸，經碳酸酐酶作用釋放氫離子（H⁺）。質子化會穩定低親和力的 T-state，促使氧氣在低氧組織處大量卸載。',
            formula: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
          },
          {
            heading: '溫度上升的雙重加成',
            summary:
              '肌肉收縮產熱使局部體溫升至 39–40°C，進一步降低血紅素與氧分子的結合穩定度，形成精妙的生理適應機制。',
          },
        ],
        keyTakeaways: [
          'pH 下降（偏酸）、PCO₂ 上升與體溫升高，三者皆會使曲線右移。',
          '曲線右移對肺部攝氧影響極小，卻能讓工作肌肉的氧氣釋放量倍增。',
        ],
        quiz: [
          {
            id: 'bio-q3',
            question: '下列哪一組條件組合會導致氧血紅素解離曲線最顯著地「向右移動」？',
            options: [
              'pH 升高、PCO₂ 下降、體溫降低',
              'pH 下降、PCO₂ 升高、體溫升高',
              'pH 維持 7.40、PCO₂ 下降、體溫 35°C',
              'pH 升高至 7.60 且呼吸停止',
            ],
            correctIndex: 1,
            explanation: '波耳效應指出：酸性環境（低 pH）、高二氧化碳分壓與高溫皆會降低親和力，使曲線右移並加速釋氧。',
          },
        ],
      },
      {
        id: 'bio-lesson-3',
        courseId: 'bio-bohr-effect',
        order: 3,
        title: '03. 肺泡攝氧與微血管擴散平衡',
        durationMinutes: 10,
        summary: '比較動脈端與靜脈端的氣體分壓梯度，理解安全係數與高原低氧環境的生理限制。',
        simulationKind: 'bohr-effect',
        simulationFocus: '觀察模擬器中「靜止組織」與「運動組織」在 PO₂ = 40 mmHg 與 20 mmHg 的飽和度落差。',
        principles: [
          {
            heading: '平坦高原區保護肺部攝氧',
            summary:
              '曲線在 PO₂ 70–100 mmHg 區段相當平緩。即使外界氧分壓略微下降（如中度海拔），肺部血液仍能維持接近 92–95% 的高飽和度。',
          },
          {
            heading: '陡峭釋放區放大組織供應',
            summary:
              '在 PO₂ 20–40 mmHg 的陡峭區段，組織氧分壓僅需微幅下降，便能觸發大量氧氣從紅血球解離擴散至粒線體。',
          },
        ],
        keyTakeaways: [
          'S 型曲線頂端的平坦段提供海拔適應緩衝；中段陡坡則確保組織高效取氧。',
        ],
        quiz: [
          {
            id: 'bio-q4',
            question: '當組織微血管的氧分壓（PO₂）從 40 mmHg 降至 20 mmHg 時，曲線陡峭段帶來什麼優勢？',
            options: [
              '血紅素拒絕釋放任何氧氣以保護心臟',
              '氧飽和度急劇下降，短時間內向細胞釋放大量氧氣',
              '紅血球直接穿過血管壁進入肌肉細胞',
              '二氧化碳停止進入血液',
            ],
            correctIndex: 1,
            explanation: '20–40 mmHg 正好位於 S 型曲線最陡峭的斜坡區，分壓微降即可釋放大量 O₂ 供應代謝需求。',
          },
        ],
      },
    ],
  },
  {
    id: 'math-golden-ratio',
    title: '黃金比例、費氏數列與幾何構造',
    subtitle: '以互動幾何繪圖與收斂數表探索 φ ≈ 1.618 的比例之美，並延伸至決策機率樹模型。',
    discipline: '數學幾何',
    level: '入門',
    estimatedMinutes: 30,
    coverImage: '/src/assets/images/course_math_geometry_1794897689391.jpg',
    coverAlt: '黃金比例螺旋與巢狀正方形的建築工程藍圖',
    instructor: '陳思穎 應用數學系',
    lessons: [
      {
        id: 'math-lesson-1',
        courseId: 'math-golden-ratio',
        order: 1,
        title: '01. 黃金分割的代數推導與無限收斂',
        durationMinutes: 10,
        summary: '從線段分割比例出發推導一元二次方程式，並見證費氏數列相鄰兩項比值逼近黃金比例。',
        simulationKind: 'golden-ratio',
        simulationFocus: '調整費氏數列階數 N，觀察螺旋結構擴展與右側數表中 Fn / Fn-1 逐步逼近 1.618034 的過程。',
        principles: [
          {
            heading: '自我相似的分割方程式',
            summary:
              '若將線段分為長段 a 與短段 b，使整體對長段之比等於長段對短段之比，即 (a+b)/a = a/b = φ，解方程式 φ² − φ − 1 = 0 可得正根 (1 + √5) / 2。',
            formula: 'φ = (1 + √5) / 2 ≈ 1.6180339887',
          },
          {
            heading: '費氏數列的極限比值',
            summary:
              '費氏數列定義為 F₁ = 1, F₂ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂。隨 n 增大，Fₙ / Fₙ₋₁ 會在黃金比例上下交替震盪並迅速收斂。',
            formula: 'lim (n → ∞) Fₙ₊₁ / Fₙ = φ',
          },
        ],
        keyTakeaways: [
          '黃金比例是唯一滿足「倒數等於自身減一」的正數：1/φ = φ − 1 ≈ 0.618。',
          '第 10 項比值 55/34 ≈ 1.61765，與真實 φ 誤差已小於 0.03%。',
        ],
        quiz: [
          {
            id: 'math-q1',
            question: '黃金比例 φ 滿足下列哪一個多項式方程式？',
            options: [
              'φ² − φ − 1 = 0',
              'φ² + φ − 1 = 0',
              'φ² − 2φ + 1 = 0',
              'φ³ − φ − 2 = 0',
            ],
            correctIndex: 0,
            explanation: '由 (a+b)/a = a/b = φ 可得 1 + 1/φ = φ，兩邊同乘 φ 即得 φ² − φ − 1 = 0。',
          },
          {
            id: 'math-q2',
            question: '費氏數列中 21 / 13 約等於多少？它與黃金比例 φ 的關係為何？',
            options: [
              '約 1.61538，略小於 φ 且逐步收斂逼近 φ',
              '約 1.75000，且隨項數增加發散至無窮大',
              '正好等於有理數 1.60000',
              '約 1.41421，逼近 √2',
            ],
            correctIndex: 0,
            explanation: '21 ÷ 13 ≈ 1.61538，下一項 34 ÷ 21 ≈ 1.61905，比值會交替從上下兩側逼近 φ。',
          },
        ],
      },
      {
        id: 'math-lesson-2',
        courseId: 'math-golden-ratio',
        order: 2,
        title: '02. 黃金矩形與對數螺線的幾何性質',
        durationMinutes: 10,
        summary: '理解為何從黃金矩形切去一個正方形後，剩餘部分依然維持相同的黃金長寬比。',
        simulationKind: 'golden-ratio',
        simulationFocus: '開啟「對角線輔助線」與「正方形邊長標註」，觀察所有相似矩形的對角線如何交於螺旋極點。',
        principles: [
          {
            heading: '無限遞迴的自相似切割',
            summary:
              '若黃金矩形長為 φ、寬為 1，切下邊長 1×1 的正方形後，剩餘矩形長為 1、寬為 φ−1 = 1/φ，長寬比仍是 1 / (1/φ) = φ，可無限自我複製。',
          },
          {
            heading: '等角螺線近似',
            summary:
              '在每個正方形內繪製四分之一圓弧並首尾相接，便構成近似對數螺線的黃金螺線，此結構常見於植物葉序與鸚鵡螺殼生長模式。',
          },
        ],
        keyTakeaways: [
          '黃金矩形的兩條主對角線交點即為螺線漸近收斂的極點（Eye of God）。',
        ],
        quiz: [
          {
            id: 'math-q3',
            question: '從一個長寬比為 φ : 1 的黃金矩形中，切掉一個最大正方形後，剩下的矩形長寬比為何？',
            options: [
              '依然保持 φ : 1',
              '變成 2 : 1',
              '變成 √2 : 1',
              '變成 1 : 1 的正方形',
            ],
            correctIndex: 0,
            explanation: '因為 1 / (φ − 1) = φ，剩餘矩形仍然維持完全相同的黃金比例。',
          },
        ],
      },
      {
        id: 'math-lesson-3',
        courseId: 'math-golden-ratio',
        order: 3,
        title: '03. 機率決策樹與條件機率直覺',
        durationMinutes: 10,
        summary: '切換至機率樹模式，透過貝氏定理視覺化基礎率如何影響篩檢陽性的真實機率。',
        simulationKind: 'golden-ratio',
        simulationFocus: '在模擬器頂端切換至「機率決策樹」，調整盛行率與檢測靈敏度，觀察陽性預測值（PPV）的變化。',
        principles: [
          {
            heading: '基礎率謬誤（Base Rate Fallacy）',
            summary:
              '即使檢測準確率高達 95%，若群體基礎盛行率僅 2%，偽陽性樣本數仍可能多於真陽性樣本數。決策樹能以具體人數或機率分支破除直覺盲點。',
            formula: 'P(A|B) = P(B|A)·P(A) / P(B)',
          },
        ],
        keyTakeaways: [
          '總陽性機率等於「真陽性分支」與「偽陽性分支」機率之和。',
        ],
        quiz: [
          {
            id: 'math-q4',
            question: '當疾病盛行率極低（例如 1%）時，即使快篩準確率達 95%，篩檢呈陽性者實際患病機率常低於 20%，主要原因為何？',
            options: [
              '健康母體數量龐大，5% 的偽陽性絕對數量超過真陽性',
              '貝氏定理不適用於醫學檢測',
              '健康者的樣本會自動轉化為真陽性',
              '盛行率與偽陽性總數無關',
            ],
            correctIndex: 0,
            explanation: '99% 的健康族群中若有 5% 誤判，佔總人口 4.95%，遠高於 1% 患病族群產生的 0.95% 真陽性。',
          },
        ],
      },
    ],
  },
  {
    id: 'cs-algorithms',
    title: '演算法視覺實驗室：排序與二分搜尋',
    subtitle: '逐步執行氣泡排序、插入排序與二分搜尋，即時追蹤比較次數、指標移動與時間複雜度。',
    discipline: '資訊工程',
    level: '入門',
    estimatedMinutes: 35,
    coverImage: '/src/assets/images/course_cs_physics_1794897688041.jpg',
    coverAlt: '節點矩陣與波紋干涉的工程演算法視覺圖',
    instructor: '張維哲 演算法實驗室',
    lessons: [
      {
        id: 'cs-lesson-1',
        courseId: 'cs-algorithms',
        order: 1,
        title: '01. 氣泡排序與插入排序的比較成本',
        durationMinutes: 12,
        summary: '單步執行相鄰元素交換與局部插入，比較 O(n²) 演算法在接近已排序陣列時的表現差異。',
        simulationKind: 'algorithm-lab',
        simulationFocus: '分別選擇「氣泡排序」與「插入排序」，點擊「單步前進」或「播放」觀察比較次數與交換次數。',
        principles: [
          {
            heading: '氣泡排序（Bubble Sort）',
            summary:
              '每輪從頭掃描相鄰元素，若前者大於後者即交換，使最大值如氣泡般浮至序列尾端。平均與最壞時間複雜度皆為 O(n²)。',
            formula: 'T(n) = n(n − 1) / 2 ∈ O(n²)',
          },
          {
            heading: '插入排序（Insertion Sort）',
            summary:
              '將元素逐一插入左側已排序區間的正確位置。對於幾乎已排好序的資料，比較次數可降至接近線性 O(n)。',
          },
        ],
        keyTakeaways: [
          '原地排序（In-place）僅需 O(1) 額外記憶體空間。',
          '穩定排序能保留相同數值元素原本的相對順序。',
        ],
        quiz: [
          {
            id: 'cs-q1',
            question: '當輸入陣列已經完全排序完成時，標準插入排序（Insertion Sort）的時間複雜度為何？',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correctIndex: 0,
            explanation: '已排序陣列中每個新元素只需與左側最後一個元素比較一次即可確認位置，總比較次數為 n−1，即 O(n)。',
          },
          {
            id: 'cs-q2',
            question: '在長度為 10 的陣列執行氣泡排序，第一輪掃描最多會進行幾次相鄰比較？',
            options: ['9 次', '10 次', '45 次', '100 次'],
            correctIndex: 0,
            explanation: '第一輪需比較相鄰對 (0,1), (1,2), ..., (8,9)，共 n − 1 = 9 次。',
          },
        ],
      },
      {
        id: 'cs-lesson-2',
        courseId: 'cs-algorithms',
        order: 2,
        title: '02. 二分搜尋：對數時間的威力',
        durationMinutes: 12,
        summary: '在已排序陣列中利用左右邊界折半夾擊，體會為何 100 萬筆資料最多只需約 20 次比較。',
        simulationKind: 'algorithm-lab',
        simulationFocus: '在模擬器切換至「二分搜尋」，指定目標數值後觀察 Low、Mid、High 三指標如何快速收斂。',
        principles: [
          {
            heading: '折半淘汰的不變量（Loop Invariant）',
            summary:
              '每次比較中位數索引 mid = ⌊(low + high) / 2⌋，若目標值小於 arr[mid]，則可安全捨棄右半部所有元素，搜尋範圍嚴格減半。',
            formula: 'T(n) = T(n / 2) + O(1) ⇒ O(log₂ n)',
          },
          {
            heading: '前置條件限制',
            summary:
              '二分搜尋要求資料必須預先排序且支援隨機存取（如陣列），在單向鏈結串列上無法發揮 O(log n) 優勢。',
          },
        ],
        keyTakeaways: [
          '資料量擴增至 1,024 倍，二分搜尋僅增加 10 次比較。',
          '實作時建議寫成 low + Math.floor((high - low) / 2) 以避免整數溢位。',
        ],
        quiz: [
          {
            id: 'cs-q3',
            question: '在一個已排序且包含 1,024 個不重複整數的陣列中進行二分搜尋，最壞情況下需要幾次比較？',
            options: ['約 10 至 11 次', '512 次', '1,024 次', '約 100 次'],
            correctIndex: 0,
            explanation: '因為 2¹⁰ = 1024，每次折半使候選區間縮小一半，最多只需 ⌈log₂(1024)⌉ + 1 ≈ 11 次即可確定結果。',
          },
        ],
      },
    ],
  },
  {
    id: 'phy-wave-optics',
    title: '波動物理：簡諧波疊加與干涉共振',
    subtitle: '調整頻率、振幅與相位差，即時視覺化兩列簡諧波如何形成建設性干涉、破壞性干涉與拍頻。',
    discipline: '物理波動',
    level: '進階',
    estimatedMinutes: 30,
    coverImage: '/src/assets/images/hero_learning_studio_1794897688566.jpg',
    coverAlt: '光影交織的現代物理建築研習室',
    instructor: '許晴嵐 物理教學團隊',
    lessons: [
      {
        id: 'phy-lesson-1',
        courseId: 'phy-wave-optics',
        order: 1,
        title: '01. 波動疊加原理與建設性／破壞性干涉',
        durationMinutes: 15,
        summary: '觀察線性介質中兩列波相遇時位移如何直接代數相加，並探索完全相消的條件。',
        simulationKind: 'wave-interference',
        simulationFocus: '設定 f₁ = f₂ = 2.0 Hz、A₁ = A₂ = 1.0，將相位差 Δφ 拖曳至 180°，觀察合成波幅歸零的完全破壞性干涉。',
        principles: [
          {
            heading: '線性疊加原理（Superposition Principle）',
            summary:
              '當兩列波同時傳經同一空間點時，該點的總位移等於各別波單獨存在時所產生位移的向量和，且兩波交會後仍各自保有原本的波形前進。',
            formula: 'y(x, t) = A₁ sin(kx − ω₁t) + A₂ sin(kx − ω₂t + Δφ)',
          },
          {
            heading: '相位差決定干涉結果',
            summary:
              '同頻波源若相位差 Δφ = 0°（同相），波峰對波峰產生建設性干涉；若 Δφ = 180°（反相）且振幅相等，則處處相消為零。',
          },
        ],
        keyTakeaways: [
          '主動降噪耳機正是利用產生反相（Δφ = 180°）聲波來抵銷環境噪音。',
        ],
        quiz: [
          {
            id: 'phy-q1',
            question: '兩列頻率相同、振幅皆為 A 的簡諧波在介質中疊加，當相位差為 180°（π 弧度）時，合成波的振幅為何？',
            options: ['0（完全破壞性干涉）', '2A（完全建設性干涉）', 'A', '√2 A'],
            correctIndex: 0,
            explanation: '相位差 180° 代表波峰永遠與波谷重合，sin(θ) + sin(θ + π) = 0，因此合成振幅為 0。',
          },
        ],
      },
      {
        id: 'phy-lesson-2',
        courseId: 'phy-wave-optics',
        order: 2,
        title: '02. 拍頻現象（Beats）與頻率微調',
        durationMinutes: 15,
        summary: '當兩列頻率相近但不相等的聲波疊加時，合成振幅會產生週期性的強弱交替。',
        simulationKind: 'wave-interference',
        simulationFocus: '設定 f₁ = 2.0 Hz、f₂ = 2.4 Hz 且 Δφ = 0°，觀察合成波外框形成週期性的「拍」包絡線。',
        principles: [
          {
            heading: '拍頻公式',
            summary:
              '兩個相近頻率 f₁ 與 f₂ 疊加後，合成波的振幅調變頻率（每秒聽到的音量強弱起伏次數）等於兩頻率差的絕對值。',
            formula: 'f_beat = |f₁ − f₂|',
          },
        ],
        keyTakeaways: [
          '調音師藉由傾聽樂器與音叉之間的拍頻消失（f_beat → 0）來完成精準校音。',
        ],
        quiz: [
          {
            id: 'phy-q2',
            question: '鋼琴調音師同時敲擊 440 Hz 的標準音叉與一條琴弦，每秒聽到 3 次強弱起伏（拍頻），該琴弦可能的頻率為何？',
            options: ['437 Hz 或 443 Hz', '僅 440 Hz', '1320 Hz', '434 Hz 或 446 Hz'],
            correctIndex: 0,
            explanation: '依據 f_beat = |f₁ − f₂| = 3 Hz，可知琴弦頻率為 440 ± 3 Hz，即 437 Hz 或 443 Hz。',
          },
        ],
      },
    ],
  },
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    discipline: '自然科學',
    courseId: 'bio-bohr-effect',
    term: '波耳效應 (Bohr Effect)',
    formula: 'pH ↓ / PCO₂ ↑ ⇒ P50 ↑',
    definition: '血液酸度增加（pH 降低）或二氧化碳分壓升高時，血紅素對氧氣的親和力下降，使氧解離曲線向右移動的生理現象。',
    example: '短跑衝刺時肌肉產生乳酸與 CO₂，促使紅血球在局部組織釋放更多 O₂。',
  },
  {
    id: 'fc-2',
    discipline: '自然科學',
    courseId: 'bio-bohr-effect',
    term: 'P50 數值',
    formula: '標準值 ≈ 26.8 mmHg',
    definition: '血紅素達到 50% 氧飽和度時對應的血液氧分壓。數值愈高代表親和力愈低、愈容易釋放氧氣。',
    example: '胎兒血紅素（HbF）的 P50 較成人低（約 19 mmHg），利於從母體胎盤抓取氧氣。',
  },
  {
    id: 'fc-3',
    discipline: '自然科學',
    courseId: 'bio-bohr-effect',
    term: '協同結合 (Cooperative Binding)',
    definition: '血紅素四個次單元中，每結合一個 O₂ 分子便誘導構形轉為 R-state，進而提高剩餘位點對 O₂ 的親和力。',
    example: '這也是氧血紅素解離曲線呈 S 型而非雙曲線的根本結構原因。',
  },
  {
    id: 'fc-4',
    discipline: '自然科學',
    courseId: 'bio-bohr-effect',
    term: '碳酸酐酶反應',
    formula: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
    definition: '紅血球內部快速催化二氧化碳與水結合生成碳酸，進而解離出氫離子驅動波耳效應的關鍵酵素反應。',
    example: '組織代謝產生的 CO₂ 大多以碳酸氫根離子（HCO₃⁻）形式在血漿中運輸至肺部。',
  },
  {
    id: 'fc-5',
    discipline: '數學幾何',
    courseId: 'math-golden-ratio',
    term: '黃金比例 (Golden Ratio, φ)',
    formula: 'φ = (1 + √5) / 2 ≈ 1.618034',
    definition: '滿足整體與長段之比等於長段與短段之比的無理數，同時也是方程式 x² − x − 1 = 0 的唯一正根。',
    example: '1 / φ = φ − 1 ≈ 0.618034，其小數部分與自身完全相同。',
  },
  {
    id: 'fc-6',
    discipline: '數學幾何',
    courseId: 'math-golden-ratio',
    term: '費氏數列收斂極限',
    formula: 'lim (Fₙ₊₁ / Fₙ) = φ',
    definition: '從 1, 1 開始、每一項為前兩項之和的數列；隨項數趨近無窮大，相鄰兩項之比穩定收斂於黃金比例。',
    example: '向日葵花盤的順時針與逆時針螺旋數目常為相鄰的費氏數（如 34 與 55）。',
  },
  {
    id: 'fc-7',
    discipline: '數學幾何',
    courseId: 'math-golden-ratio',
    term: '基礎率謬誤 (Base Rate Fallacy)',
    formula: 'P(A|B) = P(B|A)·P(A) / P(B)',
    definition: '在進行條件機率判斷時，過度聚焦於單一檢測的準確率，而忽略事件在母體中原本發生機率（先驗機率）的認知偏誤。',
    example: '極罕見疾病的篩檢即使敏感度高達 99%，多數陽性結果仍可能來自偽陽性。',
  },
  {
    id: 'fc-8',
    discipline: '資訊工程',
    courseId: 'cs-algorithms',
    term: '二分搜尋 (Binary Search)',
    formula: 'T(n) = O(log₂ n)',
    definition: '針對已排序陣列，每次比較中間元素並捨棄一半搜尋空間的高效查找演算法。',
    example: '在 10 億筆有序紀錄中尋找目標值，最多只需 30 次比較即可鎖定位置。',
  },
  {
    id: 'fc-9',
    discipline: '資訊工程',
    courseId: 'cs-algorithms',
    term: '穩定排序 (Stable Sort)',
    definition: '若序列中有兩個鍵值相等的元素，排序完成後它們在輸出中的相對前後順序與原始輸入完全一致。',
    example: '氣泡排序與插入排序皆屬穩定排序；標準選擇排序或快速排序則非穩定。',
  },
  {
    id: 'fc-10',
    discipline: '資訊工程',
    courseId: 'cs-algorithms',
    term: '循環不變量 (Loop Invariant)',
    definition: '在迴圈每次迭代前後皆維持為真的邏輯性質，常用於嚴格證明演算法的正確性。',
    example: '插入排序每輪結束時，索引 0 到 i−1 的子陣列永遠處於已排序狀態。',
  },
  {
    id: 'fc-11',
    discipline: '物理波動',
    courseId: 'phy-wave-optics',
    term: '波的疊加原理',
    formula: 'y_total = y₁ + y₂',
    definition: '線性介質中多列波交會時，任一點的合位移等於各列波單獨存在時於該點產生位移的代數和。',
    example: '兩列波交會過後會彼此穿過，各自的頻率與方向不會受到對方影響。',
  },
  {
    id: 'fc-12',
    discipline: '物理波動',
    courseId: 'phy-wave-optics',
    term: '拍頻 (Beat Frequency)',
    formula: 'f_beat = |f₁ − f₂|',
    definition: '兩列頻率相近的波疊加時，合成波包絡振幅產生週期性強弱變化的頻率，等於兩波頻率差。',
    example: '弦樂器調音時，當拍頻逐漸變慢至消失，代表兩音已達同頻共振。',
  },
];
