import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useActiveAccount } from "thirdweb/react"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  Compass,
  Copy,
  Image as ImageIcon,
  ShoppingBag,
  Star,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import { getNetwork } from "@/lib/networks"
import { cn } from "cn"
import ethereumLogo from "@/assets/ethereum.png"
import baseLogo from "@/assets/Base.png"
import polygonLogo from "@/assets/Polygon.png"
import solanaLogo from "@/assets/solana.png"

const assets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "2.4823 ETH",
    value: "$7,420",
    change: "+3.4%",
    logo: ethereumLogo,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: "2,840.00 USDC",
    value: "$2,840",
    change: "0.0%",
    logo: baseLogo,
  },
  {
    name: "Tether",
    symbol: "USDT",
    amount: "1,240.00 USDT",
    value: "$1,240",
    change: "0.0%",
    logo: polygonLogo,
  },
  {
    name: "Solana",
    symbol: "SOL",
    amount: "6.2 SOL",
    value: "$982",
    change: "+2.1%",
    logo: solanaLogo,
  },
]

const transactions = [
  {
    type: "Received",
    detail: "+0.42 ETH",
    value: "+$1,421",
    time: "2m ago",
    icon: ArrowDownLeft,
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    type: "Sent",
    detail: "−250 USDC",
    value: "−$250",
    time: "18m ago",
    icon: ArrowUpRight,
    tone: "text-rose-300 bg-rose-400/10",
  },
  {
    type: "Swapped",
    detail: "ETH → USDC",
    value: "$320",
    time: "1h ago",
    icon: ArrowLeftRight,
    tone: "text-sky-300 bg-sky-400/10",
  },
  {
    type: "NFT",
    detail: "BAYC #4582",
    value: "—",
    time: "2h ago",
    icon: ImageIcon,
    tone: "text-indigo-300 bg-indigo-400/10",
  },
]

