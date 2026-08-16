import React from 'react';

interface DiffViewerProps {
  original: string;
  modified: string;
  labelOriginal?: string;
  labelModified?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  original,
  modified,
  labelOriginal = 'Original Authentic Record',
  labelModified = 'ATS Tailored Optimization',
}) => {
  // Simple word-level visual comparison
  const origWords = original.split(/\s+/);
  const modWords = modified.split(/\s+/);

  const isIdentical = original.trim() === modified.trim();

  return (
    <div className="border border-[#E2DDD5] bg-[#FFFFFF] divide-y md:divide-y-0 md:divide-x divide-[#E2DDD5] grid grid-cols-1 md:grid-cols-2 text-xs">
      
      {/* Original Side */}
      <div className="p-3.5 bg-[#FAF8F5]">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#8E929E] mb-2 pb-1 border-b border-[#EAE5DC]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#8E929E]" />
            {labelOriginal}
          </span>
          <span>Before</span>
        </div>
        <div className="text-[#575A65] leading-relaxed font-sans">
          {original || <span className="italic text-[#A8A398]">— Empty in original record —</span>}
        </div>
      </div>

      {/* Tailored / Modified Side */}
      <div className="p-3.5 bg-[#FFFFFF]">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#C84B31] mb-2 pb-1 border-b border-[#EAE5DC]">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 bg-[#C84B31]" />
            {labelModified}
          </span>
          <span className="font-mono text-[#2A6F56]">
            {isIdentical ? 'Unchanged' : 'Optimized'}
          </span>
        </div>
        <div className="text-[#121316] font-medium leading-relaxed font-sans">
          {modified}
        </div>
      </div>

    </div>
  );
};
