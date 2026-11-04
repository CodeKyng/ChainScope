import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Check, Network, Power } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NETWORKS } from "@/lib/networks"
import { useNetwork } from "@/context/NetworkContext"
import { cn } from "@/lib/utils"

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
  const [statusMap, setStatusMap] =
    useState<Record<string, NetworkStatus>>(loadStatus)

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

  const onlineCount = NETWORKS.filter(
    (n) => (statusMap[n.id] ?? "Online") === "Online"
  ).length

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(56,189,248,0.14), transparent 55%), radial-gradient(ellipse 40% 40% at 90% 10%, rgba(99,102,241,0.12), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
            <Network className="size-3.5 text-sky-400" />
            Admin · Networks · {onlineCount}/{NETWORKS.length} online
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Configured chains
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
            Status is stored in this browser. Selecting a network updates the
            global app network used across Explore, Watchlist, and the header.{" "}
            <Link to="/admin" className="text-indigo-300 hover:underline">
              Back to overview
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {NETWORKS.map((network) => {
            const status = statusMap[network.id] ?? "Online"
            const active = networkId === network.id
            const isOnline = status === "Online"

            return (
              <article
                key={network.id}
                className={cn(
                  "flex flex-col overflow-hidden rounded-2xl border bg-[#0b1220] p-4 transition",
                  active
                    ? "border-indigo-500/40 ring-1 ring-indigo-500/20"
                    : "border-slate-800/80 hover:border-slate-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={network.logo}
                    alt=""
                    className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-700/80"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-white">
                        {network.label}
                      </h3>
                      {active && (
                        <Badge className="border-indigo-400/30 bg-indigo-500/15 text-[9px] text-indigo-200">
                          App default
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Chain {network.chainId}
                    </p>
                    <p
                      className={cn(
                        "mt-1 flex items-center gap-1.5 text-[11px] font-medium",
                        isOnline ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          isOnline ? "bg-emerald-400" : "bg-amber-400"
                        )}
                      />
                      {status}
                    </p>
                  </div>
                </div>

                <p className="mt-3 truncate font-mono text-[10px] text-slate-600">
                  {network.rpc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/80 pt-3">
                  <Button
                    size="sm"
                    className={cn(
                      "h-8 flex-1 rounded-full text-xs",
                      active
                        ? "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30"
                        : "bg-white text-slate-900 hover:bg-slate-100"
                    )}
                    onClick={() => setNetworkId(network.id)}
                    disabled={active}
                  >
                    {active ? (
                      <>
                        <Check className="size-3.5" />
                        In use
                      </>
                    ) : (
                      "Use in app"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full border-slate-700 bg-transparent text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => toggle(network.id)}
                  >
                    <Power className="size-3.5" />
                    {isOnline ? "Maintenance" : "Online"}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
