// ─────────────────────────────────────────────────────────────────
//  PROFILE.JS — Edit everything here. All pages pull from this file.
// ─────────────────────────────────────────────────────────────────

export const meta = {
  name: 'Srinjoy Ghose',
  // Hero screen tagline (three parts separated by ·)
  tagline: ['Wharton', 'Neuroscience'],
  // Short bio shown in nav/about hero
  heroBio: 'Roy and Diana Vagelos Scholar at the University of Pennsylvania — Wharton Economics and Biological Mathematics. Working at the intersection of biomedical engineering, computational biology, and capital markets.',
  // Two paragraphs shown on the home page About section
  homeBio: [
    "LSM student at UPenn studying Finance and Statistics at Wharton and Neuroscience",
    "I want to cure disease, I study ways to make processes of curing disease more streamlined, and how curing disease can be fundraised in complex international markets",
  ],
  // Home page contact blurb
  contactBlurb: 'Love to talk, feel free to reach out!',
  // Below-hero statement section
  location: 'Based in the Hong Kong SAR this summer.',
  homeStatement: 'Studying global markets of science and challenging the status quo on what it means to truly commercialize saving lives.',
  homePersonal: 'I love to stay fit, travel, and meet people.',
};

export const contact = {
  email: 'srinnghose@gmail.com',
  linkedin: 'https://linkedin.com/in/SrinjoyGhose',
};

export const experience = [
  {
    role: 'Investment Analyst',
    org: 'Balyasny Asset Management L.P.',
    period: 'March 2026 – Present',
    bullets: [
      "Member of BAM's inaugural cohort of first-year intercollegiate investors managing a selected $100k portfolio",
      'Fundamental equity research in the healthcare pod and vertical software pod — long/short theses weekly via DCF/comps, macro analysis, and scientific drug channel checks',
    ],
  },
  {
    role: 'Financial Analyst',
    org: 'AfterQuery (YC W25)',
    period: 'April – May 2025',
    bullets: [
      'Created 50+ original financial analysis QA frameworks from company 10-Ks to evaluate LLM capabilities under non-detectable constraints',
      'Applied ratio analysis, scenario projections, and unit economics for public companies',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    org: 'MiNiMedicine Biomedical Engineering Lab',
    period: 'August 2023 – May 2025',
    bullets: [
      'Founded and led development of a customizable stem cell bioreactor using mechanical and chemical stimuli',
      'Engineered an organ-on-a-chip model replicating the human optic nerve head for glaucoma and neurodegeneration research',
      'Built an ML framework reducing immunofluorescence imaging noise by 75% for alignment analysis',
    ],
  },
];

export const education = [
  {
    school: 'University of Pennsylvania',
    degree: 'BS Economics (Wharton) · BA Biological Mathematics (CAS)',
    detail: 'Roy and Diana Vagelos Scholar of Life Sciences and Management',
    year: 'May 2029',
  },
  {
    school: 'Texas Academy of Mathematics and Science',
    degree: 'High School Diploma · GPA 4.0',
    detail: 'Biomedical Engineering, Calculus 1–3, Computational Chemistry, Organic Chemistry 1–2',
    year: 'May 2025',
  },
];

export const leadership = [
  {
    role: 'Consultant Project Lead',
    org: 'Penn Undergraduate Biotechnology Society',
    period: 'Aug 2025 – Present',
    detail: 'Leading 6 junior consultants on pro-bono healthcare client engagements. Spearheaded tech differentiation assessment for a $2.4B mRNA pharma acquisition; built quantitative threat-assessment and deal benchmarking frameworks.',
  },
  {
    role: 'Venture Capital Analyst',
    org: 'Center City Ventures × Wharton Entrepreneurship Club',
    period: 'Aug 2025 – Present',
    detail: 'End-to-end due diligence on early-stage Philly and Penn startups, distributing $25,000 of non-dilutive funding.',
  },
  {
    role: 'Texas Director of Fundraising & Development',
    org: 'Civic Leaders of America',
    period: 'June 2024 – May 2025',
    detail: 'Managed financial distribution across 20+ TX chapters. Secured $18,000 in sponsorship for the North Texas Convention.',
  },
];

export const awards = [
  {
    title: 'Wharton Research and Assistantship Program, Scholar',
    detail: '$6,500 award to conduct research on drug policy, Chinese medicine markets, and biotech IPO in Hong Kong SAR.',
    date: 'February 2026',
  },
  {
    title: 'WITG × Point72 Case Competition, Finalist',
    detail: 'Finalists out of ~750 national undergraduate submissions. Built and defended a full DCF + thesis model for an EV company before Point72 NYC Analysts.',
    date: 'November 2025',
  },
];

export const currently = [
  { key: 'at', value: 'University of Pennsylvania — Vagelos Program, freshman year' },
  { key: 'working on', value: 'Organ-on-a-chip optic nerve model · BAM equity research' },
  { key: 'thinking about', value: 'How designed proteins move from in silico to market' },
];

export const hero = {
  // Protein shown in the hero background
  proteinPDB: '1QYS',
  proteinName: 'Top7',
  proteinCaption: 'The first protein ever built from pure math. Baker Lab, Science, 2003.',
  // Resting heart rate — controls action potential BPM
  bpm: 54,
};
