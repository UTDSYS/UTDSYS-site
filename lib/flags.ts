/**
 * Feature flags. Flip these to turn functionality on/off without ripping code
 * out. Kept deliberately tiny and dependency-free so it can be imported from
 * both client components and server routes.
 */

/**
 * The Get Involved contact form, powered by Resend (/api/contact). Needs
 * RESEND_API_KEY (and optionally RESEND_FROM) in the environment. Set to
 * `false` to replace the form with direct-contact links; the API route then
 * short-circuits instead of attempting to send.
 */
export const CONTACT_FORM_ENABLED = true;
