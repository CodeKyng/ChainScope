/** Comma-separated admin emails from env, e.g. admin@chainscope.app,you@example.com */
const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS ?? "admin@chainscope.app"
)
  .split(",")
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
