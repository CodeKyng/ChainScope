import { Navigate } from "react-router-dom"
import { useActiveAccount } from "thirdweb/react"
import { SignupForm } from "@/components/signup-form"
import { useAuth } from "@/context/AuthContext"

export default function SignupPage() {
  const { user, loading } = useAuth()
  const account = useActiveAccount()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#070b14] text-slate-100">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  if (user || account) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <div className="grid min-h-svh bg-[#070b14] text-slate-100 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium text-slate-100">
            <div className="flex size-6 items-center justify-center rounded-md">
              <img src="/logo.png" alt="ChainScope" className="size-6" />
            </div>
            ChainScope
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-slate-900 lg:block">
        <img
          src="/logo.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      </div>
    </div>
  )
}
