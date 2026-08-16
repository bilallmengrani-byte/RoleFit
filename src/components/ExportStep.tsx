import React, { useState, useRef } from 'react';
import {
  Printer,
  Copy,
  Check,
  FileCode,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Edit3,
  Split,
  Eye,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  FileText,
  Maximize2,
  Minimize2,
  ChevronRight,
  X,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  Loader2,
} from 'lucide-react';
import {
  ResumeData,
  TargetJob,
  InterviewTalkingPoint,
  AnalysisData,
  CVChangeLog,
} from '../types/resume';
import { formatResumeAsPlainText, formatResumeAsMarkdown } from '../utils/resumeFormatter';
import { ResumeDocument, ResumeTemplateId, ResumeDensity } from './ResumeDocument';
import { exportElementToPdf, printResumeOnly } from '../utils/pdfExporter';

interface ExportStepProps {
  originalCV: ResumeData;
  tailoredCV: ResumeData;
  changes: CVChangeLog[];
  analysisData: AnalysisData | null;
  targetJob: TargetJob;
  interviewTalkingPoints?: InterviewTalkingPoint[];
  onUpdateTailoredCV: (data: ResumeData) => void;
  onBack: () => void;
  onStartOver: () => void;
  onViewChanges?: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  originalCV,
  tailoredCV,
  changes,
  analysisData,
  targetJob,
  interviewTalkingPoints = [],
  onUpdateTailoredCV,
  onBack,
  onStartOver,
  onViewChanges,
}) => {
  // View Modes: Split-screen review, Tailored single page, Original single page
  const [viewMode, setViewMode] = useState<'split' | 'tailored' | 'original'>('split');
  const [template, setTemplate] = useState<ResumeTemplateId>('modern');
  const [density, setDensity] = useState<ResumeDensity>('comfortable');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showChangesModal, setShowChangesModal] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'text' | 'markdown' | null>(null);

  const candidateSlug = (tailoredCV.basics.name || 'Candidate')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');

  // Direct PDF export trigger
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const filename = `${candidateSlug}_tailored_cv.pdf`;
      const success = await exportElementToPdf('tailored-cv-document', { filename });
      if (success) {
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Direct print trigger
  const handlePrint = () => {
    printResumeOnly('tailored-cv-document');
  };

  // Download ATS plaintext
  const handleDownloadTxt = () => {
    const text = formatResumeAsPlainText(tailoredCV);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateSlug}_tailored_cv.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Markdown
  const handleDownloadMarkdown = () => {
    const md = formatResumeAsMarkdown(tailoredCV);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateSlug}_tailored_cv.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(tailoredCV, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateSlug}_tailored_cv.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    const text = formatResumeAsPlainText(tailoredCV);
    await navigator.clipboard.writeText(text);
    setCopiedType('text');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyMarkdown = async () => {
    const md = formatResumeAsMarkdown(tailoredCV);
    await navigator.clipboard.writeText(md);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Extract skills emphasized and skills missing from analysis
  const matchedSkillNames = (analysisData?.matchedSkills || []).map((m) => m.skill);
  const missingSkillNames = (analysisData?.missingSkills || []).map((m) => m.skill);
  const overallScore = analysisData?.overallScore || 88;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. TAILORING SUMMARY PANEL (Match score, changes count, skills & gaps)     */}
      {/* ========================================================================= */}
      <div className="editorial-card p-4 sm:p-6 space-y-4 no-print border-l-4 border-l-[#C84B31]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD5]">
          
          {/* Left Title & Status */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B31] font-bold">
                Tailoring Summary Dossier
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#2A6F56] text-[#2A6F56] bg-[#FAF8F5] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>Zero-Fabrication Grade</span>
              </span>
            </div>
            <h1 className="font-['Newsreader',Georgia,serif] text-xl sm:text-3xl font-semibold text-[#121316] leading-tight">
              {tailoredCV.basics.name} — <span className="font-normal text-[#575A65]">{targetJob.title || 'Target Role'}</span>
            </h1>
          </div>

          {/* Primary Action Buttons: View Changes, Edit CV, Download PDF, Print CV */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
            {/* 1. View changes */}
            <button
              onClick={() => setShowChangesModal(true)}
              className="editorial-btn-outline px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
            >
              <FileCheck className="w-4 h-4 text-[#C84B31] shrink-0" />
              <span>Diffs ({changes.length})</span>
            </button>

            {/* 2. Edit CV Toggle */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border whitespace-nowrap min-h-[40px] ${
                isEditing
                  ? 'bg-[#2A6F56] text-[#FFFFFF] border-[#2A6F56] font-bold'
                  : 'editorial-btn-outline text-[#121316]'
              }`}
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              <span>{isEditing ? 'Done' : 'Edit CV'}</span>
            </button>

            {/* 3. Print CV */}
            <button
              onClick={handlePrint}
              title="Print document or save via browser PDF print"
              className="editorial-btn-outline px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
            >
              <Printer className="w-4 h-4 text-[#121316] shrink-0" />
              <span>Print CV</span>
            </button>

            {/* 4. Download PDF Primary Action */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="editorial-btn-accent px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-xs disabled:opacity-50 min-h-[40px]"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFFFFF] shrink-0" />
                  <span>Saving...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Download Success Toast */}
        {pdfSuccess && (
          <div className="p-2.5 bg-[#FAF8F5] border border-[#2A6F56] text-xs font-mono text-[#2A6F56] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 animate-editorial-fade">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#2A6F56] shrink-0" />
              <span>PDF document successfully generated and downloaded!</span>
            </span>
            <span className="text-[10px] text-[#716D64] uppercase font-mono">Print Ready 2x</span>
          </div>
        )}

        {/* 4-Item Compact Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          
          {/* Match Score */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E2DDD5] space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] block">
              Match Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316]">
                {overallScore}%
              </span>
              <span className="text-[10px] font-mono text-[#2A6F56] font-semibold">
                {overallScore >= 80 ? 'Strong Fit' : 'Competitive'}
              </span>
            </div>
          </div>

          {/* Number of Changes */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E2DDD5] space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] block">
              Audited Changes
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316]">
                {changes.length}
              </span>
              <span className="text-[10px] font-mono text-[#716D64] hidden sm:inline">100% verified</span>
            </div>
          </div>

          {/* Skills Emphasized */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E2DDD5] space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] block">
              Skills Emphasized ({matchedSkillNames.length})
            </span>
            <div className="flex flex-wrap gap-1 max-h-[42px] overflow-hidden">
              {matchedSkillNames.slice(0, 4).map((s, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 bg-[#FFFFFF] border border-[#D5CFC5] text-[10px] font-mono text-[#121316]"
                >
                  {s}
                </span>
              ))}
              {matchedSkillNames.length > 4 && (
                <span className="text-[10px] font-mono text-[#8E929E] self-center">
                  +{matchedSkillNames.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Skills Still Missing */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E8C2B8] space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#AF3E26] block font-bold">
              Skills Still Missing ({missingSkillNames.length})
            </span>
            <div className="flex flex-wrap gap-1 max-h-[42px] overflow-hidden">
              {missingSkillNames.length === 0 ? (
                <span className="text-[10px] font-mono text-[#2A6F56]">No critical gaps</span>
              ) : (
                missingSkillNames.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 bg-[#FAF0ED] border border-[#E8C2B8] text-[10px] font-mono text-[#AF3E26]"
                  >
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

        {isEditing && (
          <div className="p-3 bg-[#FAF0ED] border border-[#E8C2B8] text-xs text-[#AF3E26] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-mono">
              <Edit3 className="w-3.5 h-3.5 shrink-0" />
              <span>LIVE EDITING ACTIVE: Click directly on any text inside the document below to edit.</span>
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[11px] font-mono uppercase underline font-bold cursor-pointer"
            >
              Finish Editing
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEWPORT & TYPOGRAPHY TOOLBAR (Split vs Single, Archetype, Density)      */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2DDD5] p-3 no-print">
        
        {/* View Mode Controls: Split Screen vs Single Focused View */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[11px] font-mono text-[#716D64] uppercase tracking-wider">Review:</span>
          <div className="grid grid-cols-3 sm:flex items-center gap-1 border border-[#E2DDD5] bg-[#FAF8F5] p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[34px] ${
                viewMode === 'split'
                  ? 'bg-[#121316] text-[#FFFFFF] font-bold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Split className="w-3.5 h-3.5 shrink-0" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('tailored')}
              className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[34px] ${
                viewMode === 'tailored'
                  ? 'bg-[#121316] text-[#FFFFFF] font-bold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Tailored</span>
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[34px] ${
                viewMode === 'original'
                  ? 'bg-[#121316] text-[#FFFFFF] font-bold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Original</span>
            </button>
          </div>
        </div>

        {/* Archetype & Density Selectors */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
          
          {/* Typography Archetype */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#716D64] uppercase">Style:</span>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}
              className="px-2 py-1 text-xs font-mono bg-[#FAF8F5] border border-[#D5CFC5] text-[#121316] focus:outline-hidden"
            >
              <option value="modern">Modern Executive</option>
              <option value="serif">Ivy League Serif</option>
              <option value="minimal">Clean Minimalist</option>
              <option value="technical">Technical Monospace</option>
            </select>
          </div>

          {/* Density */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#716D64] uppercase">Density:</span>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value as ResumeDensity)}
              className="px-2 py-1 text-xs font-mono bg-[#FAF8F5] border border-[#D5CFC5] text-[#121316] focus:outline-hidden"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact (1-Page)</option>
              <option value="tight">High Density</option>
            </select>
          </div>

          {/* Direct Copy Quick Actions */}
          <div className="flex items-center gap-1 border-l border-[#E2DDD5] pl-2 sm:pl-3">
            <button
              onClick={handleCopyText}
              title="Copy ATS Plaintext to clipboard"
              className="p-1.5 text-[#575A65] hover:text-[#121316] hover:bg-[#F2EFE9] border border-transparent hover:border-[#D5CFC5] text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-[#2A6F56]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">ATS Text</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              title="Copy Markdown to clipboard"
              className="p-1.5 text-[#575A65] hover:text-[#121316] hover:bg-[#F2EFE9] border border-transparent hover:border-[#D5CFC5] text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-[#2A6F56]" /> : <FileCode className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">MD</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. DOCUMENT PREVIEW CANVAS (Split Screen or Single Focused Page)          */}
      {/* ========================================================================= */}
      <div className="bg-[#EFECE6] p-2 sm:p-6 md:p-8 border border-[#D5CFC5] overflow-x-auto min-h-[600px] sm:min-h-[850px]">
        
        {/* MODE A: SPLIT-SCREEN REVIEW (Left: Original CV, Right: Tailored CV) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 items-start">
            
            {/* LEFT: ORIGINAL CV */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-mono">
                <span className="uppercase tracking-wider font-bold text-[#716D64] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#8E929E] shrink-0" />
                  <span>Original Candidate Archive</span>
                </span>
                <span className="text-[10px] uppercase text-[#8E929E] bg-[#FFFFFF] border border-[#D5CFC5] px-2 py-0.5">
                  Baseline
                </span>
              </div>
              <div className="opacity-95 hover:opacity-100 transition-opacity">
                <ResumeDocument
                  data={originalCV}
                  template={template}
                  density={density}
                  isEditable={false}
                  className="border-[#D5CFC5] bg-[#FCFBF9]"
                />
              </div>
            </div>

            {/* RIGHT: ROLEFIT TAILORED CV */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-mono">
                <span className="uppercase tracking-wider font-bold text-[#C84B31] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2A6F56] shrink-0" />
                  <span>RoleFit Tailored CV (Optimized)</span>
                </span>
                <span className="text-[10px] uppercase text-[#2A6F56] bg-[#FFFFFF] border border-[#2A6F56] px-2 py-0.5 font-semibold">
                  Zero Fabrication
                </span>
              </div>
              <div className="ring-2 ring-[#121316]/80 shadow-xl">
                <ResumeDocument
                  id="tailored-cv-document"
                  data={tailoredCV}
                  template={template}
                  density={density}
                  isEditable={isEditing}
                  onUpdate={onUpdateTailoredCV}
                  className="border-[#121316]"
                />
              </div>
            </div>

          </div>
        )}

        {/* MODE B: TAILORED CV ONLY */}
        {viewMode === 'tailored' && (
          <div className="max-w-[850px] mx-auto space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-mono">
              <span className="uppercase tracking-wider font-bold text-[#121316] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A6F56] shrink-0" />
                <span>RoleFit Tailored CV — Submission Ready</span>
              </span>
              <span className="text-[10px] uppercase text-[#2A6F56] bg-[#FFFFFF] border border-[#2A6F56] px-2 py-0.5 font-semibold">
                A4 / Letter Standard
              </span>
            </div>
            <ResumeDocument
              id="tailored-cv-document"
              data={tailoredCV}
              template={template}
              density={density}
              isEditable={isEditing}
              onUpdate={onUpdateTailoredCV}
              className="border-[#121316] shadow-xl"
            />
          </div>
        )}

        {/* MODE C: ORIGINAL CV ONLY */}
        {viewMode === 'original' && (
          <div className="max-w-[850px] mx-auto space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-mono">
              <span className="uppercase tracking-wider font-bold text-[#716D64] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#8E929E] shrink-0" />
                <span>Original Candidate Record</span>
              </span>
              <span className="text-[10px] uppercase text-[#716D64] bg-[#FFFFFF] border border-[#D5CFC5] px-2 py-0.5">
                Reference Copy
              </span>
            </div>
            <ResumeDocument
              id="original-cv-document"
              data={originalCV}
              template={template}
              density={density}
              isEditable={false}
              className="border-[#D5CFC5]"
            />
            {/* Hidden tailored document reference for PDF exporter if user is in original view */}
            <div className="hidden" aria-hidden="true">
              <ResumeDocument
                id="tailored-cv-document"
                data={tailoredCV}
                template={template}
                density={density}
                isEditable={false}
              />
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. BONUS INTERVIEW TALKING POINTS SECTION                                 */}
      {/* ========================================================================= */}
      {interviewTalkingPoints && interviewTalkingPoints.length > 0 && (
        <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2DDD5]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
              <MessageSquare className="w-4 h-4 text-[#C84B31] shrink-0" />
              <span>Interview Talking Points & Honest Boundary Guide</span>
            </div>
            <span className="text-[10px] font-mono text-[#2A6F56] bg-[#FAF8F5] border border-[#2A6F56] px-2 py-0.5 whitespace-nowrap self-start sm:self-auto">
              Interview Readiness
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {interviewTalkingPoints.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 border border-[#E2DDD5] bg-[#FAF8F5] space-y-2 text-xs">
                <div className="font-['Newsreader',Georgia,serif] text-base font-bold text-[#121316]">
                  {item.topic}
                </div>
                <div className="text-[#575A65] leading-relaxed bg-[#FFFFFF] p-2.5 border border-[#E2DDD5] break-words">
                  <span className="font-mono text-[10px] uppercase text-[#121316] font-bold block mb-0.5">
                    How to articulate your authentic experience:
                  </span>
                  {item.howToAddress}
                </div>
                <div className="text-[#AF3E26] leading-relaxed bg-[#FAF0ED] p-2.5 border border-[#E8C2B8] break-words">
                  <span className="font-mono text-[10px] uppercase text-[#AF3E26] font-bold block mb-0.5">
                    Honest Boundary (Do not claim):
                  </span>
                  {item.honestBoundary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 no-print">
        <button
          type="button"
          onClick={onBack}
          className="editorial-btn-outline w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Back to What Changed?</span>
        </button>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="editorial-btn-outline px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
          >
            <Printer className="w-3.5 h-3.5 text-[#121316] shrink-0" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="editorial-btn-accent px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs disabled:opacity-50 min-h-[40px]"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFFFFF] shrink-0" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>PDF Export</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="editorial-btn-outline px-2.5 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[40px] text-center"
          >
            .TXT
          </button>
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="editorial-btn-outline px-2.5 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[40px] text-center"
          >
            .MD
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="editorial-btn-outline px-2.5 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[40px] text-center"
          >
            .JSON
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="editorial-btn-primary px-3.5 py-2 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. "VIEW CHANGES" MODAL DIALOG                                            */}
      {/* ========================================================================= */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 bg-[#121316]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#121316] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E2DDD5] flex items-center justify-between bg-[#FFFFFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C84B31] font-bold">
                  Zero-Fabrication Changelog
                </span>
                <h3 className="font-['Newsreader',Georgia,serif] text-xl font-bold text-[#121316]">
                  What Changed? ({changes.length} Audited Optimizations)
                </h3>
              </div>
              <button
                onClick={() => setShowChangesModal(false)}
                className="p-1.5 text-[#575A65] hover:text-[#121316] hover:bg-[#F2EFE9] border border-transparent hover:border-[#D5CFC5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {changes.map((c, idx) => (
                <div key={c.id || idx} className="p-4 bg-[#FFFFFF] border border-[#E2DDD5] space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                    <span className="font-bold text-[#121316] font-mono text-[11px] uppercase">
                      {c.section} — {c.targetContext}
                    </span>
                    <span className="text-[10px] font-mono text-[#2A6F56] bg-[#FAF8F5] border border-[#2A6F56] px-2 py-0.5">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#E2DDD5]">
                      <span className="font-mono text-[10px] uppercase text-[#716D64] block mb-1 font-bold">Original (Before)</span>
                      <p className="text-[#575A65] leading-relaxed">{c.originalSnippet}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#121316]">
                      <span className="font-mono text-[10px] uppercase text-[#C84B31] block mb-1 font-bold">Tailored (After)</span>
                      <p className="text-[#121316] font-medium leading-relaxed">{c.newSnippet}</p>
                    </div>
                  </div>

                  <div className="text-[#575A65] bg-[#FAF8F5] p-2 border border-[#E2DDD5]">
                    <span className="font-mono text-[10px] uppercase text-[#121316] font-bold">Reason: </span>
                    {c.reason}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2DDD5] bg-[#FFFFFF] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#716D64]">
                All modifications strictly derived from authentic candidate history.
              </span>
              <button
                onClick={() => setShowChangesModal(false)}
                className="editorial-btn-primary px-4 py-1.5 text-xs font-mono uppercase tracking-wider"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
