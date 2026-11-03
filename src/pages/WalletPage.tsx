import { useEffect, useMemo, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Search,
  Star,
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
import { NETWORKS, getNetwork, type NetworkId } from "@/lib/networks"
import { cn } from "cn"

type WalletItem = {
  id: string
  name: string
  address: string
  fullAddress?: string
  network: NetworkId
  balance: number
  change: string
  favorite: boolean
  initials: string
  avatar: string
  primary?: boolean
  connected?: boolean
}

const SEED: WalletItem[] = [
  {
    id: "1",
    name: "Main Wallet",
    address: "0x71a3...A92F",
    network: "ethereum",
    balance: 12482.41,
    change: "+3.16%",
    favorite: true,
    initials: "M",
    avatar: "from-indigo-500 to-violet-600",
    primary: true,
  },
  {
    id: "2",
    name: "Trading Wallet",
    address: "0x9b74...821F",
    network: "ethereum",
    balance: 4328.17,
    change: "+5.42%",
    favorite: false,
    initials: "T",
    avatar: "from-sky-400 to-blue-600",
  },
  {
    id: "3",
    name: "NFT Wallet",
    address: "0x3e2f...7Da1",
    network: "base",
    balance: 2984.63,
    change: "+1.27%",
    favorite: false,
    initials: "N",
    avatar: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "4",
    name: "DeFi Wallet",
    address: "0x8f12...4Bc9",
    network: "arbitrum",
    balance: 7215.2,
    change: "−2.34%",
    favorite: false,
    initials: "D",
    avatar: "from-cyan-400 to-blue-500",
  },
  {
    id: "5",
    name: "Solana Wallet",
    address: "So1an...9C3A",
    network: "solana",
    balance: 1892.76,
    change: "+4.86%",
    favorite: false,
    initials: "S",
    avatar: "from-emerald-400 to-teal-600",
  },
]

const activity = [
  {
    label: "Received",
    detail: "+0.42 ETH",
    time: "2m ago",
    icon: ArrowDownLeft,
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    label: "Sent",
    detail: "−250 USDC",
    time: "18m ago",
    icon: ArrowUpRight,
    tone: "text-rose-300 bg-rose-400/10",
  },
  {
    label: "Swapped",
    detail: "ETH → USDC",
    time: "1h ago",
    icon: ArrowLeftRight,
    tone: "text-sky-300 bg-sky-400/10",
  },
  {
    label: "NFT",
    detail: "Mint #4582",
    time: "2h ago",
    icon: Wallet,
    tone: "text-indigo-300 bg-indigo-400/10",
  },
]

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function PortfolioSpark() {
  return (
    <svg
      className="h-16 w-full"
      viewBox="0 0 340 80"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="wpf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 58 L28 52 L56 55 L84 42 L112 46 L140 34 L168 38 L196 26 L224 30 L252 18 L280 22 L308 12 L340 8 L340 80 L0 80 Z"
        fill="url(#wpf)"
      />
      <path
        d="M0 58 L28 52 L56 55 L84 42 L112 46 L140 34 L168 38 L196 26 L224 30 L252 18 L280 22 L308 12 L340 8"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function WalletPage() {
  const account = useActiveAccount()
  const { networkId } = useNetwork()
  const [wallets, setWallets] = useState(SEED)
  const [activeNetwork, setActiveNetwork] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("recent")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newNetwork, setNewNetwork] = useState<NetworkId>(networkId)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Surface connected thirdweb wallet as primary row
  useEffect(() => {
    if (!account?.address) return
    setWallets((current) => {
      const exists = current.some(
        (w) =>
          w.connected ||
          w.fullAddress?.toLowerCase() === account.address.toLowerCase()
      )
      if (exists) {
        return current.map((w) =>
          w.connected ||
          w.fullAddress?.toLowerCase() === account.address.toLowerCase()
            ? {
                ...w,
                connected: true,
                primary: true,
                fullAddress: account.address,
                address: shortAddr(account.address),
                network: networkId === "solana" ? w.network : networkId,
              }
            : { ...w, primary: false }
        )
      }
      const connectedRow: WalletItem = {
        id: "connected",
        name: "Connected wallet",
        address: shortAddr(account.address),
        fullAddress: account.address,
        network: networkId === "solana" ? "ethereum" : networkId,
        balance: 0,
        change: "—",
        favorite: true,
        initials: account.address.slice(2, 4).toUpperCase(),
        avatar: "from-white/20 to-indigo-500",
        primary: true,
        connected: true,
      }
      return [connectedRow, ...current.map((w) => ({ ...w, primary: false }))]
    })
  }, [account?.address, networkId])

  const totalBalance = useMemo(
    () => wallets.reduce((sum, w) => sum + w.balance, 0),
    [wallets]
  )

  const visibleWallets = useMemo(() => {
    let list = wallets.filter((w) => {
      const netOk = activeNetwork === "all" || w.network === activeNetwork
      const q = searchTerm.trim().toLowerCase()
      const searchOk =
        !q ||
        `${w.name} ${w.address} ${w.fullAddress ?? ""}`
          .toLowerCase()
          .includes(q)
      return netOk && searchOk
    })
    if (sortOrder === "highest")
      list = [...list].sort((a, b) => b.balance - a.balance)
    if (sortOrder === "lowest")
      list = [...list].sort((a, b) => a.balance - b.balance)
    return list
  }, [wallets, activeNetwork, searchTerm, sortOrder])

  const toggleFavorite = (id: string) =>
    setWallets((c) =>
      c.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w))
    )

  const addWallet = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    const address = newAddress.trim()
    if (!name || !address) return
    setWallets((c) => [
      ...c,
      {
        id: `${Date.now()}`,
        name,
        address: shortAddr(address),
        fullAddress: address,
        network: newNetwork,
        balance: 0,
        change: "0.00%",
        favorite: false,
        initials: name.slice(0, 1).toUpperCase(),
        avatar: "from-cyan-400 to-blue-600",
      },
    ])
    setNewName("")
    setNewAddress("")
    setShowAddForm(false)
  }

  const copyAddress = async (w: WalletItem) => {
    const text = w.fullAddress ?? w.address
    await navigator.clipboard?.writeText(text)
    setCopiedId(w.id)
    window.setTimeout(() => setCopiedId(null), 1400)
  }

  const countFor = (net: string) =>
    net === "all"
      ? wallets.length
      : wallets.filter((w) => w.network === net).length

  return (
    <div className="min-h-full bg-[#05080f] text-slate-100">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-300/90">Wallets</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Portfolio overview
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-slate-500">
              Track addresses across networks. Connected wallets appear as
              primary when you link via thirdweb.
            </p>
          </div>
          <Button
            size="sm"
            className="h-9 bg-white text-slate-950 hover:bg-slate-100"
            onClick={() => setShowAddForm((v) => !v)}
          >
            <Plus className="size-4" />
            Add wallet
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-4">
            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:col-span-2">
                <div className="pointer-events-none absolute -right-10 top-0 size-40 rounded-full bg-indigo-500/15 blur-3xl" />
                <p className="text-xs text-slate-500">Total tracked value</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-1 text-xs text-emerald-300/90">
                  Demo balances · connect wallet for live address
                </p>
                <div className="mt-4">
                  <PortfolioSpark />
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                <div>
                  <p className="text-xs text-slate-500">Wallets</p>
                  <p className="mt-1 text-3xl font-semibold text-white">
                    {wallets.length}
                  </p>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Favorites</span>
                    <span className="text-slate-300">
                      {wallets.filter((w) => w.favorite).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>App network</span>
                    <span className="text-slate-300">
                      {getNetwork(networkId).label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session</span>
                    <span
                      className={
                        account ? "text-emerald-300" : "text-slate-500"
                      }
                    >
                      {account ? "Connected" : "No wallet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { value: "all", label: "All" },
                ...NETWORKS.filter((n) => n.id !== "polygon").map((n) => ({
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
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
                    activeNetwork === n.value
                      ? "border-white/20 bg-white text-slate-950"
                      : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200"
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
                        : "bg-white/[0.06]"
                    )}
                  >
                    {countFor(n.value)}
                  </span>
                </button>
              ))}
              <div className="ml-auto flex flex-1 items-center gap-2 sm:flex-none">
                <div className="relative min-w-0 flex-1 sm:w-40 sm:flex-none">
                  <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="h-8 border-white/[0.08] bg-white/[0.03] pl-8 text-xs"
                  />
                </div>
                <Select
                  value={sortOrder}
                  onValueChange={(v) => setSortOrder(v ?? "recent")}
                >
                  <SelectTrigger className="h-8 w-[120px] border-white/[0.08] bg-white/[0.03] text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="highest">High → low</SelectItem>
                    <SelectItem value="lowest">Low → high</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add form */}
            {showAddForm && (
              <form
                onSubmit={addWallet}
                className="grid gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:grid-cols-[1fr_1.2fr_130px_auto_auto] sm:items-center"
              >
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Label"
                  className="h-9 border-white/10 bg-[#0a0f1a] text-sm"
                  required
                />
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x… or address"
                  className="h-9 border-white/10 bg-[#0a0f1a] font-mono text-sm"
                  required
                />
                <Select
                  value={newNetwork}
                  onValueChange={(v) => v && setNewNetwork(v as NetworkId)}
                >
                  <SelectTrigger className="h-9 border-white/10 bg-[#0a0f1a] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NETWORKS.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 bg-white text-slate-950 hover:bg-slate-100"
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
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm font-medium text-slate-200">
                  My wallets{" "}
                  <span className="text-slate-500">
                    ({visibleWallets.length})
                  </span>
                </p>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {visibleWallets.map((wallet) => {
                  const net = getNetwork(wallet.network)
                  const neg = wallet.change.startsWith("−")
                  return (
                    <div
                      key={wallet.id}
                      className="group flex flex-wrap items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] sm:flex-nowrap"
                    >
                      <button
                        type="button"
                        aria-label="Favorite"
                        onClick={() => toggleFavorite(wallet.id)}
                        className={cn(
                          "shrink-0",
                          wallet.favorite
                            ? "text-amber-300"
                            : "text-slate-600 hover:text-amber-300"
                        )}
                      >
                        <Star
                          className={cn(
                            "size-4",
                            wallet.favorite && "fill-current"
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ring-1 ring-white/10",
                          wallet.avatar
                        )}
                      >
                        {wallet.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">
                            {wallet.name}
                          </p>
                          {wallet.primary && (
                            <Badge className="h-5 border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300">
                              Primary
                            </Badge>
                          )}
                          {wallet.connected && (
                            <Badge className="h-5 border-indigo-400/20 bg-indigo-400/10 text-[10px] text-indigo-200">
                              Live
                            </Badge>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => void copyAddress(wallet)}
                          className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-300"
                        >
                          {wallet.address}
                          {copiedId === wallet.id ? (
                            <Check className="size-3 text-emerald-300" />
                          ) : (
                            <Copy className="size-3 opacity-60" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <img
                          src={net.logo}
                          alt=""
                          className="size-4 rounded-full"
                        />
                        {net.label}
                      </div>

                      <div className="w-full text-right sm:w-28">
                        <p className="text-sm font-medium text-slate-100">
                          $
                          {wallet.balance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p
                          className={cn(
                            "text-[11px]",
                            neg ? "text-rose-300" : "text-emerald-300",
                            wallet.change === "—" && "text-slate-500"
                          )}
                        >
                          {wallet.change}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {!visibleWallets.length && (
                  <p className="px-4 py-12 text-center text-sm text-slate-500">
                    No wallets match this filter.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-slate-200">Recent activity</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Sample feed for the primary wallet
              </p>
              <ul className="mt-4 space-y-3">
                {activity.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.label + item.time}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full",
                          item.tone
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500">{item.detail}</p>
                      </div>
                      <span className="text-[10px] text-slate-600">
                        {item.time}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-indigo-500/10 to-transparent p-4">
              <p className="text-sm font-medium text-white">Quick tip</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Connect a wallet from Settings or Marketplace to pin it as your
                live primary address. Demo rows stay for layout and filtering.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
