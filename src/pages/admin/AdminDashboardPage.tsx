import { useEffect } from "react"
import { Activity, Eye, Shield, Users, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserData } from "@/context/UserDataContext"
import { useNetwork } from "@/context/NetworkContext"

export default function AdminDashboardPage() {
  const { adminUsers, refreshAdminUsers, adminUsersLoading, watchlist } =
    useUserData()
  const { network } = useNetwork()

  useEffect(() => {
    void refreshAdminUsers()
  }, [refreshAdminUsers])

  const active = adminUsers.filter((u) => (u.status ?? "Active") === "Active")
    .length
  const suspended = adminUsers.length - active

  const stats = [
    {
      label: "Registered users",
      value: adminUsersLoading ? "…" : String(adminUsers.length),
      change: `${active} active`,
      icon: Users,
    },
    {
      label: "Suspended",
      value: adminUsersLoading ? "…" : String(Math.max(0, suspended)),
      change: "From Firestore",
      icon: Wallet,
    },
    {
      label: "Your watchlist",
      value: String(watchlist.length),
      change: "Addresses tracked",
      icon: Eye,
    },
    {
      label: "Active network",
      value: network.label,
      change: `Chain ${network.chainId}`,
      icon: Activity,
    },
  ]

  const recentUsers = [...adminUsers]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 6)

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-indigo-300" />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-white">Overview</h1>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0"
              >
                <CardContent className="px-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-300">
                        {stat.change}
                      </p>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                      <Icon className="size-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
            <CardHeader className="border-b border-slate-800/80 px-4 py-3">
              <CardTitle className="text-sm">Recent users</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-800/80 p-0">
              {recentUsers.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No Firestore users yet. New signups create a profile doc.
                </p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-slate-200">
                        {u.email || u.displayName || u.uid}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {u.role ?? "user"}
                      </p>
                    </div>
                    <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {u.plan ?? "Free"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
            <CardHeader className="px-4 pb-2">
              <CardTitle className="text-sm">System status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 text-sm">
              {[
                ["Auth (Firebase)", "Operational"],
                ["Firestore profiles", "Operational"],
                ["Wallet connect (thirdweb)", "Operational"],
                ["Marketplace (Sepolia)", "Operational"],
                [`Network UI (${network.label})`, "Selected"],
              ].map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2"
                >
                  <span className="text-slate-300">{name}</span>
                  <span className="text-emerald-300">{status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
