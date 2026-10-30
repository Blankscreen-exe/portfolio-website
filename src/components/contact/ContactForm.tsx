'use client'

import emailjs from '@emailjs/browser'
import { Turnstile } from '@marsidev/react-turnstile'
import { type ChangeEvent, type FormEvent, type ReactNode, useState } from 'react'

import { ArrowUpRight, RotateArrow } from '@/components/ui/Decor'
import { useMediaQuery } from '@/hooks/useMediaState'
import { useQueryParams } from '@/hooks/useQueryParams'
import { emailJs, turnstileSiteKey } from '@/lib/integrations'

type Fields = { fullName: string; email: string; topic: string; message: string }
type Errors = Partial<Record<keyof Fields | 'captcha', string>>

const EMPTY: Fields = { fullName: '', email: '', topic: '', message: '' }
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export function validate(data: Fields, captchaPassed: boolean): Errors {
  const errors: Errors = {}
  if (!data.fullName.trim()) errors.fullName = 'Required'
  if (!isEmail(data.email)) errors.email = 'Enter a valid email'
  if (!data.message.trim()) errors.message = 'Required'
  if (!captchaPassed) errors.captcha = 'Please complete the check below'
  return errors
}

// Mono label on top; borders collapse so the fields read as one stacked block
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
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

const inputClass = 'w-full border-0 bg-transparent p-0 py-1 font-inter text-base outline-none'

export default function ContactForm({ topics, linkedin }: { topics: readonly string[]; linkedin?: string | null }) {
  const [data, setData] = useState<Fields>(EMPTY)
  // Buttons elsewhere link here with ?topic=… to pre-select what the visitor needs.
  // The URL is only known after hydration, so apply the topic when it first shows up.
  const [params] = useQueryParams()
  const requested = params.get('topic')
  const [appliedTopic, setAppliedTopic] = useState<string | null>(null)
  if (requested !== appliedTopic) {
    setAppliedTopic(requested)
    if (requested && topics.includes(requested)) setData((d) => ({ ...d, topic: requested }))
  }
  const [errors, setErrors] = useState<Errors>({})
  // The normal widget is a fixed 300px, wider than the form on small phones
  const captchaSize = useMediaQuery('(max-width: 389px)') ? 'compact' : 'normal'
  const [captchaPassed, setCaptchaPassed] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  const set = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData((d) => ({ ...d, [name]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === 'sending') return
    const found = validate(data, captchaPassed)
    setErrors(found)
    if (Object.keys(found).length) return
    setState('sending')
    try {
      await emailjs.send(
        emailJs.serviceId,
        emailJs.templateId,
        {
          from_name: data.fullName,
          email: data.email,
          message: data.message,
          // the EmailJS template's existing fields
          purpose: data.topic || 'Not specified',
          hireAs: data.topic || 'Not specified',
        },
        { publicKey: emailJs.publicKey }
      )
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
          onClick={() => {
            setData(EMPTY)
            setCaptchaPassed(false)
            setErrors({})
            setState('idle')
          }}
          className="mt-6 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline"
        >
          Send another <RotateArrow />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid self-end font-jet text-sm" data-reveal="rows">
      <Field label="Your name" error={errors.fullName}>
        <input value={data.fullName} onChange={set('fullName')} autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={data.email} onChange={set('email')} autoComplete="email" className={inputClass} />
      </Field>
      <div className="-mt-px border border-stock/35 px-4 py-3">
        <span className="block font-jet text-[10px] uppercase tracking-[.18em] opacity-70" id="topic-label">
          What do you need?
        </span>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="topic-label">
          {topics.map((t) => (
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
        <textarea
          rows={4}
          value={data.message}
          onChange={set('message')}
          placeholder="e.g. I run a small clinic and want patients to book online"
          className={`${inputClass} resize-none placeholder:opacity-40`}
        />
      </Field>

      <div className="-mt-px border border-stock/35 px-4 py-3">
        <Turnstile
          key={captchaSize}
          siteKey={turnstileSiteKey}
          options={{ size: captchaSize, theme: 'auto' }}
          onSuccess={() => setCaptchaPassed(true)}
          onError={() => setCaptchaPassed(false)}
          onExpire={() => setCaptchaPassed(false)}
        />
        {errors.captcha && !captchaPassed && <p className="mt-2 text-[11px] text-[#ff7a8a]">{errors.captcha}</p>}
      </div>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="ss-chev-btn -mt-px bg-primary py-4 text-xs font-bold uppercase tracking-[.18em] text-onprimary transition hover:brightness-110 disabled:opacity-60"
      >
        {state === 'sending' ? (
          'Sending…'
        ) : (
          <>
            Send message <ArrowUpRight className="ss-chev" />
          </>
        )}
      </button>
      {state === 'failed' && (
        <p className="mt-3 text-[12px] text-[#ff7a8a]" role="alert">
          Something went wrong sending that. Please try again
          {linkedin && (
            <>
              , or message me on{' '}
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="underline">
                LinkedIn
              </a>
            </>
          )}
          .
        </p>
      )}
    </form>
  )
}
