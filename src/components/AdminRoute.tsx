import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { isAdminEmail } from "@/lib/roles"

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#070b14] text-slate-100">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdminEmail(user.email)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
