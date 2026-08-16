import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, User, Briefcase, Sparkles, AlertCircle, Layers, BookOpen, Zap, ShieldCheck } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { parsePlainTextToResumeData } from '../utils/resumeFormatter';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface CVUploadStepProps {
  cvData: ResumeData;
  rawCVText: string;
  onChangeCVData: (data: ResumeData, rawText: string) => void;
  onNext: () => void;
  onLoadSample: (profileId: string) => void;
  selectedSampleId?: string | null;
  onClear?: () => void;
  onRunInstantDemo?: () => void;
}

export const CVUploadStep: React.FC<CVUploadStepProps> = ({
  cvData,
  rawCVText,
  onChangeCVData,
  onNext,
  onLoadSample,
  selectedSampleId,
  onClear,
  onRunInstantDemo,
}) => {
  const [inputTab, setInputTab] = useState<'text' | 'upload' | 'structured'>('text');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadSuccessAnim, setUploadSuccessAnim] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle raw text input
  const handleRawTextChange = (text: string) => {
    if (!text.trim()) {
      onChangeCVData({
        basics: { name: '', title: '', email: '', phone: '', location: '', summary: '' },
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
      }, '');
      return;
    }
    const parsed = parsePlainTextToResumeData(text);
    onChangeCVData(parsed, text);
  };

  // Handle file drop / upload
  const handleFileUpload = (file: File) => {
    setFileError(null);
    setFileName(file.name);
    setUploadSuccessAnim(true);
    setTimeout(() => setUploadSuccessAnim(false), 800);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['txt', 'md', 'json'].includes(ext || '')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (ext === 'json') {
          try {
            const parsedJson = JSON.parse(text);
            onChangeCVData(parsedJson, text);
            return;
          } catch {
            // fallback to plain text parsing
          }
        }
        handleRawTextChange(text);
      };
      reader.readAsText(file);
    } else if (['pdf', 'docx', 'doc'].includes(ext || '')) {
      // Extract document text
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const cleanText = text ? text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim() : '';
        if (cleanText.length > 30) {
          handleRawTextChange(cleanText);
        } else {
          setFileError(`Could not extract clean text from ${file.name}. Please paste your resume text in the "Paste Text" tab or pick a sample profile below.`);
        }
      };
      reader.readAsText(file);
    } else {
      setFileError('Unsupported file format. Please upload a .pdf, .docx, .txt, or .md file.');
    }
  };

  const isFormValid = Boolean(
    (cvData.basics.name && cvData.basics.name.trim().length > 0 && cvData.basics.name !== 'Candidate Name') ||
    rawCVText.trim().length > 30 ||
    cvData.experience.length > 0
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-editorial-fade">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Tailor your CV to the job — without changing the truth.   */}
      {/* ========================================================================= */}
      <div className="border-b border-[#E2DDD5] pb-5 sm:pb-6 space-y-3.5 sm:space-y-4">
        
        {/* Micro Category & Zero Fabrication Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C84B31] font-semibold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
            <span>Stage 01 // Candidate Archive</span>
          </div>
          <span className="text-[10px] font-mono text-[#2A6F56] bg-[#FAF8F5] border border-[#2A6F56] px-2 py-0.5 flex items-center gap-1 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>100% Anti-Hallucination</span>
          </span>
        </div>

        {/* Primary Punchy Statement */}
        <h1 className="font-['Newsreader',Georgia,serif] text-2xl sm:text-4xl lg:text-[44px] leading-[1.15] sm:leading-[1.12] font-semibold tracking-tight text-[#121316]">
          Tailor your CV to the job — without changing the truth.
        </h1>

        {/* Short, crisp explanation */}
        <p className="text-xs sm:text-base text-[#575A65] max-w-3xl leading-relaxed">
          RoleFit restructures weak descriptions into Google XYZ impact bullets, prioritizes relevant achievements, and aligns ATS terminology against the job posting — strictly grounded in what you have actually built, with zero synthetic skills.
        </p>

        {/* Instant Evaluation Quickstart Bar */}
        <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#121316] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#C84B31] font-bold">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Hackathon Evaluation & Sample Profiles</span>
            </div>
            <p className="text-[11px] text-[#575A65]">
              Click any button below to test with a pre-configured sample dossier:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto shrink-0">
            {SAMPLE_PROFILES.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample.id)}
                  className={`px-2.5 py-2 sm:py-1.5 text-[11px] font-mono uppercase font-semibold border transition-all cursor-pointer text-center min-h-[36px] flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#121316] text-[#FFFFFF] border-[#121316] shadow-xs ring-1 ring-[#121316]'
                      : 'bg-[#FFFFFF] text-[#121316] border-[#D5CFC5] hover:border-[#121316] hover:bg-[#F2EFE9]'
                  }`}
                  title={`Load sample: ${sample.name} (${sample.role})`}
                >
                  <span>{sample.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75 font-normal">({sample.role.split(' ')[0]})</span>
                  {isSelected && <span className="text-[9px] bg-[#2A6F56] text-[#FFFFFF] px-1 py-0.2 rounded-xs font-mono ml-0.5">ACTIVE</span>}
                </button>
              );
            })}
            {Boolean(rawCVText.trim() || cvData.basics.name) && onClear && (
              <button
                onClick={onClear}
                className="px-2 py-1.5 text-[11px] font-mono uppercase text-[#AF3E26] hover:text-[#C84B31] underline cursor-pointer whitespace-nowrap ml-1"
                title="Clear current resume and start blank"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN INPUT CANVAS CARD                                                 */}
      {/* ========================================================================= */}
      <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        
        {/* Editorial Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE5DC] pb-3 sm:pb-4 gap-2.5 sm:gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border border-[#E2DDD5] bg-[#FAF8F5] p-1 w-full sm:w-auto">
            <button
              onClick={() => setInputTab('text')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                inputTab === 'text'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setInputTab('upload')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                inputTab === 'upload'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>Document File</span>
            </button>
            <button
              onClick={() => setInputTab('structured')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                inputTab === 'structured'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Structured Form</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#8E929E] text-right sm:text-left">
            {rawCVText.trim() ? `${rawCVText.split(/\s+/).length} words recorded` : 'Awaiting input'}
          </div>
        </div>

        {/* TAB 1: PASTE TEXT */}
        {inputTab === 'text' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#575A65] gap-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#121316] font-semibold">
                Raw Resume Transcript
              </span>
              <span className="text-[11px] text-[#716D64]">Work history, accomplishments, tech stack, and credentials</span>
            </div>
            <textarea
              rows={11}
              value={rawCVText}
              onChange={(e) => handleRawTextChange(e.target.value)}
              placeholder={`Paste your entire resume here...\n\nExample:\nALEX CHEN\nStaff Frontend Engineer | San Francisco, CA | alex@example.com\n\nSUMMARY\nLead frontend engineer with 9+ years building high-scale design systems and real-time React web applications...\n\nEXPERIENCE\nStaff Frontend Engineer — Acme Corp (2021 - Present)\n- Architected component library reducing bundle size by 38% across 14 product squads.\n- Led performance refactor improving Core Web Vitals (LCP from 2.8s to 0.9s)...`}
              className="w-full font-mono text-xs sm:text-[13px] leading-relaxed p-3.5 sm:p-4 bg-[#FBF9F5] border border-[#D5CFC5] text-[#121316] focus:outline-hidden focus:border-[#121316] focus:bg-[#FFFFFF] transition-colors"
            />
          </div>
        )}

        {/* TAB 2: UPLOAD FILE */}
        {inputTab === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className={`border border-dashed p-6 sm:p-10 text-center cursor-pointer transition-all space-y-3 ${
                uploadSuccessAnim
                  ? 'border-[#2A6F56] bg-[#FAF8F5] animate-upload-success'
                  : 'border-[#B5AEA1] hover:border-[#121316] bg-[#FAF8F5] hover:bg-[#F2EFE9]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div className="w-10 h-10 border border-[#121316] bg-[#FFFFFF] flex items-center justify-center mx-auto text-[#C84B31]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="font-['Newsreader',Georgia,serif] text-base sm:text-lg font-semibold text-[#121316] break-words">
                  {fileName ? fileName : 'Drop your resume file here or browse'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#716D64] mt-1 font-mono">
                  Supported formats: PDF, DOCX, TXT, MD, JSON
                </p>
              </div>
            </div>

            {fileError && (
              <div className="p-3 bg-[#FAF0ED] border border-[#E8C2B8] text-xs text-[#AF3E26] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STRUCTURED FORM VIEW */}
        {inputTab === 'structured' && (
          <div className="space-y-6 text-xs">
            {/* Basics */}
            <div className="space-y-3 border-b border-[#EAE5DC] pb-5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#121316] font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C84B31]" />
                <span>Candidate Identity & Baseline</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#716D64] uppercase font-mono block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={cvData.basics.name}
                    onChange={(e) =>
                      onChangeCVData({ ...cvData, basics: { ...cvData.basics, name: e.target.value } }, rawCVText)
                    }
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-xs focus:border-[#121316] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#716D64] uppercase font-mono block mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={cvData.basics.title}
                    onChange={(e) =>
                      onChangeCVData({ ...cvData, basics: { ...cvData.basics, title: e.target.value } }, rawCVText)
                    }
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-xs focus:border-[#121316] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#716D64] uppercase font-mono block mb-1">Email</label>
                  <input
                    type="text"
                    value={cvData.basics.email}
                    onChange={(e) =>
                      onChangeCVData({ ...cvData, basics: { ...cvData.basics, email: e.target.value } }, rawCVText)
                    }
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-xs focus:border-[#121316] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#716D64] uppercase font-mono block mb-1">Authentic Career Summary</label>
                <textarea
                  rows={3}
                  value={cvData.basics.summary}
                  onChange={(e) =>
                    onChangeCVData({ ...cvData, basics: { ...cvData.basics, summary: e.target.value } }, rawCVText)
                  }
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-xs focus:border-[#121316] focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            {/* Experience List Preview */}
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#121316] font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#C84B31]" />
                <span>Parsed Experience Entries ({cvData.experience.length})</span>
              </div>
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="p-3 border border-[#E2DDD5] bg-[#FAF8F5] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-[#121316] gap-1">
                    <span>{exp.company} — {exp.position}</span>
                    <span className="font-mono text-[11px] text-[#716D64]">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#575A65] text-[11px]">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. FOOTER NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-[#716D64] font-mono flex items-center justify-center sm:justify-start gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#2A6F56] shrink-0" />
          <span>Stage 01 of 05 Ready</span>
        </div>

        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`editorial-btn-primary w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 min-h-[44px] ${
            !isFormValid ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span>Continue to Target Job</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

    </div>
  );
};
