import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import './App.css'

function useTypewriter(texts: string[], speed = 80, deleteSpeed = 40, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        } else {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        } else {
          setDeleting(false)
          setTextIdx((textIdx + 1) % texts.length)
        }
      }
    }, deleting ? deleteSpeed : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, textIdx, texts, speed, deleteSpeed, pause])

  return display
}

function GlitchText({ text }: { text: string }) {
  return (
    <span className="glitch" data-text={text}>
      {text}
    </span>
  )
}

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  )
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-bar-head">
        <span className="skill-name">{name}</span>
        <span className="skill-pct" style={{ color }}>{level}%</span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          style={{ background: `linear-gradient(90deg, ${color}, var(--neon-cyan))` }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

function ProjectCard({ title, desc, tags, link }: { title: string; desc: string; tags: string[]; link: string }) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="project-card"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="project-tags">
        {tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </motion.a>
  )
}

const skills = [
  { name: 'AI / ML Engineering', level: 90, color: '#FF006E' },
  { name: 'LangChain / LangGraph', level: 90, color: '#FFBE0B' },
  { name: 'MCP / A2A Protocols', level: 85, color: '#00C853' },
  { name: 'AWS Bedrock', level: 85, color: '#FF9900' },
  { name: 'Google ADK', level: 75, color: '#4285F4' },
  { name: 'Deep Agents / Mastra', level: 80, color: '#8B5CF6' },
  { name: 'React Native', level: 88, color: '#61DAFB' },
  { name: 'Angular 18+', level: 90, color: '#DD0031' },
  { name: 'Kubernetes / Terraform', level: 90, color: '#326CE5' },
  { name: 'OpenClaw', level: 92, color: '#FF006E' },
]

const projects = [
  {
    title: 'OpenClaw',
    desc: 'Personal AI assistant ecosystem connecting Telegram, WhatsApp, Discord → AI agents with skills engine, cron, and heartbeat automation.',
    tags: ['TypeScript', 'MCP/ACP', 'Plugin SDK', '382k+ ⭐'],
    link: 'https://github.com/openclaw/openclaw',
  },
  {
    title: '500 AI Agents Playbook',
    desc: 'Curated catalog of 500+ AI agent projects across agent frameworks, protocols, and deployment patterns.',
    tags: ['Research', 'Agents', '2026'],
    link: 'https://github.com/deb888/500-AI-Agents-Playbook',
  },
  {
    title: 'Daily AI Workflows',
    desc: 'GitHub Actions pipeline generating a unique AI agent workflow every day using Gemini 2.5 Flash.',
    tags: ['Python', 'Gemini', 'GHA'],
    link: 'https://github.com/deb888/daily-ai-workflows',
  },
  {
    title: 'AI DevOps Pipeline',
    desc: 'Enterprise ML infrastructure: 50+ clusters, 500+ services, model serving with vLLM and K8s.',
    tags: ['K8s', 'Terraform', 'vLLM', '99.99%'],
    link: 'https://github.com/deb888',
  },
]

const roles = [
  '🤖 I build AI that actually does things',
  '🦜️ LangChain → LangGraph → Deep Agents',
  '🔌 MCP → A2A → Agent Protocols',
  '🏗️ Google ADK → Mastra → MS Agent Framework',
  '☸️ Terraform → K8s → vLLM Deployments',
  '🧠 Fullstack → AI DevOps → Neural Stack',
]

