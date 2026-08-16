import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  Target,
  ShieldCheck,
  Search,
  Layers,
  HelpCircle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AnalysisData, TargetJob } from '../types/resume';

interface AnalysisStepProps {
  analysis: AnalysisData;
  targetJob: TargetJob;
  onBack: () => void;
  onProceedToTailoring: () => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  analysis,
  targetJob,
  onBack,
  onProceedToTailoring,
}) => {
  const {
    overallScore,
    breakdown,
    summary,
    keyStrengths,
    importantJobRequirements = [],
    matchedSkills = [],
    partiallyMatchedSkills = [],
    missingSkills = [],
    keywordGaps = [],
    recommendations = [],
    isFallbackMode,
    modeNote,
    executionTimeMs,
  } = analysis;

  const [activeTab, setActiveTab] = useState<'matrix' | 'requirements' | 'gaps' | 'keywords'>('matrix');
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Restrained score counter animation
  useEffect(() => {
    let start = 0;
    const end = overallScore;
    const duration = 500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [overallScore]);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'High Role Fit (Recommended)';
    if (score >= 65) return 'Strong Contender with Select Gaps';
    return 'Moderate Fit — Strategic Positioning Advised';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-editorial-fade">
      
      {/* Demo / Fallback Mode Notice Banner */}
      {isFallbackMode && (
        <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border border-[#121316] text-xs text-[#121316] space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C84B31] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#C84B31] shrink-0" />
              <span>DETERMINISTIC HEURISTIC ENGINE ACTIVE</span>
            </span>
            <span className="font-mono text-[10px] text-[#716D64] bg-[#FFFFFF] border border-[#D5CFC5] px-2 py-0.5 uppercase whitespace-nowrap self-start sm:self-auto">
              Offline Deterministic
            </span>
          </div>
          <p className="text-[#575A65] text-[11px] leading-relaxed">
            {modeNote || 'Executing local anti-hallucination semantic heuristic engine. This analysis is generated deterministically from your authentic resume and job description.'}
          </p>
        </div>
      )}

      {/* Main Editorial Scorecard */}
      <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-[#E2DDD5]">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C84B31] font-semibold whitespace-nowrap">
                Stage 03 / Fit Audit
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#121316] text-[#121316] bg-[#FAF8F5] truncate max-w-full">
                {getScoreBadge(overallScore)}
              </span>
            </div>
            <h1 className="font-['Newsreader',Georgia,serif] text-2xl sm:text-4xl font-semibold tracking-tight text-[#121316] leading-tight">
              Role Match: {targetJob.title || 'Target Position'}
            </h1>
            <p className="text-xs sm:text-sm text-[#575A65] leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Typographic Score Block */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAF8F5] border border-[#121316] shrink-0 w-full lg:w-auto min-w-[200px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#716D64] mb-1">
              Overall Match Index
            </span>
            <div className="font-['Newsreader',Georgia,serif] text-4xl sm:text-5xl font-bold text-[#121316] tracking-tight tabular-nums">
              {animatedScore}<span className="text-xl sm:text-2xl text-[#8E929E] font-normal">/100</span>
            </div>
            <div className="w-full bg-[#E2DDD5] h-1.5 mt-2.5 sm:mt-3">
              <div
                className="bg-[#C84B31] h-full transition-all duration-700 ease-out"
                style={{ width: `${animatedScore}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#2A6F56] mt-2 flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>100% Zero-Fabrication</span>
            </span>
          </div>

        </div>

        {/* 4-D Alignment Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#E2DDD5]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] truncate">Hard Skills</div>
            <div className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316] mt-0.5 sm:mt-1 tabular-nums">{breakdown.hardSkills}%</div>
            <div className="w-full bg-[#E2DDD5] h-1 mt-1.5 sm:mt-2">
              <div className="bg-[#2A6F56] h-full transition-all duration-500" style={{ width: `${breakdown.hardSkills}%` }} />
            </div>
          </div>

          <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#E2DDD5]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] truncate">Experience Scope</div>
            <div className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316] mt-0.5 sm:mt-1 tabular-nums">{breakdown.experienceFit}%</div>
            <div className="w-full bg-[#E2DDD5] h-1 mt-1.5 sm:mt-2">
              <div className="bg-[#121316] h-full transition-all duration-500" style={{ width: `${breakdown.experienceFit}%` }} />
            </div>
          </div>

          <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#E2DDD5]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] truncate">Quantified Impact</div>
            <div className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316] mt-0.5 sm:mt-1 tabular-nums">{breakdown.impactAndMetrics}%</div>
            <div className="w-full bg-[#E2DDD5] h-1 mt-1.5 sm:mt-2">
              <div className="bg-[#C84B31] h-full transition-all duration-500" style={{ width: `${breakdown.impactAndMetrics}%` }} />
            </div>
          </div>

          <div className="p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#E2DDD5]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#716D64] truncate">Domain Match</div>
            <div className="font-['Newsreader',Georgia,serif] text-xl sm:text-2xl font-bold text-[#121316] mt-0.5 sm:mt-1 tabular-nums">{breakdown.domainMatch}%</div>
            <div className="w-full bg-[#E2DDD5] h-1 mt-1.5 sm:mt-2">
              <div className="bg-[#16425B] h-full transition-all duration-500" style={{ width: `${breakdown.domainMatch}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Verified Strengths Pillars */}
      {keyStrengths && keyStrengths.length > 0 && (
        <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#121316] font-semibold">
            <Award className="w-4 h-4 text-[#C84B31] shrink-0" />
            <span>Verified Candidate Match Pillars</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {keyStrengths.map((strength, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 bg-[#FAF8F5] border border-[#E2DDD5] text-xs text-[#121316] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-[#C84B31] font-bold">Pillar 0{idx + 1}</div>
                <div className="leading-relaxed font-sans">{strength}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Analysis Navigation Tabs */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 border-b border-[#E2DDD5] pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-2.5 sm:px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
            activeTab === 'matrix'
              ? 'bg-[#121316] text-[#FFFFFF] font-bold'
              : 'text-[#575A65] hover:text-[#121316] bg-[#FAF8F5] border border-[#E2DDD5]'
          }`}
        >
          <span>Matched ({matchedSkills.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-2.5 sm:px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
            activeTab === 'requirements'
              ? 'bg-[#121316] text-[#FFFFFF] font-bold'
              : 'text-[#575A65] hover:text-[#121316] bg-[#FAF8F5] border border-[#E2DDD5]'
          }`}
        >
          <span>Job Audit ({importantJobRequirements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-2.5 sm:px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
            activeTab === 'gaps'
              ? 'bg-[#121316] text-[#FFFFFF] font-bold'
              : 'text-[#575A65] hover:text-[#121316] bg-[#FAF8F5] border border-[#E2DDD5]'
          }`}
        >
          <span>Gaps ({partiallyMatchedSkills.length + missingSkills.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-2.5 sm:px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
            activeTab === 'keywords'
              ? 'bg-[#121316] text-[#FFFFFF] font-bold'
              : 'text-[#575A65] hover:text-[#121316] bg-[#FAF8F5] border border-[#E2DDD5]'
          }`}
        >
          <span>ATS Signals ({keywordGaps.length})</span>
        </button>
      </div>

      {/* TAB 1: MATCHED SKILLS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#2A6F56] shrink-0" />
              <span>Verified Matched Skills Matrix</span>
            </div>
            <span className="text-[10px] font-mono text-[#2A6F56] bg-[#FAF8F5] border border-[#2A6F56] px-2 py-0.5 whitespace-nowrap">
              CV Citations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {matchedSkills.map((m, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 border border-[#E2DDD5] bg-[#FAF8F5] text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-[#121316] gap-1">
                  <span className="text-sm font-['Newsreader',Georgia,serif] font-bold">{m.skill}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-[#716D64] bg-[#FFFFFF] border border-[#D5CFC5] px-1.5 py-0.5 uppercase whitespace-nowrap">
                      {m.category}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 uppercase whitespace-nowrap ${
                      m.relevance === 'high' ? 'bg-[#121316] text-[#FFFFFF]' : 'bg-[#FAF8F5] border border-[#D5CFC5] text-[#575A65]'
                    }`}>
                      {m.relevance === 'high' ? 'Priority' : 'Supported'}
                    </span>
                  </div>
                </div>

                <div className="text-[#575A65] text-[11px] leading-relaxed bg-[#FFFFFF] p-2.5 border border-[#EAE5DC] break-words">
                  <span className="font-mono text-[#716D64] text-[10px] uppercase block mb-1 font-bold">
                    Direct CV Evidence:
                  </span>
                  "{m.cvEvidence}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IMPORTANT JOB REQUIREMENTS AUDIT */}
      {activeTab === 'requirements' && (
        <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
              <Target className="w-4 h-4 text-[#C84B31] shrink-0" />
              <span>Job Requirements Alignment</span>
            </div>
            <span className="text-[10px] font-mono text-[#716D64] whitespace-nowrap">
              {importantJobRequirements.filter((r) => r.isMet).length} of {importantJobRequirements.length} met
            </span>
          </div>

          <div className="space-y-3">
            {importantJobRequirements.map((req, idx) => (
              <div
                key={req.id || idx}
                className={`p-3.5 sm:p-4 border text-xs space-y-2 ${
                  req.matchLevel === 'full'
                    ? 'border-[#2A6F56]/40 bg-[#FAF8F5]'
                    : req.matchLevel === 'partial'
                    ? 'border-[#D5CFC5] bg-[#FAF8F5]'
                    : 'border-[#E8C2B8] bg-[#FAF0ED]/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-semibold text-xs text-[#121316] flex items-start gap-2">
                    <span className="font-mono text-[10px] text-[#716D64] mt-0.5 shrink-0">REQ 0{idx + 1}</span>
                    <span>{req.requirement}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 shrink-0 self-start sm:self-auto whitespace-nowrap ${
                    req.matchLevel === 'full'
                      ? 'bg-[#2A6F56] text-[#FFFFFF]'
                      : req.matchLevel === 'partial'
                      ? 'bg-[#FAF8F5] border border-[#121316] text-[#121316]'
                      : 'bg-[#C84B31] text-[#FFFFFF]'
                  }`}>
                    {req.matchLevel === 'full' ? 'Verified Match' : req.matchLevel === 'partial' ? 'Partial Coverage' : 'Gap / Missing'}
                  </span>
                </div>

                <div className="text-[11px] text-[#575A65] bg-[#FFFFFF] p-2.5 border border-[#EAE5DC] break-words">
                  <span className="font-mono text-[10px] uppercase text-[#716D64] block mb-0.5 font-bold">
                    Audit Verification & Evidence:
                  </span>
                  {req.evidenceOrGap}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GAPS & PARTIAL MATCHES */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          
          {/* Partially Matched Skills */}
          {partiallyMatchedSkills.length > 0 && (
            <div className="editorial-card p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
                  <Layers className="w-4 h-4 text-[#C84B31] shrink-0" />
                  <span>Partially Matched Skills ({partiallyMatchedSkills.length})</span>
                </div>
                <span className="text-[10px] font-mono text-[#716D64] bg-[#FAF8F5] border border-[#D5CFC5] px-2 py-0.5 whitespace-nowrap">
                  Adjacent Foundations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {partiallyMatchedSkills.map((p, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 border border-[#E2DDD5] bg-[#FAF8F5] text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold text-[#121316] gap-1">
                      <span className="text-sm font-['Newsreader',Georgia,serif] font-bold">{p.skill}</span>
                      <span className="text-[10px] font-mono uppercase text-[#716D64] border border-[#D5CFC5] px-1.5 py-0.5 bg-[#FFFFFF] whitespace-nowrap">
                        {p.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#575A65] bg-[#FFFFFF] p-2.5 border border-[#EAE5DC] space-y-1.5 break-words">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#716D64] block font-bold">Candidate Foundation:</span>
                        {p.cvEvidence}
                      </div>
                      <div className="pt-1.5 border-t border-[#EAE5DC]">
                        <span className="font-mono text-[10px] uppercase text-[#AF3E26] block font-bold">Honest Boundary:</span>
                        {p.boundary}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          <div className="editorial-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
                <AlertTriangle className="w-4 h-4 text-[#C84B31] shrink-0" />
                <span>Identified Missing Skills ({missingSkills.length})</span>
              </div>
              <span className="text-[10px] font-mono text-[#C84B31] bg-[#FAF0ED] border border-[#C84B31] px-2 py-0.5 whitespace-nowrap">
                Zero Fabrication
              </span>
            </div>

            {missingSkills.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#716D64] bg-[#FAF8F5] border border-[#E2DDD5]">
                No critical gaps identified! Full verified coverage for primary requirements.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {missingSkills.map((gap, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 border border-[#E8C2B8] bg-[#FAF0ED]/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold text-[#121316] gap-1">
                      <span className="text-sm font-['Newsreader',Georgia,serif] font-bold">{gap.skill}</span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 whitespace-nowrap ${
                        gap.priority === 'critical' ? 'bg-[#C84B31] text-[#FFFFFF]' : 'bg-[#FAF8F5] border border-[#D5CFC5] text-[#575A65]'
                      }`}>
                        {gap.priority === 'critical' ? 'Required' : 'Preferred'}
                      </span>
                    </div>
                    <div className="text-[#575A65] text-[11px] leading-relaxed bg-[#FFFFFF] p-2.5 border border-[#E8C2B8] break-words">
                      <span className="font-mono text-[#AF3E26] text-[10px] uppercase block mb-1 font-bold">
                        Interview Strategy & Honest Positioning:
                      </span>
                      {gap.advice}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: ATS KEYWORD SIGNALS */}
      {activeTab === 'keywords' && (
        <div className="editorial-card p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#121316] font-bold">
              <Search className="w-4 h-4 text-[#C84B31] shrink-0" />
              <span>ATS Keyword Signals & Terminology Gaps</span>
            </div>
            <span className="text-[10px] font-mono text-[#716D64] whitespace-nowrap">
              JD vs CV Gap
            </span>
          </div>

          <div className="space-y-3">
            {keywordGaps.map((kg, idx) => (
              <div key={idx} className="p-3 border border-[#E2DDD5] bg-[#FAF8F5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#121316]">{kg.keyword}</span>
                    <span className="text-[10px] font-mono text-[#716D64] bg-[#FFFFFF] border border-[#D5CFC5] px-1.5 py-0.2 whitespace-nowrap">
                      {kg.occurrencesInJD}x in JD
                    </span>
                  </div>
                  <p className="text-[11px] text-[#575A65]">{kg.recommendation}</p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#D5CFC5] text-[#716D64] shrink-0 self-start sm:self-auto whitespace-nowrap">
                  {kg.importance} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Directives in Ink Container */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-[#121316] text-[#F7F5F0] p-4 sm:p-6 md:p-8 space-y-4 border border-[#121316]">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#C84B31] font-bold">
            <Target className="w-4 h-4 shrink-0" />
            <span>Strategic Application & Interview Directives</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 bg-[#1F2128] border border-[#2D3039] text-xs text-[#D5CFC5] space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#C84B31] font-bold block">Directive 0{idx + 1}</span>
                <p className="leading-relaxed font-sans">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="editorial-btn-outline w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Back to Job Input</span>
        </button>

        <button
          type="button"
          onClick={onProceedToTailoring}
          className="editorial-btn-primary w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <span>Review Tailored CV & "What Changed?"</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

    </div>
  );
};
