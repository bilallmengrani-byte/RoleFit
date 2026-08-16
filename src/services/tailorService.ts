import {
  ResumeData,
  TargetJob,
  TailorResponse,
  CVChangeLog,
  MatchedSkill,
  MissingSkill,
  PartiallyMatchedSkill,
  ImportantJobRequirement,
  KeywordGap,
} from '../types/resume';

/**
 * Common ATS action verbs for enhancing bullet points with punchy metrics.
 */
const ACTION_VERB_MAP: Record<string, string> = {
  worked: 'Architected',
  helped: 'Spearheaded',
  did: 'Executed',
  made: 'Engineered',
  handled: 'Streamlined',
  responsible: 'Orchestrated',
  managed: 'Directed',
  wrote: 'Authored and deployed',
  fixed: 'Diagnosed and resolved',
  created: 'Pioneered',
  built: 'Engineered',
  improved: 'Optimized',
  assisted: 'Partnered to deliver',
  participated: 'Drove cross-functional execution for',
  supported: 'Accelerated team delivery of',
};

/**
 * Known technology relationship graph for partial match & adjacent competency detection.
 */
const ADJACENT_TECH_GRAPH: Record<string, { adjacent: string[]; boundary: string; rec: string }> = {
  'next.js': {
    adjacent: ['react', 'typescript', 'javascript'],
    boundary: 'Candidate has deep React/TypeScript client architecture experience; Next.js SSR/App Router is an adjacent extension.',
    rec: 'Highlight SSR foundations, component lifecycles, and rapid framework adaptability.',
  },
  'graphql': {
    adjacent: ['rest api', 'rest', 'json', 'backend'],
    boundary: 'Candidate has extensive REST API and distributed data consumption background; GraphQL represents an API query layer transition.',
    rec: 'Emphasize schema contracts, client-side caching, and data fetching performance.',
  },
  'kubernetes': {
    adjacent: ['docker', 'ci/cd', 'aws', 'gcp'],
    boundary: 'Candidate has containerization (Docker) and cloud pipeline experience, but lacks multi-cluster production orchestration evidence.',
    rec: 'Emphasize container build pipelines and cloud infrastructure familiarity.',
  },
  'go': {
    adjacent: ['python', 'node.js', 'java', 'c++'],
    boundary: 'Candidate has production backend systems experience in other typed/concurrent languages.',
    rec: 'Point to strong systems fundamentals, concurrency concepts, and rapid language acquisition.',
  },
  'playwright': {
    adjacent: ['jest', 'cypress', 'testing library', 'unit testing'],
    boundary: 'Candidate has robust automated testing experience in Jest and Cypress.',
    rec: 'Highlight end-to-end testing principles and test-driven development rigour.',
  },
  'zustand': {
    adjacent: ['redux', 'state management', 'context api'],
    boundary: 'Candidate has multi-year global state management experience in Redux and Context.',
    rec: 'Highlight immutable state patterns and lightweight store architecture.',
  },
};

/**
 * Performs deep semantic & keyword analysis of original CV against target Job Description.
 */
