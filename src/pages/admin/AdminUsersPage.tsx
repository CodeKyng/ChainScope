import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { RefreshCw, Search, Shield, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserData } from "@/context/UserDataContext"
import { cn } from "@/lib/utils"

export default function AdminUsersPage() {
  const {
    adminUsers,
    adminUsersLoading,
    refreshAdminUsers,
    setUserStatus,
    profile,
  } = useUserData()
  const [query, setQuery] = useState("")

  useEffect(() => {
    void refreshAdminUsers()
  }, [refreshAdminUsers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = adminUsers.length ? adminUsers : profile ? [profile] : []
    if (!q) return rows
    return rows.filter(
      (u) =>
        (u.displayName ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.uid ?? "").toLowerCase().includes(q)
    )
  }, [query, adminUsers, profile])

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(ellipse 40% 40% at 90% 10%, rgba(168,85,247,0.1), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <UserCog className="size-3.5 text-violet-400" />
                Admin · Users
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Manage accounts
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Profiles from the Firestore{" "}
                <code className="text-slate-300">users</code> collection. Suspend
                or restore access. Overview at{" "}
                <Link to="/admin" className="text-indigo-300 hover:underline">
                  Admin home
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, uid…"
                  className="h-10 w-56 rounded-xl border-slate-700/80 bg-slate-900/70 pl-10 text-sm sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                className="h-10 rounded-full border-slate-700 bg-slate-900/50 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => void refreshAdminUsers()}
                disabled={adminUsersLoading}
              >
                <RefreshCw
                  className={cn(
                    "size-3.5",
                    adminUsersLoading && "animate-spin"
                  )}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
            <UsersIcon />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              All users ({filtered.length})
              {adminUsersLoading ? " · loading…" : ""}
            </h2>
            <p className="text-[11px] text-slate-500">
              Suspend toggles status in Firestore
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-800/80 text-[10px] tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((user) => {
                  const isActive = (user.status ?? "Active") === "Active"
                  return (
                    <tr
                      key={user.uid}
                      className="transition hover:bg-slate-900/50"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-100">
                          {user.displayName || "—"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {user.email || user.uid}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className="border-slate-700 bg-slate-800/60 text-[10px] text-slate-300"
                        >
                          {user.plan ?? "Free"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 capitalize text-slate-300">
                        {user.role ?? "user"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium",
                            isActive ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              isActive ? "bg-emerald-400" : "bg-rose-400"
                            )}
                          />
                          {user.status ?? "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-full border-slate-700 bg-transparent text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white"
                          onClick={() =>
                            void setUserStatus(
                              user.uid,
                              isActive ? "Suspended" : "Active"
                            )
                          }
                        >
                          <Shield className="size-3" />
                          {isActive ? "Suspend" : "Restore"}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-14 text-center text-sm text-slate-500"
                    >
                      No users found. Sign up accounts to populate Firestore, and
                      ensure admin read rules are deployed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
