import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import HeroScene from './components/HeroScene'
import VideoBackground from './components/VideoBackground'
import './App.css'

function useTypewriter(texts: string[]) {
  const [display, setDisplay] = useState('')
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[idx]
    const t = setTimeout(() => {
      if (!deleting) {
        if (char < current.length) { setDisplay(current.slice(0, char + 1)); setChar(c => c + 1) }
        else { setTimeout(() => setDeleting(true), 2000) }
      } else {
        if (char > 0) { setDisplay(current.slice(0, char - 1)); setChar(c => c - 1) }
        else { setDeleting(false); setIdx((idx + 1) % texts.length) }
      }
    }, deleting ? 35 : 70)
    return () => clearTimeout(t)
  }, [char, deleting, idx, texts])

  return display
}

function FadeIn({ children, delay = 0, x, y, className = '' }: { children: React.ReactNode; delay?: number; x?: number; y?: number; className?: string }) {
  const ref = useRef(null)
  const isIn = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: x ?? 0, y: y ?? 40 }}
      animate={isIn ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function StaggerChildren({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isIn = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      initial="hidden"
      animate={isIn ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}>
      {children}
    </motion.div>
  )
}

function GlitchText({ text }: { text: string }) {
  return <span className="glitch" data-text={text}>{text}</span>
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const ref = useRef(null)
  const isIn = useInView(ref, { once: true })
  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-bar-head">
        <span className="skill-name">{name}</span>
        <motion.span
          className="skill-pct"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={isIn ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          style={{ background: `linear-gradient(90deg, ${color}, var(--neon-cyan))` }}
          initial={{ width: 0 }}
          animate={isIn ? { width: `${level}%` } : {}}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

function ProjectCard({ title, desc, tags, link, index }: { title: string; desc: string; tags: string[]; link: string; index: number }) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="project-card"
      whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="project-index"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="project-tags">
        {tags.map((t, i) => (
          <motion.span
            key={t}
            className="tag"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
      <motion.span
        className="project-arrow"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}

const roles = [
  '🤖  I build AI that actually does things',
  '🦜️  LangChain → LangGraph → Deep Agents',
  '🔌  MCP → A2A → Agent Protocols',
  '🏗️  Google ADK → Mastra → MS Agent Framework',
  '☸️  Terraform → K8s → vLLM Deployments',
  '🧠  Fullstack → AI DevOps → Neural Stack',
]

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
    desc: 'Personal AI assistant ecosystem connecting Telegram, WhatsApp, Discord → AI agents with skills engine, cron, and heartbeat automation. Core contributor to the 382k+ ⭐ project.',
    tags: ['TypeScript', 'MCP/ACP', 'Plugin SDK'],
    link: 'https://github.com/openclaw/openclaw',
  },
  {
    title: '500 AI Agents Playbook',
    desc: 'Curated catalog of 500+ AI agent projects across agent frameworks, protocols, deployment patterns, and reasoning architectures.',
    tags: ['Research', 'Agents', '2026'],
    link: 'https://github.com/deb888/500-AI-Agents-Playbook',
  },
  {
    title: 'Daily AI Workflows',
    desc: 'GitHub Actions pipeline generating a unique AI agent workflow every day using Gemini 2.5 Flash, with optional LinkedIn posting.',
    tags: ['Python', 'Gemini', 'GHA'],
    link: 'https://github.com/deb888/daily-ai-workflows',
  },
  {
    title: 'AI DevOps Pipeline',
    desc: 'Enterprise ML infrastructure managing 50+ clusters and 500+ services with vLLM model serving, Terraform, and ArgoCD GitOps.',
    tags: ['K8s', 'Terraform', 'vLLM'],
    link: 'https://github.com/deb888',
  },
]

export default function App() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])
  const typed = useTypewriter(roles)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorRef.current) cursorRef.current.style.opacity = cursorRef.current.style.opacity === '1' ? '0' : '1'
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="app">
      <nav className="nav">
        <motion.span
          className="nav-logo"
          onClick={() => scrollTo('hero')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="nav-deco">&gt;</span> deb888
        </motion.span>
        <div className="nav-links">
          {['about', 'skills', 'projects', 'contact'].map(s => (
            <motion.button
              key={s}
              onClick={() => scrollTo(s)}
              className="nav-link"
              whileHover={{ color: '#00FFE7' }}
              whileTap={{ scale: 0.95 }}
            >
              /{s}
            </motion.button>
          ))}
        </div>
      </nav>

      <section id="hero" className="hero">
        <VideoBackground />
        <HeroScene />
        <motion.div className="hero-overlay" style={{ opacity: heroOpacity }}>
          <motion.div
            className="hero-content"
            style={{ scale: heroScale }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="hero-badge-dot" />
              SYSTEM ONLINE
            </motion.div>

            <motion.p
              className="hero-greeting"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 120 }}
            >
              <GlitchText text="Bruce Deb" />
            </motion.h1>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              AI Developer · Fullstack Architect · AI DevOps Engineer
            </motion.p>

            <motion.div
              className="hero-typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <span className="typing-prompt">$ </span>
              <span className="typing-text">{typed}</span>
              <span className="typing-cursor" ref={cursorRef}>█</span>
            </motion.div>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            >
              <motion.button
                className="btn-primary"
                onClick={() => scrollTo('projects')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 231, 0.4)' }}
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
                Contact
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {[
                { num: '382k+', label: 'GitHub Stars' },
                { num: '500+', label: 'AI Projects' },
                { num: '10+', label: 'Years Building' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="stat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.15, type: 'spring', stiffness: 100 }}
                >
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => scrollTo('about')}
        >
          <span>scroll</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      <div className="sections-container">
        <section id="about">
          <FadeIn>
            <h2 className="section-title"><span className="title-accent">/</span> about</h2>
          </FadeIn>
          <div className="about-grid">
            <FadeIn x={-30} delay={0.1}>
              <div className="about-text">
                <p>
                  I build AI-powered applications end-to-end — from React Native mobile apps
                  to LangChain agent swarms deployed on Kubernetes.
                </p>
                <blockquote className="about-quote">
                  "Fullstack is the foundation. LangChain is the brain. Kubernetes is the body. OpenClaw is the heartbeat."
                </blockquote>
                <p>
                  Core contributor to <strong>OpenClaw</strong> (382k+ ⭐), building the
                  skills engine, automation layer, and plugin SDK. Deep into MCP, A2A, and
                  the 2026 agent protocol stack.
                </p>
              </div>
            </FadeIn>
            <FadeIn x={30} delay={0.2}>
              <div className="about-yaml">
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
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="skills">
          <FadeIn>
            <h2 className="section-title"><span className="title-accent">/</span> skills</h2>
          </FadeIn>
          <StaggerChildren className="skills-grid">
            {skills.map(s => (
              <StaggerItem key={s.name}>
                <SkillBar name={s.name} level={s.level} color={s.color} />
              </StaggerItem>
            ))}
          </StaggerChildren>
          <FadeIn delay={0.3}>
            <motion.div
              className="skills-more"
              whileHover={{ color: '#00FFE7' }}
            >
              + Angular 18+ · React · NestJS · PostgreSQL · Redis · Kafka · Istio · ArgoCD · vLLM · LangSmith · MLflow · Datadog
            </motion.div>
          </FadeIn>
        </section>

        <section id="projects">
          <FadeIn>
            <h2 className="section-title"><span className="title-accent">/</span> projects</h2>
          </FadeIn>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <FadeIn key={p.title} y={30} delay={i * 0.12}>
                <ProjectCard {...p} index={i} />
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <FadeIn>
            <h2 className="section-title"><span className="title-accent">/</span> connect</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="contact-sub">Let's build the next generation of AI agents.</p>
          </FadeIn>
          <div className="contact-links">
            {[
              { href: 'https://github.com/deb888', label: 'GitHub', icon: 'GH' },
              { href: 'https://linkedin.com/in/brucedeb', label: 'LinkedIn', icon: 'LI' },
              { href: 'mailto:wwwdeb888@gmail.com', label: 'Email', icon: '@' },
              { href: 'https://github.com/openclaw/openclaw', label: 'OpenClaw', icon: 'OC' },
            ].map((link, i) => (
              <FadeIn key={link.label} y={15} delay={0.15 + i * 0.08}>
                <motion.a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                  whileHover={{ scale: 1.05, y: -4, borderColor: '#00FFE7' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="contact-icon">{link.icon}</span>
                  <span className="contact-label">{link.label}</span>
                  <motion.span
                    className="contact-arrow"
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 2 }}
                  >
                    ↗
                  </motion.span>
                </motion.a>
              </FadeIn>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="footer-deco">&lt;/&gt;</span> built with OpenCode · wwwdeb888@gmail.com
        </motion.p>
      </footer>
    </div>
  )
}
