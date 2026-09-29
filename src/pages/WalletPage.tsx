import { useMemo, useState } from "react"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Copy,
  Eye,
  Plus,
  Search,
  Star,
  Wallet,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import arbitrumLogo from "@/assets/arbitrum.png"
import baseLogo from "@/assets/Base.png"
import ethereumLogo from "@/assets/ethereum.png"
import solanaLogo from "@/assets/solana.png"

const networks = [
  { name: "Ethereum", value: "ethereum", logo: ethereumLogo },
  { name: "Base", value: "base", logo: baseLogo },
  { name: "Arbitrum", value: "arbitrum", logo: arbitrumLogo },
  { name: "Solana", value: "solana", logo: solanaLogo },
]

type WalletItem = {
  id: number
  name: string
  address: string
  network: string
  balance: number
  change: string
  favorite: boolean
  initials: string
  avatar: string
  primary?: boolean
}

const startingWallets: WalletItem[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: "NFT Wallet",
    address: "0x3e2f...7Da1",
    network: "base",
    balance: 2984.63,
    change: "+1.27%",
    favorite: false,
    initials: "N",
    avatar: "from-violet-400 to-blue-500",
  },
  {
    id: 4,
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
    id: 5,
    name: "Solana Wallet",
    address: "0x5d7e...9C3A",
    network: "solana",
    balance: 1892.76,
    change: "+4.86%",
    favorite: false,
    initials: "S",
    avatar: "from-blue-500 to-indigo-500",
  },
]

const activity = [
  {
    label: "Received",
    detail: "+0.42 ETH",
    time: "2 mins ago",
    icon: ArrowDownLeft,
    color: "text-emerald-300 bg-emerald-400/10",
  },
  {
    label: "Sent",
    detail: "−250 USDC",
    time: "18 mins ago",
    icon: ArrowUpRight,
    color: "text-rose-300 bg-rose-400/10",
  },
  {
    label: "Swapped",
    detail: "ETH → USDC",
    time: "1 hr ago",
    icon: ArrowLeftRight,
    color: "text-sky-300 bg-sky-400/10",
  },
  {
    label: "NFT Minted",
    detail: "#4582",
    time: "2 hrs ago",
    icon: Wallet,
    color: "text-indigo-300 bg-indigo-400/10",
  },
]

function ValueChart() {
  return (
    <svg
      className="h-[72px] w-full"
      viewBox="0 0 340 92"
      role="img"
      aria-label="Portfolio value trending upward"
    >
      <defs>
        <linearGradient id="wallet-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7668ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7668ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[16, 42, 68].map((y) => (
        <line
          key={y}
          x1="0"
          x2="340"
          y1={y}
          y2={y}
          stroke="#1c2a40"
          strokeDasharray="3 5"
        />
      ))}
      <path
        d="M0 68 L17 61 L34 66 L51 53 L68 57 L85 49 L102 54 L119 43 L136 47 L153 34 L170 38 L187 29 L204 34 L221 22 L238 25 L255 16 L272 20 L289 8 L306 13 L323 10 L340 2 L340 88 L0 88 Z"
        fill="url(#wallet-chart-fill)"
      />
      <path
        d="M0 68 L17 61 L34 66 L51 53 L68 57 L85 49 L102 54 L119 43 L136 47 L153 34 L170 38 L187 29 L204 34 L221 22 L238 25 L255 16 L272 20 L289 8 L306 13 L323 10 L340 2"
        fill="none"
        stroke="#887bff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-xs font-semibold text-slate-200">{children}</h2>
      {action}
    </div>
  )
}

