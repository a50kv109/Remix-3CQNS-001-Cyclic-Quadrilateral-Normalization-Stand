/**
 * PGSGatewayModal Component — Portable Geometric State 2D Gateway Dialog
 * R3 — PGS-2D Semantic Gateway Integration
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  FileCode,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
  X
} from 'lucide-react';
import { UniversalGeometryState } from '../../kernel/state/geometryState';
import { AuxiliaryState } from '../types/auxiliaryTypes';
import { Language } from '../types/uiTypes';
import {
  exportToPGS,
  exportToPGSJson,
  importFromPGS,
  inspectPGS,
  PGSPassport,
  PGSImportResult
} from '../../kernel/pgsAdapter';

interface PGSGatewayModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly geometryState: UniversalGeometryState;
  readonly auxiliaryState: AuxiliaryState;
  readonly language?: Language;
  readonly onApplyImportedState: (nextGeo: UniversalGeometryState, nextAux?: AuxiliaryState) => void;
}

export const PGSGatewayModal: React.FC<PGSGatewayModalProps> = ({
  isOpen,
  onClose,
  geometryState,
  auxiliaryState,
  language = 'RU',
  onApplyImportedState
}) => {
  const [activeTab, setActiveTab] = useState<'EXPORT' | 'IMPORT' | 'INSPECT'>('EXPORT');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importResult, setImportResult] = useState<PGSImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate PGS-2D Passport JSON from current state
  const exportedPassport = useMemo<PGSPassport>(() => {
    return exportToPGS(geometryState, auxiliaryState, {
      includeDiagonals: true,
      includeAuxiliary: true,
      includeDomainMetadata: true
    });
  }, [geometryState, auxiliaryState]);

  const exportedJsonStr = useMemo(() => {
    return JSON.stringify(exportedPassport, null, 2);
  }, [exportedPassport]);

  const inspectionSummary = useMemo(() => {
    return inspectPGS(exportedPassport);
  }, [exportedPassport]);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportedJsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportedJsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cqns_quadrilateral_${exportedPassport.passportId}.pgs.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      const res = importFromPGS(content);
      setImportResult(res);
    };
    reader.readAsText(file);
  };

  const handleRunImport = () => {
    if (!importJsonText.trim()) return;
    const res = importFromPGS(importJsonText);
    setImportResult(res);
    if (res.success && res.geometryState) {
      onApplyImportedState(res.geometryState, res.auxiliaryState);
    }
  };

  const t = {
    title: language === 'UA' ? 'Шлюз PGS-2D (Портативний геометричний стан)' : language === 'EN' ? 'PGS-2D Gateway (Portable Geometric State)' : 'Шлюз PGS-2D (Портативное геометрическое состояние)',
    subtitle: language === 'UA' ? 'Міжстендовий обмін семантичним станом (.pgs.json)' : language === 'EN' ? 'Cross-stand semantic state exchange (.pgs.json)' : 'Межстендовый обмен семантическим состоянием (.pgs.json)',
    tabExport: language === 'UA' ? 'Експорт PGS-2D' : language === 'EN' ? 'Export PGS-2D' : 'Экспорт PGS-2D',
    tabImport: language === 'UA' ? 'Імпорт PGS-2D' : language === 'EN' ? 'Import PGS-2D' : 'Импорт PGS-2D',
    tabInspect: language === 'UA' ? 'Інспекція паспорта' : language === 'EN' ? 'Inspect Passport' : 'Инспекция паспорта',
    downloadBtn: language === 'UA' ? 'Завантажити .pgs.json' : language === 'EN' ? 'Download .pgs.json' : 'Скачать .pgs.json',
    copyBtn: language === 'UA' ? 'Копіювати JSON' : language === 'EN' ? 'Copy JSON' : 'Копировать JSON',
    copiedBtn: language === 'UA' ? 'Скопійовано!' : language === 'EN' ? 'Copied!' : 'Скопировано!',
    importPlaceholder: language === 'UA' ? 'Вставте JSON-вміст файлу .pgs.json сюди...' : language === 'EN' ? 'Paste .pgs.json document text here...' : 'Вставьте JSON-содержимое файла .pgs.json сюда...',
    uploadBtn: language === 'UA' ? 'Обрати файл .pgs.json' : language === 'EN' ? 'Select .pgs.json file' : 'Выбрать файл .pgs.json',
    executeImportBtn: language === 'UA' ? 'Перевірити та завантажити на стенд' : language === 'EN' ? 'Validate & Apply to Stand' : 'Проверить и применить на стенд',
    appliedSuccess: language === 'UA' ? 'Геометричний стан успішно імпортовано та верифіковано GeometryCore!' : language === 'EN' ? 'Geometric state successfully imported and verified by GeometryCore!' : 'Геометрическое состояние успешно импортировано и верифицировано GeometryCore!',
    receiverVerifyNote: language === 'UA' ? 'Принцип: Претензія джерела ≠ Верифікація приймача (GeometryCore виконує повну перевірку топології).' : language === 'EN' ? 'Principle: Source Claim ≠ Receiver Verification (GeometryCore independently verifies topology).' : 'Принцип: Претензия источника ≠ Верификация приёмника (GeometryCore выполняет полную проверку топологии).'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-100">{t.title}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 rounded">
                  v0.1 EXACT_STATE
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'EXPORT'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            {t.tabExport}
          </button>
          <button
            onClick={() => setActiveTab('IMPORT')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'IMPORT'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {t.tabImport}
          </button>
          <button
            onClick={() => setActiveTab('INSPECT')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'INSPECT'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.tabInspect}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: EXPORT */}
          {activeTab === 'EXPORT' && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Passport ID</span>
                  <p className="font-mono text-xs text-purple-300 truncate">{exportedPassport.passportId}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Transfer Mode</span>
                  <p className="font-mono text-xs text-emerald-400 font-semibold">{exportedPassport.transferMode}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Objects</span>
                  <p className="font-mono text-xs text-blue-400 font-semibold">{exportedPassport.objects.length} entities</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Source Claim</span>
                  <p className="font-mono text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED
                  </p>
                </div>
              </div>

              {/* JSON Code Area */}
              <div className="relative">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 border-b-0 rounded-t-xl text-[11px] text-slate-400">
                  <span>pgs-2d-v0.1 schema payload</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? t.copiedBtn : t.copyBtn}
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded flex items-center gap-1 transition-colors font-medium"
                    >
                      <Download className="w-3 h-3" />
                      {t.downloadBtn}
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl overflow-x-auto max-h-72 font-mono text-[11px] text-slate-300 leading-relaxed">
                  {exportedJsonStr}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'IMPORT' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl flex items-start gap-2.5 text-purple-200">
                <Info className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">{t.receiverVerifyNote}</p>
              </div>

              {/* File upload and paste area */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,.pgs.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4 text-purple-400" />
                  {t.uploadBtn}
                </button>
                <span className="text-slate-400 text-xs">or paste PGS document JSON below</span>
              </div>

              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder={t.importPlaceholder}
                className="w-full h-44 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 resize-none"
              />

              <button
                onClick={handleRunImport}
                disabled={!importJsonText.trim()}
                className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  importJsonText.trim()
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {t.executeImportBtn}
              </button>

              {/* Import Result Status */}
              {importResult && (
                <div
                  className={`p-4 rounded-xl border ${
                    importResult.success
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-red-950/30 border-red-800/60 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                    {importResult.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>IMPORT SUCCESSFUL — {importResult.receiverVerification.verifiedBy}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>IMPORT REJECTED</span>
                      </>
                    )}
                  </div>
                  {importResult.error && <p className="mt-1 text-[11px] text-red-300 font-mono">{importResult.error}</p>}
                  {importResult.success && <p className="mt-1 text-[11px] text-emerald-300">{t.appliedSuccess}</p>}
                  {importResult.warnings.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-[11px] text-amber-300 space-y-0.5">
                      {importResult.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INSPECT */}
          {activeTab === 'INSPECT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Object breakdown */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-xs">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Entities by Semantic Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    {Object.entries(inspectionSummary.countsByType).map(([k, v]) => (
                      <div key={k} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-slate-200 font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topology & Roles */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Polygon Topology & Roles
                  </h3>
                  {inspectionSummary.polygonTopology && (
                    <div className="space-y-1.5 text-[11px]">
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Vertices:</strong>{' '}
                        {inspectionSummary.polygonTopology.vertexCount} (A → B → C → D → A)
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Boundary Edges:</strong>{' '}
                        {inspectionSummary.polygonTopology.boundaryEdges.join(', ')}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Distinct Diagonals:</strong> AC, BD (preserved as interior diagonals)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Map Table */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-200 text-xs">Identity Mapping Ledger (portableId ↔ localId)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px] font-mono">
                  {Object.entries(exportedPassport.identityMap || {}).map(([pId, lId]) => (
                    <div key={pId} className="p-1.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-purple-300 truncate">{pId}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 mx-1 shrink-0" />
                      <span className="text-emerald-300 font-semibold truncate">{lId}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CQNS-001 Gateway • Fully decoupled from GeometryCore
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
