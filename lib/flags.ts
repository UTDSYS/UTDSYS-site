/**
 * Feature flags. Flip these to turn functionality on/off without ripping code
 * out. Kept deliberately tiny and dependency-free so it can be imported from
 * both client components and server routes.
 */

/**
 * The Get Involved contact form is powered by Resend (/api/contact). While
 * it's off, the form is replaced by direct-contact links and the API route
 * short-circuits instead of attempting to send. Set to `true` (and provide
 * RESEND_API_KEY) to re-enable.
 */
export const CONTACT_FORM_ENABLED = false;