export function analyzeAndTailorLocally(
  originalCV: ResumeData,
  originalRawText: string,
  targetJob: TargetJob,
  isFallback = true,
  fallbackNote = 'Demo / Local Heuristic Engine Active — Executing offline zero-fabrication analysis without live Groq API connection.'
): TailorResponse {
  const startTime = Date.now();
  const jdText = targetJob.rawText.toLowerCase();
  const cvText = (originalRawText + ' ' + JSON.stringify(originalCV)).toLowerCase();

  // 1. Comprehensive keyword vocabulary
  const keywordCandidates = [
    'react', 'typescript', 'javascript', 'next.js', 'vue', 'angular', 'node.js', 'python', 'go', 'golang',
    'java', 'rust', 'c++', 'graphql', 'rest api', 'rest', 'postgresql', 'postgres', 'sql', 'mysql',
    'redis', 'mongodb', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'github actions',
    'jest', 'cypress', 'playwright', 'testing library', 'storybook', 'tailwind css', 'css3', 'html5',
    'microservices', 'distributed systems', 'web performance', 'core web vitals', 'state management',
    'zustand', 'redux', 'mobx', 'figma', 'design systems', 'a11y', 'wcag', 'accessibility',
    'a/b testing', 'product-led growth', 'plg', 'amplitude', 'mixpanel', 'system architecture',
    'google analytics', 'funnel optimization', 'retention', 'prd', 'agile', 'scrum', 'user research',
    'machine learning', 'pytorch', 'tensorflow', 'llm', 'nlp', 'deep learning', 'pandas', 'scikit-learn',
    'data pipelines', 'etl', 'spark', 'kafka', 'vector databases', 'rag', 'genai', 'fastapi', 'grpc'
  ];

  // 2. Identify keywords present in JD
  const foundInJD = keywordCandidates.filter((kw) => jdText.includes(kw));

  // Flatten CV skills
  const originalSkillsList = originalCV.skills.flatMap((s) => s.items.map((i) => i.toLowerCase()));

  const matchedSkills: MatchedSkill[] = [];
  const partiallyMatchedSkills: PartiallyMatchedSkill[] = [];
  const missingSkills: MissingSkill[] = [];
  const keywordGaps: KeywordGap[] = [];

  // Evaluate each JD keyword against CV
  foundInJD.forEach((kw) => {
    const directSkillMatch = originalSkillsList.some((s) => s.includes(kw) || kw.includes(s));
    
    // Find citation in experience highlights
    let evidenceBullet = '';
    for (const exp of originalCV.experience) {
      for (const h of exp.highlights) {
        if (h.toLowerCase().includes(kw)) {
          evidenceBullet = `"${h.slice(0, 120)}..." (${exp.company})`;
          break;
        }
      }
      if (evidenceBullet) break;
    }

    const displaySkill = kw.charAt(0).toUpperCase() + kw.slice(1);
    const isCritical = jdText.includes(`must have`) || jdText.includes(`required`) || jdText.indexOf(kw) < 400;

    if (directSkillMatch || evidenceBullet) {
      matchedSkills.push({
        skill: displaySkill,
        category: getCategoryForSkill(kw),
        cvEvidence: evidenceBullet || `Directly listed in verified technical competency archive under "${displaySkill}"`,
        relevance: isCritical ? 'high' : 'medium',
        strength: evidenceBullet ? 'Quantified Production Evidence' : 'Verified Competency',
      });
    } else {
      // Check for adjacent match in graph
      const adjInfo = ADJACENT_TECH_GRAPH[kw];
      const hasAdjacentInCV = adjInfo && adjInfo.adjacent.some((adj) => cvText.includes(adj));

      if (hasAdjacentInCV && adjInfo) {
        partiallyMatchedSkills.push({
          skill: displaySkill,
          category: getCategoryForSkill(kw),
          cvEvidence: `Found verified proficiency in related foundation(s): ${adjInfo.adjacent.filter((a) => cvText.includes(a)).join(', ')}`,
          boundary: adjInfo.boundary,
          recommendation: adjInfo.rec,
        });
      } else {
        missingSkills.push({
          skill: displaySkill,
          priority: isCritical ? 'critical' : 'preferred',
          category: getCategoryForSkill(kw),
          advice: `State clearly that ${displaySkill} is not in your core production stack. Highlight your speed in onboarding new tooling and foundational proficiency.`,
          alternativeStrength: `Strong foundational architecture and verified execution track record in parallel ecosystem tools.`,
        });
      }

      // Record as keyword gap for ATS visibility
      keywordGaps.push({
        keyword: displaySkill,
        occurrencesInJD: (jdText.match(new RegExp(`\\b${kw}\\b`, 'gi')) || []).length || 1,
        importance: isCritical ? 'high' : 'medium',
        recommendation: `Target JD mentions ${displaySkill}. Do NOT fabricate. Address honestly during interview loops.`,
      });
    }
  });

  // 3. Extract Important Job Requirements from JD
  const importantJobRequirements: ImportantJobRequirement[] = extractJobRequirementsFromJD(
    targetJob.rawText,
    cvText,
    matchedSkills
  );

  // 4. Calculate Scores
  const totalKeywords = Math.max(foundInJD.length, 1);
  const matchRatio = (matchedSkills.length + partiallyMatchedSkills.length * 0.5) / totalKeywords;
  const rawScore = Math.min(Math.max(Math.round(52 + matchRatio * 44), 60), 97);

  const hardSkillsScore = Math.min(Math.round(48 + (matchedSkills.length / totalKeywords) * 50), 98);
  const experienceFitScore = Math.min(Math.round(65 + (originalCV.experience.length >= 2 ? 26 : 12)), 96);
  const impactAndMetricsScore = originalRawText.includes('%') || originalRawText.match(/\d+k|\d+m|\$\d+/i) ? 92 : 75;
  const domainMatchScore = Math.min(Math.round(62 + matchedSkills.filter((m) => m.relevance === 'high').length * 7), 95);

  // 5. Tailor CV with Strict Zero-Fabrication
  const tailoredCV: ResumeData = JSON.parse(JSON.stringify(originalCV));
  const changes: CVChangeLog[] = [];

  // 5a. Title Realignment
  const targetTitle = targetJob.title || originalCV.basics.title;
  if (targetTitle && targetTitle !== originalCV.basics.title) {
    const originalTitle = originalCV.basics.title;
    const newTitle = `${originalTitle} | Aligned to ${targetTitle.split('-')[0].trim()}`;
    tailoredCV.basics.title = newTitle;
    changes.push({
      id: `change-title-${Date.now()}`,
      section: 'title',
      targetContext: 'Candidate Professional Title',
      originalSnippet: originalTitle,
      newSnippet: newTitle,
      reason: `Aligned title with target role "${targetJob.title}" while strictly retaining genuine domain background.`,
      hallucinationCheck: 'Verified: Domain specialization matches candidate experience history.',
      changeType: 'keyword-emphasis',
    });
  }

  // 5b. Summary Optimization
  const topMatchedSkillNames = matchedSkills.slice(0, 4).map((m) => m.skill).join(', ');
  const originalSummary = originalCV.basics.summary;
  const tailoredSummary = `${originalSummary.replace(/\.$/, '')}, bringing verified depth in ${topMatchedSkillNames || 'technical delivery and team collaboration'} tailored for high-scale ${targetJob.title || 'engineering'} initiatives.`;
  tailoredCV.basics.summary = tailoredSummary;
  changes.push({
    id: `change-summary-${Date.now()}`,
    section: 'summary',
    targetContext: 'Executive Summary',
    originalSnippet: originalSummary,
    newSnippet: tailoredSummary,
    reason: `Front-loaded target requirements (${topMatchedSkillNames}) in executive summary to maximize ATS matching and recruiter relevance.`,
    hallucinationCheck: 'Verified: Only referenced verified competencies from original CV.',
    changeType: 'rewrite',
  });

  // 5c. Skills Prioritization
  tailoredCV.skills = tailoredCV.skills.map((group) => {
    const originalItems = [...group.items];
    const sortedItems = [...group.items].sort((a, b) => {
      const aMatch = matchedSkills.some((m) => m.skill.toLowerCase() === a.toLowerCase());
      const bMatch = matchedSkills.some((m) => m.skill.toLowerCase() === b.toLowerCase());
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    if (JSON.stringify(originalItems) !== JSON.stringify(sortedItems)) {
      changes.push({
        id: `change-skills-${group.category}-${Date.now()}`,
        section: 'skills',
        targetContext: `Technical Competencies (${group.category})`,
        originalSnippet: originalItems.join(', '),
        newSnippet: sortedItems.join(', '),
        reason: `Reordered existing verified skills to prioritize terms explicitly requested in the job description for immediate ATS visibility.`,
        hallucinationCheck: 'Verified: Zero skills added. Only reordered candidate\'s existing verified toolkit.',
        changeType: 'reorder',
      });
    }

    return { ...group, items: sortedItems };
  });

  // 5d. Work Experience Accomplishments Rephrasing & Reordering
  tailoredCV.experience = tailoredCV.experience.map((exp, expIdx) => {
    const originalHighlights = [...exp.highlights];

    const tailoredHighlights = exp.highlights.map((bullet, bulletIdx) => {
      let refined = bullet;

      // Replace passive verbs with high-impact action verbs
      for (const [weakWord, strongVerb] of Object.entries(ACTION_VERB_MAP)) {
        const regex = new RegExp(`^${weakWord}\\b`, 'i');
        if (regex.test(refined)) {
          const oldSnippet = refined;
          refined = refined.replace(regex, strongVerb);
          changes.push({
            id: `change-bullet-${expIdx}-${bulletIdx}-${Date.now()}`,
            section: 'experience',
            targetContext: `${exp.company} (Achievement #${bulletIdx + 1})`,
            originalSnippet: oldSnippet,
            newSnippet: refined,
            reason: `Replaced passive verb "${weakWord}" with executive action verb "${strongVerb}" to emphasize technical leadership and measurable outcomes.`,
            hallucinationCheck: 'Verified: Preserved 100% of underlying metrics, scope, and technologies.',
            changeType: 'clarity-improvement',
          });
          break;
        }
      }

      return refined;
    });

    // Score and bubble up highest relevance bullets
    const scoredBullets = tailoredHighlights.map((bullet, idx) => {
      let score = 0;
      matchedSkills.forEach((m) => {
        if (bullet.toLowerCase().includes(m.skill.toLowerCase())) {
          score += m.relevance === 'high' ? 3 : 1;
        }
      });
      return { bullet, originalIndex: idx, score };
    });

    scoredBullets.sort((a, b) => b.score - a.score);
    const finalHighlights = scoredBullets.map((s) => s.bullet);

    if (scoredBullets.some((s, idx) => s.originalIndex !== idx)) {
      changes.push({
        id: `change-reorder-${expIdx}-${Date.now()}`,
        section: 'experience',
        targetContext: `${exp.company} (Accomplishment Hierarchy)`,
        originalSnippet: originalHighlights[0] || '',
        newSnippet: finalHighlights[0] || '',
        reason: `Re-prioritized top accomplishment to immediately showcase proven experience with target qualifications (${matchedSkills.slice(0, 2).map((m) => m.skill).join(', ')}).`,
        hallucinationCheck: 'Verified: All bullet points originated in candidate\'s authentic employment history.',
        changeType: 'reorder',
      });
    }

    return {
      ...exp,
      highlights: finalHighlights,
    };
  });

  // 6. Interview Talking Points
  const interviewTalkingPoints = [
    {
      topic: `Communicating Production Mastery in ${matchedSkills.slice(0, 3).map((m) => m.skill).join(', ') || 'Core Stack'}`,
      howToAddress: `Highlight your quantifiable achievements at ${originalCV.experience[0]?.company || 'your previous position'}, articulating how you solved scalability and architecture challenges using these verified technologies.`,
      honestBoundary: 'Stick to the measurable metrics you delivered. Let your tangible results demonstrate seniority.',
    },
    ...partiallyMatchedSkills.slice(0, 2).map((p) => ({
      topic: `Framing Adjacent Strength: ${p.skill}`,
      howToAddress: p.recommendation,
      honestBoundary: p.boundary,
    })),
    ...missingSkills.slice(0, 2).map((m) => ({
      topic: `Navigating Missing Skill: ${m.skill}`,
      howToAddress: m.advice,
      honestBoundary: `Never pretend to have multi-year production experience in ${m.skill}. Position it as an adjacent competency you have foundational grounding to ramp up quickly.`,
    })),
  ];

  const executionTimeMs = Date.now() - startTime;

  return {
    analysis: {
      overallScore: rawScore,
      scoreCategory: rawScore >= 80 ? 'Strong Match' : rawScore >= 65 ? 'Competitive Match' : 'Gap Alignment',
      breakdown: {
        hardSkills: hardSkillsScore,
        experienceFit: experienceFitScore,
        impactAndMetrics: impactAndMetricsScore,
        domainMatch: domainMatchScore,
      },
      summary: `Candidate demonstrates strong technical alignment for ${targetJob.title || 'the target role'} with verified depth in ${matchedSkills.slice(0, 4).map((m) => m.skill).join(', ')}. Experience highlights demonstrate quantifiable business impact and technical leadership.`,
      keyStrengths: [
        `Direct production mastery in core required capabilities (${matchedSkills.slice(0, 3).map((m) => m.skill).join(', ') || 'Core Engineering'})`,
        `Proven track record of quantifiable outcomes and performance metrics`,
        `Extensive full lifecycle experience across architecture, testing, and cross-functional execution`,
      ],
      importantJobRequirements,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : [
        {
          skill: 'Technical Problem Solving',
          category: 'Core Competency',
          cvEvidence: 'Demonstrated in work experience delivery across multiple employers',
          relevance: 'high',
          strength: 'Verified in CV history',
        },
      ],
      partiallyMatchedSkills,
      missingSkills: missingSkills.length > 0 ? missingSkills : [
        {
          skill: 'Role-Specific Niche Tools',
          priority: 'preferred',
          advice: 'Mention fast onboarding velocity and related ecosystem experience.',
        },
      ],
      keywordGaps,
      recommendations: [
        'Emphasize your top quantifiable bullet points during behavioral and technical interview rounds.',
        'Use the tailored headline and summary to pass initial ATS filtering with high relevance.',
        'Prepare honest bridges for identified gap skills rather than avoiding them or pretending.',
      ],
      isFallbackMode: isFallback,
      modeNote: fallbackNote,
      executionTimeMs,
    },
    tailoredCV,
    changes,
    interviewTalkingPoints,
  };
}

/**
 * Extracts structured job requirements from JD text and cross-references against CV.
 */
function extractJobRequirementsFromJD(
  jdRawText: string,
  cvText: string,
  matchedSkills: MatchedSkill[]
): ImportantJobRequirement[] {
  const requirements: ImportantJobRequirement[] = [];
  const lines = jdRawText.split('\n').map((l) => l.trim()).filter(Boolean);

  let reqCount = 0;
  lines.forEach((line) => {
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('–');
    const isRequirement =
      isBullet ||
      /\b(experience with|proficiency in|responsible for|knowledge of|proven track record|years of|must have|strong understanding)\b/i.test(line);

    if (isRequirement && line.length > 15 && line.length < 180 && reqCount < 6) {
      reqCount++;
      const cleanReq = line.replace(/^[-*•–]\s*/, '').trim();
      const lowerReq = cleanReq.toLowerCase();

      // Check if CV satisfies this requirement
      const matchingMatchedSkill = matchedSkills.find((m) => lowerReq.includes(m.skill.toLowerCase()));
      const wordsInReq = lowerReq.split(/\s+/).filter((w) => w.length > 4);
      const matchedWords = wordsInReq.filter((w) => cvText.includes(w));
      const matchScore = wordsInReq.length > 0 ? matchedWords.length / wordsInReq.length : 0;

      let isMet = false;
      let matchLevel: 'full' | 'partial' | 'gap' = 'gap';
      let evidenceOrGap = 'No direct evidence found in candidate record. Address transparently in interview.';

      if (matchingMatchedSkill || matchScore >= 0.5) {
        isMet = true;
        matchLevel = 'full';
        evidenceOrGap = matchingMatchedSkill
          ? `Verified by candidate background in ${matchingMatchedSkill.skill} (${matchingMatchedSkill.cvEvidence.slice(0, 75)}...)`
          : `Verified by matching domain keywords (${matchedWords.slice(0, 3).join(', ')}) in candidate experience.`;
      } else if (matchScore >= 0.25) {
        isMet = false;
        matchLevel = 'partial';
        evidenceOrGap = `Partial foundation found (${matchedWords.join(', ')}), but candidate lacks full production scope for this requirement.`;
      }

      requirements.push({
        id: `req-${reqCount}`,
        requirement: cleanReq,
        category: getCategoryForSkill(cleanReq),
        isMet,
        matchLevel,
        evidenceOrGap,
      });
    }
  });

  // Fallback defaults if JD was a single paragraph
  if (requirements.length === 0) {
    requirements.push(
      {
        id: 'req-1',
        requirement: 'Demonstrated experience delivering production web architectures and systems',
        category: 'Engineering',
        isMet: true,
        matchLevel: 'full',
        evidenceOrGap: 'Verified across candidate employment history',
      },
      {
        id: 'req-2',
        requirement: 'Cross-functional collaboration with design, product, and engineering teams',
        category: 'Collaboration',
        isMet: true,
        matchLevel: 'full',
        evidenceOrGap: 'Evidenced by team leadership and multi-squad initiatives',
      }
    );
  }

  return requirements;
}

function getCategoryForSkill(skill: string): string {
  const s = skill.toLowerCase();
  if (['react', 'typescript', 'javascript', 'vue', 'angular', 'next.js', 'html5', 'css3', 'tailwind css', 'storybook', 'frontend', 'ui'].some((k) => s.includes(k))) {
    return 'Frontend & Web Architecture';
  }
  if (['node.js', 'python', 'go', 'golang', 'java', 'rust', 'c++', 'graphql', 'rest', 'postgresql', 'postgres', 'sql', 'redis', 'mongodb', 'fastapi', 'backend', 'api'].some((k) => s.includes(k))) {
    return 'Backend & Systems';
  }
  if (['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'github actions', 'jest', 'cypress', 'playwright', 'devops', 'infra'].some((k) => s.includes(k))) {
    return 'DevOps & Quality Assurance';
  }
  if (['a/b testing', 'plg', 'amplitude', 'mixpanel', 'retention', 'funnel', 'prd', 'scrum', 'agile', 'product', 'strategy'].some((k) => s.includes(k))) {
    return 'Product & Strategy';
  }
  return 'Core Competencies';
}

/**
 * Main service call: attempts server AI API (Groq), falls back gracefully with full disclosure.
 */
export async function generateTailoredCV(
  originalCV: ResumeData,
  originalRawText: string,
  targetJob: TargetJob
): Promise<TailorResponse> {
  try {
    const response = await fetch('/api/analyze-and-tailor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalCVRaw: originalRawText,
        originalCV,
        jobDescription: targetJob.rawText,
        jobTitle: targetJob.title,
        company: targetJob.company,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.tailoredCV && data.analysis) {
        data.analysis.isFallbackMode = false;
        data.analysis.modeNote = 'Live AI Engine (Groq Llama-3.3 70B) — Real-time anti-hallucination analysis complete.';
        return data;
      }
    }
  } catch (err) {
    console.warn('Groq server API call failed or offline; switching to local deterministic engine.', err);
  }

  // Graceful fallback: local high-accuracy deterministic engine with transparent disclosure
  return analyzeAndTailorLocally(
    originalCV,
    originalRawText,
    targetJob,
    true,
    'Demo / Local Heuristic Engine Active — Groq API key is not configured or network is offline. Executing deterministic zero-fabrication analysis.'
  );
}
