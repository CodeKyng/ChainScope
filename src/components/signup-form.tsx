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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { connect, isConnecting } = useConnectModal()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setLoading(true)
    try {
      await signup(email, password, name)
      navigate("/dashboard")
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
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
      if (err instanceof Error && !err.message.toLowerCase().includes("reject")) {
        setError(err.message)
      }
    }
  }

  const busy = loading || isConnecting

  return (
    <form
      className={cn("flex flex-col gap-6 text-slate-100", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-balance text-slate-400">
            Fill in the form below to create your account
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="name" className="text-slate-300">
            Full Name
          </FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="border-slate-700 bg-slate-900 text-slate-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email" className="text-slate-300">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="border-slate-700 bg-slate-900 text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
          <FieldDescription className="text-slate-500">
            We will not share your email with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password" className="text-slate-300">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="border-slate-700 bg-slate-900 text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
          <FieldDescription className="text-slate-500">
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password" className="text-slate-300">
            Confirm Password
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            className="border-slate-700 bg-slate-900 text-slate-100"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={busy}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={busy} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator className="text-slate-500">Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={busy}
            onClick={() => void handleConnectWallet()}
            className="w-full border-slate-700 text-slate-100"
          >
            <Wallet className="size-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          <FieldDescription className="text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-slate-200 underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
