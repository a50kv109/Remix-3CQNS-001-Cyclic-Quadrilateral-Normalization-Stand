/**
 * ResearchPlaneControls Component
 * R3-01.1: Mobile-friendly user controls for Plane 1 / Plane 2 and Lifecycle
 */

import React from 'react';
import { ResearchSession, PlaneId } from '../types/researchSession';
import { Layers, Lock, Unlock, CheckCircle2, Copy } from 'lucide-react';

interface ResearchPlaneControlsProps {
  readonly session: ResearchSession;
  readonly onTogglePlane: (plane: PlaneId) => void;
  readonly onFixPlane2: () => void;
  readonly onClonePlane1ToPlane2?: () => void;
}

export const ResearchPlaneControls: React.FC<ResearchPlaneControlsProps> = ({
  session,
  onTogglePlane,
  onFixPlane2,
  onClonePlane1ToPlane2
}) => {
  const isP1 = session.activePlane === 'PLANE_1';
  const isP2 = session.activePlane === 'PLANE_2';
  const isFixed = session.plane2Lifecycle === 'FIXED';

  return (
    <div
      data-testid="research-plane-controls"
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 bg-slate-900/95 backdrop-blur border-b border-purple-900/50 shadow-md z-20 select-none text-xs"
    >
      {/* 1. Active Plane Switcher (Mobile-First Segmented Control) */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-1 max-w-xs">
        <button
          type="button"
          onClick={() => onTogglePlane('PLANE_1')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
            isP1
              ? 'bg-purple-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          aria-label="Select Plane 1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>PLANE 1</span>
        </button>

        <button
          type="button"
          onClick={() => onTogglePlane('PLANE_2')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
            isP2
              ? 'bg-purple-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          aria-label="Select Plane 2"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>PLANE 2</span>
        </button>
      </div>

      {/* 2. Plane Clone & Plane 2 Lifecycle Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2 px-1 text-xs">
        {onClonePlane1ToPlane2 && (
          <button
            type="button"
            onClick={onClonePlane1ToPlane2}
            disabled={isFixed}
            className={`py-1.5 px-3 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
              isFixed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white shadow-sm border border-purple-500/50'
            }`}
            title={isFixed ? 'PLANE 2 IS FIXED — CLONE REJECTED' : 'Клонировать геометрическую конструкцию Plane 1 на Plane 2'}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>CLONE → PLANE 2</span>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Plane 2:</span>
          {isFixed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono text-[11px] font-semibold">
              <Lock className="w-3 h-3 text-emerald-400" />
              PLANE 2: FIXED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 font-mono text-[11px] font-semibold">
              <Unlock className="w-3 h-3 text-amber-400 animate-pulse" />
              PLANE 2: BUILDING
            </span>
          )}
        </div>

        {!isFixed && (
          <button
            type="button"
            onClick={onFixPlane2}
            className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-slate-950 font-bold rounded-md shadow transition-all flex items-center gap-1 text-xs touch-manipulation cursor-pointer"
            title="Зафиксировать геометрический эталон Plane 2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
            <span>FIX PLANE 2</span>
          </button>
        )}
      </div>
    </div>
  );
};
