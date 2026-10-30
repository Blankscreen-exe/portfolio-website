// The CMS writes to local files while developing. On a deployed site it can only work in
// GitHub mode (the host's filesystem is read-only), so it's switched off there otherwise.
export const keystaticEnabled = process.env.NODE_ENV !== 'production' || process.env.KEYSTATIC_STORAGE === 'github'
