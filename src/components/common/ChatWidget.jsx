import React, { useState, useRef, useEffect } from 'react'

// Floating chat widget that lets recruiters ask questions about Hammad.
// It POSTs the (capped) conversation to the chatbot server, which adds the
// stored context and proxies to Gemini using the tenant's own key.
//
// Configure via .env (these are public — the client key is a publishable id):
//   VITE_CHATBOT_ENDPOINT=https://chat.yourdomain.com/v1/chat
//   VITE_CHATBOT_KEY=pk_live_...
// Falls back to the local /api/chat function if the endpoint isn't set.

const ENDPOINT = import.meta.env.VITE_CHATBOT_ENDPOINT || '/api/chat'
const CLIENT_KEY = import.meta.env.VITE_CHATBOT_KEY || ''

const GREETING = {
  role: 'model',
  text: "Hi! I'm Hammad's assistant. Ask me anything about his experience, skills, or availability.",
}

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Keep the latest message in view.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function sendMessage(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      // Send everything except the canned greeting.
      const history = nextMessages.filter((m) => m !== GREETING)
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(CLIENT_KEY ? { 'x-client-key': CLIENT_KEY } : {}),
        },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }])
    } catch (err) {
      setError("Sorry, I couldn't reach the assistant. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Ask about Hammad'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-bg1 shadow-lg shadow-shadow transition-transform duration-200 hover:scale-105 focus:outline-none"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-bg2 shadow-xl shadow-shadow">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-content/10 bg-bg1 px-4 py-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
            </span>
            <div>
              <p className="text-sm font-bold text-title">Ask about Hammad</p>
              <p className="text-xs text-content/60">Powered by Gemini</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-bg1'
                      : 'bg-bg1 text-content'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-bg1 px-3 py-2 text-sm text-content/60">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:0.15s]">•</span>
                    <span className="animate-bounce [animation-delay:0.3s]">•</span>
                  </span>
                </div>
              </div>
            )}

            {error && <p className="text-center text-xs text-red-500">{error}</p>}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-content/10 px-3 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 rounded-full border border-content/15 bg-bg1 px-4 py-2 text-sm text-content placeholder:text-content/40 focus:border-primary focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-bg1 transition-opacity disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget
