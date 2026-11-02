import { useMemo, useState } from "react"
import { Search, Shield, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type UserRow = {
  id: number
  name: string
  email: string
  plan: "Free" | "Pro" | "Team"
  status: "Active" | "Suspended"
  wallets: number
}

const seed: UserRow[] = [
  {
    id: 1,
    name: "Ada Lovelace",
    email: "ada@example.com",
    plan: "Pro",
    status: "Active",
    wallets: 4,
  },
  {
    id: 2,
    name: "Satoshi N.",
    email: "satoshi@mail.io",
    plan: "Free",
    status: "Active",
    wallets: 1,
  },
  {
    id: 3,
    name: "Builder Dev",
    email: "builder@dev.xyz",
    plan: "Pro",
    status: "Active",
    wallets: 7,
  },
  {
    id: 4,
    name: "Fund Analyst",
    email: "analyst@funds.co",
    plan: "Team",
    status: "Active",
    wallets: 12,
  },
  {
    id: 5,
    name: "Spam Account",
    email: "spam@temp.mail",
    plan: "Free",
    status: "Suspended",
    wallets: 0,
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(seed)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [query, users])

  const toggleStatus = (id: number) =>
    setUsers((current) =>
      current.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    )

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
            </div>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users"
              className="h-9 w-56 border-slate-700 bg-slate-900 pl-8 text-sm"
            />
          </div>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="text-sm">
              All users ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-800 text-[11px] text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">User</th>
                  <th className="px-4 py-2.5 font-medium">Plan</th>
                  <th className="px-4 py-2.5 font-medium">Wallets</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.wallets}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.status === "Active"
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-slate-700 text-[11px]"
                        onClick={() => toggleStatus(user.id)}
                      >
                        <Shield className="size-3" />
                        {user.status === "Active" ? "Suspend" : "Restore"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
