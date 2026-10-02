/**
 * HeaderBar Component — Stand Identity, Mode Switcher & Presets
 * R2-05: Common Geometry Stand UI Shell
 */

import React, { useState } from 'react';
import {
  Compass,
  RotateCcw,
  Undo2,
  ChevronDown,
  Sparkles,
  Layers,
  FileCode,
  Download,
  Copy
} from 'lucide-react';
import { Language, PresetType, StandMode, UIState } from '../../types/uiTypes';
import { getTranslation } from '../../i18n/translations';

interface HeaderBarProps {
  readonly uiState: UIState;
  readonly onModeChange: (mode: StandMode) => void;
  readonly onLanguageChange: (lang: Language) => void;
  readonly onPresetSelect: (preset: PresetType) => void;
  readonly onReset: () => void;
  readonly onUndo: () => void;
  readonly stateHistory: any[];
  readonly onExportJson: () => void;
  readonly onExportSvg: () => void;
  readonly onExportPgsPassport?: () => void;
  readonly onOpenPgsModal?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  uiState,
  onModeChange,
  onLanguageChange,
  onPresetSelect,
  onReset,
  onUndo,
  stateHistory,
  onExportJson,
  onExportSvg,
  onExportPgsPassport,
  onOpenPgsModal
}) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const t = getTranslation(uiState.language);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-sm select-none z-30">
      {/* 1. Stand Identity */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-slate-100 text-xs tracking-wide">
              {t.standTitle}
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-900/60 text-purple-300 border border-purple-700/60 rounded">
              {t.workbenchBadge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t.standSubTitle}
          </p>
        </div>
      </div>

      {/* 2. Center: Mode Switcher & Language Switcher */}
      <div className="flex items-center gap-2">
        {/* Mode Switcher */}
        <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center">
          <button
            onClick={() => onModeChange('RESEARCH')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              uiState.standMode === 'RESEARCH'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.modeResearch}
          </button>
          <button
            onClick={() => onModeChange('SCHOOL')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              uiState.standMode === 'SCHOOL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {t.modeSchool}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs">
          {(['RU', 'UA', 'EN'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                uiState.language === lang
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Presets, Project Menu, Reset & Undo */}
      <div className="flex items-center gap-2">
        {/* Presets */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 px-1">{t.presetsLabel}</span>
          <button
            onClick={() => onPresetSelect('SQUARE')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              uiState.activePreset === 'SQUARE'
                ? 'bg-purple-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {t.presetSquare}
          </button>
          <button
            onClick={() => onPresetSelect('RECTANGLE')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              uiState.activePreset === 'RECTANGLE'
                ? 'bg-purple-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {t.presetRectangle}
          </button>
          <button
            onClick={() => onPresetSelect('TRAPEZOID')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              uiState.activePreset === 'TRAPEZOID'
                ? 'bg-purple-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {t.presetTrapezoid}
          </button>
          <button
            onClick={() => onPresetSelect('GENERAL')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              uiState.activePreset === 'GENERAL'
                ? 'bg-purple-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {t.presetGeneral}
          </button>
        </div>

        {/* Project Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.projectMenu}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {isProjectMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
              <button
                onClick={() => {
                  onExportJson();
                  setIsProjectMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                {t.exportJson}
              </button>
              <button
                onClick={() => {
                  onExportSvg();
                  setIsProjectMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                {t.exportSvg}
              </button>
              {onExportPgsPassport && (
                <button
                  onClick={() => {
                    onExportPgsPassport();
                    setIsProjectMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-emerald-300 font-medium border-t border-slate-800"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  {t.exportPgs}
                </button>
              )}
              {onOpenPgsModal && (
                <button
                  onClick={() => {
                    onOpenPgsModal();
                    setIsProjectMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-purple-300 border-t border-slate-800"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>PGS-2D Gateway...</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* PGS-2D Quick Access Button */}
        {onOpenPgsModal && (
          <button
            onClick={onOpenPgsModal}
            className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/70 text-purple-200 rounded-md text-xs flex items-center gap-1.5 transition-colors font-medium shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>PGS-2D</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          title={t.resetButton}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetButton}</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!stateHistory || stateHistory.length === 0}
          title={t.undoButton}
          className={`px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs flex items-center gap-1 transition-colors ${
            (!stateHistory || stateHistory.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.undoButton}</span>
        </button>
      </div>
    </header>
  );
};
