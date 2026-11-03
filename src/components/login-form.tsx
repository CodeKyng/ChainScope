import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useConnectModal } from "thirdweb/react"
import { Wallet } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { client, wallets } from "@/lib/thirdweb"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { connect, isConnecting } = useConnectModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to log in. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    setError(null)
    try {
      await connect({ client, wallets })
      navigate("/dashboard")
    } catch (err: unknown) {
      // User closed modal — ignore; only show real errors
      if (err instanceof Error && !err.message.toLowerCase().includes("reject")) {
        setError(err.message)
      }
    }
  }

  const busy = loading || isConnecting

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Login to your account</h1>
          <p className="text-sm text-balance text-slate-400">
            Enter your email below to login to your account
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className="border-slate-700 bg-slate-900"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {/* Password reset not implemented yet — hide dead link */}
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            className="border-slate-700 bg-slate-900"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={busy}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={busy}
            onClick={() => void handleConnectWallet()}
            className="border-slate-700"
          >
            <Wallet className="size-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          <FieldDescription className="text-center text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-slate-200 underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
