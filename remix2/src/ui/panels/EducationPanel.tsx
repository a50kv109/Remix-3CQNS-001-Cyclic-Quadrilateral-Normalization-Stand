/**
 * EducationPanel Component — Educational Proof Cards & Theorems
 * R2-05: Common Geometry Stand UI Shell
 */

import React from 'react';
import { GraduationCap, BookOpen, CheckCircle, Compass, ShieldCheck } from 'lucide-react';
import { GeometryPresentationData } from '../projection/presentationModel';
import { AGENT_RESEARCH_CHECKLIST, DRA_REMINDER } from '../../research/researchGuide';
import { Language } from '../types/uiTypes';
import { getTranslation } from '../i18n/translations';

interface EducationPanelProps {
  readonly presentation: GeometryPresentationData;
  readonly language?: Language;
}

export const EducationPanel: React.FC<EducationPanelProps> = ({ presentation, language = 'RU' }) => {
  const t = getTranslation(language);
  const { oppositeAngleSums, ptolemy, inscribedAngles } = presentation;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 select-none text-xs space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 text-xs">
              {t.educationTitle}
            </h2>
            <p className="text-[11px] text-slate-400">
              {t.educationSubTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Research Guide & DRA Heuristics Card */}
      <div className="p-3 bg-slate-950 rounded-lg border border-amber-900/50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            {t.checklistTitle}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-mono text-[10px] font-semibold border border-amber-800">
            HEURISTIC RAILS
          </span>
        </div>
        <p className="text-slate-400 text-[11px]">
          {t.checklistSubTitle}
        </p>
        <div className="space-y-1.5 pt-1">
          {t.researchChecklist.map((item) => (
            <div key={`chk-${item.stepNumber}`} className="p-1.5 bg-slate-900 rounded border border-slate-800/80 flex gap-2 text-[11px]">
              <span className="font-mono text-amber-400 font-bold shrink-0">{item.stepNumber}. {item.name}:</span>
              <span className="text-slate-300">{item.question}</span>
            </div>
          ))}
        </div>

        {/* DRA Sub-block */}
        <div className="mt-2 p-2.5 bg-slate-900/90 rounded border border-cyan-800/60 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.draTitle}</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-tight">
            {t.draSubtitle}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] font-mono text-cyan-300 border border-cyan-900">
              {t.draToolVerifiedFact}
            </span>
            <span className="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] font-mono text-cyan-300 border border-cyan-900">
              {t.draAgentInterpretation}
            </span>
            <span className="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] font-mono text-cyan-300 border border-cyan-900">
              {t.draAgentHypotheses}
            </span>
          </div>
          <p className="text-slate-500 text-[9px] italic pt-0.5">
            {t.draNote}
          </p>
        </div>
      </div>

      {/* 3. Theorem Card 1: Opposite Angles */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            {t.theoremOppositeTitle}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-800">
            {t.theoremOppositeBadge}
          </span>
        </div>
        <p className="text-slate-400 text-[11px]">
          {t.theoremOppositeDesc}
        </p>
        <div className="p-2 bg-slate-900 rounded font-mono text-center text-emerald-300 text-[11px] space-y-1">
          <div>∠A + ∠C = {oppositeAngleSums.acSumDeg.toFixed(1)}° = 180.0°</div>
          <div>∠B + ∠D = {oppositeAngleSums.bdSumDeg.toFixed(1)}° = 180.0°</div>
        </div>
        <p className="text-slate-500 text-[10px]">
          {t.theoremOppositeProof}
        </p>
      </div>

      {/* 4. Theorem Card 2: Inscribed Angle Theorem */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            {t.theoremInscribedTitle}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono text-[10px] font-semibold border border-blue-800">
            {t.theoremInscribedBadge}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          {inscribedAngles.map((ang) => (
            <div key={`edu-ang-${ang.vertexId}`} className="p-2 bg-slate-900 rounded border border-slate-800/60">
              <span className="text-slate-400">∠{ang.vertexId} = </span>
              <span className="text-amber-400 font-bold">{ang.angleDeg.toFixed(1)}°</span>
              <span className="text-slate-500 text-[10px] block">
                {t.theoremInscribedArcHalf} {ang.subtendedArcDeg.toFixed(1)}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Theorem Card 3: Ptolemy's Theorem */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {t.theoremPtolemyTitle}
          </span>
        </div>
        <p className="text-slate-400 text-[11px]">
          {t.theoremPtolemyDesc}
        </p>
        <div className="p-2 bg-slate-900 rounded font-mono text-center text-blue-300 text-[11px]">
          AC · BD = AB · CD + BC · DA
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono p-2 bg-slate-900/60 rounded border border-slate-800">
          <span>{t.theoremPtolemyDiagonals} {ptolemy.diagonalProduct.toFixed(0)}</span>
          <span className="text-slate-500">=</span>
          <span>{t.theoremPtolemySides} {ptolemy.oppositeProductSum.toFixed(0)}</span>
          <span className="text-emerald-400 font-bold">{t.theoremPtolemyMatches}</span>
        </div>
      </div>
    </div>
  );
};

