import React from 'react';
import { ResumeData } from '../types/resume';
import { ExternalLink, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export type ResumeTemplateId = 'modern' | 'serif' | 'minimal' | 'technical';
export type ResumeDensity = 'comfortable' | 'compact' | 'tight';

interface ResumeDocumentProps {
  id?: string;
  data: ResumeData;
  template?: ResumeTemplateId;
  density?: ResumeDensity;
  isEditable?: boolean;
  onUpdate?: (updated: ResumeData) => void;
  highlightedKeywords?: string[];
  className?: string;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  id,
  data,
  template = 'modern',
  density = 'comfortable',
  isEditable = false,
  onUpdate,
  highlightedKeywords = [],
  className = '',
}) => {
  const { basics, skills = [], experience = [], education = [], projects = [], certifications = [] } = data;

  const handleFieldChange = (section: string, field: string, value: string, index?: number, subIndex?: number) => {
    if (!onUpdate) return;
    const clone: ResumeData = JSON.parse(JSON.stringify(data));

    if (section === 'basics') {
      (clone.basics as any)[field] = value;
    } else if (section === 'experience' && typeof index === 'number') {
      if (typeof subIndex === 'number') {
        clone.experience[index].highlights[subIndex] = value;
      } else {
        (clone.experience[index] as any)[field] = value;
      }
    } else if (section === 'skills' && typeof index === 'number') {
      if (field === 'items') {
        clone.skills[index].items = value.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        (clone.skills[index] as any)[field] = value;
      }
    } else if (section === 'education' && typeof index === 'number') {
      (clone.education[index] as any)[field] = value;
    } else if (section === 'projects' && typeof index === 'number') {
      if (typeof subIndex === 'number') {
        clone.projects[index].highlights[subIndex] = value;
      } else {
        (clone.projects[index] as any)[field] = value;
      }
    }
    onUpdate(clone);
  };

  // Density spacing mapping
  const densityStyles = {
    comfortable: {
      pagePadding: 'p-4 sm:p-8 md:p-12 lg:p-14',
      sectionGap: 'space-y-5 sm:space-y-6',
      itemGap: 'space-y-3 sm:space-y-3.5',
      bulletGap: 'space-y-1.5',
      fontSize: 'text-xs sm:text-[13px] leading-[1.65]',
      headingMargin: 'mb-2 sm:mb-2.5',
    },
    compact: {
      pagePadding: 'p-3.5 sm:p-6 md:p-10 lg:p-12',
      sectionGap: 'space-y-4 sm:space-y-4.5',
      itemGap: 'space-y-2 sm:space-y-2.5',
      bulletGap: 'space-y-1',
      fontSize: 'text-[11.5px] sm:text-[12.5px] leading-[1.55]',
      headingMargin: 'mb-1.5 sm:mb-2',
    },
    tight: {
      pagePadding: 'p-3 sm:p-5 md:p-8 lg:p-10',
      sectionGap: 'space-y-3 sm:space-y-3.5',
      itemGap: 'space-y-1.5 sm:space-y-2',
      bulletGap: 'space-y-0.5',
      fontSize: 'text-[11px] sm:text-[12px] leading-[1.45]',
      headingMargin: 'mb-1 sm:mb-1.5',
    },
  }[density];

  // Font family styles by template
  const getTemplateContainerStyles = () => {
    switch (template) {
      case 'serif':
        return 'font-["Newsreader",Georgia,serif] text-[#1a1a1a]';
      case 'technical':
        return 'font-["JetBrains_Mono",monospace] text-[#111827] text-xs';
      case 'minimal':
        return 'font-["Plus_Jakarta_Sans",sans-serif] text-[#18181b]';
      case 'modern':
      default:
        return 'font-["Space_Grotesk",sans-serif] text-[#111827]';
    }
  };

  return (
    <div
      id={id}
      className={`resume-paper-sheet bg-[#FFFFFF] text-[#121316] w-full max-w-[850px] mx-auto min-h-[1100px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#E5E0D8] ${densityStyles.pagePadding} ${getTemplateContainerStyles()} ${className}`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div className={densityStyles.sectionGap}>
        
        {/* ========================================================================= */}
        {/* 1. HEADER SECTION (Identity, Title, Contact Channels)                      */}
        {/* ========================================================================= */}
        <header className="border-b border-[#121316] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldChange('basics', 'name', e.currentTarget.textContent || '')}
              className={`font-bold tracking-tight text-[#121316] ${
                template === 'serif'
                  ? 'text-3xl sm:text-4xl font-serif'
                  : template === 'technical'
                  ? 'text-2xl sm:text-3xl tracking-tight'
                  : 'text-3xl sm:text-[34px] tracking-tight'
              } ${isEditable ? 'hover:bg-[#FAF0ED] p-0.5 rounded-xs' : ''}`}
            >
              {basics.name || 'Candidate Name'}
            </h1>

            {basics.location && (
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleFieldChange('basics', 'location', e.currentTarget.textContent || '')}
                className="text-xs font-mono text-[#575A65] tracking-wide"
              >
                {basics.location}
              </span>
            )}
          </div>

          {basics.title && (
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldChange('basics', 'title', e.currentTarget.textContent || '')}
              className={`font-semibold mt-1 ${
                template === 'serif'
                  ? 'text-lg text-[#C84B31] italic font-serif'
                  : template === 'technical'
                  ? 'text-sm text-[#C84B31] font-mono'
                  : 'text-base text-[#C84B31] tracking-tight'
              } ${isEditable ? 'hover:bg-[#FAF0ED] p-0.5 rounded-xs' : ''}`}
            >
              {basics.title}
            </div>
          )}

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#575A65] mt-2.5 font-mono pt-1 border-t border-[#F0EBE1]">
            {basics.email && (
              <span className="flex items-center gap-1">
                <span className="text-[#8E929E]">EMAIL:</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldChange('basics', 'email', e.currentTarget.textContent || '')}
                  className="text-[#121316]"
                >
                  {basics.email}
                </span>
              </span>
            )}

            {basics.phone && (
              <span className="flex items-center gap-1">
                <span className="text-[#8E929E]">TEL:</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldChange('basics', 'phone', e.currentTarget.textContent || '')}
                  className="text-[#121316]"
                >
                  {basics.phone}
                </span>
              </span>
            )}

            {basics.linkedin && (
              <span className="flex items-center gap-1">
                <span className="text-[#8E929E]">LINKEDIN:</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldChange('basics', 'linkedin', e.currentTarget.textContent || '')}
                  className="text-[#121316]"
                >
                  {basics.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </span>
              </span>
            )}

            {basics.github && (
              <span className="flex items-center gap-1">
                <span className="text-[#8E929E]">GITHUB:</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldChange('basics', 'github', e.currentTarget.textContent || '')}
                  className="text-[#121316]"
                >
                  {basics.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </span>
              </span>
            )}

            {basics.website && (
              <span className="flex items-center gap-1">
                <span className="text-[#8E929E]">WEB:</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldChange('basics', 'website', e.currentTarget.textContent || '')}
                  className="text-[#121316]"
                >
                  {basics.website.replace(/^https?:\/\//, '')}
                </span>
              </span>
            )}
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. PROFESSIONAL SUMMARY SECTION                                           */}
        {/* ========================================================================= */}
        {basics.summary && (
          <section className="space-y-1.5">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Professional Summary
            </h2>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldChange('basics', 'summary', e.currentTarget.textContent || '')}
              className={`${densityStyles.fontSize} text-[#2D3039] text-justify ${
                isEditable ? 'hover:bg-[#FAF0ED] p-1 rounded-xs' : ''
              }`}
            >
              {basics.summary}
            </p>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. TECHNICAL & PROFESSIONAL SKILLS                                        */}
        {/* ========================================================================= */}
        {skills && skills.length > 0 && (
          <section className="space-y-2">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Areas of Expertise & Technical Capabilities
            </h2>
            <div className="space-y-1.5">
              {skills.map((group, idx) => (
                <div key={idx} className={`${densityStyles.fontSize} flex flex-col sm:flex-row sm:items-baseline gap-1`}>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldChange('skills', 'category', e.currentTarget.textContent || '', idx)}
                    className="font-bold text-[#121316] font-mono text-[11px] uppercase shrink-0 min-w-[170px]"
                  >
                    {group.category}:
                  </span>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldChange('skills', 'items', e.currentTarget.textContent || '', idx)}
                    className={`text-[#2D3039] flex-1 ${isEditable ? 'hover:bg-[#FAF0ED] p-0.5 rounded-xs' : ''}`}
                  >
                    {group.items.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. WORK EXPERIENCE (Core Accomplishments with Google XYZ Formula)         */}
        {/* ========================================================================= */}
        {experience && experience.length > 0 && (
          <section className="space-y-2">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Professional Work History
            </h2>
            <div className={densityStyles.itemGap}>
              {experience.map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="space-y-1.5 break-inside-avoid">
                  
                  {/* Employer Header Line */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleFieldChange('experience', 'company', e.currentTarget.textContent || '', expIdx)}
                        className="font-bold text-sm sm:text-[15px] text-[#121316]"
                      >
                        {exp.company}
                      </span>
                      <span className="text-[#8E929E] font-normal">—</span>
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleFieldChange('experience', 'position', e.currentTarget.textContent || '', expIdx)}
                        className="font-semibold text-xs sm:text-[13.5px] text-[#333742]"
                      >
                        {exp.position}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#575A65] shrink-0">
                      {exp.location && <span>{exp.location} |</span>}
                      <span>
                        {exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')}
                      </span>
                    </div>
                  </div>

                  {/* Accomplishment Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className={`list-disc list-outside ml-4 ${densityStyles.bulletGap} ${densityStyles.fontSize} text-[#2D3039]`}>
                      {exp.highlights.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldChange('experience', 'highlights', e.currentTarget.textContent || '', expIdx, bIdx)}
                          className={`pl-0.5 leading-relaxed text-justify ${
                            isEditable ? 'hover:bg-[#FAF0ED] p-0.5 rounded-xs' : ''
                          }`}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 5. KEY PROJECTS & PORTFOLIO INITIATIVES                                    */}
        {/* ========================================================================= */}
        {projects && projects.length > 0 && (
          <section className="space-y-2">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Featured Engineering & Product Initiatives
            </h2>
            <div className={densityStyles.itemGap}>
              {projects.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="space-y-1 break-inside-avoid">
                  <div className="flex items-baseline justify-between flex-wrap gap-1">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleFieldChange('projects', 'name', e.currentTarget.textContent || '', pIdx)}
                      className="font-bold text-xs sm:text-sm text-[#121316]"
                    >
                      {proj.name}
                    </span>
                    {proj.url && (
                      <span className="text-[11px] font-mono text-[#575A65]">{proj.url}</span>
                    )}
                  </div>
                  {proj.description && (
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleFieldChange('projects', 'description', e.currentTarget.textContent || '', pIdx)}
                      className={`${densityStyles.fontSize} text-[#2D3039]`}
                    >
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && (
                    <ul className={`list-disc list-outside ml-4 ${densityStyles.bulletGap} ${densityStyles.fontSize} text-[#2D3039]`}>
                      {proj.highlights.map((h, hIdx) => (
                        <li
                          key={hIdx}
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldChange('projects', 'highlights', e.currentTarget.textContent || '', pIdx, hIdx)}
                          className="pl-0.5"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 6. EDUCATION & CREDENTIALS                                                */}
        {/* ========================================================================= */}
        {education && education.length > 0 && (
          <section className="space-y-2">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Education & Academic Credentials
            </h2>
            <div className="space-y-2">
              {education.map((edu, eduIdx) => (
                <div key={edu.id || eduIdx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 break-inside-avoid">
                  <div className="text-xs sm:text-[13px]">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleFieldChange('education', 'institution', e.currentTarget.textContent || '', eduIdx)}
                      className="font-bold text-[#121316]"
                    >
                      {edu.institution}
                    </span>
                    <span className="text-[#575A65]"> — {edu.studyType} in {edu.area}</span>
                    {edu.gpa && <span className="text-[#8E929E] font-mono text-[11px]"> (GPA: {edu.gpa})</span>}
                  </div>
                  <div className="font-mono text-[11px] text-[#575A65] shrink-0">
                    {edu.startDate} – {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 7. CERTIFICATIONS & HONORS                                                */}
        {/* ========================================================================= */}
        {certifications && certifications.length > 0 && (
          <section className="space-y-2">
            <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest text-[#121316] border-b border-[#D5CFC5] pb-1 ${densityStyles.headingMargin}`}>
              Certifications & Accreditations
            </h2>
            <div className="space-y-1.5 text-xs sm:text-[13px]">
              {certifications.map((cert, cIdx) => (
                <div key={cert.id || cIdx} className="flex items-baseline justify-between gap-1">
                  <span className="font-semibold text-[#121316]">
                    {cert.name} <span className="font-normal text-[#575A65]">({cert.issuer})</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#716D64]">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
