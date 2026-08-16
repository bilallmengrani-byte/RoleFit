import React from 'react';
import { Briefcase, Building2, ArrowRight, ArrowLeft, Search, Loader2, Target, CheckCircle2 } from 'lucide-react';
import { TargetJob } from '../types/resume';

interface JobDescriptionStepProps {
  jobData: TargetJob;
  onChangeJobData: (data: TargetJob) => void;
  onBack: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  jobData,
  onChangeJobData,
  onBack,
  onAnalyze,
  isLoading,
}) => {
  const isJobReady = jobData.rawText.trim().length > 40;

  // Real-time client keyword detector
  const detectedKeywords = React.useMemo(() => {
    if (!jobData.rawText) return [];
    const text = jobData.rawText.toLowerCase();
    const commonKeywords = [
      'react', 'typescript', 'next.js', 'node.js', 'python', 'sql', 'postgresql',
      'docker', 'aws', 'kubernetes', 'graphql', 'rest api', 'a/b testing', 'plg',
      'amplitude', 'design systems', 'ci/cd', 'agile', 'scrum', 'state management',
      'zustand', 'wcag', 'accessibility', 'microservices', 'data pipelines', 'go',
      'system architecture', 'cross-functional', 'okrs', 'roadmapping', 'strategy'
    ];
    return commonKeywords.filter((kw) => text.includes(kw));
  }, [jobData.rawText]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Editorial Header Section */}
      <div className="border-b border-[#E2DDD5] pb-5 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C84B31] mb-1.5 sm:mb-2 font-semibold">
            <span>Stage 02</span>
            <span>/</span>
            <span>Target Job Dossier</span>
          </div>
          <h1 className="font-['Newsreader',Georgia,serif] text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#121316] leading-tight">
            Paste the Target Job Description
          </h1>
          <p className="text-xs sm:text-sm text-[#575A65] mt-2 leading-relaxed">
            RoleFit extracts explicit keywords, seniority expectations, technical prerequisites, and domain scope to measure authentic alignment.
          </p>
        </div>

        <div className="text-right text-[11px] font-mono text-[#8E929E] hidden md:block">
          <div>PARSING ENGINE</div>
          <div className="text-[#121316] font-semibold">Groq Llama-3.3 70B</div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        
        {/* Target role & company metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#716D64] block mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />
              <span>Target Position Title</span>
            </label>
            <input
              type="text"
              value={jobData.title}
              onChange={(e) => onChangeJobData({ ...jobData, title: e.target.value })}
              placeholder="e.g. Staff Frontend Engineer, Lead Product Manager"
              className="w-full text-xs sm:text-sm font-sans font-medium px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-[#121316] focus:border-[#121316] focus:bg-[#FFFFFF] transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#716D64] block mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />
              <span>Target Organization / Company</span>
            </label>
            <input
              type="text"
              value={jobData.company}
              onChange={(e) => onChangeJobData({ ...jobData, company: e.target.value })}
              placeholder="e.g. Stripe, Linear, OpenAI, Scale AI"
              className="w-full text-xs sm:text-sm font-sans font-medium px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5CFC5] text-[#121316] focus:border-[#121316] focus:bg-[#FFFFFF] transition-colors"
            />
          </div>
        </div>

        {/* Job Description Text Area */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#121316] font-semibold">
              Full Job Posting Transcript
            </label>
            <span className="text-[11px] font-mono text-[#8E929E]">
              {jobData.rawText.length > 0 ? `${jobData.rawText.split(/\s+/).length} words` : 'Paste responsibilities & requirements'}
            </span>
          </div>
          <textarea
            rows={11}
            value={jobData.rawText}
            onChange={(e) => onChangeJobData({ ...jobData, rawText: e.target.value })}
            placeholder="Paste the complete job posting here (Overview, Responsibilities, Minimum Requirements, Preferred Qualifications)..."
            className="w-full font-mono text-xs sm:text-[13px] leading-relaxed p-3.5 sm:p-4 bg-[#FBF9F5] border border-[#D5CFC5] text-[#121316] focus:border-[#121316] focus:bg-[#FFFFFF] transition-colors"
          />
        </div>

        {/* Real-time ATS Keywords Detected */}
        {detectedKeywords.length > 0 && (
          <div className="p-3 sm:p-4 bg-[#FAF8F5] border border-[#E2DDD5] space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#716D64] font-semibold">
              <Search className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />
              <span>ATS Signal Keywords Detected ({detectedKeywords.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {detectedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-[#FFFFFF] border border-[#D5CFC5] text-[#121316] px-2 py-1 sm:py-0.5 text-[10px] sm:text-[11px] font-mono uppercase"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="editorial-btn-outline w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Back to CV Input</span>
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!isJobReady || isLoading}
          className={`editorial-btn-accent w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] ${
            !isJobReady || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Auditing Fit & Grounding CV...</span>
            </>
          ) : (
            <>
              <span>Audit Fit & Tailor CV</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
