import { useState } from "react"
import { Bell, BellOff, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AlertRule = {
  id: number
  title: string
  description: string
  enabled: boolean
  channel: "Email" | "In-app"
}

const initialRules: AlertRule[] = [
  {
    id: 1,
    title: "Large inbound transfer",
    description: "Notify when any watched wallet receives > $10,000",
    enabled: true,
    channel: "Email",
  },
  {
    id: 2,
    title: "Large outbound transfer",
    description: "Notify when any watched wallet sends > $10,000",
    enabled: true,
    channel: "In-app",
  },
  {
    id: 3,
    title: "New NFT mint",
    description: "Alert when a watched wallet mints or receives an NFT",
    enabled: false,
    channel: "In-app",
  },
  {
    id: 4,
    title: "Token price move",
    description: "Daily digest when ETH moves more than 5%",
    enabled: true,
    channel: "Email",
  },
]

const recent = [
  {
    id: 1,
    text: "Main Wallet received 0.42 ETH",
    time: "2 mins ago",
    status: "new" as const,
  },
  {
    id: 2,
    text: "Trading Wallet sent 250 USDC",
    time: "18 mins ago",
    status: "read" as const,
  },
  {
    id: 3,
    text: "ETH +3.4% in the last 24h",
    time: "1 hr ago",
    status: "read" as const,
  },
]

export default function AlertsPage() {
  const [rules, setRules] = useState(initialRules)

  const toggle = (id: number) =>
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    )

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
            Alerts
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Stay on top of on-chain events
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure rules and review recent notifications.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
            <CardHeader className="border-b border-slate-800/80 px-4 py-3">
              <CardTitle className="text-sm">Alert rules</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-800/80 p-0">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-wrap items-start gap-3 px-4 py-3"
                >
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                    {rule.enabled ? (
                      <Bell className="size-4" />
                    ) : (
                      <BellOff className="size-4 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-100">
                        {rule.title}
                      </p>
                      <Badge className="border-slate-700 bg-slate-800 text-[9px] text-slate-300">
                        {rule.channel}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {rule.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={rule.enabled ? "default" : "outline"}
                    className={
                      rule.enabled
                        ? "bg-indigo-600 text-xs hover:bg-indigo-500"
                        : "border-slate-700 text-xs"
                    }
                    onClick={() => toggle(rule.id)}
                  >
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
            <CardHeader className="border-b border-slate-800/80 px-4 py-3">
              <CardTitle className="text-sm">Recent notifications</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-800/80 p-0">
              {recent.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <CheckCircle2
                    className={`mt-0.5 size-4 shrink-0 ${
                      item.status === "new"
                        ? "text-emerald-300"
                        : "text-slate-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200">{item.text}</p>
                    <p className="text-[11px] text-slate-500">{item.time}</p>
                  </div>
                  {item.status === "new" && (
                    <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[9px] text-emerald-300">
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
