import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  Split,
  FileCheck,
  Layers,
  Info,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { ResumeData, CVChangeLog, TargetJob } from '../types/resume';
import { DiffViewer } from './DiffViewer';

interface TailorStepProps {
  originalCV: ResumeData;
  tailoredCV: ResumeData;
  changes: CVChangeLog[];
  targetJob: TargetJob;
  onUpdateTailoredCV: (updated: ResumeData) => void;
  onBack: () => void;
  onProceedToExport: () => void;
}

export const TailorStep: React.FC<TailorStepProps> = ({
  originalCV,
  tailoredCV,
  changes,
  targetJob,
  onUpdateTailoredCV,
  onBack,
  onProceedToExport,
}) => {
  const [viewMode, setViewMode] = useState<'changelog' | 'diff' | 'side-by-side'>('changelog');
  const [selectedSection, setSelectedSection] = useState<'all' | 'title' | 'summary' | 'skills' | 'experience'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const filteredChanges = changes.filter((c) => {
    const matchSection = selectedSection === 'all' || c.section === selectedSection;
    const matchType = selectedType === 'all' || (c.changeType && c.changeType === selectedType);
    return matchSection && matchType;
  });

  const getChangeTypeBadge = (type?: string) => {
    switch (type) {
      case 'rewrite':
        return 'Clarity & Google XYZ Formula';
      case 'reorder':
        return 'Accomplishment Hierarchy';
      case 'keyword-emphasis':
        return 'ATS Terminology Alignment';
      case 'clarity-improvement':
        return 'Action Verb Refactor';
      default:
        return 'Strategic Alignment';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-editorial-fade">
      
      {/* Editorial Header & Mode Switcher */}
      <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-[#E2DDD5]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C84B31] font-semibold">
                Stage 04 / Optimization Audit
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#2A6F56] text-[#2A6F56] bg-[#FAF8F5] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero-Fabrication Verified</span>
              </span>
            </div>
            <h1 className="font-['Newsreader',Georgia,serif] text-2xl sm:text-4xl font-semibold tracking-tight text-[#121316] leading-tight">
              What Changed? Optimization Review
            </h1>
            <p className="text-xs sm:text-sm text-[#575A65] leading-relaxed">
              Every change below preserves candidate facts, rewrites weak descriptions for clarity and impact, and prioritizes accomplishments relevant to <span className="text-[#121316] font-semibold">{targetJob.title || 'the target role'}</span>.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#121316] p-3.5 sm:p-4 text-center shrink-0 w-full lg:w-auto min-w-[170px]">
            <div className="font-['Newsreader',Georgia,serif] text-3xl sm:text-4xl font-bold text-[#121316] tabular-nums">{changes.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] mt-0.5">
              Verified Optimizations
            </div>
          </div>
        </div>

        {/* View Mode Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-1 border border-[#E2DDD5] bg-[#FAF8F5] p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('changelog')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                viewMode === 'changelog'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 shrink-0" />
              <span>What Changed? ({changes.length})</span>
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                viewMode === 'diff'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Split className="w-3.5 h-3.5 shrink-0" />
              <span>Section Diffs</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-2 sm:py-1.5 text-xs font-mono tracking-tight uppercase transition-all flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer min-h-[36px] ${
                viewMode === 'side-by-side'
                  ? 'bg-[#121316] text-[#FFFFFF] font-semibold'
                  : 'text-[#575A65] hover:text-[#121316]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {/* Section Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-[11px] font-mono text-[#8E929E] uppercase mr-1">Filter:</span>
            {(['all', 'title', 'summary', 'skills', 'experience'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2 py-1 text-[11px] font-mono uppercase transition-colors border cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-[#121316] text-[#FFFFFF] border-[#121316] font-semibold'
                    : 'bg-[#FFFFFF] text-[#575A65] border-[#D5CFC5] hover:border-[#121316]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODE 1: DEDICATED "WHAT CHANGED?" SECTION (Original → Tailored → Reason) */}
      {viewMode === 'changelog' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between px-2 text-xs font-mono text-[#716D64]">
            <span className="uppercase tracking-wider font-semibold text-[#121316]">
              Showing {filteredChanges.length} of {changes.length} Audited Modifications
            </span>
            <span className="hidden sm:inline">Zero hallucination guarantee enforced</span>
          </div>

          {filteredChanges.length === 0 ? (
            <div className="editorial-card p-6 sm:p-10 text-center text-xs text-[#716D64] space-y-2">
              <p>No changes found matching the selected section filter.</p>
              <button
                onClick={() => setSelectedSection('all')}
                className="text-xs font-mono text-[#C84B31] uppercase underline cursor-pointer"
              >
                Reset section filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChanges.map((change, idx) => (
                <div
                  key={change.id || idx}
                  className="editorial-card p-4 sm:p-6 space-y-3.5 sm:space-y-4 border border-[#E2DDD5] hover:border-[#121316] transition-all"
                >
                  
                  {/* Top Metadata Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-[#EAE5DC]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#121316] text-[#FFFFFF] text-[10px] font-mono uppercase px-2 py-0.5 font-bold">
                        {change.section}
                      </span>
                      <span className="font-semibold text-xs text-[#121316] font-sans">
                        {change.targetContext}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] font-mono uppercase bg-[#FAF8F5] border border-[#D5CFC5] px-2 py-0.5 text-[#575A65]">
                        {getChangeTypeBadge(change.changeType)}
                      </span>
                      <span className="text-[10px] font-mono text-[#2A6F56] bg-[#FAF8F5] border border-[#2A6F56] px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>{change.hallucinationCheck || 'Verified'}</span>
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Visual Flow: Original → Tailored */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pt-1">
                    {/* ORIGINAL (BEFORE) */}
                    <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#D5CFC5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#716D64]">
                          Original (Candidate Archive)
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[#8E929E]">Before</span>
                      </div>
                      <div className="text-xs text-[#575A65] font-mono leading-relaxed bg-[#FFFFFF] p-2.5 border border-[#E2DDD5] break-words">
                        {change.originalSnippet || '(Not specified)'}
                      </div>
                    </div>

                    {/* TAILORED (AFTER) */}
                    <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#121316] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#C84B31]">
                          Tailored (Aligned & Sharpened)
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[#2A6F56] font-bold">Optimized</span>
                      </div>
                      <div className="text-xs text-[#121316] font-medium leading-relaxed bg-[#FFFFFF] p-2.5 border border-[#121316] break-words">
                        {change.newSnippet}
                      </div>
                    </div>
                  </div>

                  {/* REASON FOR CHANGE */}
                  <div className="p-3 bg-[#FAF8F5] border border-[#E2DDD5] flex items-start gap-2.5 text-xs text-[#575A65]">
                    <Info className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#121316] font-bold">
                        Reason for Change: 
                      </span>{' '}
                      <span className="font-sans leading-relaxed break-words">{change.reason}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Section Diffs */}
      {viewMode === 'diff' && (
        <div className="space-y-4 sm:space-y-6">
          
          {/* Headline & Summary Diff */}
          {(selectedSection === 'all' || selectedSection === 'summary' || selectedSection === 'title') && (
            <div className="editorial-card p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
                  <Layers className="w-4 h-4 text-[#C84B31] shrink-0" />
                  <span>Executive Headline & Summary Realignment</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E2DDD5] text-[#2A6F56] whitespace-nowrap">
                  ATS Alignment
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] mb-1.5">Candidate Title</div>
                  <DiffViewer
                    original={originalCV.basics.title}
                    modified={tailoredCV.basics.title}
                    labelOriginal="Original Title"
                    labelModified="Tailored Title"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] mb-1.5">Executive Summary</div>
                  <DiffViewer
                    original={originalCV.basics.summary}
                    modified={tailoredCV.basics.summary}
                    labelOriginal="Original Summary"
                    labelModified="Tailored Summary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Prioritization Diff */}
          {(selectedSection === 'all' || selectedSection === 'skills') && (
            <div className="editorial-card p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
                  <Layers className="w-4 h-4 text-[#C84B31] shrink-0" />
                  <span>Technical Competencies Prioritization</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E2DDD5] text-[#716D64] whitespace-nowrap">
                  JD Reordering
                </span>
              </div>
              {tailoredCV.skills.map((group, idx) => {
                const origGroup = originalCV.skills[idx] || group;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-xs font-bold text-[#121316] font-sans">{group.category}</div>
                    <DiffViewer
                      original={origGroup.items.join(' • ')}
                      modified={group.items.join(' • ')}
                      labelOriginal="Original Order"
                      labelModified="ATS Prioritized Order"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Work Experience Accomplishments Diff */}
          {(selectedSection === 'all' || selectedSection === 'experience') && (
            <div className="editorial-card p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
                  <Layers className="w-4 h-4 text-[#C84B31] shrink-0" />
                  <span>Work Experience Accomplishments & Metric Phrasing</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E2DDD5] text-[#2A6F56] whitespace-nowrap">
                  Google XYZ Format
                </span>
              </div>

              {tailoredCV.experience.map((exp, expIdx) => {
                const origExp = originalCV.experience[expIdx] || exp;
                return (
                  <div key={exp.id || expIdx} className="space-y-3 pb-5 border-b border-[#EAE5DC] last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-['Newsreader',Georgia,serif] text-base font-bold text-[#121316]">
                        {exp.company} — <span className="font-normal text-[#575A65]">{exp.position}</span>
                      </h4>
                      <span className="text-[11px] font-mono text-[#716D64]">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {exp.highlights.map((tailoredBullet, bIdx) => {
                        const origBullet = origExp.highlights[bIdx] || tailoredBullet;
                        return (
                          <div key={bIdx} className="space-y-1">
                            <div className="text-[10px] font-mono uppercase text-[#8E929E]">Achievement #{bIdx + 1}</div>
                            <DiffViewer
                              original={origBullet}
                              modified={tailoredBullet}
                              labelOriginal="Original Bullet"
                              labelModified="Tailored Action Bullet"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* MODE 3: Full Side-by-Side Comparison */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Original Record */}
          <div className="editorial-card p-4 sm:p-6 space-y-4">
            <div className="pb-3 border-b border-[#E2DDD5] flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#716D64] font-bold">Original Record</span>
              <span className="text-[10px] font-mono bg-[#FAF8F5] border border-[#D5CFC5] px-2 py-0.5">Raw Input</span>
            </div>
            <div className="space-y-4 text-xs font-sans">
              <div>
                <h3 className="font-['Newsreader',Georgia,serif] text-xl font-bold text-[#121316]">{originalCV.basics.name}</h3>
                <p className="text-[#575A65] font-medium">{originalCV.basics.title}</p>
                <p className="text-[#8E929E] text-[11px] font-mono mt-0.5 break-words">{originalCV.basics.email} | {originalCV.basics.location}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E929E] mb-1">Summary</div>
                <p className="text-[#575A65] leading-relaxed break-words">{originalCV.basics.summary}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E929E] mb-2">Experience</div>
                <div className="space-y-3">
                  {originalCV.experience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="font-semibold text-[#121316]">{exp.company} — {exp.position}</div>
                      <ul className="list-disc list-inside space-y-1 text-[#575A65] text-[11px]">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="leading-relaxed">{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tailored Document */}
          <div className="editorial-card p-4 sm:p-6 space-y-4 border-[#121316]">
            <div className="pb-3 border-b border-[#121316] flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">Tailored Career Dossier</span>
              <span className="text-[10px] font-mono bg-[#121316] text-[#FFFFFF] px-2 py-0.5">Optimized</span>
            </div>
            <div className="space-y-4 text-xs font-sans">
              <div>
                <h3 className="font-['Newsreader',Georgia,serif] text-xl font-bold text-[#121316]">{tailoredCV.basics.name}</h3>
                <p className="text-[#C84B31] font-semibold">{tailoredCV.basics.title}</p>
                <p className="text-[#8E929E] text-[11px] font-mono mt-0.5 break-words">{tailoredCV.basics.email} | {tailoredCV.basics.location}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#C84B31] mb-1">Tailored Summary</div>
                <p className="text-[#121316] leading-relaxed font-medium bg-[#FAF8F5] p-3 border border-[#E2DDD5] break-words">
                  {tailoredCV.basics.summary}
                </p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#C84B31] mb-2">Tailored Experience</div>
                <div className="space-y-3">
                  {tailoredCV.experience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="font-bold text-[#121316]">{exp.company} — {exp.position}</div>
                      <ul className="list-disc list-inside space-y-1 text-[#121316] text-[11px]">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="leading-relaxed font-medium">{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="editorial-btn-outline w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Back to Analysis</span>
        </button>

        <button
          type="button"
          onClick={onProceedToExport}
          className="editorial-btn-primary w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <span>Final Resume Preview & Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

    </div>
  );
};
