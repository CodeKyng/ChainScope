import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ArrowUpRight,
  ExternalLink,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNetwork } from "@/context/NetworkContext"
import { explorerAddressUrl, getNetwork } from "@/lib/networks"

const trendingWallets = [
  {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    label: "Main Whale",
    network: "ethereum",
    value: "$4.2M",
    change: "+12.4%",
  },
  {
    address: "0x9b74d3a5f2c1e8f0a6b3d9c7e4f1a2b5c8d0e3f6",
    label: "DeFi Trader",
    network: "base",
    value: "$890K",
    change: "+5.1%",
  },
  {
    address: "0x3e2f9a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9",
    label: "NFT Collector",
    network: "arbitrum",
    value: "$312K",
    change: "−1.8%",
  },
  {
    address: "7EqQdEULxWcra9KPVvoYVnXYxPqx5qz8vFzqH9mN3pQR",
    label: "Solana Whale",
    network: "solana",
    value: "$1.1M",
    change: "+8.6%",
  },
]

const tokens = [
  { symbol: "ETH", name: "Ethereum", price: "$3,012", change: "+2.4%", volume: "$18.2B", network: "ethereum" },
  { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "0.0%", volume: "$6.4B", network: "ethereum" },
  { symbol: "ARB", name: "Arbitrum", price: "$1.12", change: "+4.1%", volume: "$412M", network: "arbitrum" },
  { symbol: "SOL", name: "Solana", price: "$148.20", change: "+3.7%", volume: "$2.1B", network: "solana" },
]

function shortAddr(addr: string) {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const { networkId } = useNetwork()
  const [query, setQuery] = useState(params.get("q") ?? "")

  useEffect(() => {
    setQuery(params.get("q") ?? "")
  }, [params])

  const filteredWallets = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trendingWallets.filter((w) => {
      const matchesNetwork = w.network === networkId || !networkId
      const matchesQuery =
        !q ||
        w.address.toLowerCase().includes(q) ||
        w.label.toLowerCase().includes(q) ||
        w.network.toLowerCase().includes(q)
      return matchesNetwork && matchesQuery
    })
  }, [query, networkId])

  const filteredTokens = useMemo(() => {
    return tokens.filter(
      (t) => t.network === networkId || networkId === "ethereum"
    )
  }, [networkId])

  const onSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) setParams({ q: value.trim() })
    else setParams({})
  }

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <section className="rounded-lg border border-slate-800/80 bg-[radial-gradient(ellipse_at_80%_0%,rgba(99,102,241,0.18),transparent_50%),#0a101d] px-5 py-6 sm:px-7">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
            Explore · {getNetwork(networkId).label}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Discover wallets, tokens & activity
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Header search and network selector filter this page.
          </p>
          <div className="relative mt-5 max-w-xl">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search wallet, ENS, token, or collection..."
              className="h-11 border-slate-700 bg-slate-900/70 pl-10 text-sm"
            />
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
            <CardHeader className="px-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4 text-indigo-300" />
                Trending wallets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4">
              {filteredWallets.map((wallet) => {
                const net = getNetwork(wallet.network)
                return (
                  <div
                    key={wallet.address}
                    className="flex items-center gap-3 rounded-md border border-slate-800/80 bg-[#0a1422]/60 px-3 py-2.5"
                  >
                    <img
                      src={net.logo}
                      alt=""
                      className="size-8 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-medium text-slate-100">
                          {wallet.label}
                        </p>
                        <Badge className="border-slate-700 bg-slate-800/80 text-[9px] text-slate-300">
                          {net.label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                        {shortAddr(wallet.address)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-200">
                        {wallet.value}
                      </p>
                      <p
                        className={`text-[10px] ${
                          wallet.change.startsWith("−")
                            ? "text-rose-300"
                            : "text-emerald-300"
                        }`}
                      >
                        {wallet.change}
                      </p>
                    </div>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-slate-400"
                      aria-label="Open explorer"
                      onClick={() =>
                        window.open(
                          explorerAddressUrl(wallet.network, wallet.address),
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </div>
                )
              })}
              {!filteredWallets.length && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No wallets match your search on {getNetwork(networkId).label}.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
            <CardHeader className="px-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wallet className="size-4 text-indigo-300" />
                Top tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4">
              {(filteredTokens.length ? filteredTokens : tokens).map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between rounded-md border border-slate-800/80 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-100">
                      {token.symbol}{" "}
                      <span className="text-slate-500">{token.name}</span>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Vol {token.volume}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-200">{token.price}</p>
                    <p
                      className={`flex items-center justify-end gap-0.5 text-[10px] ${
                        token.change.startsWith("−")
                          ? "text-rose-300"
                          : "text-emerald-300"
                      }`}
                    >
                      <ArrowUpRight className="size-3" />
                      {token.change}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
