import { useEffect, useMemo, useState } from "react"
import { Search, Shield, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUserData } from "@/context/UserDataContext"

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
        (u.email ?? "").toLowerCase().includes(q)
    )
  }, [query, adminUsers, profile])

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1200px] space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCog className="size-5 text-indigo-300" />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
                Admin
              </p>
              <h1 className="text-2xl font-semibold text-white">Users</h1>
              <p className="text-xs text-slate-500">
                Loaded from Firestore <code className="text-slate-400">users</code>{" "}
                collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users"
                className="h-9 w-56 border-slate-700 bg-slate-900 pl-8 text-sm"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-xs"
              onClick={() => void refreshAdminUsers()}
              disabled={adminUsersLoading}
            >
              Refresh
            </Button>
          </div>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="text-sm">
              All users ({filtered.length})
              {adminUsersLoading ? " · loading…" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-800 text-[11px] text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">User</th>
                  <th className="px-4 py-2.5 font-medium">Plan</th>
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">
                        {user.displayName || "—"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {user.email || user.uid}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                        {user.plan ?? "Free"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {user.role ?? "user"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          (user.status ?? "Active") === "Active"
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {user.status ?? "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-slate-700 text-[11px]"
                        onClick={() =>
                          void setUserStatus(
                            user.uid,
                            (user.status ?? "Active") === "Active"
                              ? "Suspended"
                              : "Active"
                          )
                        }
                      >
                        <Shield className="size-3" />
                        {(user.status ?? "Active") === "Active"
                          ? "Suspend"
                          : "Restore"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No users found. Sign up accounts to populate Firestore, and
                      deploy open read rules for admins.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
