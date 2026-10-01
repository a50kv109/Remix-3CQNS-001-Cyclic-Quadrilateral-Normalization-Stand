/**
 * SchoolToolbar Component — 12 Canonical School Geometry Tools
 * R2-05.2 — Canonical Geometry Stand Active Tools
 * 
 * Strict 12-tool order:
 * 1. Выделение (SELECT)
 * 2. Точка (POINT)
 * 3. Отрезок (SEGMENT)
 * 4. Линейка (RULER)
 * 5. Циркуль (COMPASS)
 * 6. Прямая / Окружность (LINE_CIRCLE)
 * 7. Параллель (PARALLEL)
 * 8. Перпендикуляр (PERPENDICULAR)
 * 9. Деление угла пополам (ANGLE_BISECTOR)
 * 10. Диагональ (DIAGONAL)
 * 11. Пересечение (INTERSECTION)
 * 12. Ластик (ERASER)
 */

import React from 'react';
import {
  MousePointer,
  Dot,
  Slash,
  Ruler,
  Compass,
  Circle as CircleIcon,
  AlignJustify,
  GitCommit,
  Divide,
  CornerDownRight,
  Tangent as TangentIcon,
  Eraser
} from 'lucide-react';
import { CanonicalToolId, Language, ToolbarPosition } from '../types/uiTypes';
import { getTranslation } from '../i18n/translations';

export interface ToolItem {
  readonly id: CanonicalToolId;
  readonly icon: React.ReactNode;
}

export const CANONICAL_TOOLS: readonly ToolItem[] = [
  {
    id: 'SELECT',
    icon: <MousePointer className="w-4 h-4" />
  },
  {
    id: 'POINT',
    icon: <Dot className="w-5 h-5" />
  },
  {
    id: 'SEGMENT',
    icon: <Slash className="w-4 h-4" />
  },
  {
    id: 'RULER',
    icon: <Ruler className="w-4 h-4" />
  },
  {
    id: 'COMPASS',
    icon: <Compass className="w-4 h-4" />
  },
  {
    id: 'LINE_CIRCLE',
    icon: <CircleIcon className="w-4 h-4" />
  },
  {
    id: 'PARALLEL',
    icon: <AlignJustify className="w-4 h-4" />
  },
  {
    id: 'PERPENDICULAR',
    icon: <GitCommit className="w-4 h-4" />
  },
  {
    id: 'ANGLE_BISECTOR',
    icon: <Divide className="w-4 h-4" />
  },
  {
    id: 'DIAGONAL',
    icon: <CornerDownRight className="w-4 h-4" />
  },
  {
    id: 'TANGENT',
    icon: <TangentIcon className="w-4 h-4" />
  },
  {
    id: 'INTERSECTION',
    icon: <GitCommit className="w-4 h-4 rotate-45" />
  },
  {
    id: 'ERASER',
    icon: <Eraser className="w-4 h-4" />
  }
];

interface SchoolToolbarProps {
  readonly activeTool: CanonicalToolId;
  readonly onSelectTool: (tool: CanonicalToolId) => void;
  readonly tangentQuantity?: 1 | 2;
  readonly onSetTangentQuantity?: (qty: 1 | 2) => void;
  readonly intersectionMode?: boolean;
  readonly onToggleIntersectionMode?: () => void;
  readonly toolbarPosition: ToolbarPosition;
  readonly onSetToolbarPosition: (pos: ToolbarPosition) => void;
  readonly language?: Language;
}

