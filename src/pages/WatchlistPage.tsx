import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  ExternalLink,
  Plus,
  Search,
  Star,
  Trash2,
  Wallet,
} from "lucide-react"
import { NetworkIcon } from "@/components/NetworkIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import {
  explorerAddressUrl,
  getNetwork,
  type NetworkId,
} from "@/lib/networks"
import { cn } from "@/lib/utils"

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function WatchlistPage() {
  const { networkId, networks } = useNetwork()
  const { watchlist, addWatchItem, removeWatchItem, pushNotification } =
    useUserData()
  const [label, setLabel] = useState("")
  const [address, setAddress] = useState("")
  const [itemNetwork, setItemNetwork] = useState<NetworkId>(networkId)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState("")
  const [filterNet, setFilterNet] = useState<NetworkId | "all">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return watchlist.filter((item) => {
      const matchesNet = filterNet === "all" || item.network === filterNet
      const matchesQ =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.network.toLowerCase().includes(q)
      return matchesNet && matchesQ
    })
  }, [watchlist, query, filterNet])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim() || !address.trim()) return
    const addr = address.trim()
    await addWatchItem({
      label: label.trim(),
      address: addr,
      network: itemNetwork,
      notes: "",
    })
    await pushNotification(`Added ${label.trim()} to watchlist`)
    setLabel("")
    setAddress("")
    setShowForm(false)
  }

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(251,191,36,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(99,102,241,0.14), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <Star className="size-3.5 text-amber-400" />
                Watchlist · {watchlist.length} saved
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Addresses you care about
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Track wallets across chains. Saved locally and synced to your
                account when signed in. Arm alerts from here or the{" "}
                <Link to="/alerts" className="text-indigo-300 hover:underline">
                  Alerts
                </Link>{" "}
                page.
              </p>
            </div>

            <Button
              className="h-10 shrink-0 rounded-full bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
              onClick={() => setShowForm((v) => !v)}
            >
              <Plus className="size-3.5" />
              {showForm ? "Cancel" : "Add address"}
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search label, address, or network…"
                className="h-11 rounded-xl border-slate-700/80 bg-slate-900/70 pl-11 text-sm placeholder:text-slate-500 focus-visible:ring-amber-500/30"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterNet("all")}
                className={cn(
                  "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  filterNet === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "border border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                )}
              >
                All
              </button>
              {networks.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setFilterNet(n.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                    filterNet === n.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "border border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  )}
                >
                  <NetworkIcon networkId={n.id} sizeClass="size-3.5" />
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <form
            onSubmit={(e) => void addItem(e)}
            className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]"
          >
            <div className="border-b border-slate-800/80 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Add to watchlist
              </h2>
              <p className="text-[11px] text-slate-500">
                Label + address + network. Synced when signed in.
              </p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_160px_auto]">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Label</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Main whale"
                  className="h-10 rounded-xl border-slate-700 bg-slate-900/80 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Address or ENS
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x… or vitalik.eth"
                  className="h-10 rounded-xl border-slate-700 bg-slate-900/80 font-mono text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Network</Label>
                <Select
                  value={itemNetwork}
                  onValueChange={(v) => v && setItemNetwork(v as NetworkId)}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-700 bg-slate-900/80 text-xs">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <NetworkIcon
                          networkId={itemNetwork}
                          sizeClass="size-4"
                        />
                        {getNetwork(itemNetwork).label}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        <span className="flex items-center gap-2">
                          <NetworkIcon networkId={n.id} sizeClass="size-4" />
                          {n.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="h-10 w-full rounded-full bg-white text-sm font-medium text-slate-900 hover:bg-slate-100 lg:w-auto lg:px-6"
                >
                  <Star className="size-3.5" />
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
              <Star className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Saved addresses
              </h2>
              <p className="text-[11px] text-slate-500">
                {filtered.length} of {watchlist.length} shown
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
              <Wallet className="mx-auto size-10 text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-300">
                {watchlist.length === 0
                  ? "Your watchlist is empty"
                  : "No addresses match your filters"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
                {watchlist.length === 0
                  ? "Add a wallet label and address to start tracking activity."
                  : "Try another network chip or clear the search."}
              </p>
              {watchlist.length === 0 && (
                <Button
                  className="mt-5 h-9 rounded-full bg-white px-4 text-xs font-medium text-slate-900 hover:bg-slate-100"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="size-3.5" />
                  Add address
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => {
                const net = getNetwork(item.network)
                return (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 transition hover:border-slate-700 hover:bg-[#0d1524]"
                  >
                    <div className="flex items-start gap-3">
                      <NetworkIcon
                        networkId={item.network}
                        sizeClass="size-11"
                        className="rounded-xl"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="truncate text-sm font-medium text-white">
                            {item.label}
                          </h3>
                          <Badge
                            variant="outline"
                            className="h-5 border-slate-700 bg-slate-800/60 px-1.5 text-[9px] font-normal text-slate-400"
                          >
                            {net.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {shortAddr(item.address)}
                        </p>
                        {item.notes ? (
                          <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                            {item.notes}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-800/80 pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 flex-1 rounded-full border-slate-700 bg-transparent text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() =>
                          void pushNotification(
                            `Alert armed for ${item.label} (${net.label})`
                          )
                        }
                      >
                        <Bell className="size-3.5" />
                        Arm alert
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="size-8 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
                        aria-label="Open explorer"
                        onClick={() =>
                          window.open(
                            explorerAddressUrl(item.network, item.address),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <ExternalLink className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="size-8 rounded-full text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                        aria-label="Remove"
                        onClick={() => void removeWatchItem(item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
