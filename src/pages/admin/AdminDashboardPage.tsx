import { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Activity,
  ArrowUpRight,
  Eye,
  Shield,
  Users,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUserData } from "@/context/UserDataContext"
import { useNetwork } from "@/context/NetworkContext"
import { cn } from "@/lib/utils"

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
      accent: "bg-indigo-500/15 text-indigo-300",
    },
    {
      label: "Suspended",
      value: adminUsersLoading ? "…" : String(Math.max(0, suspended)),
      change: "From Firestore",
      icon: Wallet,
      accent: "bg-rose-500/15 text-rose-300",
    },
    {
      label: "Your watchlist",
      value: String(watchlist.length),
      change: "Addresses tracked",
      icon: Eye,
      accent: "bg-amber-500/15 text-amber-300",
    },
    {
      label: "Active network",
      value: network.label,
      change: `Chain ${network.chainId}`,
      icon: Activity,
      accent: "bg-sky-500/15 text-sky-300",
    },
  ]

  const recentUsers = [...adminUsers]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 6)

  const systems = [
    ["Auth (Firebase)", "Operational"],
    ["Firestore profiles", "Operational"],
    ["Wallet connect (thirdweb)", "Operational"],
    ["Marketplace (Sepolia)", "Operational"],
    [`Network UI (${network.label})`, "Selected"],
  ] as const

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.2), transparent 55%), radial-gradient(ellipse 40% 40% at 95% 10%, rgba(244,63,94,0.08), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
            <Shield className="size-3.5 text-indigo-400" />
            Admin · Overview
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Control center
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
            Users, network status, and system health. Manage accounts in{" "}
            <Link to="/admin/users" className="text-indigo-300 hover:underline">
              Users
            </Link>{" "}
            and chains in{" "}
            <Link
              to="/admin/networks"
              className="text-indigo-300 hover:underline"
            >
              Networks
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      stat.accent
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                  <Users className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recent users
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Newest Firestore profiles
                  </p>
                </div>
              </div>
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                View all
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
              {recentUsers.length === 0 ? (
                <p className="px-4 py-12 text-center text-sm text-slate-500">
                  No Firestore users yet. New signups create a profile doc.
                </p>
              ) : (
                <ul className="divide-y divide-slate-800/60">
                  {recentUsers.map((u) => (
                    <li
                      key={u.uid}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {u.displayName || u.email || u.uid}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.email || u.uid.slice(0, 12)} · {u.role ?? "user"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-700 bg-slate-800/60 text-[10px] text-slate-300"
                        >
                          {u.plan ?? "Free"}
                        </Badge>
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            (u.status ?? "Active") === "Active"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          )}
                        >
                          {u.status ?? "Active"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Activity className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  System status
                </h2>
                <p className="text-[11px] text-slate-500">Core services</p>
              </div>
            </div>

            <div className="space-y-2">
              {systems.map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-[#0b1220] px-4 py-3"
                >
                  <span className="text-sm text-slate-300">{name}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
