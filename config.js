/**
 * Cinematic AI Character Portfolio - Configuration
 * Strictly follows AI_Character_Portfolio_Visual_Guide.pdf
 * Fill in your details once here to populate the entire website.
 */
window.CONFIG = {
  // 1. Full name
  name: "S. J. Suryakanth",
  nameLine1: "S. J.",
  nameLine2: "SURYAKANTH",

  // 2. Role / title
  role: "Python & Django Developer · Backend & Full-Stack",

  // 3. City + status line
  city: "Chennai, Tamil Nadu",
  status: "Open to Full-Time Python & Backend Roles",

  // 4. About title (one line)
  aboutTitle: "Engineering intelligent backend architectures & AI systems.",

  // 5. About (2–3 sentences)
  about: "Entry-level Python and Django Developer with a B.Tech in AI & Data Science (CGPA 8.4/10) and full-stack internship experience at ADYOG. I build production REST APIs with Django and FastAPI, write optimized SQL across PostgreSQL and MySQL, craft modern React front ends, and automate end-to-end tests with Playwright and pytest.",

  // 6. 3 stats
  stats: [
    { value: "8.4", label: "CGPA · AI & Data Science" },
    { value: "4+", label: "Production & AI Projects" },
    { value: "5+", label: "Certifications & Training" }
  ],

  // 7. Projects (title, tech, description, link)
  projects: [
    {
      title: "School Attendance System",
      tech: "Python · OpenCV · Computer Vision",
      description: "Automated biometric attendance system utilizing OpenCV facial recognition to eliminate manual attendance registers with sub-second student verification.",
      codeUrl: "https://github.com/suryakanthsj",
      featured: true
    },
    {
      title: "AI Personal Assistant",
      tech: "Python · NLP · FastAPI",
      description: "Voice and text-driven AI assistant powered by NLP intent parsing, orchestrated through high-throughput asynchronous FastAPI endpoints.",
      codeUrl: "https://github.com/suryakanthsj",
      featured: true
    },
    {
      title: "Full-Stack Task Management App",
      tech: "Django · Python · PostgreSQL · SQL CRUD",
      description: "Enterprise-grade task workflow system with user authentication, role-based access control, and complete CRUD operations on PostgreSQL.",
      codeUrl: "https://github.com/suryakanthsj",
      featured: true
    },
    {
      title: "Modern Frontend Web Suite",
      tech: "JavaScript (ES6+) · HTML5 · CSS Grid",
      description: "Suite of dynamic client-side applications including scientific calculator, task tracker, and pixel-perfect clones with responsive DOM manipulation.",
      codeUrl: "https://github.com/suryakanthsj",
      featured: false
    }
  ],

  // 8. 8–12 Skills categorized
  skillCategories: [
    {
      category: "Backend & APIs",
      skills: ["Python", "Django", "FastAPI", "RESTful APIs", "CRUD Operations", "Authentication", "MVT Architecture"]
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MySQL", "Relational DB Design", "Query Optimization", "Joins & Subqueries", "Indexing"]
    },
    {
      category: "Testing & Tools",
      skills: ["Playwright (Python)", "pytest", "Test Automation", "Unit & E2E Testing", "Git & GitHub", "Agile / Scrum"]
    },
    {
      category: "AI & Data Science",
      skills: ["NLP", "OpenCV", "Computer Vision", "Scikit-learn", "Pandas", "NumPy", "Generative AI", "LLMs & RAG"]
    },
    {
      category: "Frontend",
      skills: ["React", "JavaScript (ES6+)", "TypeScript (basics)", "Tailwind CSS", "HTML5 & CSS3 Grid"]
    }
  ],

  // 9. Experience
  experience: {
    role: "Full Stack Development Intern",
    company: "ADYOG",
    location: "Chennai, India",
    period: "July 2026 – Present",
    highlights: [
      "Built responsive, accessible interfaces using React, JavaScript (ES6+), and Tailwind CSS.",
      "Engineered modular backend services and RESTful APIs with Django and FastAPI with JSON serialization.",
      "Wrote optimized SQL queries, complex joins, subqueries, and indexing for PostgreSQL and MySQL.",
      "Automated comprehensive end-to-end UI tests with Playwright (Python) to catch cross-browser regressions.",
      "Collaborated in Agile sprints and managed continuous deployment via Git and GitHub branching."
    ]
  },

  // 10. Education & Certifications
  education: [
    {
      degree: "B.Tech — Artificial Intelligence & Data Science",
      institution: "Thangavelu Engineering College, Chennai",
      period: "Class of 2026",
      detail: "CGPA: 8.4 / 10"
    },
    {
      degree: "Higher Secondary Certificate (HSC – 12th)",
      institution: "Vyasa Vidyalaya",
      period: "2022",
      detail: "Score: 74%"
    }
  ],
  certifications: [
    "Oracle Professional: Generative AI Exam (Jul 2025)",
    "Data Science Intern Certification: DEVEIN (Oct 2025)",
    "Python Full-Stack Developer Training: Q-SPIDER",
    "SQL & Python Master Certifications: Udemy",
    "Workshop: IoT & Environmental Applications"
  ],

  // 11. Email + social links
  email: "suryakanth2004sk@gmail.com",
  phone: "+91 9150197966",
  social: {
    github: "https://github.com/suryakanthsj",
    linkedin: "https://linkedin.com/in/s-j-surya-kanth",
    website: "https://suryakanthsj.github.io/portfolio"
  },

  // 12. Outfit for the video
  outfit: "Charcoal black blazer, dark top, tailored black trousers, white sneakers",

  // 13. Accent colour
  accentColor: "#ff9a4d",

  // Media paths
  media: {
    desktopFilm: "media/film.mp4",
    mobileFilm: "media/film_mobile.mp4",
    poster: "media/poster.jpg",
    photo: "media/photo.jpg",
    resume: "media/resume.pdf"
  },

  // Film segment timings (exact timings calibrated to 46-second film)
  timing: {
    intro: { showStart: 2.0, hold: 7.6, showEnd: 8.6 },
    about: { showStart: 10.2, hold: 14.6, showEnd: 16.0 },
    work: { showStart: 24.5, hold: 26.5, showEnd: 29.5 },
    skills: { showStart: 31.0, hold: 37.5, showEnd: 39.5 },
    resume: { showStart: 39.8, hold: 42.3, showEnd: 43.8, dropStart: 40.3, dropEnd: 41.4 },
    contact: { showStart: 44.0, hold: 45.7, showEnd: 46.0, frameStart: 43.9, frameEnd: 45.3 }
  }
};
