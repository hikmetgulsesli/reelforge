"use client";

import { useEffect, useRef, useState } from "react";

interface Experience {
  date: string;
  title: string;
  description: string;
  company: string;
  logo?: string;
}

interface Skill {
  name: string;
  proficiency: number;
  icon: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

const experiences: Experience[] = [
  {
    date: "2023 - Present",
    title: "Senior Full-Stack Developer",
    description: "Leading development of AI-powered video generation platform serving 50K+ users.",
    company: "ReelForge",
  },
  {
    date: "2021 - 2023",
    title: "Full-Stack Developer",
    description: "Built scalable microservices architecture and real-time collaboration features.",
    company: "TechCorp",
  },
  {
    date: "2019 - 2021",
    title: "Frontend Developer",
    description: "Developed responsive web applications with React and Next.js frameworks.",
    company: "StartupXYZ",
  },
  {
    date: "2017 - 2019",
    title: "Junior Developer",
    description: "Maintained legacy systems and contributed to digital transformation initiatives.",
    company: "Legacy Systems Inc.",
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "🎨",
    skills: [
      { name: "React", proficiency: 95, icon: "⚛️" },
      { name: "Next.js", proficiency: 90, icon: "▲" },
      { name: "TypeScript", proficiency: 88, icon: "TS" },
      { name: "Tailwind CSS", proficiency: 92, icon: "🎨" },
    ],
  },
  {
    name: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js", proficiency: 90, icon: "🟢" },
      { name: "Python", proficiency: 82, icon: "🐍" },
      { name: "PostgreSQL", proficiency: 85, icon: "🐘" },
      { name: "GraphQL", proficiency: 78, icon: "◈" },
    ],
  },
  {
    name: "Database",
    icon: "🗄️",
    skills: [
      { name: "PostgreSQL", proficiency: 88, icon: "🐘" },
      { name: "MongoDB", proficiency: 75, icon: "🍃" },
      { name: "Redis", proficiency: 80, icon: "💚" },
      { name: "Prisma", proficiency: 85, icon: "◆" },
    ],
  },
  {
    name: "DevOps",
    icon: "🚀",
    skills: [
      { name: "Docker", proficiency: 85, icon: "🐳" },
      { name: "AWS", proficiency: 78, icon: "☁️" },
      { name: "CI/CD", proficiency: 82, icon: "⚡" },
      { name: "Kubernetes", proficiency: 70, icon: "☸️" },
    ],
  },
  {
    name: "Tools",
    icon: "🔧",
    skills: [
      { name: "Git", proficiency: 92, icon: "📦" },
      { name: "Figma", proficiency: 75, icon: "🎨" },
      { name: "Jest", proficiency: 80, icon: "🃏" },
      { name: "VS Code", proficiency: 95, icon: "💻" },
    ],
  },
  {
    name: "Soft Skills",
    icon: "💬",
    skills: [
      { name: "Team Leadership", proficiency: 88, icon: "👥" },
      { name: "Problem Solving", proficiency: 92, icon: "🧩" },
      { name: "Communication", proficiency: 85, icon: "💬" },
      { name: "Agile/Scrum", proficiency: 82, icon: "🔄" },
    ],
  },
];

function Avatar() {
  const [isGlowing, setIsGlowing] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative cursor-pointer transition-all duration-500"
        onMouseEnter={() => setIsGlowing(true)}
        onMouseLeave={() => setIsGlowing(false)}
        data-testid="avatar-container"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          padding: 4,
          border: "4px solid var(--color-primary)",
          boxShadow: isGlowing
            ? "0 0 40px 10px var(--color-primary)"
            : "0 0 20px 2px var(--color-primary)",
          transition: "box-shadow 0.5s ease-in-out",
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-6xl about-avatar-inner"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          }}
        >
          👨‍💻
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Avatar />
      <h1
        className="mt-6 text-5xl font-bold about-gradient-text"
        style={{
          fontFamily: "var(--font-display)",
        }}
      >
        ReelForge Team
      </h1>
      <p
        className="mt-4 text-xl"
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        AI-Powered Video Generation Platform
      </p>
      <p
        className="mt-4 max-w-2xl text-lg"
        style={{
          color: "var(--text-main)",
          fontFamily: "var(--font-body)",
          lineHeight: 1.8,
        }}
      >
        We build cutting-edge faceless video generation tools that empower creators worldwide. 
        Our platform leverages advanced AI to produce professional-quality content at scale.
      </p>
    </section>
  );
}

function ExperienceTimelineItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex items-center mb-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : isLeft ? "translateX(-30px)" : "translateX(30px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      {/* Vertical line */}
      <div
        className="absolute left-1/2 w-0.5 h-full"
        style={{
          background: "linear-gradient(to bottom, var(--color-primary), var(--color-secondary))",
          transform: "translateX(-50%)",
        }}
      />

      {/* Date badge */}
      <div
        className="absolute left-1/2 px-3 py-1 text-sm font-semibold rounded-full about-date-badge"
        style={{
          background: "var(--color-primary)",
          color: "white",
          transform: "translateX(-50%)",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}
      >
        {experience.date}
      </div>

      {/* Content card */}
      <div
        className="w-5/12 about-timeline-card"
        style={{
          marginLeft: isLeft ? "0" : "auto",
          marginRight: isLeft ? "auto" : "0",
          paddingLeft: isLeft ? "0" : "3rem",
          paddingRight: isLeft ? "3rem" : "0",
        }}
      >
        <div
          className="p-6 rounded-xl border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏢</span>
            <span
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {experience.company}
            </span>
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-main)",
            }}
          >
            {experience.title}
          </h3>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            {experience.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExperienceTimeline() {
  return (
    <section className="py-16 px-4">
      <h2
        className="text-3xl font-bold text-center mb-12"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-main)",
        }}
      >
        Experience
      </h2>
      <div className="relative max-w-4xl mx-auto">
        {experiences.map((exp, index) => (
          <ExperienceTimelineItem key={index} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
}

function SkillBar({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(skill.proficiency), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [skill.proficiency, index]);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{skill.icon}</span>
          <span
            className="font-medium text-sm"
            style={{ color: "var(--text-main)" }}
          >
            {skill.name}
          </span>
        </div>
        <span
          className="text-sm font-semibold about-skill-percent"
          style={{ color: "var(--color-primary)" }}
        >
          {skill.proficiency}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--surface-darker)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out about-skill-bar"
          style={{
            width: `${width}%`,
            background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
          }}
        />
      </div>
    </div>
  );
}

function SkillsGrid() {
  return (
    <section className="py-16 px-4" style={{ background: "var(--surface)" }}>
      <h2
        className="text-3xl font-bold text-center mb-12"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-main)",
        }}
      >
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {skillCategories.map((category) => (
          <div
            key={category.name}
            className="p-6 rounded-xl border about-skill-card"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{category.icon}</span>
              <h3
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-main)",
                }}
              >
                {category.name}
              </h3>
            </div>
            {category.skills.map((skill, skillIndex) => (
              <SkillBar key={skill.name} skill={skill} index={skillIndex} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CVDownloadButton() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/cv/Hikmet_Gulesli_CV.pdf";
    link.download = "Hikmet_Gulesli_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 px-4 text-center">
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 about-cv-button"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          color: "white",
          boxShadow: "0 4px 20px rgba(224, 36, 133, 0.4)",
        }}
      >
        <span>📄</span>
        <span>Download CV</span>
      </button>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <HeroSection />
      <ExperienceTimeline />
      <SkillsGrid />
      <CVDownloadButton />
    </main>
  );
}
