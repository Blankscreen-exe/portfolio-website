// Vercel serverless function: proxies recruiter questions to the Gemini API.
//
// Why this exists: the Gemini API key must NEVER ship to the browser. This
// function runs on Vercel's server, holds the key in an env var, and is the
// only thing that talks to Google. The frontend just POSTs messages here.
//
// Required env var (set in Vercel → Project → Settings → Environment Variables):
//   GEMINI_API_KEY
//
// Local testing: `vite dev` does NOT run this file. Use `vercel dev` (install
// the Vercel CLI: `npm i -g vercel`) so /api/chat works on localhost.

import fs from 'node:fs'
import path from 'node:path'

// Gemini's free tier. Swap the model name here if you want a different one.
const MODEL = 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// Read the context file once per cold start. It's bundled via vercel.json's
// `includeFiles` config, and lives at the project root.
let ABOUT_ME = ''
try {
  ABOUT_ME = fs.readFileSync(path.join(process.cwd(), 'about-me.txt'), 'utf8')
} catch {
  ABOUT_ME = '(No about-me.txt found.)'
}

const SYSTEM_PROMPT = `You are a friendly assistant embedded on M. Hammad Hassan's portfolio website. You answer questions from recruiters and hiring managers about Hammad.

Strict rules:
- Answer ONLY using the information in the "ABOUT HAMMAD" context below.
- If a question can't be answered from that context, politely say you don't have that detail and suggest they use the contact form on the site. Never invent facts (no made-up dates, salaries, employers, or skills).
- If asked about anything unrelated to Hammad or his professional background, politely decline and steer back to questions about Hammad.
- Keep answers concise, warm, and professional. Speak about Hammad in the third person.

=== ABOUT HAMMAD ===
${ABOUT_ME}
=== END CONTEXT ===`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' })
  }

  // Body is { messages: [{ role: 'user' | 'model', text: string }, ...] }
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
  if (messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided.' })
  }

  // Cap history to keep requests cheap and snappy.
  const recent = messages.slice(-12)
  const contents = recent
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }))

  try {
    const gemini = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    })

    if (!gemini.ok) {
      const detail = await gemini.text()
      // console.error('Gemini error:', gemini.status, detail)
      return res.status(502).json({ error: 'Upstream model error.' })
    }

    const data = await gemini.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''

    return res.status(200).json({
      reply: reply.trim() || "Sorry, I couldn't generate a response. Please try again.",
    })
  } catch (err) {
    // console.error('Chat handler error:', err)
    return res.status(500).json({ error: 'Something went wrong.' })
  }
}
