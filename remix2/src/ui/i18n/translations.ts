/**
 * AAM Language Kernels — Internationalization (i18n) Registry
 * Supports RU (Russian), UA (Ukrainian), and EN (English).
 *
 * Architecture: Language is a Semantic Gateway for UI representation,
 * strictly isolated from GeometryCore, State, DAG, and Commands.
 */

import { Language } from '../types/uiTypes';

export interface TranslationDictionary {
  // Stand Identity & Header
  standTitle: string;
  standSubTitle: string;
  workbenchBadge: string;
  modeResearch: string;
  modeSchool: string;
  presetsLabel: string;
  presetSquare: string;
  presetRectangle: string;
  presetTrapezoid: string;
  presetGeneral: string;
  projectMenu: string;
  exportJson: string;
  exportSvg: string;
  resetButton: string;
  undoButton: string;

  // Control Ribbon
  geometryBadge: string;
  interactiveDial: string;
  dragHint: string;
  unitLearner: string;
  centerInside: string;
  centerOnChord: string;
  centerOutside: string;
  degreesLabel: string;
  radiansLabel: string;
  fractionsLabel: string;
  scaleLabel: string;
  radiiLabel: string;

  // Rotation Bar
  rotationLabel: string;
  rotationHint: string;

  // Tools & Palette
  toolSelect: string;
  toolSelectDesc: string;
  toolPoint: string;
  toolPointDesc: string;
  toolSegment: string;
  toolSegmentDesc: string;
  toolRuler: string;
  toolRulerDesc: string;
  toolCompass: string;
  toolCompassDesc: string;
  toolLineCircle: string;
  toolLineCircleDesc: string;
  toolParallel: string;
  toolParallelDesc: string;
  toolPerpendicular: string;
  toolPerpendicularDesc: string;
  toolAngleBisector: string;
  toolAngleBisectorDesc: string;
  toolDiagonal: string;
  toolDiagonalDesc: string;
  toolTangent: string;
  toolTangentDesc: string;
  toolIntersection: string;
  toolIntersectionDesc: string;
  toolEraser: string;
  toolEraserDesc: string;
  intersectionModeLabel: string;
  intersectionModeOnDesc: string;
  intersectionModeOffDesc: string;
  tangentQuantityLabel: string;
  lineSubmodeLine: string;
  lineSubmodeCircle: string;
  switchToolbarPosition: string;

  // Tool Guidance
  guidanceSelectTitle: string;
  guidanceSelectSchoolSubtitle: string;
  guidanceSelectResearchSubtitle: string;
  guidancePointTitle: string;
  guidancePointSnapSubtitle: string;
  guidancePointFreeSubtitle: string;
  guidanceSegmentTitle: string;
  guidanceSegmentStep1: string;
  guidanceSegmentStep2: string;
  guidanceRulerTitle: string;
  guidanceRulerStep1: string;
  guidanceRulerStep2: string;
  guidanceCompassTitle: string;
  guidanceCompassStep1: string;
  guidanceCompassStep2: string;
  guidanceLineCircleLineTitle: string;
  guidanceLineCircleCircleTitle: string;
  guidanceLineCircleLineStep1: string;
  guidanceLineCircleLineStep2: string;
  guidanceLineCircleCircleStep1: string;
  guidanceLineCircleCircleStep2: string;
  guidanceParallelTitle: string;
  guidanceParallelStep1: string;
  guidanceParallelStep2Point: string;
  guidanceParallelStep2Line: string;
  guidancePerpendicularTitle: string;
  guidancePerpendicularStep1: string;
  guidancePerpendicularStep2Point: string;
  guidancePerpendicularStep2Line: string;
  guidanceAngleBisectorTitle: string;
  guidanceAngleBisectorStep1: string;
  guidanceAngleBisectorStep2: string;
  guidanceAngleBisectorStep3: string;
  guidanceDiagonalTitle: string;
  guidanceDiagonalSubtitle: string;
  guidanceTangent1Title: string;
  guidanceTangent1Subtitle: string;
  guidanceTangent2Title: string;
  guidanceTangent2Step1: string;
  guidanceTangent2Step2: string;
  guidanceIntersectionTitle: string;
  guidanceIntersectionStep1: string;
  guidanceIntersectionStep2: string;
  guidanceEraserTitle: string;
  guidanceEraserSubtitle: string;
  diagonalVertexToast: string;

  // Research Planes
  plane1Label: string;
  plane2Label: string;
  cloneToPlane2: string;
  fixPlane2: string;
  plane2FixedStatus: string;
  plane2BuildingStatus: string;
  plane2FixedTooltip: string;
  cloneTooltip: string;

  // Information Panel Tabs
  tabSummary: string;
  tabResearch: string;
  tabPassport: string;
  tabGateway: string;
  tabEducation: string;

  // Summary Tab
  quadStateHeader: string;
  quadStateSubHeader: string;
  setAnglesButton: string;
  liveSyncBadge: string;
  inspectorHeader: string;
  inspectorCoordinates: string;
  inspectorAngle: string;
  inspectorCycleFraction: string;
  inspectorOppositeArc: string;
  inspectorChord: string;
  inspectorLength: string;
  inspectorSubtendedAngle: string;
  inspectorArcFraction: string;
  inspectorPoint: string;
  inspectorParentsDag: string;
  inspectorSegment: string;
  inspectorEndpoints: string;
  inspectorLine: string;
  inspectorThroughPoint: string;
  inspectorRefSegment: string;
  inspectorCircle: string;
  inspectorCenter: string;
  inspectorRadius: string;
  inspectorMeasurement: string;
  inspectorDistance: string;

  // Summary Table Columns
  colElement: string;
  colClassicalTrig: string;
  colRelationalMatrix: string;
  colSystemRelation: string;
  rowVertex: string;
  rowArc: string;
  rowSide: string;
  rowInscribedAngle: string;
  oppositeAngleSumTheorem: string;
  ptolemyInvariant: string;
  ptolemyHolds: string;
  ptolemyDeviation: string;
  rowRadius: string;
  rowCenter: string;
  centerPositionRelation: string;
  circleCircleFraction: string;
  subtendedArcText: string;
  inscribedAngleAtVertex: string;

  // Research Table
  noResearchDataTitle: string;
  noResearchDataSub: string;
  researchTableVersion: string;
  researchTableSub: string;
  rowCount: string;
  thStep: string;
  thParameter: string;
  thRadius: string;
  thAreaCircle: string;
  thAreaQuad: string;
  thAreaVoid: string;
  thFillRatio: string;
  thVoidRatio: string;

  // Passport Panel
  passportTitle: string;
  passportSubTitle: string;
  validBadge: string;
  figureAndVertices: string;
  inscribedQuadName: string;
  profileLabel: string;
  baseCircleLabel: string;
  provenanceLabel: string;
  immutableFreezeNote: string;
  canonicalAnglesTableTitle: string;
  thVertex: string;
  thAngleDeg: string;
  thAngleRad: string;
  thCartesianXY: string;

  // Gateway Panel
  gatewayTitle: string;
  gatewaySubTitle: string;
  pipelineTitle: string;
  transactionStreamTitle: string;
  noticeTitle: string;
  noticeBody: string;

