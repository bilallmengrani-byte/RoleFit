import { ResumeData, TargetJob } from '../types/resume';

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  targetCompany: string;
  targetRole: string;
  originalCV: ResumeData;
  originalCVRaw: string;
  targetJob: TargetJob;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'frontend-lead',
    name: 'Alex Chen',
    role: 'Senior Full-Stack & Frontend Engineer',
    targetCompany: 'Linear & Scale AI',
    targetRole: 'Staff Frontend Engineer (React / TypeScript / High-Performance UI)',
    originalCV: {
      basics: {
        name: 'Alex Chen',
        title: 'Senior Full-Stack Software Engineer',
        email: 'alex.chen.dev@example.com',
        phone: '+1 (415) 555-0192',
        location: 'San Francisco, CA (Open to Remote)',
        linkedin: 'linkedin.com/in/alexchen-dev',
        github: 'github.com/alexchen-builds',
        website: 'alexchen.engineering',
        summary:
          'Software Engineer with 6+ years of full-stack web development experience building scalable web applications with React, TypeScript, Node.js, and PostgreSQL. Experienced with microservices, state management, and mentoring junior engineers.',
      },
      skills: [
        {
          category: 'Frontend & Architecture',
          items: ['React', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Zustand', 'HTML5/CSS3', 'Tailwind CSS', 'WebSockets', 'Webpack/Vite'],
        },
        {
          category: 'Backend & Databases',
          items: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'REST APIs', 'GraphQL', 'Prisma ORM'],
        },
        {
          category: 'DevOps & Quality',
          items: ['Docker', 'AWS (S3, ECS)', 'Jest', 'React Testing Library', 'Cypress', 'CI/CD (GitHub Actions)', 'Git'],
        },
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Nexus Cloud Platforms',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          endDate: 'Present',
          current: true,
          highlights: [
            'Built and maintained core SaaS dashboard web app using React, TypeScript, and Tailwind CSS serving 120,000 monthly active enterprise users.',
            'Redesigned the frontend state architecture by replacing bloated context providers with Zustand, reducing unnecessary component re-renders by 42% and improving First Input Delay (FID) to <45ms.',
            'Collaborated with backend engineers to define GraphQL schemas and migrated 18 legacy REST endpoints, improving dashboard data payload sizes by 35%.',
            'Implemented an internal design system component library with Storybook and automated accessibility (a11y) checks, adopted across 4 distributed engineering teams.',
            'Led bi-weekly code reviews and mentored 3 mid-level engineers in modern React patterns and TypeScript strict typing.',
          ],
        },
        {
          id: 'exp-2',
          company: 'Veloce Data Systems',
          position: 'Software Engineer',
          location: 'San Jose, CA',
          startDate: '2019-06',
          endDate: '2022-02',
          current: false,
          highlights: [
            'Developed full-stack data visualization tools using React, D3.js, Node.js, and PostgreSQL for real-time telemetry streaming.',
            'Built real-time collaboration canvas with WebSockets and Canvas API, supporting concurrent editing by up to 50 active operators.',
            'Wrote comprehensive unit and integration test suites using Jest and Cypress, elevating frontend test coverage from 48% to 86%.',
            'Configured Docker containers and GitHub Actions deployment pipelines for automated staging releases.',
          ],
        },
        {
          id: 'exp-3',
          company: 'Hyperion Interactive',
          position: 'Junior Web Developer',
          location: 'Oakland, CA',
          startDate: '2018-05',
          endDate: '2019-05',
          current: false,
          highlights: [
            'Created responsive customer-facing landing pages and e-commerce checkout flows using React and CSS Modules.',
            'Optimized client-side asset loading, images, and bundle splitting to achieve 90+ Google Lighthouse performance scores.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          area: 'Computer Science',
          studyType: 'B.S.',
          startDate: '2014',
          endDate: '2018',
          highlights: ['Focus on Distributed Systems and Human-Computer Interaction', 'Dean’s Honor List'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'CanvasFlow - Realtime Graph Editor',
          description: 'High-performance interactive node graph editor built with WebGL and React with 60fps rendering under 10k nodes.',
          highlights: ['Built custom virtualized viewport rendering', 'Open sourced on GitHub with 1.4k stars'],
          keywords: ['React', 'TypeScript', 'WebGL', 'Performance'],
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          date: '2023',
        },
      ],
    },
    originalCVRaw: `ALEX CHEN
San Francisco, CA | alex.chen.dev@example.com | +1 (415) 555-0192 | linkedin.com/in/alexchen-dev | github.com/alexchen-builds

SUMMARY
Software Engineer with 6+ years of full-stack web development experience building scalable web applications with React, TypeScript, Node.js, and PostgreSQL. Experienced with microservices, state management, and mentoring junior engineers.

TECHNICAL SKILLS
- Frontend & Architecture: React, TypeScript, Next.js, Redux Toolkit, Zustand, HTML5/CSS3, Tailwind CSS, WebSockets, Webpack/Vite
- Backend & Databases: Node.js, Express, PostgreSQL, Redis, REST APIs, GraphQL, Prisma ORM
- DevOps & Quality: Docker, AWS (S3, ECS), Jest, React Testing Library, Cypress, CI/CD (GitHub Actions), Git

EXPERIENCE
Nexus Cloud Platforms — Senior Software Engineer
March 2022 – Present | San Francisco, CA
- Built and maintained core SaaS dashboard web app using React, TypeScript, and Tailwind CSS serving 120,000 monthly active enterprise users.
- Redesigned the frontend state architecture by replacing bloated context providers with Zustand, reducing unnecessary component re-renders by 42% and improving First Input Delay (FID) to <45ms.
- Collaborated with backend engineers to define GraphQL schemas and migrated 18 legacy REST endpoints, improving dashboard data payload sizes by 35%.
- Implemented an internal design system component library with Storybook and automated accessibility (a11y) checks, adopted across 4 distributed engineering teams.
- Led bi-weekly code reviews and mentored 3 mid-level engineers in modern React patterns and TypeScript strict typing.

Veloce Data Systems — Software Engineer
June 2019 – February 2022 | San Jose, CA
- Developed full-stack data visualization tools using React, D3.js, Node.js, and PostgreSQL for real-time telemetry streaming.
- Built real-time collaboration canvas with WebSockets and Canvas API, supporting concurrent editing by up to 50 active operators.
- Wrote comprehensive unit and integration test suites using Jest and Cypress, elevating frontend test coverage from 48% to 86%.
- Configured Docker containers and GitHub Actions deployment pipelines for automated staging releases.

Hyperion Interactive — Junior Web Developer
May 2018 – May 2019 | Oakland, CA
- Created responsive customer-facing landing pages and e-commerce checkout flows using React and CSS Modules.
- Optimized client-side asset loading, images, and bundle splitting to achieve 90+ Google Lighthouse performance scores.

EDUCATION
University of California, Berkeley — B.S. in Computer Science (2014 – 2018)

CERTIFICATIONS
AWS Certified Solutions Architect – Associate (2023)`,
    targetJob: {
      title: 'Staff Frontend Engineer - Web Performance & Design Systems',
      company: 'ScaleStack Technologies',
      location: 'San Francisco, CA / Remote',
      rawText: `ScaleStack Technologies is hiring a Staff Frontend Engineer to lead architecture across our web platform and core design system.

About the Role:
We are looking for a deeply experienced Frontend Engineer who cares obsessively about UI performance, snappy interaction design, and robust TypeScript engineering. You will own our mission-critical web application used daily by Fortune 500 teams, as well as lead our cross-team design systems initiatives.

Responsibilities:
- Architect, build, and optimize high-throughput, low-latency web interfaces using React, TypeScript, and modern state architectures.
- Drive web performance optimization across Core Web Vitals (LCP, INP, CLS) and real-time interactive canvas surfaces.
- Elevate and scale our centralized design system component library, ensuring strict WCAG 2.1 AA accessibility and cross-browser consistency.
- Champion frontend best practices, strict typing, automated testing (Jest, Playwright/Cypress), and developer velocity.
- Partner with Product and Design to translate complex collaborative workflows into intuitive, lightning-fast UI.

Required Qualifications:
- 5+ years of production experience with modern React, TypeScript, and frontend performance tuning.
- Proven track record architecting modular design systems and reusable component libraries (Storybook, a11y, semantic HTML).
- Deep knowledge of modern state management (Zustand, Redux, or similar) and client-side data caching strategies (GraphQL / React Query).
- Experience with real-time UI data streaming (WebSockets or WebRTC).
- Strong empathy for developer tooling, CI/CD, and code quality.

Nice to Have:
- Experience with WebAssembly (WASM) or Rust for client-side compute.
- Production experience with Playwright end-to-end testing frameworks.
- Prior experience leading frontend architecture reviews at scale.`,
    },
  },
  {
    id: 'product-manager',
    name: 'Elena Rostova',
    role: 'Senior Product Manager',
    targetCompany: 'FinPulse Systems',
    targetRole: 'Lead Growth Product Manager (B2B SaaS & Onboarding)',
    originalCV: {
      basics: {
        name: 'Elena Rostova',
        title: 'Senior Product Manager',
        email: 'elena.rostova.pm@example.com',
        phone: '+1 (206) 555-4921',
        location: 'Seattle, WA',
        linkedin: 'linkedin.com/in/elena-rostova-pm',
        website: 'elenarostova.co',
        summary:
          'Data-driven Product Manager with 7 years of experience scaling B2B SaaS and consumer software products. Proven track record leading cross-functional teams of engineers, designers, and data scientists to launch revenue-generating features and optimize user funnels.',
      },
      skills: [
        {
          category: 'Product Strategy & Growth',
          items: ['A/B Testing', 'PLG (Product-Led Growth)', 'Customer Funnel Optimization', 'User Retention', 'Cohort Analysis', 'Pricing & Packaging'],
        },
        {
          category: 'Analytics & Technical',
          items: ['SQL', 'Amplitude', 'Mixpanel', 'Google Analytics 4', 'Tableau', 'Figma', 'Jira/Linear', 'REST API Basics'],
        },
        {
          category: 'Methodologies & Leadership',
          items: ['Agile / Scrum', 'Customer Discovery Interviews', 'PRD Writing', 'Go-To-Market (GTM) Planning', 'Cross-Functional Leadership'],
        },
      ],
      experience: [
        {
          id: 'exp-pm-1',
          company: 'Aura Cloud Analytics',
          position: 'Senior Product Manager, Activation & Growth',
          location: 'Seattle, WA',
          startDate: '2021-08',
          endDate: 'Present',
          current: true,
          highlights: [
            'Owned user onboarding and product-led growth initiatives for a B2B analytics platform with 45,000 monthly signups.',
            'Designed and executed 24 multivariate experiments across the self-serve signup and workspace setup funnel, lifting Day-7 activation from 22% to 36.4%.',
            'Spearheaded the introduction of interactive product tours and in-app milestone checklists, increasing free-to-paid conversion by 28% and generating $1.8M incremental ARR.',
            'Conducted 60+ customer discovery interviews and weekly usability testing sessions to synthesize customer friction points into prioritized roadmap PRDs.',
            'Collaborated closely with 8 engineers, 2 product designers, and 1 product data scientist using Agile sprints.',
          ],
        },
        {
          id: 'exp-pm-2',
          company: 'MetricForge',
          position: 'Product Manager',
          location: 'San Francisco, CA',
          startDate: '2018-04',
          endDate: '2021-07',
          current: false,
          highlights: [
            'Led the redesign of the enterprise billing, subscription management, and user permissions modules.',
            'Authored detailed user stories, PRDs, and acceptance criteria in Jira; managed bi-weekly backlog grooming and sprint reviews.',
            'Built custom SQL queries and Amplitude dashboards to analyze churn cohorts, identifying key drop-off triggers for enterprise accounts.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-pm-1',
          institution: 'University of Washington',
          area: 'Business Administration (Information Systems)',
          studyType: 'B.A.',
          startDate: '2013',
          endDate: '2017',
          highlights: ['Summa Cum Laude', 'President, Women in Tech & Product Association'],
        },
      ],
      projects: [],
      certifications: [
        {
          id: 'cert-pm-1',
          name: 'Reforge Growth Series & Retention Certification',
          issuer: 'Reforge',
          date: '2022',
        },
      ],
    },
    originalCVRaw: `ELENA ROSTOVA
Seattle, WA | elena.rostova.pm@example.com | +1 (206) 555-4921 | linkedin.com/in/elena-rostova-pm | elenarostova.co

SUMMARY
Data-driven Product Manager with 7 years of experience scaling B2B SaaS and consumer software products. Proven track record leading cross-functional teams of engineers, designers, and data scientists to launch revenue-generating features and optimize user funnels.

SKILLS
- Product Strategy & Growth: A/B Testing, PLG (Product-Led Growth), Customer Funnel Optimization, User Retention, Cohort Analysis, Pricing & Packaging
- Analytics & Technical: SQL, Amplitude, Mixpanel, Google Analytics 4, Tableau, Figma, Jira/Linear, REST API Basics
- Methodologies & Leadership: Agile / Scrum, Customer Discovery Interviews, PRD Writing, Go-To-Market (GTM) Planning, Cross-Functional Leadership

EXPERIENCE
Aura Cloud Analytics — Senior Product Manager, Activation & Growth
August 2021 – Present | Seattle, WA
- Owned user onboarding and product-led growth initiatives for a B2B analytics platform with 45,000 monthly signups.
- Designed and executed 24 multivariate experiments across the self-serve signup and workspace setup funnel, lifting Day-7 activation from 22% to 36.4%.
- Spearheaded the introduction of interactive product tours and in-app milestone checklists, increasing free-to-paid conversion by 28% and generating $1.8M incremental ARR.
- Conducted 60+ customer discovery interviews and weekly usability testing sessions to synthesize customer friction points into prioritized roadmap PRDs.
- Collaborated closely with 8 engineers, 2 product designers, and 1 product data scientist using Agile sprints.

MetricForge — Product Manager
April 2018 – July 2021 | San Francisco, CA
- Led the redesign of the enterprise billing, subscription management, and user permissions modules.
- Authored detailed user stories, PRDs, and acceptance criteria in Jira; managed bi-weekly backlog grooming and sprint reviews.
- Built custom SQL queries and Amplitude dashboards to analyze churn cohorts, identifying key drop-off triggers for enterprise accounts.

EDUCATION
University of Washington — B.A. in Business Administration (2013 – 2017)

CERTIFICATIONS
Reforge Growth Series & Retention Certification (2022)`,
    targetJob: {
      title: 'Lead Growth Product Manager - Onboarding & Monetization',
      company: 'FinPulse Systems',
      location: 'New York, NY / Remote',
      rawText: `FinPulse Systems is seeking a Lead Growth Product Manager to own our core activation, product-led monetization, and self-serve onboarding engine.

What You Will Do:
- Formulate growth strategy and quantitative experiment roadmaps to drive self-serve activation, trial-to-paid conversion, and Net Revenue Retention (NRR).
- Deeply analyze user lifecycle cohorts, churn drivers, and behavioral telemetry using SQL and Amplitude/Mixpanel.
- Lead a dedicated squad of frontend/backend engineers, designers, and growth marketers to execute rapid experimentation cycles.
- Run continuous user discovery, usability testing, and customer empathy interviews to discover onboarding frictions.
- Work with Executive leadership on pricing, tier packaging, and self-serve checkout optimizations.

Qualifications:
- 5+ years of dedicated Product Management experience with a clear focus on Product-Led Growth (PLG), experimentation, or self-serve onboarding.
- Proven track record executing statistically rigorous A/B and multivariate tests resulting in measurable ARR/conversion impact.
- High analytical fluency: Expert in SQL, cohort analysis, and funnel diagnostics (Amplitude, Mixpanel, or Tableau).
- Exceptional communication, PRD clarity, and cross-functional leadership skills.

Bonus Points:
- Experience in FinTech, payment processing, or compliance workflows.
- Formal training in Reforge Growth or Retention frameworks.`,
    },
  },
];
