import type { PortfolioProject } from '@/types/game'

// ── Hero ──────────────────────────────────────────────────────────────────────
export const heroInfo = {
  name: 'Sushree Satapathy',
  title: 'Software Engineer',
  tagline: 'Building intelligent, scalable and impactful solutions.',
  level: 99,
  avatarEmoji: '⚔️',
  bio: [
    "Hi, I'm Sushree!",
    'Software Engineer',
    'Building intelligent, scalable and impactful solutions with Agentic AI, LLMs and modern web technologies.',
  ],
  location: 'Visakhapatnam, India',
  available: true,
  email: 'coolsushreesatapathy@gmail.com',
  github: 'https://github.com/sushi2012',
  linkedin: 'https://www.linkedin.com/in/sushree-s-918022242',
}

// ── Projects ──────────────────────────────────────────────────────────────────
export const projects: PortfolioProject[] = [
  {
    id: 'project-1',
    title: 'Trip Mate AI',
    description:
      'AI-powered travel planning assistant built with Python, FastAPI, and LangGraph. Uses a multi-stage agent workflow to automate travel research — flight info via AviationStack, hotel discovery via Tavily, and personalised day-by-day itineraries using Groq LLMs.',
    tech: ['Python', 'LangGraph', 'GroqAI', 'FastAPI'],
    github: 'https://github.com/sushi2012/tripmateai.git',
  },
  {
    id: 'project-2',
    title: 'Intelligent Document Engine',
    description:
      'RAG-based LangChain Documentation Assistant using LangGraph and Pinecone for semantic search and context-aware Q&A. Streamlit interface with Hugging Face model support.',
    tech: ['FastAPI', 'Pinecone', 'RAG', 'Streamlit'],
    github: 'https://github.com/sushi2012',
  },
  {
    id: 'project-3',
    title: 'AI Medical Receptionist',
    description:
      'AI dental receptionist using Python, FastAPI, LangGraph, Groq, and MongoDB. Agent with tool calling for FAQs, appointment booking, availability checks, and cancellations. RAG-based retrieval with session memory and safety guardrails.',
    tech: ['FastAPI', 'LangChain', 'Python', 'Docker'],
    github: 'https://github.com/sushi2012/AImedicalReceptionist.git',
    link: 'https://aimedicalreceptionist-1.onrender.com',
  },
]

// ── Skills ────────────────────────────────────────────────────────────────────
export interface SkillCategory {
  category: string
  icon: string
  skills: { name: string; level: number }[]  // level 1–5
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'AI & Machine Learning',
    icon: '🧠',
    skills: [
      { name: 'LLMs & Prompt Engineering', level: 5 },
      { name: 'Agentic AI / LangChain',    level: 5 },
      { name: 'RAG Pipelines',             level: 5 },
      { name: 'Vector Databases',          level: 4 },
    ],
  },
  {
    category: 'Backend & Frontend',
    icon: '⚙️',
    skills: [
      { name: 'React.js',              level: 4 },
      { name: 'Node.js / Python',      level: 5 },
      { name: 'REST APIs',             level: 5 },
      { name: 'PostgreSQL / MongoDB',  level: 4 },
      { name: 'Redis',                 level: 3 },
      { name: 'Microservices',         level: 4 },
    ],
  },
  {
    category: 'Cloud & DevOps',
    icon: '☁️',
    skills: [
      { name: 'Docker / Kubernetes', level: 4 },
      { name: 'CI/CD Pipelines',     level: 4 },
    ],
  },
]

// ── Experience ────────────────────────────────────────────────────────────────
export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  current: boolean
  bullets: string[]
}

export const experience: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Software Engineer',
    company: 'Technosoft Solutions, Visakhapatnam',
    period: 'February 2024 – April 2026',
    current: false,
    bullets: [
      'Migrated legacy C++ desktop applications to Python, improving maintainability.',
      'Built a real-time MERN chat app with JWT auth, Socket.IO, and Cloudinary.',
      'Developed an AI Medical Assistant chatbot using LangChain, RAG, and LLM APIs.',
      'Gained hands-on experience with Agentic AI, RAG pipelines, and vector databases.',
    ],
  },
  {
    id: 'exp-2',
    role: 'Lecturer, Computer Science',
    company: 'Gandhi Engineering College',
    period: 'September 2023 – February 2024',
    current: false,
    bullets: [
      'Taught C, C++, Python, and embedded systems through lectures and workshops.',
    ],
  },
  {
    id: 'exp-3',
    role: 'Trainee Support',
    company: 'Tech Mahindra, Bangalore',
    period: 'February 2023 – May 2023',
    current: false,
    bullets: [
      'Built a food spoilage detection project using Arduino Uno and MQ-4 gas sensor.',
    ],
  },
]

// ── Legacy flat skills list ───────────────────────────────────────────────────
export const skills = skillCategories.flatMap(c => c.skills.map(s => s.name))
