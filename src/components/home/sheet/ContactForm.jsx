import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { Turnstile } from '@marsidev/react-turnstile'

import homeContent from '../../../data/homeContent.json'
import socialLinks from '../../../data/socialLinks.json'

// Same EmailJS service/template and Turnstile site key as components/contact/Form.jsx
const EMAILJS_PUBLIC_KEY = '2u2IBkz4SNHuJ3jqF'
const EMAILJS_SERVICE = 'service_jjms90v'
const EMAILJS_TEMPLATE = 'template_he0fd6r'
const TURNSTILE_SITE_KEY = '0x4AAAAAAAcY1yqOBIph005P'

const EMPTY = { fullName: '', email: '', topic: '', message: '' }
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// Field shell: mono label on top, borders collapse into one stacked block
function Field({ label, error, children }) {
  return (
    <label className={`-mt-px block border px-4 py-3 focus-within:border-primary ${error ? 'border-[#ff7a8a]' : 'border-stock/35'}`}>
      <span className="flex justify-between font-jet text-[10px] uppercase tracking-[.18em] opacity-70">
        <span>{label}</span>
        {error && <span className="text-[#ff7a8a] opacity-100">{error}</span>}
      </span>
      {children}
    </label>
  )
}

function ContactForm() {
  const [params] = useSearchParams()
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [captcha, setCaptcha] = useState(null) // null | 'success' | 'error' | 'expired'
  const [state, setState] = useState('idle')  // idle | sending | sent | failed

  // Buttons elsewhere link here with ?topic=… to pre-select what the visitor needs
  useEffect(() => {
    const topic = params.get('topic')
    if (topic && homeContent.contactTopics.includes(topic)) setData((d) => ({ ...d, topic }))
  }, [params])

  const set = (name) => (e) => setData((d) => ({ ...d, [name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!data.fullName.trim()) e.fullName = 'Required'
    if (!isEmail(data.email)) e.email = 'Enter a valid email'
    if (!data.message.trim()) e.message = 'Required'
    if (captcha !== 'success') e.captcha = 'Please complete the check below'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (state === 'sending' || !validate()) return
    setState('sending')
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: data.fullName,
        email: data.email,
        message: data.message,
        // The template's existing fields; the topic picker replaces the old checkboxes
        purpose: data.topic || 'Not specified',
        hireAs: data.topic || 'Not specified',
      })
      setState('sent')
    } catch {
      setState('failed')
    }
  }

  if (state === 'sent') {
    return (
      <div className="self-end border border-stock/35 p-8" role="status">
        <div className="ss-display text-4xl text-primary">Message received.</div>
        <p className="mt-4 opacity-80">Thanks for reaching out. I&apos;ll read it and get back to you, usually within a day.</p>
        <button
          type="button"
          onClick={() => { setData(EMPTY); setCaptcha(null); setErrors({}); setState('idle') }}
          className="mt-6 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline"
        >
          Send another ↻
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid self-end font-jet text-sm" data-reveal="rows">
      <Field label="Your name" error={errors.fullName}>
        <input value={data.fullName} onChange={set('fullName')} autoComplete="name" className="w-full border-0 bg-transparent p-0 py-1 font-inter text-base outline-none focus:ring-0" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={data.email} onChange={set('email')} autoComplete="email" className="w-full border-0 bg-transparent p-0 py-1 font-inter text-base outline-none focus:ring-0" />
      </Field>
      <div className="-mt-px border border-stock/35 px-4 py-3">
        <span className="block font-jet text-[10px] uppercase tracking-[.18em] opacity-70">What do you need?</span>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="What do you need?">
          {homeContent.contactTopics.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={data.topic === t}
              onClick={() => setData((d) => ({ ...d, topic: d.topic === t ? '' : t }))}
              className={`border px-2.5 py-1 text-[11px] uppercase tracking-[.08em] transition-colors ${data.topic === t ? 'border-primary bg-primary text-onprimary' : 'border-stock/35 hover:border-primary'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <Field label="Tell me a little about it" error={errors.message}>
        <textarea rows={4} value={data.message} onChange={set('message')} placeholder="e.g. I run a small clinic and want patients to book online" className="w-full resize-none border-0 bg-transparent p-0 py-1 font-inter text-base outline-none placeholder:opacity-40 focus:ring-0" />
      </Field>

      <div className="-mt-px border border-stock/35 px-4 py-3">
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          options={{ size: 'flexible', theme: 'auto' }}
          onSuccess={() => setCaptcha('success')}
          onError={() => setCaptcha('error')}
          onExpire={() => setCaptcha('expired')}
        />
        {errors.captcha && captcha !== 'success' && <p className="mt-2 text-[11px] text-[#ff7a8a]">{errors.captcha}</p>}
      </div>

      <button type="submit" disabled={state === 'sending'} className="ss-chev-btn -mt-px bg-primary py-4 text-xs font-bold uppercase tracking-[.18em] text-onprimary transition hover:brightness-110 disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : <>Send message <span className="ss-chev">↗</span></>}
      </button>
      {state === 'failed' && (
        <p className="mt-3 text-[12px] text-[#ff7a8a]" role="alert">
          Something went wrong sending that. Please try again, or message me on{' '}
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>.
        </p>
      )}
    </form>
  )
}

export default ContactForm
