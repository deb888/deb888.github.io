export interface KnowledgeEntry {
  keywords: string[]
  response: string
}

const knowledge: KnowledgeEntry[] = [
  {
    keywords: ['who', 'bruce', 'deb', 'name', 'you'],
    response: 'I am Bruce Deb — handle **deb888**. AI Developer, Fullstack Architect, and AI DevOps Engineer. I build AI-powered applications end-to-end, from React Native mobile apps to LangChain agent swarms running on Kubernetes.',
  },
  {
    keywords: ['what', 'you do', 'mission', 'work'],
    response: 'I build AI applications end-to-end. My mission is creating AI apps from concept to deployment — LangChain agents, MCP/A2A protocols, React Native apps, and Kubernetes-native AI infrastructure. Core contributor to OpenClaw (382k+ ⭐).',
  },
  {
    keywords: ['skills', 'tech', 'stack', 'technologies', 'languages', 'expertise'],
    response: '**Core Stack:**\n• AI/ML Engineering (90%)\n• LangChain / LangGraph (90%)\n• MCP / A2A Protocols (85%)\n• AWS Bedrock (85%)\n• Google ADK (75%)\n• Deep Agents / Mastra (80%)\n• React Native (88%)\n• Angular 18+ (90%)\n• Kubernetes / Terraform (90%)\n• OpenClaw (92%)\n\nPlus: React, NestJS, PostgreSQL, Redis, Kafka, Istio, ArgoCD, vLLM, LangSmith, MLflow, Datadog, Angular, etc.',
  },
  {
    keywords: ['project', 'openclaw', 'github'],
    response: '**OpenClaw** — Personal AI assistant ecosystem (382k+ ⭐). Connects Telegram, WhatsApp, Discord → AI agents with skills engine, cron, and heartbeat automation. I contribute to the core SDK, skills engine, automation layer, and plugin system.\n\n**500 AI Agents Playbook** — Curated catalog of 500+ AI agent projects across frameworks, protocols, and deployment patterns.\n\n**Daily AI Workflows** — GitHub Actions pipeline generating AI agent workflows daily using Gemini 2.5 Flash.\n\n**AI DevOps Pipeline** — Enterprise ML infrastructure managing 50+ clusters with vLLM, Terraform, and ArgoCD.\n\nSee all at https://github.com/deb888',
  },
  {
    keywords: ['contact', 'email', 'reach', 'hire', 'talk', 'chat'],
    response: 'You can reach me at **wwwdeb888@gmail.com** or through the contact section below. If you want a real-time conversation, click the *Chat with Bruce* button — I\'ll send an alert to his inbox so he can get back to you.',
  },
  {
    keywords: ['github', 'profile', 'deb888'],
    response: 'My GitHub is **deb888** — https://github.com/deb888. I maintain OpenClaw, the 500 AI Agents Playbook, Daily AI Workflows, and various AI infrastructure projects. Core contributor to the OpenClaw ecosystem.',
  },
  {
    keywords: ['philosophy', 'quote', 'motto', 'belief'],
    response: 'My philosophy: *"Fullstack is the foundation. LangChain is the brain. Kubernetes is the body. OpenClaw is the heartbeat."* I believe in shipping real AI that works — not just demos.',
  },
  {
    keywords: ['experience', 'background', 'career', 'history', 'years'],
    response: '10+ years building software. Deep into the 2026 agent protocol stack — MCP, A2A, ACP. Infrastructure at scale: 50+ K8s clusters, 500+ microservices. Currently focused on agent frameworks (LangGraph, Google ADK, Mastra, MS Agent Framework) and AI deployment infrastructure (vLLM, Bedrock, Terraform).',
  },
  {
    keywords: ['location', 'based', 'live', 'timezone'],
    response: 'I work remotely in the AI/DevOps space. Available for collaboration across timezones — reach me at wwwdeb888@gmail.com.',
  },
  {
    keywords: ['help', 'assist', 'capabilities', 'can you'],
    response: 'I can tell you about Bruce\'s skills, projects, experience, tech stack, and philosophy. I\'m an AI avatar powered by knowledge of his GitHub profile and work. If you need to chat with the real Bruce, just ask and I\'ll send an alert.',
  },
  {
    keywords: ['resume', 'cv', 'work', 'job', 'position'],
    response: 'Bruce is an AI Developer / Fullstack Architect / AI DevOps Engineer. Check the projects section above for his featured work, or visit https://github.com/deb888 for the full portfolio.',
  },
]

export function findResponse(input: string): { answer: string; wantsContact: boolean } {
  const q = input.toLowerCase().trim()

  const wantsContact =
    /^(hi|hello|hey|chat|talk|speak|human|real|person|live|connect|let'?s talk|can i talk|want to talk)/i.test(input) &&
    !/what|who|how|tell/i.test(input)

  const greeting = /^(hi|hello|hey|sup|yo|howdy)\b/i.test(input)
  const thanks = /thank|thanks|thx/i.test(input)
  const bye = /bye|goodbye|see you|exit|quit/i.test(input)

  if (bye) return { answer: 'Goodbye! 👋 Feel free to come back anytime. If you need to reach Bruce directly, just say the word.', wantsContact: false }
  if (thanks) return { answer: 'You\'re welcome! 😊 Let me know if you have more questions about Bruce or his work.', wantsContact: false }
  if (greeting) return { answer: 'Hey there! 👋 I\'m Bruce\'s AI avatar. Ask me about his skills, projects, experience, or anything you see on this page. Want to chat with the real Bruce? Just let me know!', wantsContact: false }

  if (wantsContact) return { answer: 'Sure! I\'ll send an alert to Bruce\'s inbox so he knows you want to chat. You can also email him directly at **wwwdeb888@gmail.com** with any specific questions.', wantsContact: true }

  for (const entry of knowledge) {
    const match = entry.keywords.some(kw => q.includes(kw))
    if (match) return { answer: entry.response, wantsContact: false }
  }

  const fallbacks = [
    'I\'m not sure about that, but I can tell you about Bruce\'s skills, projects, tech stack, or how to reach him. What would you like to know?',
    'Hmm, I don\'t have that info in my knowledge base. Ask me about his GitHub, skills, projects, or contact details!',
  ]
  return { answer: fallbacks[Math.floor(Math.random() * fallbacks.length)], wantsContact: false }
}
