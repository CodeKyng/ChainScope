import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ArrowUpRight,
  ExternalLink,
  Flame,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNetwork } from "@/context/NetworkContext"
import { explorerAddressUrl, getNetwork, NETWORKS } from "@/lib/networks"
import { cn } from "@/lib/utils"

type ExploreTab = "all" | "wallets" | "tokens" | "activity"

const trendingWallets = [
  {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    label: "Main Whale",
    network: "ethereum",
    value: "$4.2M",
    change: "+12.4%",
    tag: "Whale",
    activity: "42 txs · 24h",
  },
  {
    address: "0x9b74d3a5f2c1e8f0a6b3d9c7e4f1a2b5c8d0e3f6",
    label: "DeFi Trader",
    network: "base",
    value: "$890K",
    change: "+5.1%",
    tag: "Trader",
    activity: "118 txs · 24h",
  },
  {
    address: "0x3e2f9a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9",
    label: "NFT Collector",
    network: "arbitrum",
    value: "$312K",
    change: "−1.8%",
    tag: "Collector",
    activity: "9 txs · 24h",
  },
  {
    address: "7EqQdEULxWcra9KPVvoYVnXYxPqx5qz8vFzqH9mN3pQR",
    label: "Solana Whale",
    network: "solana",
    value: "$1.1M",
    change: "+8.6%",
    tag: "Whale",
    activity: "67 txs · 24h",
  },
  {
    address: "0x28c6c06298d514db089934071355e5743bf21d60",
    label: "Exchange Hot",
    network: "ethereum",
    value: "$203M",
    change: "+0.4%",
    tag: "Exchange",
    activity: "1.2k txs · 24h",
  },
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    label: "Base Builder",
    network: "base",
    value: "$156K",
    change: "+18.2%",
    tag: "Builder",
    activity: "31 txs · 24h",
  },
]

const tokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,012",
    change: "+2.4%",
    volume: "$18.2B",
    network: "ethereum",
    mcap: "$362B",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: "$1.00",
    change: "0.0%",
    volume: "$6.4B",
    network: "ethereum",
    mcap: "$34B",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    price: "$1.12",
    change: "+4.1%",
    volume: "$412M",
    network: "arbitrum",
    mcap: "$3.9B",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$148.20",
    change: "+3.7%",
    volume: "$2.1B",
    network: "solana",
    mcap: "$68B",
  },
  {
    symbol: "POL",
    name: "Polygon",
    price: "$0.42",
    change: "+1.9%",
    volume: "$280M",
    network: "polygon",
    mcap: "$4.1B",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    price: "$3,011",
    change: "+2.3%",
    volume: "$1.8B",
    network: "base",
    mcap: "—",
  },
]

const recentActivity = [
  {
    id: "1",
    type: "swap",
    title: "Swapped 12.4 ETH → USDC",
    detail: "Uniswap V3 · Ethereum",
    time: "2m ago",
    value: "$37.2K",
  },
  {
    id: "2",
    type: "transfer",
    title: "Received 450 SOL",
    detail: "From whale · Solana",
    time: "8m ago",
    value: "$66.7K",
  },
  {
    id: "3",
    type: "mint",
    title: "Minted 3 NFTs",
    detail: "Base · Collection drop",
    time: "14m ago",
    value: "$1.2K",
  },
  {
    id: "4",
    type: "bridge",
    title: "Bridged 2.1 ETH",
    detail: "Ethereum → Arbitrum",
    time: "22m ago",
    value: "$6.3K",
  },
]

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const tabs: { id: ExploreTab; label: string; count?: string }[] = [
  { id: "all", label: "All" },
  { id: "wallets", label: "Wallets", count: "6" },
  { id: "tokens", label: "Tokens", count: "6" },
  { id: "activity", label: "Activity" },
]

