import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Terminal, CheckCircle2, Sparkles } from 'lucide-react';

interface LoadingAnalysisModalProps {
  isOpen: boolean;
  jobTitle?: string;
}

const ANALYSIS_STAGES = [
  {
    title: 'Parsing & Structuring Candidate Record',
    desc: 'Extracting verified work history, measurable metrics, and technical competencies.',
    detail: 'AST tokenizer validating employment dates, company scopes, and baseline achievements.',
  },
  {
    title: 'Deconstructing Job Requirements & ATS Signals',
    desc: 'Identifying core engineering prerequisites, domain expectations, and priority skills.',
    detail: 'Categorizing required vs preferred capabilities and target responsibilities.',
  },
  {
    title: 'Executing Zero-Fabrication Alignment Matrix',
    desc: 'Cross-auditing CV evidence against JD criteria without inventing missing capabilities.',
    detail: 'Matching verified achievements, classifying partial foundations, and isolating gaps.',
  },
  {
    title: 'Sharpening Action Verbs & Re-Prioritizing Impact',
    desc: 'Refactoring passive descriptions into Google XYZ formula while preserving facts.',
    detail: 'Promoting highest-relevance achievements to top positions per employer.',
  },
  {
    title: 'Compiling What Changed? Audit & Strategic Dossier',
    desc: 'Generating itemized before/after changelog and transparent interview bridges.',
    detail: 'Finalizing ATS keyword alignment and authentic career presentation.',
  },
];

export const LoadingAnalysisModal: React.FC<LoadingAnalysisModalProps> = ({ isOpen, jobTitle }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIdx(0);
      setProgress(10);
      return;
    }

    const stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 650);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 8) + 3;
        }
        return prev;
      });
    }, 120);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStage = ANALYSIS_STAGES[currentStageIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#121316]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#121316] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DDD5] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#C84B31] font-bold">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>Zero-Fabrication Intelligence Engine</span>
            </div>
            <h2 className="font-['Newsreader',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#121316] mt-1">
              Analyzing Role Fit & Tailoring CV
            </h2>
            {jobTitle && (
              <p className="text-xs font-mono text-[#716D64] mt-0.5">
                Targeting: <span className="text-[#121316] font-semibold">{jobTitle}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="font-['Newsreader',Georgia,serif] text-3xl font-bold text-[#121316]">
              {Math.min(progress, 99)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#E2DDD5] h-2">
            <div
              className="bg-[#121316] h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#716D64] uppercase">
            <span>Stage 0{currentStageIdx + 1} of 05</span>
            <span>Anti-Hallucination Guard Active</span>
          </div>
        </div>

        {/* Stage Status Checklist */}
        <div className="space-y-2.5 bg-[#FFFFFF] border border-[#E2DDD5] p-4">
          {ANALYSIS_STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-[#2A6F56]'
                    : isCurrent
                    ? 'text-[#121316] font-semibold'
                    : 'text-[#8E929E] opacity-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2A6F56]" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-[#C84B31] border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <div className="w-4 h-4 border border-[#D5CFC5] rounded-full flex items-center justify-center text-[9px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-tight">{stage.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#C84B31] bg-[#FAF0ED] px-1.5 py-0.2">
                        Processing
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-[#575A65] font-sans font-normal leading-relaxed">
                      {stage.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Terminal / Guarantee Footer */}
        <div className="bg-[#121316] text-[#F7F5F0] p-3 text-[11px] font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#C84B31]" />
            <span className="text-[#D5CFC5]">Strict Guard: Zero synthetic metric injection</span>
          </div>
          <span className="text-[#2A6F56] font-bold">100% AUDITED</span>
        </div>

      </div>
    </div>
  );
};
