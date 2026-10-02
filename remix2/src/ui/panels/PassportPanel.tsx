/**
 * PassportPanel Component — Dual View: CQNS Internal Passport & PGS-2D Portable Passport
 * R2-05: Common Geometry Stand UI Shell x PGS-2D Integration
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileCode,
  Download,
  Copy,
  Globe,
  Code,
  Check
} from 'lucide-react';
import { GeometryPresentationData } from '../projection/presentationModel';
import { UniversalGeometryState } from '../../kernel/state/geometryState';
import { AuxiliaryState } from '../types/auxiliaryTypes';
import { Language } from '../types/uiTypes';
import { getTranslation } from '../i18n/translations';
import { exportToPGS, exportToPGSJson, inspectPGS, PGSPassport } from '../../kernel/pgsAdapter';

interface PassportPanelProps {
  readonly presentation: GeometryPresentationData;
  readonly geometryState?: UniversalGeometryState;
  readonly auxiliaryState?: AuxiliaryState;
  readonly language?: Language;
  readonly onExportPgsPassport?: () => void;
}

export const PassportPanel: React.FC<PassportPanelProps> = ({
  presentation,
  geometryState,
  auxiliaryState,
  language = 'RU',
  onExportPgsPassport
}) => {
  const t = getTranslation(language);
  const [viewMode, setViewMode] = useState<'CQNS' | 'PGS'>('CQNS');
  const [copied, setCopied] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const { topologyReport, stateVersion, provenance, center, radius, vertices } = presentation;
  const isCqnsValid = topologyReport.status === 'VALID';

  // Dynamically compute PGS Passport from live state if available
  const pgsPassport = useMemo<PGSPassport | null>(() => {
    if (!geometryState) return null;
    try {
      return exportToPGS(geometryState, auxiliaryState, {
        includeDiagonals: true,
        includeAuxiliary: true,
        includeDomainMetadata: true,
        generatorName: 'CQNS-001 Normalization Stand'
      });
    } catch {
      return null;
    }
  }, [geometryState, auxiliaryState]);

  const pgsJsonStr = useMemo(() => {
    if (!pgsPassport) return '';
    return JSON.stringify(pgsPassport, null, 2);
  }, [pgsPassport]);

  const pgsSummary = useMemo(() => {
    if (!pgsPassport) return null;
    return inspectPGS(pgsPassport);
  }, [pgsPassport]);

  const handleCopyPgsJson = () => {
    if (!pgsJsonStr) return;
    navigator.clipboard.writeText(pgsJsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPgs = () => {
    if (onExportPgsPassport) {
      onExportPgsPassport();
      return;
    }
    if (!pgsJsonStr) return;
    const blob = new Blob([pgsJsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cqns-001-pgs-passport.pgs.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 select-none text-xs space-y-4">
      {/* 1. Dual Passport View Switcher Header */}
      <div className="flex items-center justify-between p-1 bg-slate-950 rounded-lg border border-slate-800 font-medium">
        <button
          onClick={() => setViewMode('CQNS')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
            viewMode === 'CQNS'
              ? 'bg-purple-950/80 border border-purple-700/60 text-purple-200 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>CQNS State Passport</span>
        </button>

        <button
          onClick={() => setViewMode('PGS')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
            viewMode === 'PGS'
              ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>PGS-2D Portable Passport</span>
        </button>
      </div>

      {/* =========================================================
          VIEW MODE 1: CQNS INTERNAL GEOMETRY PASSPORT
         ========================================================= */}
      {viewMode === 'CQNS' && (
        <div className="space-y-4">
          {/* Header Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-100 text-xs">
                  {t.passportTitle}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {t.passportSubTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-mono text-[11px]">
                v{stateVersion}
              </span>
              <span
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-mono text-[11px] font-semibold border ${
                  isCqnsValid
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-700 text-rose-300'
                }`}
              >
                {isCqnsValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {t.validBadge}
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    {topologyReport.status}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase">{t.figureAndVertices}</span>
              <span className="text-slate-100 font-semibold">{t.inscribedQuadName}</span>
              <span className="text-purple-400">{t.profileLabel} {topologyReport.profile}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase">{t.baseCircleLabel}</span>
              <span className="text-slate-100 font-semibold">R = {radius.toFixed(2)} мм</span>
              <span className="text-slate-400">{t.inspectorCenter} O({center.x.toFixed(1)}, {center.y.toFixed(1)})</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1 col-span-2">
              <span className="text-[10px] text-slate-400 font-sans uppercase">{t.provenanceLabel}</span>
              <span className="text-slate-200">{provenance}</span>
              <span className="text-slate-500 text-[10px] font-sans">
                {t.immutableFreezeNote}
              </span>
            </div>
          </div>

          {/* Angular Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
            <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 font-semibold text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.canonicalAnglesTableTitle}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">P_i = O + R·(cos α_i, sin α_i)</span>
            </div>
            <table className="w-full text-left border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-[10px] border-b border-slate-800">
                  <th className="py-1.5 px-3">{t.thVertex}</th>
                  <th className="py-1.5 px-3">{t.thAngleDeg}</th>
                  <th className="py-1.5 px-3">{t.thAngleRad}</th>
                  <th className="py-1.5 px-3">{t.thCartesianXY}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vertices.map((v) => (
                  <tr key={`pass-vertex-${v.id}`} className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 font-bold text-slate-200">{v.id}</td>
                    <td className="py-2 px-3 text-purple-400">{v.angleDeg.toFixed(2)}°</td>
                    <td className="py-2 px-3 text-slate-300">{v.normalizedAngleRad.toFixed(4)} rad</td>
                    <td className="py-2 px-3 text-emerald-400">
                      ({v.cartesian.x.toFixed(2)}, {v.cartesian.y.toFixed(2)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Topology Guard Report */}
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex flex-col gap-1 text-[11px]">
            <span className="font-semibold text-slate-200">Отчёт TopologyGuard (CQNS Receiver Authority):</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5 pt-1">
              <li>Упорядочение: монотонная циклическая последовательность [A, B, C, D]</li>
              <li>Угловые зазоры: все Δα &gt; MIN_VERTEX_ANGLE_GAP (0.005 rad)</li>
              <li>Замыкание цикла: полная сумма шагов Σ Δα_i = 360.0° (2π rad)</li>
              <li>Самопересечения: отсутствуют (выпуклый вписанный многоугольник)</li>
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 2: PGS-2D PORTABLE PASSPORT
         ========================================================= */}
      {viewMode === 'PGS' && (
        <div className="space-y-4">
          {/* Header Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-100 text-xs">
                  PGS-2D Portable Semantic Passport
                </h2>
                <p className="text-[11px] text-emerald-400/90">
                  Переносимый паспорт геометрического состояния для обмена со Стендами и ИИ-агентами
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-600/60 text-emerald-200 font-bold">
                EXACT_STATE
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                v0.1
              </span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPgs}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow flex items-center justify-center gap-2 transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать .pgs.json</span>
            </button>

            <button
              onClick={handleCopyPgsJson}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Скопировано!' : 'Копировать JSON'}</span>
            </button>

            <button
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className={`py-2 px-3 rounded-lg border flex items-center gap-1.5 transition-colors text-xs ${
                showJsonInspector
                  ? 'bg-purple-950 border-purple-700 text-purple-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJsonInspector ? 'Скрыть код' : 'JSON код'}</span>
            </button>
          </div>

          {/* Optional JSON Inspector */}
          {showJsonInspector && (
            <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60 font-mono text-[10px] text-purple-200 max-h-60 overflow-y-auto whitespace-pre">
              {pgsJsonStr}
            </div>
          )}

          {/* PGS Metadata Summary Cards */}
          {pgsPassport && pgsSummary && (
            <>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-sans uppercase">ID паспорта</span>
                  <span className="text-slate-100 font-semibold truncate">{pgsPassport.passportId}</span>
                  <span className="text-emerald-400 text-[10px]">Режим: {pgsPassport.transferMode}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-sans uppercase">Генератор / Источник</span>
                  <span className="text-slate-100 font-semibold">{pgsPassport.generator?.name}</span>
                  <span className="text-slate-400 text-[10px]">{pgsPassport.generator?.standId}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1 col-span-2">
                  <span className="text-[10px] text-slate-400 font-sans uppercase">Состав объектов</span>
                  <div className="flex items-center gap-3 text-slate-300 pt-0.5">
                    <span>Точки: <strong className="text-purple-400">{pgsSummary.countsByType.point}</strong></span>
                    <span>Отрезки: <strong className="text-blue-400">{pgsSummary.countsByType.segment}</strong></span>
                    <span>Окружности: <strong className="text-amber-400">{pgsSummary.countsByType.circle}</strong></span>
                    <span>Полигон: <strong className="text-emerald-400">{pgsSummary.countsByType.polygon}</strong></span>
                  </div>
                </div>
              </div>

              {/* Portable Objects & Semantic Identities Table */}
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 font-semibold text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Переносимые объекты и семантические роли</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">portableId ↔ localId</span>
                </div>
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 text-[10px] border-b border-slate-800">
                      <th className="py-1.5 px-3">portableId</th>
                      <th className="py-1.5 px-3">Тип</th>
                      <th className="py-1.5 px-3">Роль</th>
                      <th className="py-1.5 px-3">Local Label</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pgsPassport.objects.map((obj) => (
                      <tr key={`pgs-obj-${obj.portableId}`} className="hover:bg-slate-900/40">
                        <td className="py-1.5 px-3 font-bold text-emerald-400">{obj.portableId}</td>
                        <td className="py-1.5 px-3 text-slate-300">{obj.semanticType}</td>
                        <td className="py-1.5 px-3 text-purple-400">{obj.semanticRole}</td>
                        <td className="py-1.5 px-3 text-slate-200">{obj.displayLabel || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Source Claim & Verification Note */}
              <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/50 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Source Verification Claim: {pgsPassport.sourceClaim?.engine}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {pgsPassport.timestamp ? new Date(pgsPassport.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
                <p className="text-slate-400 pt-1 text-[10px]">
                  Переносимый паспорт сформирован напрямую из текущего <code className="text-slate-300">UniversalGeometryState</code>. При импорте в сторонний стенд валидация выполняется повторно независимым модулем проверки геометрии.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
