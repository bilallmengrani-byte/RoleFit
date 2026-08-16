import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { CVUploadStep } from './components/CVUploadStep';
import { JobDescriptionStep } from './components/JobDescriptionStep';
import { AnalysisStep } from './components/AnalysisStep';
import { TailorStep } from './components/TailorStep';
import { ExportStep } from './components/ExportStep';
import { ResumeData, TargetJob, AnalysisData, CVChangeLog, InterviewTalkingPoint } from './types/resume';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { generateTailoredCV } from './services/tailorService';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { LoadingAnalysisModal } from './components/LoadingAnalysisModal';

export const EMPTY_CV: ResumeData = {
  basics: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

export const EMPTY_TARGET_JOB: TargetJob = {
  title: '',
  company: '',
  location: '',
  rawText: '',
  keyRequirements: [],
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [originalCV, setOriginalCV] = useState<ResumeData>(EMPTY_CV);
  const [rawCVText, setRawCVText] = useState<string>('');
  const [targetJob, setTargetJob] = useState<TargetJob>(EMPTY_TARGET_JOB);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [tailoredCV, setTailoredCV] = useState<ResumeData | null>(null);
  const [changes, setChanges] = useState<CVChangeLog[]>([]);
  const [interviewTalkingPoints, setInterviewTalkingPoints] = useState<InterviewTalkingPoint[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load a sample profile only when user explicitly chooses a sample button
  const handleLoadSample = (profileId: string) => {
    const found = SAMPLE_PROFILES.find((p) => p.id === profileId);
    if (!found) return;
    setSelectedSampleId(found.id);
    setOriginalCV(found.originalCV);
    setRawCVText(found.originalCVRaw);
    setTargetJob(found.targetJob);
    setAnalysisData(null);
    setTailoredCV(null);
    setChanges([]);
    setInterviewTalkingPoints([]);
    setErrorMessage(null);
  };

  // Clear back to blank state
  const handleClear = () => {
    setSelectedSampleId(null);
    setOriginalCV(EMPTY_CV);
    setRawCVText('');
    setTargetJob(EMPTY_TARGET_JOB);
    setAnalysisData(null);
    setTailoredCV(null);
    setChanges([]);
    setInterviewTalkingPoints([]);
    setErrorMessage(null);
  };

  // Run the analysis and tailoring pipeline
  const handleAnalyzeAndTailor = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await generateTailoredCV(originalCV, rawCVText, targetJob);
      setAnalysisData(response.analysis);
      setTailoredCV(response.tailoredCV);
      setChanges(response.changes || []);
      setInterviewTalkingPoints(response.interviewTalkingPoints || []);
      setCurrentStep(3); // Advance to Stage 3: Fit Audit
    } catch (err: any) {
      console.error('Tailoring error:', err);
      setErrorMessage(err?.message || 'Failed to analyze and tailor CV. Please check network/API status.');
    } finally {
      setIsLoading(false);
    }
  };

  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return Boolean(
      (originalCV.basics.name && originalCV.basics.name.trim().length > 0) ||
      rawCVText.trim().length > 30 ||
      originalCV.experience.length > 0
    );
    if (step === 3 || step === 4 || step === 5) return Boolean(analysisData && tailoredCV);
    return false;
  };

  const handleStartOver = () => {
    handleClear();
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#121316] flex flex-col font-['Space_Grotesk',sans-serif]">
      
      {/* Top Bar Editorial Navigation */}
      <Header
        currentStep={currentStep}
        onNavigate={(step) => setCurrentStep(step)}
        canNavigateToStep={canNavigateToStep}
        onLoadSample={handleLoadSample}
        selectedSampleId={selectedSampleId}
        onClear={handleClear}
      />

      {/* Step Tracker Ruler */}
      <div className="no-print border-b border-[#E2DDD5] bg-[#FAF8F5]">
        <StepIndicator
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
          canNavigateToStep={canNavigateToStep}
        />
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-4 w-full">
          <div className="p-4 bg-[#FAF0ED] border border-[#E8C2B8] text-xs text-[#AF3E26] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C84B31] mt-0.5" />
            <div className="flex-1 font-mono">
              <span className="font-bold uppercase">// EXECUTION ERROR: </span>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#AF3E26] hover:text-[#121316] text-xs font-mono uppercase underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content View per Step */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">
        {/* Loading Modal with realistic stages */}
        <LoadingAnalysisModal isOpen={isLoading} jobTitle={targetJob.title} />

        {currentStep === 1 && (
          <CVUploadStep
            cvData={originalCV}
            rawCVText={rawCVText}
            selectedSampleId={selectedSampleId}
            onChangeCVData={(data, raw) => {
              setSelectedSampleId(null); // User manually customized/pasted their own CV
              setOriginalCV(data);
              setRawCVText(raw);
            }}
            onNext={() => setCurrentStep(2)}
            onLoadSample={handleLoadSample}
            onClear={handleClear}
          />
        )}

        {currentStep === 2 && (
          <JobDescriptionStep
            jobData={targetJob}
            onChangeJobData={(data) => setTargetJob(data)}
            onBack={() => setCurrentStep(1)}
            onAnalyze={handleAnalyzeAndTailor}
            isLoading={isLoading}
          />
        )}

        {currentStep === 3 && analysisData && (
          <AnalysisStep
            analysis={analysisData}
            targetJob={targetJob}
            onBack={() => setCurrentStep(2)}
            onProceedToTailoring={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && tailoredCV && (
          <TailorStep
            originalCV={originalCV}
            tailoredCV={tailoredCV}
            changes={changes}
            targetJob={targetJob}
            onUpdateTailoredCV={(updated) => setTailoredCV(updated)}
            onBack={() => setCurrentStep(3)}
            onProceedToExport={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && tailoredCV && (
          <ExportStep
            originalCV={originalCV}
            tailoredCV={tailoredCV}
            changes={changes}
            analysisData={analysisData}
            targetJob={targetJob}
            interviewTalkingPoints={interviewTalkingPoints}
            onUpdateTailoredCV={(updated) => setTailoredCV(updated)}
            onBack={() => setCurrentStep(4)}
            onStartOver={handleStartOver}
            onViewChanges={() => setCurrentStep(4)}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="no-print mt-auto border-t border-[#E2DDD5] bg-[#FBF9F5] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#716D64]">
          <div className="flex items-center gap-2">
            <span className="font-['Newsreader',Georgia,serif] font-bold text-[#121316] text-sm">RoleFit</span>
            <span>—</span>
            <span>Editorial Resume Architecture & Anti-Hallucination Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#2A6F56] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2A6F56]" />
              Zero-Fabrication Standard
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
