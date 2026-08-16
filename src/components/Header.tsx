import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ShieldCheck, FileText } from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface HeaderProps {
  currentStep: number;
  onNavigate: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  onLoadSample: (profileId: string) => void;
  selectedSampleId?: string | null;
  onClear?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigate,
  canNavigateToStep,
  onLoadSample,
  selectedSampleId,
  onClear,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="no-print bg-[#FBF9F5] border-b border-[#E2DDD5] sticky top-0 z-30">
      {/* Top micro masthead bar */}
      <div className="border-b border-[#EAE5DC] px-3 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#716D64] uppercase tracking-wider">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C84B31] shrink-0" />
          <span className="truncate">RoleFit // Career Editorial</span>
          <span className="hidden md:inline text-[#B5AEA1]">|</span>
          <span className="hidden md:inline">Zero-Fabrication ATS Architecture</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <span className="flex items-center gap-1 text-[#2A6F56] font-medium whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-[#2A6F56]" />
            100% Grounded
          </span>
          <span className="hidden sm:inline text-[#B5AEA1]">|</span>
          <span className="hidden sm:inline">Edition 2026.1</span>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Zone 1: Brand Title (Single text element in Serif Display) */}
        <button
          onClick={() => onNavigate(1)}
          className="text-left group cursor-pointer focus:outline-hidden shrink-0"
          title="Return to Step 1"
        >
          <span className="font-['Newsreader',Georgia,serif] text-2xl sm:text-3xl font-semibold tracking-tight text-[#121316] group-hover:text-[#C84B31] transition-colors">
            RoleFit
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single line, numbered editorial steps) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {[
            { step: 1, label: '01 CV Archive' },
            { step: 2, label: '02 Job Dossier' },
            { step: 3, label: '03 Fit Audit' },
            { step: 4, label: '04 Tailor & Diff' },
            { step: 5, label: '05 Dispatch' },
          ].map((item) => {
            const isAccessible = canNavigateToStep(item.step);
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                onClick={() => isAccessible && onNavigate(item.step)}
                disabled={!isAccessible}
                className={`px-3 py-1.5 text-xs font-mono tracking-tight uppercase transition-all whitespace-nowrap shrink-0 border ${
                  isCurrent
                    ? 'bg-[#121316] text-[#F7F5F0] border-[#121316] font-semibold'
                    : isAccessible
                    ? 'bg-transparent text-[#575A65] border-transparent hover:border-[#D5CFC5] hover:text-[#121316] cursor-pointer'
                    : 'bg-transparent text-[#A8A398] border-transparent cursor-not-allowed'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Sample Profiles Dropdown & Reset/New) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="editorial-btn-outline px-2.5 sm:px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            >
              <FileText className="w-3.5 h-3.5 text-[#C84B31]" />
              <span className="hidden sm:inline">Load Sample Dossier</span>
              <span className="sm:hidden text-[11px] font-mono uppercase">Samples</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#716D64] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-[calc(100vw-24px)] max-w-xs sm:w-72 bg-[#FFFFFF] border border-[#121316] shadow-xl z-50 p-1.5 animate-editorial-fade">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-[#716D64] tracking-wider border-b border-[#EAE5DC]">
                  Curated Reference Profiles
                </div>
                <div className="divide-y divide-[#F2EFE9] mt-1 max-h-[70vh] overflow-y-auto">
                  {SAMPLE_PROFILES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onLoadSample(sample.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#F7F5F0] transition-colors cursor-pointer block group"
                    >
                      <div className="font-['Newsreader',Georgia,serif] text-sm font-semibold text-[#121316] group-hover:text-[#C84B31]">
                        {sample.name} — {sample.role}
                      </div>
                      <div className="text-[11px] text-[#716D64] mt-0.5 font-mono truncate">
                        → {sample.targetJob.title} @ {sample.targetJob.company}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate(1)}
            className="editorial-btn-primary px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer hidden sm:flex items-center gap-1.5 min-h-[36px]"
          >
            <span>New Application</span>
          </button>
        </div>

      </div>
    </header>
  );
};
