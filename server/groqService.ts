import dotenv from 'dotenv';

dotenv.config();

export async function analyzeAndTailorWithGroq(originalCVText: string, jobDescriptionText: string) {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server. Fallback to local heuristic engine.');
  }

  const systemInstruction = `You are RoleFit, an elite AI career architect, ATS resume strategist, and strict zero-fabrication auditor.

YOUR CORE PRIME DIRECTIVE & ANTI-HALLUCINATION POLICY:
1. NEVER INVENT, EXAGGERATE, OR FABRICATE any experience, job titles, companies, dates, skills, metrics, certifications, or technologies not grounded in the candidate's original CV.
2. If a requirement or keyword in the job description is absent from the candidate's CV, DO NOT ADD IT to the tailored CV. Instead, list it in "missingSkills", "partiallyMatchedSkills", or "keywordGaps" with honest interview framing advice.
3. You may:
   - Rephrase weak or passive bullet points using strong action verbs and Google XYZ format (Accomplished [X] measured by [Y] by doing [Z]).
   - Reorder bullet points within existing job history to prioritize accomplishments most relevant to the target role.
   - Naturally emphasize matching terminology ONLY when the candidate's existing work already supports it.
   - De-emphasize or streamline irrelevant points.
   - Maintain the candidate's actual seniority level.
4. Provide an itemized "What changed?" list with:
   - section, targetContext, originalSnippet, newSnippet, reason, hallucinationCheck ("Verified 100% in original CV"), changeType ('rewrite' | 'reorder' | 'keyword-emphasis' | 'clarity-improvement' | 'de-emphasis').
5. Output ONLY strict JSON matching the schema below without any markdown fences or exterior commentary.`;

  const userPrompt = `ORIGINAL CANDIDATE CV:
"""
${originalCVText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescriptionText}
"""

Analyze the candidate's fit and tailor their CV adhering strictly to zero fabrication.
Return ONLY this JSON object structure:

{
  "analysis": {
    "overallScore": 88,
    "scoreCategory": "Strong Match",
    "breakdown": {
      "hardSkills": 85,
      "experienceFit": 90,
      "impactAndMetrics": 88,
      "domainMatch": 84
    },
    "summary": "2-3 sentence overview of candidate match against JD requirements.",
    "keyStrengths": [
      "Verified strength 1 with proof",
      "Verified strength 2 with proof",
      "Verified strength 3 with proof"
    ],
    "importantJobRequirements": [
      {
        "id": "req-1",
        "requirement": "5+ years building React/TypeScript production web apps",
        "category": "Core Engineering",
        "isMet": true,
        "matchLevel": "full",
        "evidenceOrGap": "Directly demonstrated across 6+ years at Company X and Y"
      },
      {
        "id": "req-2",
        "requirement": "Deep experience with Kubernetes orchestration",
        "category": "Infrastructure",
        "isMet": false,
        "matchLevel": "partial",
        "evidenceOrGap": "Candidate has Docker containerization experience, but lacks multi-cluster K8s production evidence"
      }
    ],
    "matchedSkills": [
      {
        "skill": "TypeScript",
        "category": "Frontend & Architecture",
        "cvEvidence": "Architected component library in TypeScript used by 14 squads",
        "relevance": "high",
        "strength": "Production mastery"
      }
    ],
    "partiallyMatchedSkills": [
      {
        "skill": "GraphQL",
        "category": "API Design",
        "cvEvidence": "Consumed complex GraphQL APIs at Company X",
        "boundary": "Candidate has client-side schema consumption; lacks backend GraphQL schema design",
        "recommendation": "Emphasize client query optimization and Apollo Client caching mastery"
      }
    ],
    "missingSkills": [
      {
        "skill": "Go / Golang",
        "priority": "preferred",
        "category": "Backend Systems",
        "advice": "Be upfront: cite strong Python/Node backend foundations and rapid language onboarding ability.",
        "alternativeStrength": "Deep proficiency in asynchronous Node.js and Python microservices"
      }
    ],
    "keywordGaps": [
      {
        "keyword": "gRPC",
        "occurrencesInJD": 3,
        "importance": "medium",
        "recommendation": "Not present in CV. Frame as adjacent protocol mastery during technical rounds."
      }
    ],
    "recommendations": [
      "Strategic application recommendation 1",
      "Strategic application recommendation 2",
      "Strategic application recommendation 3"
    ]
  },
  "tailoredCV": {
    "basics": {
      "name": "Candidate Name",
      "title": "Optimized Headline Aligned to Role",
      "email": "candidate@example.com",
      "phone": "+1 555-0100",
      "location": "City, State / Remote",
      "website": "",
      "linkedin": "",
      "github": "",
      "summary": "Targeted summary emphasizing authentic matching experience."
    },
    "skills": [
      {
        "category": "Core Competencies",
        "items": ["Skill 1", "Skill 2"]
      }
    ],
    "experience": [
      {
        "id": "exp-1",
        "company": "Company Name",
        "position": "Position Title",
        "location": "Location",
        "startDate": "2021",
        "endDate": "Present",
        "current": true,
        "highlights": [
          "Grounded, punchy bullet point rewritten using Google XYZ formula preserving 100% factual accuracy"
        ]
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "institution": "University",
        "area": "Major",
        "studyType": "B.S.",
        "startDate": "2015",
        "endDate": "2019",
        "highlights": []
      }
    ],
    "projects": [],
    "certifications": []
  },
  "changes": [
    {
      "id": "change-1",
      "section": "summary",
      "targetContext": "Executive Summary",
      "originalSnippet": "Original text snippet",
      "newSnippet": "Tailored text snippet",
      "reason": "Re-centered summary around high-relevance qualifications while strictly preserving authenticity",
      "hallucinationCheck": "Confirmed 100% factually grounded in original CV",
      "changeType": "rewrite"
    }
  ],
  "interviewTalkingPoints": [
    {
      "topic": "Topic or Skill discussion",
      "howToAddress": "How candidate should articulate their authentic experience",
      "honestBoundary": "Clear boundary on what to claim vs acknowledge as adjacent"
    }
  ]
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.15,
      max_tokens: 6500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API Error Response:', response.status, errorText);
    throw new Error(`Groq API Error (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Groq returned an empty response.');
  }

  const parsed = JSON.parse(rawContent);

  if (!parsed.analysis || !parsed.tailoredCV) {
    throw new Error('Groq response missing required analysis or tailoredCV payload.');
  }

  if (!parsed.analysis.importantJobRequirements) parsed.analysis.importantJobRequirements = [];
  if (!parsed.analysis.partiallyMatchedSkills) parsed.analysis.partiallyMatchedSkills = [];
  if (!parsed.analysis.keywordGaps) parsed.analysis.keywordGaps = [];
  if (!parsed.changes) parsed.changes = [];
  if (!parsed.interviewTalkingPoints) parsed.interviewTalkingPoints = [];

  return parsed;
}
