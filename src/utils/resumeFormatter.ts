import { ResumeData } from '../types/resume';

/**
 * Formats a structured ResumeData into clean ATS-compatible plain text.
 */
export function formatResumeAsPlainText(cv: ResumeData): string {
  const b = cv.basics;
  const contactParts = [
    b.location,
    b.email,
    b.phone,
    b.linkedin,
    b.github,
    b.website,
  ].filter(Boolean);

  let out = `${b.name.toUpperCase()}\n`;
  out += `${b.title}\n`;
  out += `${contactParts.join(' | ')}\n\n`;

  if (b.summary) {
    out += `SUMMARY\n`;
    out += `${b.summary}\n\n`;
  }

  if (cv.skills && cv.skills.length > 0) {
    out += `TECHNICAL SKILLS & COMPETENCIES\n`;
    cv.skills.forEach((group) => {
      out += `• ${group.category}: ${group.items.join(', ')}\n`;
    });
    out += `\n`;
  }

  if (cv.experience && cv.experience.length > 0) {
    out += `PROFESSIONAL EXPERIENCE\n`;
    cv.experience.forEach((exp) => {
      const dateRange = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
      const loc = exp.location ? ` | ${exp.location}` : '';
      out += `${exp.company} — ${exp.position}\n`;
      out += `${dateRange}${loc}\n`;
      exp.highlights.forEach((h) => {
        out += `• ${h}\n`;
      });
      out += `\n`;
    });
  }

  if (cv.education && cv.education.length > 0) {
    out += `EDUCATION\n`;
    cv.education.forEach((edu) => {
      out += `${edu.institution} — ${edu.studyType} in ${edu.area} (${edu.startDate} – ${edu.endDate})\n`;
      if (edu.highlights && edu.highlights.length > 0) {
        edu.highlights.forEach((h) => {
          out += `  - ${h}\n`;
        });
      }
    });
    out += `\n`;
  }

  if (cv.certifications && cv.certifications.length > 0) {
    out += `CERTIFICATIONS\n`;
    cv.certifications.forEach((c) => {
      out += `• ${c.name} — ${c.issuer}${c.date ? ` (${c.date})` : ''}\n`;
    });
    out += `\n`;
  }

  if (cv.projects && cv.projects.length > 0) {
    out += `KEY PROJECTS\n`;
    cv.projects.forEach((p) => {
      out += `${p.name}: ${p.description}\n`;
      p.highlights.forEach((h) => {
        out += `• ${h}\n`;
      });
      out += `\n`;
    });
  }

  return out.trim();
}

/**
 * Formats a structured ResumeData into clean Markdown.
 */
export function formatResumeAsMarkdown(cv: ResumeData): string {
  const b = cv.basics;
  const contactParts = [
    b.location,
    b.email,
    b.phone,
    b.linkedin ? `[LinkedIn](${b.linkedin})` : '',
    b.github ? `[GitHub](${b.github})` : '',
    b.website ? `[Portfolio](${b.website})` : '',
  ].filter(Boolean);

  let md = `# ${b.name}\n\n`;
  md += `**${b.title}**\n\n`;
  md += `${contactParts.join(' • ')}\n\n`;

  if (b.summary) {
    md += `## Professional Summary\n\n${b.summary}\n\n`;
  }

  if (cv.skills && cv.skills.length > 0) {
    md += `## Skills & Competencies\n\n`;
    cv.skills.forEach((group) => {
      md += `- **${group.category}:** ${group.items.join(', ')}\n`;
    });
    md += `\n`;
  }

  if (cv.experience && cv.experience.length > 0) {
    md += `## Professional Experience\n\n`;
    cv.experience.forEach((exp) => {
      const dateRange = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
      md += `### ${exp.position} | ${exp.company}\n`;
      md += `*${dateRange}${exp.location ? ` | ${exp.location}` : ''}*\n\n`;
      exp.highlights.forEach((h) => {
        md += `- ${h}\n`;
      });
      md += `\n`;
    });
  }

  if (cv.education && cv.education.length > 0) {
    md += `## Education\n\n`;
    cv.education.forEach((edu) => {
      md += `- **${edu.studyType} in ${edu.area}** — ${edu.institution} (${edu.startDate} – ${edu.endDate})\n`;
    });
    md += `\n`;
  }

  return md.trim();
}

/**
 * Basic deterministic parser to convert raw text into a ResumeData structure.
 */
export function parsePlainTextToResumeData(rawText: string): ResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  const data: ResumeData = {
    basics: {
      name: lines[0] || '',
      title: lines[1] && !lines[1].includes('@') ? lines[1] : '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  // Find email / phone / URLs
  for (const line of lines) {
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !data.basics.email) {
      data.basics.email = emailMatch[0];
    }
    const phoneMatch = line.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch && !data.basics.phone) {
      data.basics.phone = phoneMatch[0];
    }
    const linkedinMatch = line.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/);
    if (linkedinMatch && !data.basics.linkedin) {
      data.basics.linkedin = linkedinMatch[0];
    }
    const githubMatch = line.match(/github\.com\/[a-zA-Z0-9_-]+/);
    if (githubMatch && !data.basics.github) {
      data.basics.github = githubMatch[0];
    }
  }

  // Extract Summary if present
  const summaryIdx = lines.findIndex((l) => l.toUpperCase().includes('SUMMARY') || l.toUpperCase().includes('PROFILE') || l.toUpperCase().includes('ABOUT'));
  if (summaryIdx !== -1 && lines[summaryIdx + 1]) {
    data.basics.summary = lines.slice(summaryIdx + 1, summaryIdx + 4).filter(l => !l.startsWith('#') && !l.toUpperCase().includes('EXPERIENCE')).join(' ');
  }

  return data;
}
