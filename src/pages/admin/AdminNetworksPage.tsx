import { useEffect, useState } from "react"
import { Network, Power } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NETWORKS } from "@/lib/networks"
import { useNetwork } from "@/context/NetworkContext"

type NetworkStatus = "Online" | "Maintenance"

const STATUS_KEY = "chainscope.admin.networkStatus"

function loadStatus(): Record<string, NetworkStatus> {
  try {
    const raw = localStorage.getItem(STATUS_KEY)
    if (raw) return JSON.parse(raw) as Record<string, NetworkStatus>
  } catch {
    /* ignore */
  }
  return Object.fromEntries(NETWORKS.map((n) => [n.id, "Online" as const]))
}

export default function AdminNetworksPage() {
  const { networkId, setNetworkId } = useNetwork()
  const [statusMap, setStatusMap] = useState<Record<string, NetworkStatus>>(loadStatus)

  useEffect(() => {
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(statusMap))
    } catch {
      /* ignore */
    }
  }, [statusMap])

  const toggle = (id: string) =>
    setStatusMap((current) => ({
      ...current,
      [id]: current[id] === "Online" ? "Maintenance" : "Online",
    }))

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <div className="flex items-center gap-2">
          <Network className="size-5 text-indigo-300" />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-white">Networks</h1>
            <p className="text-sm text-slate-400">
              Status is stored in this browser; selecting a network updates the
              global app network.
            </p>
          </div>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="text-sm">Configured chains</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {NETWORKS.map((network) => {
              const status = statusMap[network.id] ?? "Online"
              const active = networkId === network.id
              return (
                <div
                  key={network.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <img
                    src={network.logo}
                    alt=""
                    className="size-8 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-100">
                        {network.label}
                      </p>
                      <Badge className="border-slate-700 bg-slate-800 text-[9px]">
                        Chain {network.chainId}
                      </Badge>
                      {active && (
                        <Badge className="border-indigo-400/30 bg-indigo-500/10 text-[9px] text-indigo-200">
                          App default
                        </Badge>
                      )}
                      <span
                        className={
                          status === "Online"
                            ? "text-[11px] text-emerald-300"
                            : "text-[11px] text-amber-300"
                        }
                      >
                        {status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-slate-500">
                      {network.rpc}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                    onClick={() => setNetworkId(network.id)}
                    disabled={active}
                  >
                    Use in app
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                    onClick={() => toggle(network.id)}
                  >
                    <Power className="size-3.5" />
                    {status === "Online" ? "Set maintenance" : "Bring online"}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
