// Third-party keys used by the contact form. These are *public* identifiers (EmailJS public
// key, Cloudflare Turnstile site key) — they are designed to be shipped to the browser.
// Each can be overridden per environment.
export const emailJs = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '2u2IBkz4SNHuJ3jqF',
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'service_jjms90v',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'template_he0fd6r',
}

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAAAcY1yqOBIph005P'
