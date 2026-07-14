import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { findResponse } from '../data/knowledge'

const AVATAR_EMOJI = 'O'

type Message = { from: 'ai' | 'user'; text: string; action?: 'contact' }

const initialMessages: Message[] = [
  { from: 'ai', text: '👋 Hey, I\'m Bruce Deb\'s AI avatar. Ask me anything about his work, skills, or projects!' },
]

function AvatarOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame: number
    let t = 0

    function draw() {
      t += 0.02
      ctx!.clearRect(0, 0, 48, 48)
      const cx = 24, cy = 24, r = 14

      ctx!.beginPath()
      ctx!.arc(cx, cy, r, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(0, 255, 231, 0.06)'
      ctx!.fill()
      ctx!.strokeStyle = 'rgba(0, 255, 231, 0.25)'
      ctx!.lineWidth = 1
      ctx!.stroke()

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t
        const pr = r * 0.7 + Math.sin(t * 1.5 + i) * 4
        const px = cx + Math.cos(angle) * pr
        const py = cy + Math.sin(angle) * pr
        const size = 1.5 + Math.sin(t * 2 + i * 2) * 0.8
        ctx!.beginPath()
        ctx!.arc(px, py, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 0, 110, ${0.4 + Math.sin(t + i) * 0.2})`
        ctx!.fill()
      }

      ctx!.beginPath()
      ctx!.arc(cx, cy, 3 + Math.sin(t * 2) * 1, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(0, 255, 231, ${0.3 + Math.sin(t) * 0.15})`
      ctx!.fill()

      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} width={48} height={48} className="avatar-orb-canvas" />
}

export default function AIAvatar() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [showNudge, setShowNudge] = useState(true)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(false), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (open) {
      setShowNudge(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || thinking) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text }])
    setThinking(true)

    setTimeout(() => {
      const { answer, wantsContact } = findResponse(text)
      const msg = wantsContact
        ? answer
        : answer
      const next: Message[] = [{ from: 'ai', text: msg }]
      if (wantsContact) {
        next.push({ from: 'ai', text: '', action: 'contact' })
      }
      setMessages(prev => [...prev, ...next])
      setThinking(false)
    }, 600 + Math.random() * 400)
  }

  return (
    <>
      <motion.button
        className="ai-avatar-btn"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="ai-avatar-btn-inner">
          <AvatarOrb />
          <span className="ai-avatar-btn-label">AI</span>
        </div>
        <AnimatePresence>
          {showNudge && (
            <motion.span
              className="ai-nudge"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              Ask me anything!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-chat"
            initial={{ opacity: 0, y: 40, scale: 0.92, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <AvatarOrb />
                <div className="ai-chat-header-info">
                  <span className="ai-chat-header-name">AI Avatar</span>
                  <span className="ai-chat-header-status">
                    <span className="status-dot" />
                    online · ask me anything
                  </span>
                </div>
              </div>
              <motion.button
                className="ai-chat-close"
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1, color: '#FF006E' }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            <div className="ai-chat-body">
              {messages.map((msg, i) => (
                msg.text ? (
                  <motion.div
                    key={i}
                    className={`ai-msg ${msg.from === 'user' ? 'ai-msg-user' : 'ai-msg-ai'}`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <div className="ai-msg-content">
                      {msg.from === 'ai' && <span className="ai-msg-avatar-icon">{AVATAR_EMOJI}</span>}
                      <span>{msg.text}</span>
                    </div>
                  </motion.div>
                ) : msg.action === 'contact' ? (
                  <motion.div
                    key={i}
                    className="ai-msg ai-msg-ai"
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                  >
                    <div className="ai-msg-content ai-contact-action">
                      <motion.a
                        href="mailto:wwwdeb888@gmail.com?subject=Let's%20Chat%20-%20Inquiry%20from%20your%20AI%20Avatar%20page&body=Hi%20Bruce%2C%0A%0AI%20just%20visited%20your%20page%20and%20I'd%20like%20to%20chat%20with%20you!%0A%0A"
                        className="btn-primary ai-contact-btn"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        ✉️  Chat with Bruce
                      </motion.a>
                    </div>
                  </motion.div>
                ) : null
              ))}
              {thinking && (
                <motion.div
                  className="ai-msg ai-msg-ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="ai-msg-content">
                    <span className="ai-msg-avatar-icon">{AVATAR_EMOJI}</span>
                    <span className="ai-thinking">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <form className="ai-chat-input" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Bruce's work..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={thinking}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || thinking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                →
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
