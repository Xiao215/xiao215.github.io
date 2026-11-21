export const contactLinks = [
  { label: "GitHub", href: "https://github.com/Xiao215" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xiao215/" },
  {
    label: "Scholar",
    href: "https://scholar.google.com/citations?hl=en&user=_PvbotcAAAAJ",
  },
  { label: "Email", href: "mailto:zhxiao@cs.toronto.edu" },
];

export const resumes = [
  {
    name: "Software",
    slug: "software",
    href: "https://drive.google.com/file/d/1eOFepl2Mfsk5X1DANQqtrFkcyQktwZ9u/preview",
    viewHref: "https://drive.google.com/file/d/1eOFepl2Mfsk5X1DANQqtrFkcyQktwZ9u/view",
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    href: "https://drive.google.com/file/d/1pSJX5jQz3GYFS1BhL_RRn-rhOCGgFJW9/preview",
    viewHref: "https://drive.google.com/file/d/1pSJX5jQz3GYFS1BhL_RRn-rhOCGgFJW9/view",
  },
];

export const work = [
  {
    role: "Software Engineer",
    organization: "Google",
    date: "2025-Now",
  },
  {
    role: "Research Collaborator",
    organization: "Vector Institute",
    date: "2025-Now",
  },
  {
    role: "Software Engineer Intern",
    organization: "Google",
    date: "2024",
  },
  {
    role: "STEP Software Engineer Intern",
    organization: "Google",
    date: "2023",
  },
  {
    role: "Software Developer Intern",
    organization: "Royal Bank of Canada",
    date: "2022",
  },
  {
    role: "Software Developer Intern",
    organization: "Royal Bank of Canada",
    date: "2021",
  },
];

export const research = [
  {
    title:
      "CoopEval: Benchmarking Cooperation-Sustaining Mechanisms and LLM Agents in Social Dilemmas",
    authors:
      "Emanuel Tewolde, Xiao Zhang, David Guzman Piedrahita, Vincent Conitzer, Zhijing Jin",
    venue: "ICML 2026 Poster",
    detail: "arXiv:2604.15267",
    href: "https://arxiv.org/abs/2604.15267",
    pdfHref: "https://arxiv.org/pdf/2604.15267",
    codeHref: "https://github.com/Xiao215/CoopEval",
    tags: ["LLM agents", "Game theory", "Social dilemmas"],
    summary:
      "A benchmark and comparative study of mechanisms that help capable LLM agents sustain cooperation in mixed-motive games.",
  },
];

export const projects = [
  {
    name: "self.mp3",
    slug: "selfmp3",
    status: "Live",
    date: "2026",
    tagline: "An AI-native music app for a library that is actually yours.",
    image: {
      src: "/assets/projects/selfmp3-home.webp",
      width: 1440,
      height: 900,
      alt: "The self.mp3 desktop app: tag tiles, recently played albums and the player bar.",
    },
    summary:
      "Ask it in your own words to play something, dig up a song or put a playlist together \u2014 always from music you own, never a catalogue you rent. It runs on the web, iPhone, Android and Mac, and the phone and Mac apps keep playing with no signal.",
    links: [
      { label: "Open the app", href: "https://xiao215.github.io/selfmp3/" },
      { label: "Code", href: "https://github.com/Xiao215/selfmp3" },
      {
        label: "Docs",
        href: "https://github.com/Xiao215/selfmp3/blob/main/docs/README.md",
      },
      {
        label: "Get it on your phone",
        href: "https://xiao215.github.io/selfmp3/install/",
      },
    ],
  },
];
