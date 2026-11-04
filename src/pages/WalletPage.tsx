import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
  useIsAutoConnecting,
  useWalletBalance,
} from "thirdweb/react"
import { getWalletBalance } from "thirdweb/wallets"
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  Star,
  Unplug,
  Wallet,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import { getThirdwebChain } from "@/lib/chains"
import {
  explorerAddressUrl,
  getNetwork,
  NETWORKS,
  type NetworkId,
} from "@/lib/networks"
import { client, wallets as thirdwebWallets } from "@/lib/thirdweb"
import { cn } from "@/lib/utils"

type TrackedWallet = {
  id: string
  name: string
  address: string
  network: NetworkId
  favorite: boolean
  connected?: boolean
}

type BalanceMap = Record<
  string,
  { displayValue: string; symbol: string; value: number } | "loading" | "error"
>

const TRACKED_KEY = "chainscope.trackedWallets"

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function loadTracked(): TrackedWallet[] {
  try {
    const raw = localStorage.getItem(TRACKED_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TrackedWallet[]
  } catch {
    return []
  }
}

function saveTracked(list: TrackedWallet[]) {
  try {
    localStorage.setItem(TRACKED_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

function balanceKey(address: string, network: string) {
  return `${address.toLowerCase()}:${network}`
}

export default function WalletPage() {
  const account = useActiveAccount()
  const activeWallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { connect, isConnecting } = useConnectModal()
  const isAutoConnecting = useIsAutoConnecting()
  const { networkId } = useNetwork()
  const { linkedWallet, profile } = useUserData()

  const [tracked, setTracked] = useState<TrackedWallet[]>(loadTracked)
  const [balances, setBalances] = useState<BalanceMap>({})
  const [activeNetwork, setActiveNetwork] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newNetwork, setNewNetwork] = useState<NetworkId>(
    networkId === "solana" ? "ethereum" : networkId
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Live balance for the connected session wallet on the selected app network
  const balanceChain = getThirdwebChain(
    networkId === "solana" ? "ethereum" : networkId
  )
  const {
    data: liveBalance,
    isLoading: liveBalanceLoading,
  } = useWalletBalance({
    client,
    chain: balanceChain ?? undefined,
    address: account?.address,
  })

  // Persist tracked list
  useEffect(() => {
    saveTracked(tracked)
  }, [tracked])

  // Fetch balances for manually tracked EVM addresses
  const fetchTrackedBalances = useCallback(async () => {
    const next: BalanceMap = {}
    await Promise.all(
      tracked.map(async (w) => {
        const key = balanceKey(w.address, w.network)
        const chain = getThirdwebChain(w.network)
        if (!chain) {
          next[key] = "error"
          return
        }
        next[key] = "loading"
        setBalances((prev) => ({ ...prev, [key]: "loading" }))
        try {
          const res = await getWalletBalance({
            client,
            chain,
            address: w.address,
          })
          next[key] = {
            displayValue: res.displayValue,
            symbol: res.symbol,
            value: Number(res.displayValue) || 0,
          }
        } catch {
          next[key] = "error"
        }
      })
    )
    setBalances((prev) => ({ ...prev, ...next }))
  }, [tracked])

  useEffect(() => {
    if (tracked.length) void fetchTrackedBalances()
  }, [tracked, fetchTrackedBalances])

  // Build rows: connected wallet first, then tracked (dedupe by address)
  const rows = useMemo(() => {
    const list: TrackedWallet[] = []
    if (account?.address) {
      list.push({
        id: "session",
        name: "Connected wallet",
        address: account.address,
        network: networkId === "solana" ? "ethereum" : networkId,
        favorite: true,
        connected: true,
      })
    }
    for (const w of tracked) {
      if (
        account?.address &&
        w.address.toLowerCase() === account.address.toLowerCase()
      ) {
        continue
      }
      list.push(w)
    }
    return list
  }, [account?.address, networkId, tracked])

  const visible = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return rows.filter((w) => {
      const netOk = activeNetwork === "all" || w.network === activeNetwork
      const searchOk =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.address.toLowerCase().includes(q)
      return netOk && searchOk
    })
  }, [rows, activeNetwork, searchTerm])

  const totalNativeDisplay = useMemo(() => {
    if (liveBalance) {
      return `${liveBalance.displayValue} ${liveBalance.symbol}`
    }
    return null
  }, [liveBalance])

  const addTracked = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    const address = newAddress.trim()
    if (!name || !address) return
    setTracked((c) => [
      ...c,
      {
        id: `${Date.now()}`,
        name,
        address,
        network: newNetwork,
        favorite: false,
      },
    ])
    setNewName("")
    setNewAddress("")
    setShowAddForm(false)
  }

  const removeTracked = (id: string) => {
    if (id === "session") return
    setTracked((c) => c.filter((w) => w.id !== id))
  }

  const toggleFavorite = (id: string) => {
    if (id === "session") return
    setTracked((c) =>
      c.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w))
    )
  }

  const copyAddress = async (address: string, id: string) => {
    await navigator.clipboard?.writeText(address)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), 1400)
  }

  const handleConnect = async () => {
    await connect({ client, wallets: thirdwebWallets })
  }

  const handleDisconnect = async () => {
    if (!activeWallet) return
    try {
      await disconnect(activeWallet)
    } catch {
      /* ignore */
    }
  }

  const countFor = (net: string) =>
    net === "all"
      ? rows.length
      : rows.filter((w) => w.network === net).length

  const resolving = isAutoConnecting && !account

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.2), transparent 55%), radial-gradient(ellipse 45% 40% at 90% 15%, rgba(16,185,129,0.08), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <Wallet className="size-3.5 text-indigo-400" />
                Wallets
                {resolving && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Reconnecting…</span>
                  </>
                )}
                {account && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400">Connected</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Portfolio overview
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Live balance from your connected wallet. Session is restored on
                reload via AutoConnect. Track extra addresses below — no demo
                data.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {!account ? (
                <Button
                  className="h-10 rounded-full bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                  disabled={isConnecting || resolving}
                  onClick={() => void handleConnect()}
                >
                  {isConnecting || resolving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Wallet className="size-3.5" />
                  )}
                  {resolving
                    ? "Reconnecting…"
                    : isConnecting
                      ? "Connecting…"
                      : "Connect wallet"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-slate-700 bg-slate-900/50 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => void handleDisconnect()}
                >
                  <Unplug className="size-3.5" />
                  Disconnect
                </Button>
              )}
              <Button
                variant="outline"
                className="h-10 rounded-full border-slate-700 bg-slate-900/50 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setShowAddForm((v) => !v)}
              >
                <Plus className="size-3.5" />
                Track address
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] p-5 sm:col-span-2">
            <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-indigo-500/15 blur-3xl" />
            <p className="text-xs text-slate-500">
              Connected balance · {getNetwork(networkId).label}
            </p>
            {account ? (
              <>
                <p className="mt-1 font-mono text-sm text-slate-400">
                  {shortAddr(account.address)}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {liveBalanceLoading
                    ? "…"
                    : totalNativeDisplay ?? "—"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Native token on selected network
                  {linkedWallet &&
                    profile?.walletAddress &&
                    " · linked to your account"}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-3xl font-semibold text-slate-600">—</p>
                <p className="mt-1 text-xs text-slate-500">
                  Connect a wallet to see live balance. AutoConnect will restore
                  the last session after refresh.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-[#0b1220] p-5">
            <div>
              <p className="text-xs text-slate-500">Addresses</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {rows.length}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Session</span>
                <span className={account ? "text-emerald-400" : "text-slate-500"}>
                  {resolving
                    ? "Reconnecting"
                    : account
                      ? "Connected"
                      : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tracked</span>
                <span className="text-slate-300">{tracked.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-slate-300">
                  {getNetwork(networkId).label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: "all", label: "All" },
            ...NETWORKS.filter((n) => n.id !== "solana").map((n) => ({
              value: n.id,
              label: n.label,
              logo: n.logo,
            })),
          ].map((n) => (
            <button
              key={n.value}
              type="button"
              onClick={() => setActiveNetwork(n.value)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition",
                activeNetwork === n.value
                  ? "border-transparent bg-white text-slate-900"
                  : "border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              )}
            >
              {"logo" in n && n.logo && (
                <img
                  src={n.logo as string}
                  alt=""
                  className="size-3.5 rounded-full"
                />
              )}
              {n.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px]",
                  activeNetwork === n.value
                    ? "bg-black/10"
                    : "bg-slate-800"
                )}
              >
                {countFor(n.value)}
              </span>
            </button>
          ))}
          <div className="relative ml-auto min-w-0 flex-1 sm:w-48 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="h-8 border-slate-700/80 bg-slate-900/50 pl-8 text-xs"
            />
          </div>
        </div>

        {/* Add tracked */}
        {showAddForm && (
          <form
            onSubmit={addTracked}
            className="grid gap-2 rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 sm:grid-cols-[1fr_1.2fr_140px_auto_auto] sm:items-end"
          >
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500">Label</label>
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Treasury"
                className="h-9 rounded-xl border-slate-700 bg-slate-900/80 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500">Address</label>
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x…"
                className="h-9 rounded-xl border-slate-700 bg-slate-900/80 font-mono text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500">Network</label>
              <Select
                value={newNetwork}
                onValueChange={(v) => v && setNewNetwork(v as NetworkId)}
              >
                <SelectTrigger className="h-9 rounded-xl border-slate-700 bg-slate-900/80 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.filter((n) => n.id !== "solana").map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-full bg-white text-slate-900 hover:bg-slate-100"
            >
              Save
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400"
            >
              <X className="size-4" />
            </Button>
          </form>
        )}

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
          <div className="border-b border-slate-800/80 px-4 py-3">
            <p className="text-sm font-medium text-slate-200">
              Addresses{" "}
              <span className="text-slate-500">({visible.length})</span>
            </p>
          </div>

          {!visible.length ? (
            <div className="px-4 py-14 text-center">
              <Wallet className="mx-auto size-10 text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-300">
                {rows.length === 0
                  ? "No wallet connected"
                  : "No addresses match this filter"}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-500">
                {rows.length === 0
                  ? "Connect a wallet to see your live balance, or track any EVM address."
                  : "Try another network chip or clear search."}
              </p>
              {rows.length === 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button
                    className="h-9 rounded-full bg-white px-4 text-xs font-medium text-slate-900 hover:bg-slate-100"
                    disabled={isConnecting || resolving}
                    onClick={() => void handleConnect()}
                  >
                    Connect wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 rounded-full border-slate-700 text-xs"
                    onClick={() => setShowAddForm(true)}
                  >
                    Track address
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {visible.map((wallet) => {
                const net = getNetwork(wallet.network)
                const key = balanceKey(wallet.address, wallet.network)
                const bal =
                  wallet.connected && liveBalance
                    ? {
                        displayValue: liveBalance.displayValue,
                        symbol: liveBalance.symbol,
                      }
                    : balances[key]

                return (
                  <div
                    key={wallet.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3.5 transition hover:bg-slate-900/40 sm:flex-nowrap"
                  >
                    <button
                      type="button"
                      aria-label="Favorite"
                      disabled={wallet.connected}
                      onClick={() => toggleFavorite(wallet.id)}
                      className={cn(
                        "shrink-0",
                        wallet.favorite
                          ? "text-amber-300"
                          : "text-slate-600 hover:text-amber-300",
                        wallet.connected && "cursor-default"
                      )}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          wallet.favorite && "fill-current"
                        )}
                      />
                    </button>

                    <img
                      src={net.logo}
                      alt=""
                      className="size-10 shrink-0 rounded-full object-cover ring-1 ring-slate-700"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {wallet.name}
                        </p>
                        {wallet.connected && (
                          <Badge className="h-5 border-emerald-400/25 bg-emerald-400/10 text-[10px] text-emerald-300">
                            Session
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="h-5 border-slate-700 bg-slate-800/60 text-[9px] text-slate-400"
                        >
                          {net.label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                        {shortAddr(wallet.address)}
                      </p>
                    </div>

                    <div className="w-full text-right sm:w-36">
                      {bal === "loading" ||
                      (wallet.connected && liveBalanceLoading) ? (
                        <Loader2 className="ml-auto size-4 animate-spin text-slate-500" />
                      ) : bal === "error" || !bal ? (
                        <p className="text-sm text-slate-500">—</p>
                      ) : (
                        <p className="text-sm font-medium text-slate-100">
                          {bal.displayValue}{" "}
                          <span className="text-slate-500">{bal.symbol}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="size-8 text-slate-400 hover:text-white"
                        onClick={() =>
                          void copyAddress(wallet.address, wallet.id)
                        }
                        aria-label="Copy address"
                      >
                        {copiedId === wallet.id ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="size-8 text-slate-400 hover:text-white"
                        onClick={() =>
                          window.open(
                            explorerAddressUrl(wallet.network, wallet.address),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        aria-label="Explorer"
                      >
                        <ExternalLink className="size-3.5" />
                      </Button>
                      {!wallet.connected && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="size-8 text-slate-400 hover:text-rose-300"
                          onClick={() => removeTracked(wallet.id)}
                          aria-label="Remove"
                        >
                          <X className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-600">
          Wallet session persists across reloads. Link email + wallet in{" "}
          <Link to="/settings" className="text-indigo-400 hover:underline">
            Settings
          </Link>{" "}
          for a single identity across Marketplace and alerts.
        </p>
      </div>
    </div>
  )
}
