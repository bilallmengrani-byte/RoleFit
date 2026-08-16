RoleFit

«Tailor your CV to the job without changing the truth.»

RoleFit is an AI powered CV tailoring tool that helps candidates adapt their existing CV to a specific job description while keeping their real experience intact.

Instead of simply generating a new resume, RoleFit analyzes the candidate's existing experience, compares it with the target role, identifies gaps, and explains every change made to the CV.

✨ Features

- CV Archive
  Add an existing CV as the verified source of candidate information.

- Target Job Analysis
  Paste a job description and extract important requirements, technical skills, seniority expectations, and ATS keywords.

- Fit Audit
  Get an overall job match score with separate breakdowns for skills, experience, impact, and domain alignment.

- Verified Skill Matching
  See which job requirements match the candidate's CV with direct evidence from the original CV.

- Gap Analysis
  Identify skills and requirements that are still missing from the candidate's experience.

- AI CV Tailoring
  Rewrite and reorganize existing CV content to make it more relevant to the target role.

- Change Tracking
  See the original version, tailored version, and the reason behind every optimization.

- Side-by-Side Review
  Compare the original and tailored CV before using the final version.

- CV Export
  Review and export the tailored CV for the application.

🛡️ Zero-Fabrication Approach

RoleFit is designed around one important rule:

The AI should never make the candidate more qualified than they actually are.

RoleFit does not intentionally invent:

- Jobs
- Employers
- Skills
- Projects
- Certifications
- Education
- Achievements
- Metrics
- Years of experience
- Responsibilities

Instead, it can reorganize, rewrite, shorten, or emphasize information that already exists in the original CV.

If a job requires a skill that is not supported by the candidate's CV, RoleFit identifies it as a gap instead of adding it.

🔄 How It Works

CV Archive
    ↓
Target Job
    ↓
Fit Audit
    ↓
Tailor & Diff
    ↓
Final CV

1. CV Archive

The original CV becomes the verified source of candidate information.

2. Target Dossier

The target job description is analyzed for relevant requirements and ATS signals.

3. Fit Audit

RoleFit compares the candidate's experience with the target role and generates a detailed match analysis.

4. Tailor & Diff

Relevant CV content is rewritten and prioritized while keeping the candidate's factual experience intact.

5. Dispatch

The candidate reviews the final CV, compares it with the original, and exports the tailored version.

🧠 AI

RoleFit uses Groq's API with "openai/gpt-oss-120b" for AI powered analysis and CV tailoring.

The application is designed to use structured AI responses so that match scores, skills, gaps, and CV changes can be presented consistently in the interface.

🎨 Design

RoleFit intentionally avoids the typical AI SaaS aesthetic.

The interface uses an editorial inspired visual system with:

- Serif display typography
- Monospace and technical UI elements
- Warm neutral backgrounds
- Strong black typography
- Restrained accent colors
- Thin borders
- Editorial layouts
- Clear five stage workflow

The goal was to make RoleFit feel more like a professional career publication and document tool than a generic AI dashboard.

🛠️ Built With

- React
- JavaScript
- CSS
- Groq API
- "openai/gpt-oss-120b"
- Google AI Studio

🚀 Getting Started

Prerequisites

Make sure you have:

- Node.js installed
- A Groq API key

Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/rolefit.git
cd rolefit

Install dependencies:

npm install

Create an environment file:

.env

Add your Groq API key:

GROQ_API_KEY=your_api_key_here

Start the development server:

npm run dev

The application should now be available locally.

🔐 Security

The Groq API key should always be stored as an environment variable or server-side secret.

Never commit your API key to GitHub.

Add your environment file to ".gitignore":

.env
.env.local

📱 Responsive Design

RoleFit is designed to work across desktop and mobile screen sizes.

The five-stage workflow adapts to smaller screens while keeping the CV analysis, comparison, and final document readable and usable.

🗺️ What's Next

Potential future improvements include:

- Multiple CV templates
- Improved PDF generation
- Cover letter generation
- LinkedIn profile optimization
- ATS compatibility analysis
- Skill-gap recommendations
- Job application tracking
- Interview preparation
- CV version history
- More detailed job-to-CV analytics

👤 Creator

Built independently as an AI powered career-tech project.

📄 License

This project is currently provided for demonstration and educational purposes.

demo: https://role-fit-alpha.vercel.app/