export const SchoolToolbar: React.FC<SchoolToolbarProps> = ({
  activeTool,
  onSelectTool,
  tangentQuantity = 1,
  onSetTangentQuantity,
  intersectionMode = false,
  onToggleIntersectionMode,
  toolbarPosition,
  onSetToolbarPosition,
  language = 'RU'
}) => {
  const isBottom = toolbarPosition === 'BOTTOM';
  const t = getTranslation(language);

  const getToolText = (id: CanonicalToolId): { label: string; desc: string } => {
    switch (id) {
      case 'SELECT': return { label: t.toolSelect, desc: t.toolSelectDesc };
      case 'POINT': return { label: t.toolPoint, desc: t.toolPointDesc };
      case 'SEGMENT': return { label: t.toolSegment, desc: t.toolSegmentDesc };
      case 'RULER': return { label: t.toolRuler, desc: t.toolRulerDesc };
      case 'COMPASS': return { label: t.toolCompass, desc: t.toolCompassDesc };
      case 'LINE_CIRCLE': return { label: t.toolLineCircle, desc: t.toolLineCircleDesc };
      case 'PARALLEL': return { label: t.toolParallel, desc: t.toolParallelDesc };
      case 'PERPENDICULAR': return { label: t.toolPerpendicular, desc: t.toolPerpendicularDesc };
      case 'ANGLE_BISECTOR': return { label: t.toolAngleBisector, desc: t.toolAngleBisectorDesc };
      case 'DIAGONAL': return { label: t.toolDiagonal, desc: t.toolDiagonalDesc };
      case 'TANGENT': return { label: t.toolTangent, desc: t.toolTangentDesc };
      case 'INTERSECTION': return { label: t.toolIntersection, desc: t.toolIntersectionDesc };
      case 'ERASER': return { label: t.toolEraser, desc: t.toolEraserDesc };
    }
  };

  return (
    <aside className={`absolute z-20 flex p-1 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl shadow-2xl touch-none ${
      toolbarPosition === 'LEFT' ? 'left-3 top-14 flex-col gap-1' :
      toolbarPosition === 'RIGHT' ? 'right-3 top-14 flex-col gap-1' :
      'bottom-3 left-1/2 -translate-x-1/2 flex-row gap-1'
    }`}>
      {/* Position Toggle */}
      <button
        onClick={() => onSetToolbarPosition(
          toolbarPosition === 'LEFT' ? 'RIGHT' :
          toolbarPosition === 'RIGHT' ? 'BOTTOM' : 'LEFT'
        )}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-100 hover:bg-slate-800"
        title={t.switchToolbarPosition}
      >
        {isBottom ? '⠿' : '⋮'}
      </button>
      <div className={`bg-slate-800 ${isBottom ? 'w-[1px]' : 'h-[1px]'} my-1`} />
      {CANONICAL_TOOLS.map((tool) => {
        const isActive = activeTool === tool.id;
        const isTangent = tool.id === 'TANGENT';
        const { label, desc } = getToolText(tool.id);

        return (
          <div key={tool.id} className="relative flex items-center group">
            <button
              type="button"
              onClick={() => onSelectTool(tool.id)}
              aria-label={label}
              title={isTangent ? `${label} — ${t.tangentQuantityLabel} ${tangentQuantity}` : label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-700'
              }`}
            >
              {tool.icon}

              {/* Tangent Quantity Badge */}
              {isTangent && (
                <span
                  data-testid="tangent-quantity-badge"
                  className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 flex items-center justify-center bg-purple-950 border border-purple-400/80 rounded-full text-[9px] font-bold text-purple-200 font-mono shadow-sm"
                  title={`${t.tangentQuantityLabel} ${tangentQuantity}`}
                >
                  {tangentQuantity}
                </span>
              )}
            </button>

            {/* Sub-selector for Tangent when active */}
            {isTangent && isActive && onSetTangentQuantity && (
              <div className="absolute left-full ml-1.5 flex items-center bg-slate-950/95 border border-purple-500/50 rounded-lg p-0.5 shadow-xl z-30 gap-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetTangentQuantity(1);
                  }}
                  className={`w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold font-mono transition-all ${
                    tangentQuantity === 1
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title="1"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetTangentQuantity(2);
                  }}
                  className={`w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold font-mono transition-all ${
                    tangentQuantity === 2
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title="2"
                >
                  2
                </button>
              </div>
            )}

            {/* Floating Tooltip on Hover (hidden when tangent sub-selector is active) */}
            {!(isTangent && isActive) && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-md text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-purple-300">{label}</span>
                  {isTangent && (
                    <span className="px-1 py-0.2 rounded bg-purple-900/60 border border-purple-500/40 text-[10px] text-purple-200 font-mono">
                      {t.tangentQuantityLabel} {tangentQuantity}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 block text-[11px] mt-0.5 max-w-xs whitespace-normal">
                  {desc}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Intersection Research Mode Toggle */}
      {onToggleIntersectionMode && (
        <>
          <div className="h-[1px] bg-slate-800 my-0.5" />
          <div className="relative flex items-center group">
            <button
              type="button"
              onClick={onToggleIntersectionMode}
              aria-label={t.intersectionModeLabel}
              title={`${t.intersectionModeLabel}: ${intersectionMode ? 'ON' : 'OFF'}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative ${
                intersectionMode
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-700'
              }`}
            >
              <GitCommit className="w-4 h-4 rotate-45" />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                  intersectionMode ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-md text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-amber-300">{t.intersectionModeLabel}</span>
                <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${intersectionMode ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'bg-slate-800 text-slate-400'}`}>
                  {intersectionMode ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="text-slate-400 block text-[11px] mt-0.5 max-w-xs whitespace-normal">
                {intersectionMode
                  ? t.intersectionModeOnDesc
                  : t.intersectionModeOffDesc}
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