export default function WalletPage() {
  const [wallets, setWallets] = useState(startingWallets)
  const [activeNetwork, setActiveNetwork] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("recent")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWalletName, setNewWalletName] = useState("")
  const [newWalletAddress, setNewWalletAddress] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const visibleWallets = useMemo(() => {
    const filtered = wallets.filter((wallet) => {
      const matchesNetwork =
        activeNetwork === "all" || wallet.network === activeNetwork
      const query = searchTerm.trim().toLowerCase()
      return (
        matchesNetwork &&
        (!query ||
          `${wallet.name} ${wallet.address}`.toLowerCase().includes(query))
      )
    })
    if (sortOrder === "highest")
      return [...filtered].sort(
        (first, second) => second.balance - first.balance
      )
    if (sortOrder === "lowest")
      return [...filtered].sort(
        (first, second) => first.balance - second.balance
      )
    return filtered
  }, [activeNetwork, searchTerm, sortOrder, wallets])

  const toggleFavorite = (id: number) => {
    setWallets((current) =>
      current.map((wallet) =>
        wallet.id === id ? { ...wallet, favorite: !wallet.favorite } : wallet
      )
    )
  }

  const addWallet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newWalletName.trim()
    const address = newWalletAddress.trim()
    if (!name || !address) return
    setWallets((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        address:
          address.length > 14
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : address,
        network: "ethereum",
        balance: 0,
        change: "0.00%",
        favorite: false,
        initials: name.slice(0, 1).toUpperCase(),
        avatar: "from-cyan-400 to-blue-500",
      },
    ])
    setNewWalletName("")
    setNewWalletAddress("")
    setShowAddForm(false)
  }

  const copyAddress = async (wallet: WalletItem) => {
    await navigator.clipboard?.writeText(wallet.address)
    setCopiedId(wallet.id)
    window.setTimeout(() => setCopiedId(null), 1400)
  }

  const countForNetwork = (network: string) =>
    network === "all"
      ? wallets.length
      : wallets.filter((wallet) => wallet.network === network).length

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_262px]">
          <main className="min-w-0 space-y-3">
            <section className="relative isolate overflow-hidden rounded-lg border border-slate-800/80 bg-[radial-gradient(ellipse_at_76%_60%,rgba(37,99,235,0.17),transparent_38%),linear-gradient(110deg,#09111e,#070c16_70%)] px-4 py-5 sm:px-5 sm:py-6">
              <div className="relative z-10 max-w-[620px]">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-sky-300 uppercase">
                  Your wallets
                </p>
                <h1 className="mt-1.5 text-2xl leading-tight font-semibold tracking-tight text-slate-100 sm:text-[28px]">
                  Manage your wallets
                  <br className="hidden sm:block" /> and{" "}
                  <span className="text-indigo-400">
                    track on-chain activity.
                  </span>
                </h1>
                <p className="mt-2 max-w-xl text-xs leading-5 text-slate-400">
                  Add, organize, and monitor your wallets across multiple
                  networks.
                  <br className="hidden sm:block" /> Get real-time insights into
                  your assets, transactions, and more.
                </p>
              </div>
              <img
                src="/hero.png"
                alt="Wallet and Ethereum network illustration"
                className="pointer-events-none absolute top-1/2 right-2 hidden w-[210px] -translate-y-1/2 object-contain opacity-95 md:block"
              />
            </section>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { value: "all", label: "All networks" },
                ...networks.map((network) => ({
                  value: network.value,
                  label: network.name,
                })),
              ].map((network) => (
                <Button
                  key={network.value}
                  size="sm"
                  variant={
                    activeNetwork === network.value ? "default" : "outline"
                  }
                  onClick={() => setActiveNetwork(network.value)}
                  className={`h-7 gap-1.5 px-2.5 text-[10px] ${activeNetwork === network.value ? "border-indigo-500/40 bg-indigo-600/80 text-white hover:bg-indigo-500" : "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800"}`}
                >
                  {network.value !== "all" && (
                    <img
                      src={
                        networks.find((item) => item.value === network.value)
                          ?.logo
                      }
                      alt=""
                      className="size-3.5 rounded-full"
                    />
                  )}
                  {network.label}
                  <span className="rounded bg-black/15 px-1 text-[9px]">
                    {countForNetwork(network.value)}
                  </span>
                </Button>
              ))}
              <div className="ml-auto flex items-center gap-1.5">
                <div className="relative hidden sm:block">
                  <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search wallets"
                    aria-label="Search wallets"
                    className="h-8 w-36 border-slate-800 bg-slate-900/60 pl-8 text-xs placeholder:text-slate-500"
                  />
                </div>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value ?? "recent")}
                >
                  <SelectTrigger className="h-8 w-[130px] border-slate-800 bg-slate-900/60 text-[10px] text-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Sort: Recently used</SelectItem>
                    <SelectItem value="highest">
                      Balance: High to low
                    </SelectItem>
                    <SelectItem value="lowest">Balance: Low to high</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative mt-2 w-full sm:hidden">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-500" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search wallets"
                  aria-label="Search wallets"
                  className="h-8 border-slate-800 bg-slate-900/60 pl-8 text-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            <Card className="gap-0 rounded-lg border border-slate-800/80 bg-[#09111e] py-0 text-slate-100 ring-0">
              <CardHeader className="flex-row items-center justify-between px-3.5 py-3 sm:px-4">
                <CardTitle className="text-sm font-semibold">
                  My wallets{" "}
                  <span className="ml-1 text-slate-500">
                    ({visibleWallets.length})
                  </span>
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowAddForm((open) => !open)}
                  className="h-7 bg-indigo-600 px-2.5 text-[10px] text-white hover:bg-indigo-500"
                >
                  <Plus className="size-3.5" />
                  Add wallet
                </Button>
              </CardHeader>
              {showAddForm && (
                <form
                  onSubmit={addWallet}
                  className="mx-3.5 mb-3 grid gap-2 rounded-md border border-slate-800 bg-slate-900/60 p-3 sm:mx-4 sm:grid-cols-[1fr_1.3fr_auto_auto] sm:items-center"
                >
                  <Input
                    autoFocus
                    value={newWalletName}
                    onChange={(event) => setNewWalletName(event.target.value)}
                    placeholder="Wallet name"
                    aria-label="Wallet name"
                    className="h-8 border-slate-700 bg-[#090f1b] text-xs"
                    required
                  />
                  <Input
                    value={newWalletAddress}
                    onChange={(event) =>
                      setNewWalletAddress(event.target.value)
                    }
                    placeholder="Wallet address"
                    aria-label="Wallet address"
                    className="h-8 border-slate-700 bg-[#090f1b] font-mono text-xs"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 bg-indigo-600 text-xs"
                  >
                    Save wallet
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Cancel adding wallet"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400"
                  >
                    <X className="size-4" />
                  </Button>
                </form>
              )}
              <CardContent className="space-y-1.5 px-2.5 pb-3 sm:px-3.5">
                {visibleWallets.length ? (
                  visibleWallets.map((wallet) => {
                    const network =
                      networks.find((item) => item.value === wallet.network) ??
                      networks[0]
                    const isNegative = wallet.change.startsWith("−")
                    return (
                      <div
                        key={wallet.id}
                        className="grid grid-cols-[20px_minmax(0,1fr)_minmax(105px,0.75fr)_minmax(96px,0.65fr)] items-center gap-2 rounded-md border border-slate-800 bg-[#0a1422]/70 px-2.5 py-2.5 transition-colors hover:border-slate-700 sm:grid-cols-[24px_minmax(160px,1.2fr)_minmax(105px,0.75fr)_minmax(110px,0.7fr)] sm:gap-3 sm:px-3"
                      >
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={
                            wallet.favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          onClick={() => toggleFavorite(wallet.id)}
                          className={
                            wallet.favorite
                              ? "text-amber-300 hover:text-amber-200"
                              : "text-slate-500 hover:text-amber-300"
                          }
                        >
                          <Star
                            className={`size-3.5 ${wallet.favorite ? "fill-current" : ""}`}
                          />
                        </Button>
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div
                            className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${wallet.avatar} text-xs font-semibold text-white`}
                          >
                            {wallet.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="truncate text-[11px] font-medium text-slate-200">
                                {wallet.name}
                              </p>
                              {wallet.primary && (
                                <Badge className="h-4 border-emerald-400/20 bg-emerald-400/10 px-1.5 text-[8px] text-emerald-300">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => void copyAddress(wallet)}
                              className="mt-0.5 flex items-center gap-1 font-mono text-[9px] text-slate-500 hover:text-slate-300"
                            >
                              {wallet.address}
                              {copiedId === wallet.id ? (
                                <Check className="size-3 text-emerald-300" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <Select defaultValue={wallet.network}>
                          <SelectTrigger className="h-7 w-full max-w-[110px] min-w-0 gap-1 border-0 bg-slate-900/70 px-1.5 text-[9px] text-slate-300">
                            <SelectValue>
                              <span className="flex items-center gap-1.5">
                                <img
                                  src={network.logo}
                                  alt=""
                                  className="size-4 rounded-full"
                                />
                                <span className="truncate">{network.name}</span>
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {networks.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <span className="flex items-center gap-2">
                                  <img
                                    src={item.logo}
                                    alt=""
                                    className="size-4 rounded-full"
                                  />
                                  {item.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-slate-200 sm:text-[11px]">
                            $
                            {wallet.balance.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p
                            className={`mt-0.5 text-[9px] ${isNegative ? "text-rose-400" : "text-emerald-300"}`}
                          >
                            {wallet.change} (24h)
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-md border border-dashed border-slate-800 px-4 py-10 text-center text-xs text-slate-500">
                    No wallets match these filters.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-lg border border-slate-800/80 bg-[#09111e] py-3 text-slate-100 ring-0">
              <CardHeader className="px-3.5 pb-2 sm:px-4">
                <CardTitle className="text-[11px] font-semibold">
                  Add more wallets
                </CardTitle>
                <p className="text-[9px] text-slate-500">
                  Connect multiple wallets to get a complete view of your
                  on-chain activity.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 px-3.5 sm:grid-cols-4 sm:px-4">
                {networks.map((network) => (
                  <button
                    type="button"
                    key={network.value}
                    onClick={() => {
                      setActiveNetwork(network.value)
                      setShowAddForm(true)
                    }}
                    className="flex min-w-0 items-center gap-2 rounded-md border border-slate-800 bg-slate-900/40 px-2 py-2 text-left transition-colors hover:border-slate-700 hover:bg-slate-900 sm:px-2.5"
                  >
                    <img
                      src={network.logo}
                      alt=""
                      className="size-6 shrink-0 rounded-full"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-medium text-slate-200">
                        {network.name}
                      </span>
                      <span className="block truncate text-[8px] text-slate-500">
                        Connect or add address
                      </span>
                    </span>
                    <ChevronRight className="size-3 shrink-0 text-slate-500" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </main>

          <aside className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-lg border border-slate-800/80 bg-[#09111e] py-3.5 text-slate-100 ring-0">
              <CardHeader className="px-3.5 pb-0">
                <SectionTitle
                  action={<Eye className="size-3 text-slate-500" />}
                >
                  Total portfolio value
                </SectionTitle>
              </CardHeader>
              <CardContent className="px-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xl font-semibold tracking-tight text-slate-100">
                    $28,903.17
                  </p>
                  <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[8px] text-emerald-300">
                    ↗ 2.84% (24h)
                  </Badge>
                </div>
                <ValueChart />
                <div className="mt-1 flex items-center justify-between">
                  {["1D", "1W", "1M", "3M", "1Y"].map((range, index) => (
                    <button
                      type="button"
                      key={range}
                      className={`rounded px-2 py-1 text-[9px] ${index === 0 ? "border border-indigo-500/40 bg-indigo-500/15 text-indigo-200" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border border-slate-800/80 bg-[#09111e] py-3.5 text-slate-100 ring-0">
              <CardHeader className="px-3.5 pb-0">
                <SectionTitle>Wallet distribution</SectionTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4 px-3.5">
                <div
                  className="relative grid size-[104px] shrink-0 place-items-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#8b5cf6 0 60%, #22d3ee 60% 74%, #0ea5e9 74% 85%, #4f46e5 85% 92%, #94a3b8 92% 100%)",
                  }}
                >
                  <div className="grid size-[66px] place-content-center rounded-full bg-[#09111e] text-center">
                    <span className="text-base font-semibold">
                      {wallets.length}
                    </span>
                    <span className="text-[9px] text-slate-500">Wallets</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  {[
                    ["Ethereum", "60%", "bg-violet-500"],
                    ["Base", "14%", "bg-cyan-400"],
                    ["Arbitrum", "11%", "bg-sky-500"],
                    ["Solana", "7%", "bg-indigo-500"],
                    ["Other", "8%", "bg-slate-400"],
                  ].map(([name, percent, color]) => (
                    <div
                      className="flex items-center gap-2 text-[9px]"
                      key={name}
                    >
                      <span className={`size-2 rounded-full ${color}`} />
                      <span className="flex-1 text-slate-400">{name}</span>
                      <span className="text-slate-300">{percent}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border border-slate-800/80 bg-[#09111e] py-3.5 text-slate-100 ring-0">
              <CardHeader className="px-3.5 pb-0">
                <SectionTitle>Quick actions</SectionTitle>
              </CardHeader>
              <CardContent className="space-y-0 px-3.5">
                {[
                  [Wallet, "Connect wallet", "Link your Web3 wallet"],
                  [Plus, "Import wallet", "Add an existing address"],
                  [Star, "Create watchlist", "Track specific addresses"],
                  [Bell, "Set up alerts", "Get notified of key activity"],
                ].map(([Icon, title, subtitle]) => (
                  <button
                    type="button"
                    key={title as string}
                    onClick={() =>
                      title === "Import wallet"
                        ? setShowAddForm(true)
                        : undefined
                    }
                    className="flex w-full items-center gap-2.5 border-b border-slate-800/70 py-2 text-left last:border-0"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-indigo-500/20 text-indigo-200">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-medium text-slate-200">
                        {title as string}
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        {subtitle as string}
                      </span>
                    </span>
                    <ChevronRight className="size-3 text-slate-500" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-lg border border-slate-800/80 bg-[#09111e] py-3.5 text-slate-100 ring-0">
              <CardHeader className="px-3.5 pb-0">
                <SectionTitle
                  action={
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-5 px-1 text-[9px] text-sky-300"
                    >
                      View all <ArrowRight />
                    </Button>
                  }
                >
                  Recent activity
                </SectionTitle>
              </CardHeader>
              <CardContent className="space-y-0 px-3.5">
                {activity.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      className="flex items-center gap-2 border-b border-slate-800/70 py-2 last:border-0"
                      key={item.label}
                    >
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-md ${item.color}`}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-200">
                          {item.label}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-[9px] whitespace-nowrap text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
