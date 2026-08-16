import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

const STEPS = [
  { step: 1, number: '01', title: 'CV Archive', desc: 'Original Verified History' },
  { step: 2, number: '02', title: 'Target Dossier', desc: 'Job Requirements & ATS' },
  { step: 3, number: '03', title: 'Fit Audit', desc: '4-D Match & Gap Map' },
  { step: 4, number: '04', title: 'Tailor & Diff', desc: 'Grounded Realignment' },
  { step: 5, number: '05', title: 'Dispatch', desc: 'Print, PDF & Plaintext' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToStep,
}) => {
  const currentStepObj = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      {/* Mobile Step Bar (< sm screens: 320px - 639px) */}
      <div className="sm:hidden bg-[#FFFFFF] border border-[#E2DDD5] p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#C84B31] uppercase">
              {currentStepObj.number} / 05
            </span>
            <span className="text-xs font-bold text-[#121316]">
              {currentStepObj.title}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#716D64] uppercase">
            {currentStepObj.desc}
          </span>
        </div>

        {/* 5-Step Visual Progress Pips for Mobile */}
        <div className="grid grid-cols-5 gap-1.5 pt-0.5">
          {STEPS.map((item) => {
            const isCurrent = currentStep === item.step;
            const isDone = currentStep > item.step;
            const isAccessible = canNavigateToStep(item.step);

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => isAccessible && onSelectStep(item.step)}
                disabled={!isAccessible}
                title={`${item.number} ${item.title}`}
                className={`h-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C84B31] ring-1 ring-[#C84B31]'
                    : isDone
                    ? 'bg-[#2A6F56]'
                    : isAccessible
                    ? 'bg-[#D5CFC5] hover:bg-[#121316]'
                    : 'bg-[#EAE5DC] cursor-not-allowed opacity-60'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Step Ruler (>= sm screens: 640px+) */}
      <div className="hidden sm:grid sm:grid-cols-5 border border-[#E2DDD5] bg-[#FFFFFF] divide-x divide-[#E2DDD5]">
        {STEPS.map((item) => {
          const isCurrent = currentStep === item.step;
          const isDone = currentStep > item.step;
          const isAccessible = canNavigateToStep(item.step);

          return (
            <button
              key={item.step}
              onClick={() => isAccessible && onSelectStep(item.step)}
              disabled={!isAccessible}
              className={`p-3 text-left transition-all relative ${
                isCurrent
                  ? 'bg-[#FBF9F5] border-t-2 border-t-[#C84B31]'
                  : isDone
                  ? 'bg-[#FFFFFF] hover:bg-[#F7F5F0] cursor-pointer'
                  : isAccessible
                  ? 'bg-[#FFFFFF] hover:bg-[#F7F5F0] cursor-pointer'
                  : 'bg-[#FAF8F5] opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-semibold tracking-wider ${
                  isCurrent ? 'text-[#C84B31]' : isDone ? 'text-[#2A6F56]' : 'text-[#8E929E]'
                }`}>
                  {item.number}
                </span>
                {isDone && (
                  <span className="w-4 h-4 flex items-center justify-center bg-[#2A6F56] text-[#FFFFFF] rounded-none text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className={`text-xs font-semibold tracking-tight truncate ${
                isCurrent ? 'text-[#121316] font-bold' : 'text-[#4A4D57]'
              }`}>
                {item.title}
              </div>
              <div className="text-[10px] text-[#8E929E] font-sans truncate mt-0.5">
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