export default function App() {
  const { scrollYProgress } = useScroll()
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.8])
  const typed = useTypewriter(roles, 70, 35, 2000)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity =
          cursorRef.current.style.opacity === '1' ? '0' : '1'
      }
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <motion.div className="bg-overlay" style={{ opacity: bgOpacity }} />

      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="star"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        />
      ))}

      <nav className="nav">
        <span className="nav-logo" onClick={() => scrollTo('hero')}>
          <span className="nav-deco">[</span>deb888<span className="nav-deco">]</span>
        </span>
        <div className="nav-links">
          {['about', 'skills', 'projects', 'contact'].map(s => (
            <button key={s} onClick={() => scrollTo(s)} className="nav-link">
              /{s}
            </button>
          ))}
        </div>
      </nav>

      <section id="hero" className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.p
              className="hero-greeting"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hello, I'm
            </motion.p>
            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <GlitchText text="Bruce Deb" />
            </motion.h1>
            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              AI Developer · Fullstack Architect · AI DevOps Engineer
            </motion.p>
          </motion.div>

          <motion.div
            className="hero-typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="typing-text">{typed}</span>
            <span className="typing-cursor" ref={cursorRef}>|</span>
          </motion.div>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => scrollTo('projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>
            <motion.button
              className="btn-secondary"
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <div className="stat">
              <span className="stat-num">382k+</span>
              <span className="stat-label">GitHub Stars</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">AI Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">10+</span>
              <span className="stat-label">Years Building</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => scrollTo('about')}
        >
          <span>scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </section>

      <div className="sections-container">
        <Section id="about" className="about-section">
          <motion.h2 className="section-title">
            <span className="title-accent">/</span> about
          </motion.h2>
          <div className="about-grid">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p>
                I build AI-powered applications end-to-end — from React Native mobile apps
                to LangChain agent swarms deployed on Kubernetes. My philosophy:
              </p>
              <blockquote className="about-quote">
                "Fullstack is the foundation. LangChain is the brain. Kubernetes is the body. OpenClaw is the heartbeat."
              </blockquote>
              <p>
                Core contributor to <strong>OpenClaw</strong> (382k+ ⭐), building the
                skills engine, automation layer, and plugin SDK. Deep into MCP, A2A, and
                the 2026 agent protocol stack.
              </p>
            </motion.div>
            <motion.div
              className="about-yaml"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <pre><code>{`name: Bruce Deb
handle: deb888
role: AI Developer
mission: AI apps end-to-end
stack:
  ai:     LangChain·LangGraph·Bedrock
  proto:  MCP·A2A·ACP
  mobile: React Native·Expo
  infra:  K8s·Terraform·Serverless
engine:  OpenClaw`}</code></pre>
            </motion.div>
          </div>
        </Section>

        <Section id="skills" className="skills-section">
          <motion.h2 className="section-title">
            <span className="title-accent">/</span> skills
          </motion.h2>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <SkillBar name={s.name} level={s.level} color={s.color} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="skills-more"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span>+ Angular 18+ · React · NestJS · PostgreSQL · Redis · Kafka · Istio · ArgoCD · vLLM · LangSmith · MLflow · Datadog</span>
          </motion.div>
        </Section>

        <Section id="projects" className="projects-section">
          <motion.h2 className="section-title">
            <span className="title-accent">/</span> projects
          </motion.h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <ProjectCard {...p} />
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="contact" className="contact-section">
          <motion.h2 className="section-title">
            <span className="title-accent">/</span> connect
          </motion.h2>
          <motion.p
            className="contact-sub"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Let's build the next generation of AI agents.
          </motion.p>
          <div className="contact-links">
            {[
              { href: 'https://github.com/deb888', label: 'GitHub', icon: 'GH' },
              { href: 'https://linkedin.com/in/brucedeb', label: 'LinkedIn', icon: 'LI' },
              { href: 'mailto:bruce@deb888.dev', label: 'Email', icon: '@' },
              { href: 'https://github.com/openclaw/openclaw', label: 'OpenClaw', icon: 'OC' },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="contact-icon">{link.icon}</span>
                <span className="contact-label">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </Section>
      </div>

      <footer className="footer">
        <p>
          <span className="footer-deco">&lt;/&gt;</span> built with{' '}
          <a href="https://github.com/deb888/deb888" target="_blank" rel="noreferrer">
            OpenCode
          </a>{' '}
          · debrowse 2026
        </p>
      </footer>
    </div>
  )
}