  // Education Panel
  educationTitle: string;
  educationSubTitle: string;
  checklistTitle: string;
  checklistSubTitle: string;
  researchChecklist: readonly { readonly stepNumber: number; readonly name: string; readonly question: string }[];
  draTitle: string;
  draSubtitle: string;
  draToolVerifiedFact: string;
  draAgentInterpretation: string;
  draAgentHypotheses: string;
  draNote: string;
  theoremOppositeTitle: string;
  theoremOppositeBadge: string;
  theoremOppositeDesc: string;
  theoremOppositeProof: string;
  theoremInscribedTitle: string;
  theoremInscribedBadge: string;
  theoremInscribedArcHalf: string;
  theoremPtolemyTitle: string;
  theoremPtolemyDesc: string;
  theoremPtolemyDiagonals: string;
  theoremPtolemySides: string;
  theoremPtolemyMatches: string;

  // Numeric Modal
  numericModalTitle: string;
  numericModalDescription: string;
  numericModalVertex: string;
  numericModalApply: string;
  numericModalCancel: string;
  numericModalInvalidNum: string;
}

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  RU: {
    // Header
    standTitle: 'CQNS-001 Cyclic Quadrilateral Stand',
    standSubTitle: 'Геометрический стенд : Исследование и школьные чертёжные инструменты',
    workbenchBadge: '50 / 50 WORKBENCH',
    modeResearch: 'Исследование',
    modeSchool: 'Школьный режим',
    presetsLabel: 'Пресеты:',
    presetSquare: 'Квадрат',
    presetRectangle: 'Прямоугольник',
    presetTrapezoid: 'Трапеция',
    presetGeneral: 'Общий',
    projectMenu: 'Проект',
    exportJson: 'Экспорт JSON состояния',
    exportSvg: 'Экспорт SVG чертежа',
    resetButton: 'Сброс',
    undoButton: '↶ Undo',

    // Control Ribbon
    geometryBadge: 'GEOMETRY',
    interactiveDial: 'Интерактивный циферблат',
    dragHint: 'Тяните вершины A, B, C, D или вращайте диск ↻',
    unitLearner: '1 px = 1 мм (учебный)',
    centerInside: 'Центр O строго внутри четырёхугольника',
    centerOnChord: 'Центр O лежит на хорде (Фалес)',
    centerOutside: 'Центр O вне четырёхугольника',
    degreesLabel: 'Градусы (0°..360°)',
    radiansLabel: 'Радианы (0..2π)',
    fractionsLabel: 'Доли цикла (u ∈ [0, 1))',
    scaleLabel: 'Шкала',
    radiiLabel: 'Радиусы',

    // Rotation Bar
    rotationLabel: 'ВРАЩЕНИЕ::',
    rotationHint: 'Поверните диск для удобного доступа к вершинам',

    // Tools
    toolSelect: 'Выделение',
    toolSelectDesc: 'Выделение объектов и перемещение вершин мышью',
    toolPoint: 'Точка',
    toolPointDesc: 'Построение свободной или привязанной точки',
    toolSegment: 'Отрезок',
    toolSegmentDesc: 'Отрезок между двумя точками с резиновой нитью',
    toolRuler: 'Линейка',
    toolRulerDesc: 'Измерение расстояния между двумя точками в мм',
    toolCompass: 'Циркуль',
    toolCompassDesc: 'Классический школьный циркуль: фиксация иглы и раствор второй ножки',
    toolLineCircle: 'Прямая / Окружность',
    toolLineCircleDesc: 'Бесконечная прямая через 2 точки или окружность по центру и радиусу',
    toolParallel: 'Параллель',
    toolParallelDesc: 'Прямая через точку, параллельная выбранному отрезку',
    toolPerpendicular: 'Перпендикуляр',
    toolPerpendicularDesc: 'Прямая через точку, перпендикулярная выбранному отрезку',
    toolAngleBisector: 'Деление угла пополам',
    toolAngleBisectorDesc: 'Деление угла пополам по 3 точкам (луч 1, вершина, луч 2)',
    toolDiagonal: 'Диагональ',
    toolDiagonalDesc: 'Построение диагоналей AC или BD четырёхугольника',
    toolTangent: 'Касательная',
    toolTangentDesc: 'Касательная к окружности в выбранной точке',
    toolIntersection: 'Пересечение',
    toolIntersectionDesc: 'Пересечение двух прямых или отрезков',
    toolEraser: 'Ластик',
    toolEraserDesc: 'Удаление вспомогательного геометрического объекта',
    intersectionModeLabel: 'Режим пересечений',
    intersectionModeOnDesc: 'Обнаружение пересечений активно. Кликните по кандидату для материализации точки Iₖ',
    intersectionModeOffDesc: 'По умолчанию выключено. Включите для поиска и материализации точек пересечений Iₖ',
    tangentQuantityLabel: 'Количество:',
    lineSubmodeLine: 'Прямая',
    lineSubmodeCircle: 'Окружность',
    switchToolbarPosition: 'Сменить положение панели',

    // Tool Guidance
    guidanceSelectTitle: 'Инструмент «Выделение»',
    guidanceSelectSchoolSubtitle: 'Перетаскивайте вершины A, B, C, D по окружности S¹ или кликните объект для инспекции',
    guidanceSelectResearchSubtitle: 'Исследовательский режим: свободное перемещение вершин на плоскости ℝ²',
    guidancePointTitle: 'Инструмент «Точка»',
    guidancePointSnapSubtitle: 'Привязка к:',
    guidancePointFreeSubtitle: 'Кликните на полотне для создания точки',
    guidanceSegmentTitle: 'Инструмент «Отрезок»',
    guidanceSegmentStep1: 'Шаг 1 из 2: Кликните первую точку',
    guidanceSegmentStep2: 'Шаг 2 из 2: Кликните вторую точку',
    guidanceRulerTitle: 'Инструмент «Линейка»',
    guidanceRulerStep1: 'Шаг 1: Выберите начальную точку для измерения',
    guidanceRulerStep2: 'Шаг 2: Выберите конечную точку',
    guidanceCompassTitle: 'Инструмент «Циркуль»',
    guidanceCompassStep1: 'Шаг 1 из 2: Зафиксируйте иглу (центр окружности)',
    guidanceCompassStep2: 'Шаг 2 из 2: Двигайте курсор для изменения раствора. Кликните для построения',
    guidanceLineCircleLineTitle: 'Инструмент «Прямая»',
    guidanceLineCircleCircleTitle: 'Инструмент «Окружность»',
    guidanceLineCircleLineStep1: 'Кликните первую точку прямой',
    guidanceLineCircleLineStep2: 'Кликните вторую точку прямой',
    guidanceLineCircleCircleStep1: 'Кликните центр окружности',
    guidanceLineCircleCircleStep2: 'Кликните точку радиуса',
    guidanceParallelTitle: 'Инструмент «Параллель»',
    guidanceParallelStep1: 'Кликните опорный отрезок или точку',
    guidanceParallelStep2Point: 'Кликните целевую точку',
    guidanceParallelStep2Line: 'Кликните целевую прямую',
    guidancePerpendicularTitle: 'Инструмент «Перпендикуляр»',
    guidancePerpendicularStep1: 'Кликните опорный отрезок или точку',
    guidancePerpendicularStep2Point: 'Кликните целевую точку',
    guidancePerpendicularStep2Line: 'Кликните целевую прямую',
    guidanceAngleBisectorTitle: 'Инструмент «Деление угла пополам»',
    guidanceAngleBisectorStep1: 'Шаг 1 из 3: Кликните точку первого луча угла',
    guidanceAngleBisectorStep2: 'Шаг 2 из 3: Кликните ВЕРШИНУ угла',
    guidanceAngleBisectorStep3: 'Шаг 3 из 3: Кликните точку второго луча угла',
    guidanceDiagonalTitle: 'Инструмент «Диагональ»',
    guidanceDiagonalSubtitle: 'Кликните любую вершину четырёхугольника (A, B, C или D) для построения диагонали',
    guidanceTangent1Title: 'Инструмент «Касательная» (1 касательная)',
    guidanceTangent1Subtitle: 'Кликните точку на окружности S¹ для построения касательной',
    guidanceTangent2Title: 'Инструмент «Касательная» (2 касательные)',
    guidanceTangent2Step1: 'Шаг 1 из 2: Кликните первую точку на окружности S¹',
    guidanceTangent2Step2: 'Шаг 2 из 2: Кликните вторую точку на окружности S¹',
    guidanceIntersectionTitle: 'Инструмент «Пересечение»',
    guidanceIntersectionStep1: 'Шаг 1 из 2: Кликните первый отрезок или прямую',
    guidanceIntersectionStep2: 'Шаг 2 из 2: Кликните второй отрезок для пересечения',
    guidanceEraserTitle: 'Инструмент «Ластик»',
    guidanceEraserSubtitle: 'Кликните любой вспомогательный объект для его удаления',
    diagonalVertexToast: 'Кликните вершину (A, B, C или D)',

    // Research Planes
    plane1Label: 'PLANE 1',
    plane2Label: 'PLANE 2',
    cloneToPlane2: 'CLONE → PLANE 2',
    fixPlane2: 'FIX PLANE 2',
    plane2FixedStatus: 'PLANE 2: FIXED',
    plane2BuildingStatus: 'PLANE 2: BUILDING',
    plane2FixedTooltip: 'PLANE 2 IS FIXED — CLONE REJECTED',
    cloneTooltip: 'Клонировать геометрическую конструкцию Plane 1 на Plane 2',

    // Information Panel Tabs
    tabSummary: 'Сводка',
    tabResearch: 'Исследование',
    tabPassport: 'Паспорт',
    tabGateway: 'ААМ Шлюз',
    tabEducation: 'Обучение',

    // Summary Tab
    quadStateHeader: 'QUADRILATERAL STATE',
    quadStateSubHeader: 'Циклический четырёхугольник → Два способа описания',
    setAnglesButton: 'Задать углы числом',
    liveSyncBadge: 'Live Sync',
    inspectorHeader: 'ИНСПЕКТОР ВЫБРАННОГО ОБЪЕКТА:',
    inspectorCoordinates: 'Координаты:',
    inspectorAngle: 'Угол:',
    inspectorCycleFraction: 'Доля цикла u:',
    inspectorOppositeArc: 'Противоположная дуга:',
    inspectorChord: 'Хорда:',
    inspectorLength: 'Длина:',
    inspectorSubtendedAngle: 'Стягиваемый угол:',
    inspectorArcFraction: 'Доля окружности:',
    inspectorPoint: 'Точка:',
    inspectorParentsDag: 'Родители в DAG:',
    inspectorSegment: 'Отрезок:',
    inspectorEndpoints: 'Концы:',
    inspectorLine: 'Прямая:',
    inspectorThroughPoint: 'Точка прохождения:',
    inspectorRefSegment: 'Опорный отрезок:',
    inspectorCircle: 'Окружность:',
    inspectorCenter: 'Центр:',
    inspectorRadius: 'Радиус:',
    inspectorMeasurement: 'Измерение:',
    inspectorDistance: 'Расстояние:',

    // Summary Table Columns
    colElement: 'ЭЛЕМЕНТ',
    colClassicalTrig: 'CLASSICAL (Trig)',
    colRelationalMatrix: 'RELATIONAL / MATRIX',
    colSystemRelation: 'ОТНОШЕНИЕ В СИСТЕМЕ',
    rowVertex: 'Вершина',
    rowArc: 'Дуга',
    rowSide: 'Сторона',
    rowInscribedAngle: '∠',
    oppositeAngleSumTheorem: 'Теорема о сумме противоположных углов',
    ptolemyInvariant: 'Птолемей',
    ptolemyHolds: 'Тождество выполняется ✓',
    ptolemyDeviation: 'Отклонение',
    rowRadius: 'Радиус R',
    rowCenter: 'Центр O',
    centerPositionRelation: 'Положение центра относительно хорд',
    circleCircleFraction: 'круга',
    subtendedArcText: '½ дуги',
    inscribedAngleAtVertex: 'Вписанный угол при вершине',

    // Research Table
    noResearchDataTitle: 'Нет данных исследования',
    noResearchDataSub: 'Запустите параметрическое исследование или измените положение вершин для формирования строк измерений.',
    researchTableVersion: 'RESEARCH TABLE v0.1',
    researchTableSub: 'Опорное пространство (Круг) ↔ Вписанный объект',
    rowCount: 'Строк:',
    thStep: 'Шаг',
    thParameter: 'Параметр',
    thRadius: 'R (мм)',
    thAreaCircle: 'S круга (мм²)',
    thAreaQuad: 'S 4-уг (мм²)',
    thAreaVoid: 'S пустоты (мм²)',
    thFillRatio: 'Заполнение',
    thVoidRatio: 'Пустота',

    // Passport Panel
    passportTitle: 'Паспорт конфигурации (Geometry Passport)',
    passportSubTitle: 'Архитектурный срез состояния Remix 2 State Core',
    validBadge: 'VALID',
    figureAndVertices: 'Фигура & Вершины',
    inscribedQuadName: 'Вписанный четырёхугольник (N = 4)',
    profileLabel: 'Профиль:',
    baseCircleLabel: 'Опорная окружность S¹',
    provenanceLabel: 'Происхождение (Provenance)',
    immutableFreezeNote: 'Неизменяемое состояние зафиксировано через глубокий freeze (Object.freeze)',
    canonicalAnglesTableTitle: 'Канонические углы и производные декартовы координаты',
    thVertex: 'ВЕРШИНА',
    thAngleDeg: 'УГОЛ α (ГРАДУСЫ)',
    thAngleRad: 'УГОЛ α (РАДИАНЫ)',
    thCartesianXY: 'ДЕКАРТОВЫ (X, Y)',

    // Gateway Panel
    gatewayTitle: 'ААМ Шлюз / SOL Agent Gateway',
    gatewaySubTitle: 'Операционный мост между агентами, верификацией и ядром состояния',
    pipelineTitle: 'Принцип операционного взаимодействия (SOL Pipeline):',
    transactionStreamTitle: 'Журнал транзакций ядра (State Transaction Stream)',
    noticeTitle: 'Архитектурное разграничение:',
    noticeBody: 'Полный операционный диспетчер SOL Gateway (R2-12), Relation Graph (R2-07) и Verification Core (R2-08) будут развёрнуты в последующих пакетах.',

    // Education Panel
    educationTitle: 'Обучение и Теоремы (School Curriculum & Agent Guide)',
    educationSubTitle: 'Математические доказательства и исследовательский протокол агента',
    checklistTitle: 'Протокол исследователя (Agent Research Checklist)',
    checklistSubTitle: 'Методические вопросы для формулирования исследовательских экспериментов:',
    researchChecklist: [
      { stepNumber: 1, name: 'ВОПРОС', question: 'Что именно я пытаюсь выяснить?' },
      { stepNumber: 2, name: 'ОБЪЕКТ', question: 'Какой геометрический объект или отношение исследуется?' },
      { stepNumber: 3, name: 'ПЕРЕМЕННАЯ', question: 'Что можно изменять при сохранении соответствующих условий?' },
      { stepNumber: 4, name: 'ПОСТРОЕНИЕ', question: 'Какие дополнительные геометрические объекты могут выявить отношение?' },
      { stepNumber: 5, name: 'ИЗМЕРЕНИЕ', question: 'Какие величины следует наблюдать?' },
      { stepNumber: 6, name: 'СООТНОШЕНИЕ / ВЫРАЖЕНИЕ', question: 'Можно ли объединить наблюдения в осмысленное выражение, отношение, разность, произведение, сумму или квадрат?' },
      { stepNumber: 7, name: 'ПЕРЕБОР ПАРАМЕТРОВ', question: 'Поможет ли серия контролируемых состояний выявить закономерность лучше, чем одно наблюдение?' },
      { stepNumber: 8, name: 'ПАТТЕРН', question: 'Что остаётся постоянным? Что меняется систематически?' },
      { stepNumber: 9, name: 'ГИПОТЕЗА', question: 'Можно ли сформулировать наблюдаемую закономерность как проверяемую гипотезу?' },
      { stepNumber: 10, name: 'КОНТРПРИМЕР', question: 'Какое изменение состояния может опровергнуть гипотезу?' },
      { stepNumber: 11, name: 'СЛЕДУЮЩИЙ ЭКСПЕРИМЕНТ', question: 'Какое следующее наблюдение будет наиболее информативным?' },
      { stepNumber: 12, name: 'ЭПИСТЕМИЧЕСКИЙ СТАТУС', question: 'Это сырое измерение, производное выражение, эмпирическое наблюдение, гипотеза или формально ВЕРИФИЦИРОВАННЫЙ факт?' }
    ],
    draTitle: 'Детерминированный якорь рассуждений (DRA)',
    draSubtitle: 'Эвристика для внешней детерминированной верификации',
    draToolVerifiedFact: 'ФАКТ, ВЕРИФИЦИРОВАННЫЙ ИНСТРУМЕНТОМ',
    draAgentInterpretation: 'ИНТЕРПРЕТАЦИЯ АГЕНТА',
    draAgentHypotheses: 'ГИПОТЕЗЫ АГЕНТА',
    draNote: 'Слой верификации остается единственным источником истинности для ВЕРИФИЦИРОВАННЫХ математических фактов.',
    theoremOppositeTitle: 'Теорема о сумме противоположных углов',
    theoremOppositeBadge: '180° ИНВАРИАНТ',
    theoremOppositeDesc: 'Сумма противоположных углов четырёхугольника, вписанного в окружность, всегда равна 180°:',
    theoremOppositeProof: 'Доказательство: Вписанный угол равен половине дуги, на которую он опирается. Сумма дуг BCD и DAB составляет полную окружность (360°), следовательно, ½ · 360° = 180°.',
    theoremInscribedTitle: 'Теорема о вписанном угле',
    theoremInscribedBadge: '∠ = ½ ДУГИ',
    theoremInscribedArcHalf: '½ от дуги',
    theoremPtolemyTitle: 'Теорема Птолемея для циклического четырёхугольника',
    theoremPtolemyDesc: 'Для любого вписанного четырёхугольника произведение диагоналей равно сумме произведений противоположных сторон:',
    theoremPtolemyDiagonals: 'Диагонали:',
    theoremPtolemySides: 'Стороны:',
    theoremPtolemyMatches: '✓ Совпадает',

    // Numeric Modal
    numericModalTitle: 'Задать углы вершин числом',
    numericModalDescription: 'Введите значения полярных углов (0°..360°) для вершин A, B, C, D. Углы должны следовать в строго возрастающем циклическом порядке.',
    numericModalVertex: 'Вершина',
    numericModalApply: 'Применить',
    numericModalCancel: 'Отмена',
    numericModalInvalidNum: 'Некорректное значение угла для вершины'
  },

  UA: {
    // Header
    standTitle: 'CQNS-001 Cyclic Quadrilateral Stand',
    standSubTitle: 'Геометричний стенд : Дослідження та шкільні креслярські інструменти',
    workbenchBadge: '50 / 50 WORKBENCH',
    modeResearch: 'Дослідження',
    modeSchool: 'Шкільний режим',
    presetsLabel: 'Пресети:',
    presetSquare: 'Квадрат',
    presetRectangle: 'Прямокутник',
    presetTrapezoid: 'Трапеція',
    presetGeneral: 'Загальний',
    projectMenu: 'Проєкт',
    exportJson: 'Експорт JSON стану',
    exportSvg: 'Експорт SVG креслення',
    resetButton: 'Скидання',
    undoButton: '↶ Undo',

    // Control Ribbon
    geometryBadge: 'GEOMETRY',
    interactiveDial: 'Інтерактивний циферблат',
    dragHint: 'Тягніть вершини A, B, C, D або обертайте диск ↻',
    unitLearner: '1 px = 1 мм (навчальний)',
    centerInside: 'Центр O чітко всередині чотирикутника',
    centerOnChord: 'Центр O лежить на хорді (Фалес)',
    centerOutside: 'Центр O поза чотирикутником',
    degreesLabel: 'Градуси (0°..360°)',
    radiansLabel: 'Радіани (0..2π)',
    fractionsLabel: 'Частки циклу (u ∈ [0, 1))',
    scaleLabel: 'Шкала',
    radiiLabel: 'Радіуси',

    // Rotation Bar
    rotationLabel: 'ОБЕРТАННЯ::',
    rotationHint: 'Поверніть диск для зручного доступу до вершин',

    // Tools
    toolSelect: 'Виділення',
    toolSelectDesc: 'Виділення об’єктів та переміщення вершин мишею',
    toolPoint: 'Точка',
    toolPointDesc: 'Побудова вільної або прив’язаної точки',
    toolSegment: 'Відрізок',
    toolSegmentDesc: 'Відрізок між двома точками з гумовою ниткою',
    toolRuler: 'Лінійка',
    toolRulerDesc: 'Вимірювання відстані між двома точками в мм',
    toolCompass: 'Циркуль',
    toolCompassDesc: 'Класичний шкільний циркуль: фіксація голки та розхил другої ніжки',
    toolLineCircle: 'Пряма / Коло',
    toolLineCircleDesc: 'Нескінченна пряма через 2 точки або коло по центру та радіусу',
    toolParallel: 'Паралель',
    toolParallelDesc: 'Пряма через точку, паралельна обраному відрізку',
    toolPerpendicular: 'Перпендикуляр',
    toolPerpendicularDesc: 'Пряма через точку, перпендикулярна обраному відрізку',
    toolAngleBisector: 'Ділення кута навпіл',
    toolAngleBisectorDesc: 'Ділення кута навпіл по 3 точках (промінь 1, вершина, промінь 2)',
    toolDiagonal: 'Діагональ',
    toolDiagonalDesc: 'Побудова діагоналей AC або BD чотирикутника',
    toolTangent: 'Дотична',
    toolTangentDesc: 'Дотична до кола в обраній точці',
    toolIntersection: 'Перетин',
    toolIntersectionDesc: 'Перетин двох прямих або відрізків',
    toolEraser: 'Гумка',
    toolEraserDesc: 'Видалення допоміжного геометричного об’єкта',
    intersectionModeLabel: 'Режим перетинів',
    intersectionModeOnDesc: 'Виявлення перетинів активне. Клікніть по кандидату для матеріалізації точки Iₖ',
    intersectionModeOffDesc: 'За замовчуванням вимкнено. Увімкніть для пошуку та матеріалізації точок перетинів Iₖ',
    tangentQuantityLabel: 'Кількість:',
    lineSubmodeLine: 'Пряма',
    lineSubmodeCircle: 'Коло',
    switchToolbarPosition: 'Змінити положення панели',

    // Tool Guidance
    guidanceSelectTitle: 'Інструмент «Виділення»',
    guidanceSelectSchoolSubtitle: 'Перетягуйте вершини A, B, C, D по колу S¹ або клікніть об’єкт для інспекції',
    guidanceSelectResearchSubtitle: 'Дослідницький режим: вільне переміщення вершин на площині ℝ²',
    guidancePointTitle: 'Інструмент «Точка»',
    guidancePointSnapSubtitle: 'Прив’язка до:',
    guidancePointFreeSubtitle: 'Клікніть на полотні для створення точки',
    guidanceSegmentTitle: 'Інструмент «Відрізок»',
    guidanceSegmentStep1: 'Крок 1 з 2: Клікніть першу точку',
    guidanceSegmentStep2: 'Крок 2 з 2: Клікніть другу точку',
    guidanceRulerTitle: 'Інструмент «Лінійка»',
    guidanceRulerStep1: 'Крок 1: Оберіть початкову точку для вимірювання',
    guidanceRulerStep2: 'Крок 2: Оберіть кінцеву точку',
    guidanceCompassTitle: 'Інструмент «Циркуль»',
    guidanceCompassStep1: 'Крок 1 з 2: Зафіксуйте голку (центр кола)',
    guidanceCompassStep2: 'Крок 2 з 2: Рухайте курсор для зміни розхилу. Клікніть для побудови',
    guidanceLineCircleLineTitle: 'Інструмент «Пряма»',
    guidanceLineCircleCircleTitle: 'Інструмент «Коло»',
    guidanceLineCircleLineStep1: 'Клікніть першу точку прямої',
    guidanceLineCircleLineStep2: 'Клікніть другу точку прямої',
    guidanceLineCircleCircleStep1: 'Клікніть центр кола',
    guidanceLineCircleCircleStep2: 'Клікніть точку радіуса',
    guidanceParallelTitle: 'Інструмент «Паралель»',
    guidanceParallelStep1: 'Клікніть опорний відрізок або точку',
    guidanceParallelStep2Point: 'Клікніть цільову точку',
    guidanceParallelStep2Line: 'Клікніть цільову пряму',
    guidancePerpendicularTitle: 'Інструмент «Перпендикуляр»',
    guidancePerpendicularStep1: 'Клікніть опорний відрізок або точку',
    guidancePerpendicularStep2Point: 'Клікніть цільову точку',
    guidancePerpendicularStep2Line: 'Клікніть цільову пряму',
    guidanceAngleBisectorTitle: 'Інструмент «Ділення кута навпіл»',
    guidanceAngleBisectorStep1: 'Крок 1 з 3: Клікніть точку першого променя кута',
    guidanceAngleBisectorStep2: 'Крок 2 з 3: Клікніть ВЕРШИНУ кута',
    guidanceAngleBisectorStep3: 'Крок 3 з 3: Клікніть точку второго променя кута',
    guidanceDiagonalTitle: 'Інструмент «Діагональ»',
    guidanceDiagonalSubtitle: 'Клікніть будь-яку вершину чотирикутника (A, B, C або D) для побудови діагоналі',
    guidanceTangent1Title: 'Інструмент «Дотична» (1 дотична)',
    guidanceTangent1Subtitle: 'Клікніть точку на колі S¹ для побудови дотичної',
    guidanceTangent2Title: 'Інструмент «Дотична» (2 дотичні)',
    guidanceTangent2Step1: 'Крок 1 з 2: Клікніть першу точку на колі S¹',
    guidanceTangent2Step2: 'Крок 2 з 2: Клікніть другу точку на колі S¹',
    guidanceIntersectionTitle: 'Інструмент «Перетин»',
    guidanceIntersectionStep1: 'Крок 1 з 2: Клікніть перший відрізок або пряму',
    guidanceIntersectionStep2: 'Крок 2 з 2: Клікніть другий відрізок для перетину',
    guidanceEraserTitle: 'Інструмент «Гумка»',
    guidanceEraserSubtitle: 'Клікніть будь-який допоміжний об’єкт для його видалення',
    diagonalVertexToast: 'Клікніть вершину (A, B, C або D)',

    // Research Planes
    plane1Label: 'PLANE 1',
    plane2Label: 'PLANE 2',
    cloneToPlane2: 'CLONE → PLANE 2',
    fixPlane2: 'FIX PLANE 2',
    plane2FixedStatus: 'PLANE 2: FIXED',
    plane2BuildingStatus: 'PLANE 2: BUILDING',
    plane2FixedTooltip: 'PLANE 2 IS FIXED — CLONE REJECTED',
    cloneTooltip: 'Клонувати геометричну конструкцію Plane 1 на Plane 2',

    // Information Panel Tabs
    tabSummary: 'Зведення',
    tabResearch: 'Дослідження',
    tabPassport: 'Паспорт',
    tabGateway: 'ААМ Шлюз',
    tabEducation: 'Навчання',

    // Summary Tab
    quadStateHeader: 'QUADRILATERAL STATE',
    quadStateSubHeader: 'Циклічний чотирикутник → Два способи опису',
    setAnglesButton: 'Задати кути числом',
    liveSyncBadge: 'Live Sync',
    inspectorHeader: 'ІНСПЕКТОР ОБРАНОГО ОБ’ЄКТА:',
    inspectorCoordinates: 'Координати:',
    inspectorAngle: 'Кут:',
    inspectorCycleFraction: 'Частка циклу u:',
    inspectorOppositeArc: 'Протилежна дуга:',
    inspectorChord: 'Хорда:',
    inspectorLength: 'Довжина:',
    inspectorSubtendedAngle: 'Стягуваний кут:',
    inspectorArcFraction: 'Частка кола:',
    inspectorPoint: 'Точка:',
    inspectorParentsDag: 'Батьки в DAG:',
    inspectorSegment: 'Відрізок:',
    inspectorEndpoints: 'Кінці:',
    inspectorLine: 'Пряма:',
    inspectorThroughPoint: 'Точка проходження:',
    inspectorRefSegment: 'Опорний відрізок:',
    inspectorCircle: 'Коло:',
    inspectorCenter: 'Центр:',
    inspectorRadius: 'Радіус:',
    inspectorMeasurement: 'Вимірювання:',
    inspectorDistance: 'Відстань:',

    // Summary Table Columns
    colElement: 'ЕЛЕМЕНТ',
    colClassicalTrig: 'CLASSICAL (Trig)',
    colRelationalMatrix: 'RELATIONAL / MATRIX',
    colSystemRelation: 'ВІДНОШЕННЯ В СИСТЕМІ',
    rowVertex: 'Вершина',
    rowArc: 'Дуга',
    rowSide: 'Сторона',
    rowInscribedAngle: '∠',
    oppositeAngleSumTheorem: 'Теорема про суму протилежних кутів',
    ptolemyInvariant: 'Птолемей',
    ptolemyHolds: 'Тотожність виконується ✓',
    ptolemyDeviation: 'Відхилення',
    rowRadius: 'Радіус R',
    rowCenter: 'Центр O',
    centerPositionRelation: 'Положення центра відносно хорд',
    circleCircleFraction: 'кола',
    subtendedArcText: '½ дуги',
    inscribedAngleAtVertex: 'Вписаний кут при вершині',

    // Research Table
    noResearchDataTitle: 'Немає даних дослідження',
    noResearchDataSub: 'Запустіть параметричне дослідження або змініть положення вершин для формування рядків вимірювань.',
    researchTableVersion: 'RESEARCH TABLE v0.1',
    researchTableSub: 'Опорний простір (Коло) ↔ Вписаний об’єкт',
    rowCount: 'Рядків:',
    thStep: 'Крок',
    thParameter: 'Параметр',
    thRadius: 'R (мм)',
    thAreaCircle: 'S кола (мм²)',
    thAreaQuad: 'S 4-кут (мм²)',
    thAreaVoid: 'S порожнечі (мм²)',
    thFillRatio: 'Заповнення',
    thVoidRatio: 'Порожнеча',

    // Passport Panel
    passportTitle: 'Паспорт конфігурації (Geometry Passport)',
    passportSubTitle: 'Архітектурний зріз стану Remix 2 State Core',
    validBadge: 'VALID',
    figureAndVertices: 'Фігура & Вершини',
    inscribedQuadName: 'Вписаний чотирикутник (N = 4)',
    profileLabel: 'Профіль:',
    baseCircleLabel: 'Опорне коло S¹',
    provenanceLabel: 'Походження (Provenance)',
    immutableFreezeNote: 'Незмінний стан зафіксовано через глибокий freeze (Object.freeze)',
    canonicalAnglesTableTitle: 'Канонічні кути та похідні декартові координати',
    thVertex: 'ВЕРШИНА',
    thAngleDeg: 'КУТ α (ГРАДУСИ)',
    thAngleRad: 'КУТ α (РАДІАНИ)',
    thCartesianXY: 'ДЕКАРТОВІ (X, Y)',

    // Gateway Panel
    gatewayTitle: 'ААМ Шлюз / SOL Agent Gateway',
    gatewaySubTitle: 'Операційний міст між агентами, верифікацією та ядром стану',
    pipelineTitle: 'Принцип операційної взаємодії (SOL Pipeline):',
    transactionStreamTitle: 'Журнал транзакцій ядра (State Transaction Stream)',
    noticeTitle: 'Архітектурне розмежування:',
    noticeBody: 'Повний операційний диспетчер SOL Gateway (R2-12), Relation Graph (R2-07) та Verification Core (R2-08) будуть розгорнуті у наступних пакетах.',

    // Education Panel
    educationTitle: 'Навчання та Теореми (School Curriculum & Agent Guide)',
    educationSubTitle: 'Математичні доведення та дослідницький протокол агента',
    checklistTitle: 'Протокол дослідника (Agent Research Checklist)',
    checklistSubTitle: 'Методичні питання для формулювання дослідницьких експериментів:',
    researchChecklist: [
      { stepNumber: 1, name: 'ПИТАННЯ', question: "Що саме я намагаюся з'ясувати?" },
      { stepNumber: 2, name: "ОБ'ЄКТ", question: 'Який геометричний об’єкт або відношення досліджується?' },
      { stepNumber: 3, name: 'ЗМІННА', question: 'Що можна змінювати при збереженні відповідних умов?' },
      { stepNumber: 4, name: 'ПОБУДОВА', question: 'Які додаткові геометричні об’єкти можуть виявити відношення?' },
      { stepNumber: 5, name: 'ВИМІРЮВАННЯ', question: 'Які величини слід спостерігати?' },
      { stepNumber: 6, name: 'ВІДНОШЕННЯ / ВИРАЗ', question: 'Чи можна об’єднати спостереження в осмислений вираз, відношення, різницю, добуток, суму чи квадрат?' },
      { stepNumber: 7, name: 'ПЕРЕБІР ПАРАМЕТРІВ', question: 'Чи допоможе серія контрольованих станів виявити закономірність краще, ніж одне спостереження?' },
      { stepNumber: 8, name: 'ПАТЕРН', question: 'Що залишається постійним? Що змінюється систематично?' },
      { stepNumber: 9, name: 'ГІПОТЕЗА', question: 'Чи можна сформулювати спостережувану закономірність як гіпотезу, що перевіряється?' },
      { stepNumber: 10, name: 'КОНТРПРИКЛАД', question: 'Яка зміна стану може спростувати гіпотезу?' },
      { stepNumber: 11, name: 'НАСТУПНИЙ ЕКСПЕРИМЕНТ', question: 'Яке наступне спостереження буде найбільш інформативним?' },
      { stepNumber: 12, name: 'ЕПІСТЕМІЧНИЙ СТАТУС', question: 'Це сире вимірювання, похідний вираз, емпіричне спостереження, гіпотеза чи формально ВЕРИФІКОВАНИЙ факт?' }
    ],
    draTitle: 'Детермінований якір міркувань (DRA)',
    draSubtitle: 'Евристика для зовнішньої детермінованої верифікації',
    draToolVerifiedFact: 'ФАКТ, ВЕРИФІКОВАНИЙ ІНСТРУМЕНТОМ',
    draAgentInterpretation: 'ІНТЕРПРЕТАЦІЯ АГЕНТА',
    draAgentHypotheses: 'ГІПОТЕЗИ АГЕНТА',
    draNote: 'Шар верифікації залишається єдиним джерелом істинності для ВЕРИФІКОВАНИХ математичних фактів.',
    theoremOppositeTitle: 'Теорема про суму протилежних кутів',
    theoremOppositeBadge: '180° ІНВАРІАНТ',
    theoremOppositeDesc: 'Сума протилежних кутів чотирикутника, вписаного в коло, завжди дорівнює 180°:',
    theoremOppositeProof: 'Доведення: Вписаний кут дорівнює половині дуги, на яку він спирається. Сума дуг BCD та DAB складає повне коло (360°), отже, ½ · 360° = 180°.',
    theoremInscribedTitle: 'Теорема про вписаний кут',
    theoremInscribedBadge: '∠ = ½ ДУГИ',
    theoremInscribedArcHalf: '½ від дуги',
    theoremPtolemyTitle: 'Теорема Птолемея для циклічного чотирикутника',
    theoremPtolemyDesc: 'Для будь-якого вписаного чотирикутника добуток діагоналей дорівнює сумі добутків протилежних сторін:',
    theoremPtolemyDiagonals: 'Діагоналі:',
    theoremPtolemySides: 'Сторони:',
    theoremPtolemyMatches: '✓ Збігається',

    // Numeric Modal
    numericModalTitle: 'Задати кути вершин числом',
    numericModalDescription: 'Введіть значення полярних кутів (0°..360°) для вершин A, B, C, D. Кути повинні слідувати у суворо зростаючому циклічному порядку.',
    numericModalVertex: 'Вершина',
    numericModalApply: 'Застосувати',
    numericModalCancel: 'Скасувати',
    numericModalInvalidNum: 'Некоректне значення кута для вершини'
  },

  EN: {
    // Header
    standTitle: 'CQNS-001 Cyclic Quadrilateral Stand',
    standSubTitle: 'Geometry Stand : Research & School Drawing Tools',
    workbenchBadge: '50 / 50 WORKBENCH',
    modeResearch: 'Research',
    modeSchool: 'School Mode',
    presetsLabel: 'Presets:',
    presetSquare: 'Square',
    presetRectangle: 'Rectangle',
    presetTrapezoid: 'Trapezoid',
    presetGeneral: 'General',
    projectMenu: 'Project',
    exportJson: 'Export JSON State',
    exportSvg: 'Export SVG Drawing',
    resetButton: 'Reset',
    undoButton: '↶ Undo',

    // Control Ribbon
    geometryBadge: 'GEOMETRY',
    interactiveDial: 'Interactive Dial',
    dragHint: 'Drag vertices A, B, C, D or rotate disc ↻',
    unitLearner: '1 px = 1 mm (academic)',
    centerInside: 'Center O strictly inside quadrilateral',
    centerOnChord: 'Center O lies on chord (Thales)',
    centerOutside: 'Center O outside quadrilateral',
    degreesLabel: 'Degrees (0°..360°)',
    radiansLabel: 'Radians (0..2π)',
    fractionsLabel: 'Cycle Fractions (u ∈ [0, 1))',
    scaleLabel: 'Scale',
    radiiLabel: 'Radii',

    // Rotation Bar
    rotationLabel: 'ROTATION::',
    rotationHint: 'Rotate disc for easy access to vertices',

    // Tools
    toolSelect: 'Select',
    toolSelectDesc: 'Select objects and drag vertices with mouse',
    toolPoint: 'Point',
    toolPointDesc: 'Construct free or snapped point',
    toolSegment: 'Segment',
    toolSegmentDesc: 'Segment between two points with rubberband',
    toolRuler: 'Ruler',
    toolRulerDesc: 'Measure distance between two points in mm',
    toolCompass: 'Compass',
    toolCompassDesc: 'Classic school compass: needle anchor & leg span',
    toolLineCircle: 'Line / Circle',
    toolLineCircleDesc: 'Infinite line through 2 points or circle by center & radius',
    toolParallel: 'Parallel',
    toolParallelDesc: 'Line through point parallel to reference segment',
    toolPerpendicular: 'Perpendicular',
    toolPerpendicularDesc: 'Line through point perpendicular to reference segment',
    toolAngleBisector: 'Angle Bisector',
    toolAngleBisectorDesc: 'Bisect angle by 3 points (ray 1, vertex, ray 2)',
    toolDiagonal: 'Diagonal',
    toolDiagonalDesc: 'Construct quadrilateral diagonals AC or BD',
    toolTangent: 'Tangent',
    toolTangentDesc: 'Tangent to circle at selected point',
    toolIntersection: 'Intersection',
    toolIntersectionDesc: 'Intersection of two lines or segments',
    toolEraser: 'Eraser',
    toolEraserDesc: 'Delete auxiliary geometry object',
    intersectionModeLabel: 'Intersection Mode',
    intersectionModeOnDesc: 'Intersection detection active. Click candidate to materialize point I▖',
    intersectionModeOffDesc: 'Disabled by default. Enable to find and materialize intersection points I▖',
    tangentQuantityLabel: 'Quantity:',
    lineSubmodeLine: 'Line',
    lineSubmodeCircle: 'Circle',
    switchToolbarPosition: 'Switch toolbar position',

    // Tool Guidance
    guidanceSelectTitle: 'Select Tool',
    guidanceSelectSchoolSubtitle: 'Drag vertices A, B, C, D along circle S¹ or click object to inspect',
    guidanceSelectResearchSubtitle: 'Research Mode: free vertex movement on plane ℝ²',
    guidancePointTitle: 'Point Tool',
    guidancePointSnapSubtitle: 'Snapped to:',
    guidancePointFreeSubtitle: 'Click canvas to create point',
    guidanceSegmentTitle: 'Segment Tool',
    guidanceSegmentStep1: 'Step 1 of 2: Click first point',
    guidanceSegmentStep2: 'Step 2 of 2: Click second point',
    guidanceRulerTitle: 'Ruler Tool',
    guidanceRulerStep1: 'Step 1: Select start point for measurement',
    guidanceRulerStep2: 'Step 2: Select end point',
    guidanceCompassTitle: 'Compass Tool',
    guidanceCompassStep1: 'Step 1 of 2: Anchor needle (circle center)',
    guidanceCompassStep2: 'Step 2 of 2: Move cursor to set radius span. Click to construct',
    guidanceLineCircleLineTitle: 'Line Tool',
    guidanceLineCircleCircleTitle: 'Circle Tool',
    guidanceLineCircleLineStep1: 'Click first point of line',
    guidanceLineCircleLineStep2: 'Click second point of line',
    guidanceLineCircleCircleStep1: 'Click center of circle',
    guidanceLineCircleCircleStep2: 'Click radius point',
    guidanceParallelTitle: 'Parallel Tool',
    guidanceParallelStep1: 'Click reference segment or point',
    guidanceParallelStep2Point: 'Click target point',
    guidanceParallelStep2Line: 'Click target line',
    guidancePerpendicularTitle: 'Perpendicular Tool',
    guidancePerpendicularStep1: 'Click reference segment or point',
    guidancePerpendicularStep2Point: 'Click target point',
    guidancePerpendicularStep2Line: 'Click target line',
    guidanceAngleBisectorTitle: 'Angle Bisector Tool',
    guidanceAngleBisectorStep1: 'Step 1 of 3: Click point on first ray',
    guidanceAngleBisectorStep2: 'Step 2 of 3: Click angle VERTEX',
    guidanceAngleBisectorStep3: 'Step 3 of 3: Click point on second ray',
    guidanceDiagonalTitle: 'Diagonal Tool',
    guidanceDiagonalSubtitle: 'Click any quadrilateral vertex (A, B, C, or D) to construct diagonal',
    guidanceTangent1Title: 'Tangent Tool (1 tangent)',
    guidanceTangent1Subtitle: 'Click point on circle S¹ to construct tangent',
    guidanceTangent2Title: 'Tangent Tool (2 tangents)',
    guidanceTangent2Step1: 'Step 1 of 2: Click first point on circle S¹',
    guidanceTangent2Step2: 'Step 2 of 2: Click second point on circle S¹',
    guidanceIntersectionTitle: 'Intersection Tool',
    guidanceIntersectionStep1: 'Step 1 of 2: Click first segment or line',
    guidanceIntersectionStep2: 'Step 2 of 2: Click second segment to intersect',
    guidanceEraserTitle: 'Eraser Tool',
    guidanceEraserSubtitle: 'Click any auxiliary object to delete it',
    diagonalVertexToast: 'Click vertex (A, B, C, or D)',

    // Research Planes
    plane1Label: 'PLANE 1',
    plane2Label: 'PLANE 2',
    cloneToPlane2: 'CLONE → PLANE 2',
    fixPlane2: 'FIX PLANE 2',
    plane2FixedStatus: 'PLANE 2: FIXED',
    plane2BuildingStatus: 'PLANE 2: BUILDING',
    plane2FixedTooltip: 'PLANE 2 IS FIXED — CLONE REJECTED',
    cloneTooltip: 'Clone Plane 1 geometry construction to Plane 2',

    // Information Panel Tabs
    tabSummary: 'Summary',
    tabResearch: 'Research',
    tabPassport: 'Passport',
    tabGateway: 'AAM Gateway',
    tabEducation: 'Education',

    // Summary Tab
    quadStateHeader: 'QUADRILATERAL STATE',
    quadStateSubHeader: 'Cyclic Quadrilateral → Two Representations',
    setAnglesButton: 'Set Angles Numerically',
    liveSyncBadge: 'Live Sync',
    inspectorHeader: 'SELECTED OBJECT INSPECTOR:',
    inspectorCoordinates: 'Coordinates:',
    inspectorAngle: 'Angle:',
    inspectorCycleFraction: 'Cycle fraction u:',
    inspectorOppositeArc: 'Opposite arc:',
    inspectorChord: 'Chord:',
    inspectorLength: 'Length:',
    inspectorSubtendedAngle: 'Subtended angle:',
    inspectorArcFraction: 'Circle fraction:',
    inspectorPoint: 'Point:',
    inspectorParentsDag: 'Parents in DAG:',
    inspectorSegment: 'Segment:',
    inspectorEndpoints: 'Endpoints:',
    inspectorLine: 'Line:',
    inspectorThroughPoint: 'Through point:',
    inspectorRefSegment: 'Reference segment:',
    inspectorCircle: 'Circle:',
    inspectorCenter: 'Center:',
    inspectorRadius: 'Radius:',
    inspectorMeasurement: 'Measurement:',
    inspectorDistance: 'Distance:',

    // Summary Table Columns
    colElement: 'ELEMENT',
    colClassicalTrig: 'CLASSICAL (Trig)',
    colRelationalMatrix: 'RELATIONAL / MATRIX',
    colSystemRelation: 'SYSTEM RELATIONSHIP',
    rowVertex: 'Vertex',
    rowArc: 'Arc',
    rowSide: 'Side',
    rowInscribedAngle: '∠',
    oppositeAngleSumTheorem: 'Inscribed Quadrilateral Theorem',
    ptolemyInvariant: 'Ptolemy',
    ptolemyHolds: 'Identity Holds ✓',
    ptolemyDeviation: 'Deviation',
    rowRadius: 'Radius R',
    rowCenter: 'Center O',
    centerPositionRelation: 'Center position relative to chords',
    circleCircleFraction: 'circle',
    subtendedArcText: '½ arc',
    inscribedAngleAtVertex: 'Inscribed angle at vertex',

    // Research Table
    noResearchDataTitle: 'No Research Data',
    noResearchDataSub: 'Run a parametric study or move vertices to populate measurement rows.',
    researchTableVersion: 'RESEARCH TABLE v0.1',
    researchTableSub: 'Reference Space (Circle) ↔ Inscribed Object',
    rowCount: 'Rows:',
    thStep: 'Step',
    thParameter: 'Parameter',
    thRadius: 'R (mm)',
    thAreaCircle: 'S circle (mm²)',
    thAreaQuad: 'S quad (mm²)',
    thAreaVoid: 'S void (mm²)',
    thFillRatio: 'Fill Ratio',
    thVoidRatio: 'Void Ratio',

    // Passport Panel
    passportTitle: 'Configuration Passport (Geometry Passport)',
    passportSubTitle: 'Architectural Snapshot of Remix 2 State Core',
    validBadge: 'VALID',
    figureAndVertices: 'Figure & Vertices',
    inscribedQuadName: 'Inscribed Quadrilateral (N = 4)',
    profileLabel: 'Profile:',
    baseCircleLabel: 'Reference Circle S¹',
    provenanceLabel: 'Provenance',
    immutableFreezeNote: 'Immutable state locked via deep freeze (Object.freeze)',
    canonicalAnglesTableTitle: 'Canonical Angles & Derived Cartesian Coordinates',
    thVertex: 'VERTEX',
    thAngleDeg: 'ANGLE α (DEGREES)',
    thAngleRad: 'ANGLE α (RADIANS)',
    thCartesianXY: 'CARTESIAN (X, Y)',

    // Gateway Panel
    gatewayTitle: 'AAM Gateway / SOL Agent Gateway',
    gatewaySubTitle: 'Operational Bridge between Agents, Verification & State Core',
    pipelineTitle: 'Operational Principle (SOL Pipeline):',
    transactionStreamTitle: 'State Transaction Stream',
    noticeTitle: 'Architectural Boundary:',
    noticeBody: 'Full operational SOL Gateway dispatcher (R2-12), Relation Graph (R2-07), and Verification Core (R2-08) will be deployed in subsequent packages.',

    // Education Panel
    educationTitle: 'School Curriculum & Agent Guide',
    educationSubTitle: 'Mathematical Proofs & Agent Research Protocol',
    checklistTitle: 'Agent Research Protocol (Checklist)',
    checklistSubTitle: 'Methodological questions for formulating research experiments:',
    researchChecklist: [
      { stepNumber: 1, name: 'QUESTION', question: 'What exactly am I trying to find out?' },
      { stepNumber: 2, name: 'OBJECT', question: 'Which geometric object or relation is being investigated?' },
      { stepNumber: 3, name: 'VARIABLE', question: 'What can be changed while keeping the relevant conditions?' },
      { stepNumber: 4, name: 'CONSTRUCTION', question: 'What additional geometric objects might expose the relation?' },
      { stepNumber: 5, name: 'MEASUREMENT', question: 'What quantities should be observed?' },
      { stepNumber: 6, name: 'RELATION / EXPRESSION', question: 'Can the observations be combined into a meaningful expression, ratio, difference, product, sum, or square?' },
      { stepNumber: 7, name: 'PARAMETER SWEEP', question: 'Would several controlled states reveal a pattern better than one observation?' },
      { stepNumber: 8, name: 'PATTERN', question: 'What appears to remain constant? What changes systematically?' },
      { stepNumber: 9, name: 'HYPOTHESIS', question: 'Can the observed pattern be stated as a testable hypothesis?' },
      { stepNumber: 10, name: 'COUNTEREXAMPLE', question: 'What change of state could potentially break the hypothesis?' },
      { stepNumber: 11, name: 'NEXT EXPERIMENT', question: 'What is the most informative next observation?' },
      { stepNumber: 12, name: 'EPISTEMIC STATUS', question: 'Is this raw measurement, derived expression, empirical observation, hypothesis, or formally VERIFIED fact?' }
    ],
    draTitle: 'DETERMINISTIC REASONING ANCHOR (DRA)',
    draSubtitle: 'Heuristic for External Deterministic Verification',
    draToolVerifiedFact: 'TOOL-VERIFIED FACT',
    draAgentInterpretation: 'AGENT INTERPRETATION',
    draAgentHypotheses: 'AGENT HYPOTHESES',
    draNote: 'The Verification Layer remains the sole authority for VERIFIED mathematical facts.',
    theoremOppositeTitle: 'Opposite Angles Sum Theorem',
    theoremOppositeBadge: '180° INVARIANT',
    theoremOppositeDesc: 'The sum of opposite angles of a cyclic quadrilateral is always 180°:',
    theoremOppositeProof: 'Proof: An inscribed angle equals half the subtended arc. Sum of arcs BCD and DAB is a full circle (360°), thus ½ · 360° = 180°.',
    theoremInscribedTitle: 'Inscribed Angle Theorem',
    theoremInscribedBadge: '∠ = ½ ARC',
    theoremInscribedArcHalf: '½ of arc',
    theoremPtolemyTitle: "Ptolemy's Theorem for Cyclic Quadrilaterals",
    theoremPtolemyDesc: 'For any inscribed quadrilateral, the product of diagonals equals the sum of products of opposite sides:',
    theoremPtolemyDiagonals: 'Diagonals:',
    theoremPtolemySides: 'Sides:',
    theoremPtolemyMatches: '✓ Matches',

    // Numeric Modal
    numericModalTitle: 'Set Vertex Angles Numerically',
    numericModalDescription: 'Enter polar angle values (0°..360°) for vertices A, B, C, D. Angles must be strictly increasing in cyclic order.',
    numericModalVertex: 'Vertex',
    numericModalApply: 'Apply',
    numericModalCancel: 'Cancel',
    numericModalInvalidNum: 'Invalid angle value for vertex'
  }
};

const LOCAL_STORAGE_LANG_KEY = 'cqns_language_preference';

export function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    if (saved === 'RU' || saved === 'UA' || saved === 'EN') {
      return saved;
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'RU';
}

export function saveLanguagePreference(lang: Language): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  } catch {
    // Ignore localStorage errors
  }
}

export function getTranslation(lang: Language): TranslationDictionary {
  return TRANSLATIONS[lang] || TRANSLATIONS.RU;
}