export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const { networkId } = useNetwork()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [tab, setTab] = useState<ExploreTab>("all")

  useEffect(() => {
    setQuery(params.get("q") ?? "")
  }, [params])

  const filteredWallets = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trendingWallets.filter((w) => {
      const matchesNetwork = !networkId || w.network === networkId
      const matchesQuery =
        !q ||
        w.address.toLowerCase().includes(q) ||
        w.label.toLowerCase().includes(q) ||
        w.network.toLowerCase().includes(q) ||
        w.tag.toLowerCase().includes(q)
      return matchesNetwork && matchesQuery
    })
  }, [query, networkId])

  const filteredTokens = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tokens.filter((t) => {
      const matchesNetwork =
        !networkId || t.network === networkId || networkId === "ethereum"
      const matchesQuery =
        !q ||
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.network.toLowerCase().includes(q)
      return matchesNetwork && matchesQuery
    })
  }, [query, networkId])

  const onSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) setParams({ q: value.trim() })
    else setParams({})
  }

  const showWallets = tab === "all" || tab === "wallets"
  const showTokens = tab === "all" || tab === "tokens"
  const showActivity = tab === "all" || tab === "activity"

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      {/* Hero — 21st-inspired clean search surface */}
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(56,189,248,0.08), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <Sparkles className="size-3.5 text-indigo-400" />
                Explore · {getNetwork(networkId).label}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Discover wallets, tokens &amp; on-chain activity
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Search addresses, track trending wallets, and surface tokens
                across Ethereum, L2s, and Solana — filtered by your network
                selector.
              </p>
            </div>

            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search wallet, ENS, token, or collection…"
                  className="h-12 rounded-xl border-slate-700/80 bg-slate-900/70 pl-11 text-sm shadow-lg shadow-black/20 placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {NETWORKS.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onSearch(n.label)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/40 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-slate-600 hover:bg-slate-800/60 hover:text-slate-200"
                  >
                    <img
                      src={n.logo}
                      alt=""
                      className="size-3.5 rounded-full object-cover"
                    />
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  tab === t.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "border border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                )}
              >
                {t.label}
                {t.count && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px]",
                      tab === t.id
                        ? "bg-slate-200 text-slate-700"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Trending wallets */}
        {showWallets && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Trending wallets
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    High-activity addresses on the selected network
                  </p>
                </div>
              </div>
              {tab === "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-slate-400 hover:text-white"
                  onClick={() => setTab("wallets")}
                >
                  View all
                  <ArrowUpRight className="ml-1 size-3.5" />
                </Button>
              )}
            </div>

            {filteredWallets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
                <Wallet className="mx-auto size-8 text-slate-600" />
                <p className="mt-3 text-sm text-slate-500">
                  No wallets match your search on{" "}
                  {getNetwork(networkId).label}.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredWallets.map((wallet) => {
                  const net = getNetwork(wallet.network)
                  const isDown = wallet.change.startsWith("−")
                  return (
                    <article
                      key={wallet.address}
                      className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 transition hover:border-slate-700 hover:bg-[#0d1524]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={net.logo}
                            alt=""
                            className="size-11 rounded-xl object-cover ring-1 ring-slate-700/80"
                          />
                          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-slate-900 ring-2 ring-[#0b1220]">
                            <Flame className="size-2.5 text-amber-400" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="truncate text-sm font-medium text-white">
                              {wallet.label}
                            </h3>
                            <Badge
                              variant="outline"
                              className="h-5 border-slate-700 bg-slate-800/60 px-1.5 text-[9px] font-normal text-slate-400"
                            >
                              {wallet.tag}
                            </Badge>
                          </div>
                          <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                            {shortAddr(wallet.address)}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {wallet.activity} · {net.label}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between border-t border-slate-800/80 pt-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {wallet.value}
                          </p>
                          <p
                            className={cn(
                              "text-[11px] font-medium",
                              isDown ? "text-rose-400" : "text-emerald-400"
                            )}
                          >
                            {wallet.change} 24h
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-slate-700 bg-transparent text-xs text-slate-300 opacity-80 transition group-hover:opacity-100 hover:bg-slate-800 hover:text-white"
                          onClick={() =>
                            window.open(
                              explorerAddressUrl(
                                wallet.network,
                                wallet.address
                              ),
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          Open
                          <ExternalLink className="ml-1.5 size-3" />
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Top tokens */}
        {showTokens && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Top tokens
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Market movers across supported chains
                  </p>
                </div>
              </div>
              {tab === "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-slate-400 hover:text-white"
                  onClick={() => setTab("tokens")}
                >
                  View all
                  <ArrowUpRight className="ml-1 size-3.5" />
                </Button>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-slate-800/80 px-4 py-2.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                <span>Token</span>
                <span className="text-right">Price</span>
                <span className="hidden text-right sm:block">24h</span>
                <span className="hidden text-right sm:block">Volume</span>
                <span className="w-8" />
              </div>
              <ul className="divide-y divide-slate-800/60">
                {(filteredTokens.length ? filteredTokens : tokens).map(
                  (token) => {
                    const net = getNetwork(token.network)
                    const isDown = token.change.startsWith("−")
                    return (
                      <li
                        key={`${token.symbol}-${token.network}`}
                        className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-3 transition hover:bg-slate-900/50 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-200">
                            {token.symbol.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {token.symbol}{" "}
                              <span className="font-normal text-slate-500">
                                {token.name}
                              </span>
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-slate-500">
                              <img
                                src={net.logo}
                                alt=""
                                className="size-3 rounded-full"
                              />
                              {net.label}
                              {token.mcap !== "—" && (
                                <>
                                  <span className="text-slate-700">·</span>
                                  MCap {token.mcap}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="text-right text-sm text-slate-200">
                          {token.price}
                        </p>
                        <p
                          className={cn(
                            "hidden text-right text-sm sm:block",
                            isDown ? "text-rose-400" : "text-emerald-400"
                          )}
                        >
                          {token.change}
                        </p>
                        <p className="hidden text-right text-sm text-slate-400 sm:block">
                          {token.volume}
                        </p>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="size-8 text-slate-500 hover:text-white"
                          aria-label={`View ${token.symbol}`}
                        >
                          <ArrowUpRight className="size-3.5" />
                        </Button>
                      </li>
                    )
                  }
                )}
              </ul>
            </div>
          </section>
        )}

        {/* Recent activity */}
        {showActivity && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Live activity
                </h2>
                <p className="text-[11px] text-slate-500">
                  Notable transfers, swaps, and mints
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#0b1220] px-4 py-3.5 transition hover:border-slate-700"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
                    {item.type === "swap" && (
                      <TrendingUp className="size-4" />
                    )}
                    {item.type === "transfer" && (
                      <Wallet className="size-4" />
                    )}
                    {item.type === "mint" && (
                      <Sparkles className="size-4" />
                    )}
                    {item.type === "bridge" && (
                      <Layers className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-200">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