const nfts = [
  { name: "BAYC #4582", chain: "Ethereum", art: "from-lime-300 to-orange-300" },
  { name: "Azuki #7321", chain: "Ethereum", art: "from-rose-400 to-fuchsia-500" },
  { name: "Doodles #3188", chain: "Ethereum", art: "from-cyan-300 to-violet-400" },
  { name: "Pudgy #2718", chain: "Ethereum", art: "from-sky-400 to-indigo-500" },
]

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function PortfolioSpark() {
  return (
    <svg className="h-20 w-full" viewBox="0 0 360 90" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 62 L30 56 L60 60 L90 48 L120 52 L150 38 L180 42 L210 28 L240 32 L270 18 L300 22 L330 10 L360 12 L360 90 L0 90 Z"
        fill="url(#dash-fill)"
      />
      <path
        d="M0 62 L30 56 L60 60 L90 48 L120 52 L150 38 L180 42 L210 28 L240 32 L270 18 L300 22 L330 10 L360 12"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AllocationRing() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div
        className="relative grid size-28 shrink-0 place-items-center rounded-full"
        style={{
          background:
            "conic-gradient(#818cf8 0 59%, #38bdf8 59% 82%, #2dd4bf 82% 92%, #fbbf24 92% 100%)",
        }}
      >
        <div className="grid size-[4.5rem] place-content-center rounded-full bg-[#0a0f1a] text-center ring-4 ring-[#0a0f1a]">
          <span className="text-sm font-semibold text-white">$12.4k</span>
          <span className="text-[10px] text-slate-500">Total</span>
        </div>
      </div>
      <div className="w-full space-y-2.5 text-xs">
        {[
          ["ETH", "59%", "$7,420", "bg-indigo-400"],
          ["USDC", "23%", "$2,840", "bg-sky-400"],
          ["USDT", "10%", "$1,240", "bg-teal-400"],
          ["Other", "8%", "$982", "bg-amber-300"],
        ].map(([name, share, value, color]) => (
          <div
            key={name}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3"
          >
            <span className="flex items-center gap-2 text-slate-300">
              <span className={cn("size-2 rounded-full", color)} />
              {name}
            </span>
            <span className="text-slate-500">{share}</span>
            <span className="w-14 text-right text-slate-200">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { user } = useAuth()
  const account = useActiveAccount()
  const { networkId, network } = useNetwork()
  const { watchlist, unreadCount, profile } = useUserData()
  const [copied, setCopied] = useState(false)

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    (account?.address ? shortAddr(account.address) : "Explorer")

  const walletLabel = account?.address
    ? shortAddr(account.address)
    : profile?.walletAddress
      ? shortAddr(profile.walletAddress)
      : "No wallet linked"

  const copyAddress = async () => {
    const addr = account?.address ?? profile?.walletAddress
    if (!addr) return
    await navigator.clipboard?.writeText(addr)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const shortcuts = useMemo(
    () => [
      {
        to: "/wallet",
        title: "Wallets",
        body: "Manage tracked addresses",
        icon: Wallet,
      },
      {
        to: "/explore",
        title: "Explore",
        body: "Search chains & tokens",
        icon: Compass,
      },
      {
        to: "/watchlist",
        title: "Watchlist",
        body: `${watchlist.length} saved`,
        icon: Star,
      },
      {
        to: "/marketplace",
        title: "Marketplace",
        body: "Buy & list NFTs",
        icon: ShoppingBag,
      },
    ],
    [watchlist.length]
  )

  return (
    <div className="min-h-full bg-[#05080f] text-slate-100">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-300/90">Dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Viewing data in the context of{" "}
              <span className="text-slate-300">{network.label}</span>
              {unreadCount > 0 && (
                <>
                  {" · "}
                  <Link to="/alerts" className="text-indigo-300 hover:underline">
                    {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/explore"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-9 border-white/10 bg-white/[0.03]"
              )}
            >
              <Compass className="size-3.5" />
              Explore
            </Link>
            <Link
              to="/wallet"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-9 bg-white text-slate-950 hover:bg-slate-100"
              )}
            >
              <Wallet className="size-3.5" />
              Wallets
            </Link>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] via-transparent to-indigo-500/10 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 top-0 size-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Wallet className="size-5 text-indigo-200" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Active identity</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-mono text-sm font-semibold text-white sm:text-base">
                    {walletLabel}
                  </h2>
                  {(account?.address || profile?.walletAddress) && (
                    <button
                      type="button"
                      onClick={() => void copyAddress()}
                      className="text-slate-500 hover:text-slate-300"
                      aria-label="Copy address"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  )}
                  {account?.address && (
                    <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300">
                      Connected
                    </Badge>
                  )}
                  <Badge className="border-white/10 bg-white/[0.04] text-[10px] text-slate-300">
                    {getNetwork(networkId).label}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-semibold tracking-tight text-white">
                    $12,482.41
                  </span>
                  <Badge className="mb-1 border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300">
                    +3.16% 24h
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Demo portfolio value · live balances require an indexer
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-3 sm:max-w-md lg:w-auto">
              {[
                ["Assets", "$12.4k"],
                ["NFTs", "37"],
                ["Txns", "1.2k"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5 text-center"
                >
                  <p className="text-[10px] text-slate-500">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-4 max-w-xl">
            <PortfolioSpark />
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.to}
                to={s.to}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-indigo-300">
                    <Icon className="size-4" />
                  </span>
                  <ArrowRight className="size-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-white">{s.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.body}</p>
              </Link>
            )
          })}
        </div>

        <Tabs defaultValue="portfolio" className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] px-2">
            <TabsList
              variant="line"
              className="h-11 w-full min-w-max justify-start gap-6 rounded-none bg-transparent p-0"
            >
              {["portfolio", "transactions", "nfts", "analytics"].map((v) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="h-11 flex-none capitalize px-1 text-xs text-slate-500 after:bg-indigo-400 data-active:text-white"
                >
                  {v}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="portfolio" className="mt-0 space-y-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 xl:col-span-1">
                <p className="text-sm font-medium text-slate-200">Allocation</p>
                <div className="mt-4">
                  <AllocationRing />
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] xl:col-span-2">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                  <p className="text-sm font-medium text-slate-200">Top assets</p>
                  <Link
                    to="/wallet"
                    className="text-xs text-indigo-300 hover:underline"
                  >
                    View wallets
                  </Link>
                </div>
                <div className="divide-y divide-white/[0.05]">
                  {assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <img
                        src={asset.logo}
                        alt=""
                        className="size-8 rounded-full ring-1 ring-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-100">
                          {asset.name}{" "}
                          <span className="text-slate-500">{asset.symbol}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">{asset.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-100">{asset.value}</p>
                        <p className="text-[11px] text-emerald-300">{asset.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              <div className="border-b border-white/[0.06] px-5 py-3">
                <p className="text-sm font-medium text-slate-200">
                  Recent transactions
                </p>
              </div>
              <ul className="divide-y divide-white/[0.05]">
                {transactions.map((tx) => {
                  const Icon = tx.icon
                  return (
                    <li
                      key={tx.type + tx.time}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full",
                          tx.tone
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-100">{tx.type}</p>
                        <p className="text-[11px] text-slate-500">{tx.detail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-200">{tx.value}</p>
                        <p className="text-[10px] text-slate-600">{tx.time}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="mt-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {nfts.map((nft) => (
                <div
                  key={nft.name}
                  className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]"
                >
                  <div className={cn("aspect-square bg-gradient-to-br", nft.art)} />
                  <div className="p-3">
                    <p className="text-sm font-medium text-white">{nft.name}</p>
                    <p className="text-[11px] text-slate-500">{nft.chain}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">
              Sample NFTs · connect a wallet and indexer for live holdings
            </p>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["7d volume", "$48.2k", "+12%"],
                ["Active days", "5 / 7", "Stable"],
                ["Gas spent", "0.08 ETH", "−4%"],
              ].map(([label, value, delta]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{delta}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <Bell className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Stay ahead of moves</p>
              <p className="text-xs text-slate-500">
                Configure alert rules and review notifications
              </p>
            </div>
          </div>
          <Link
            to="/alerts"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "border-white/10"
            )}
          >
            Open alerts
          </Link>
        </div>
      </div>
    </div>
  )
}
