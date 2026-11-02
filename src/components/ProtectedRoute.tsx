import { Navigate, Outlet } from "react-router-dom"
import { useActiveAccount } from "thirdweb/react"
import { useAuth } from "@/context/AuthContext"

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const account = useActiveAccount()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#070b14] text-slate-100">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  // Allow access if Firebase user OR thirdweb wallet is connected
  if (!user && !account) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
