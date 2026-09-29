import { useState } from "react"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Ellipsis,
  ExternalLink,
  Eye,
  Image,
  Layers3,
  Plus,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import arbitrumLogo from "@/assets/arbitrum.png"
import baseLogo from "@/assets/Base.png"
import ethereumLogo from "@/assets/ethereum.png"
import polygonLogo from "@/assets/Polygon.png"
import solanaLogo from "@/assets/solana.png"

const networks = [
  { label: "Ethereum", value: "ethereum", logo: ethereumLogo },
  { label: "Base", value: "base", logo: baseLogo },
  { label: "Arbitrum", value: "arbitrum", logo: arbitrumLogo },
  { label: "Polygon", value: "polygon", logo: polygonLogo },
  { label: "Solana", value: "solana", logo: solanaLogo },
]

const assets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "2.4823 ETH",
    value: "$7,420",
    change: "+3.4%",
    color: "#8292ff",
    logo: ethereumLogo,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: "2,840.00 USDC",
    value: "$2,840",
    change: "+0.0%",
    color: "#3b9cff",
    logo: baseLogo,
  },
  {
    name: "Tether",
    symbol: "USDT",
    amount: "1,240.00 USDT",
    value: "$1,240",
    change: "+0.0%",
    color: "#36c9ad",
    logo: polygonLogo,
  },
  {
    name: "Others",
    symbol: "5 assets",
    amount: "5 assets",
    value: "$982",
    change: "+2.1%",
    color: "#9ba8c2",
    logo: solanaLogo,
  },
]

const transactions = [
  {
    type: "Received",
    asset: "ETH",
    amount: "+0.42 ETH",
    value: "+$1,421.32",
    time: "2 mins ago",
    icon: ArrowDownLeft,
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    type: "Sent",
    asset: "USDC",
    amount: "−250 USDC",
    value: "−$250.00",
    time: "18 mins ago",
    icon: ArrowUpRight,
    tone: "text-rose-300 bg-rose-400/10",
  },
  {
    type: "Swapped",
    asset: "ETH → USDC",
    amount: "0.15 ETH → 320 USDC",
    value: "+$320.45",
    time: "1 hr ago",
    icon: ArrowLeftRight,
    tone: "text-blue-300 bg-blue-400/10",
  },
  {
    type: "Received",
    asset: "NFT",
    amount: "Bored Ape #4582",
    value: "—",
    time: "2 hrs ago",
    icon: Image,
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    type: "Sent",
    asset: "USDT",
    amount: "−100 USDT",
    value: "−$100.00",
    time: "4 hrs ago",
    icon: ArrowUpRight,
    tone: "text-rose-300 bg-rose-400/10",
  },
]

const collections = [
  {
    name: "Bored Ape Yacht Club #4582",
    chain: "BAYC · Ethereum",
    style: "from-lime-300 via-emerald-300 to-orange-200",
    art: "🐒",
  },
  {
    name: "Azuki #7321",
    chain: "Azuki · Ethereum",
    style: "from-rose-300 via-fuchsia-300 to-slate-800",
    art: "◉",
  },
  {
    name: "Doodles #3188",
    chain: "Doodles · Ethereum",
    style: "from-pink-300 via-cyan-200 to-violet-300",
    art: "✿",
  },
  {
    name: "Pudgy Penguins #2718",
    chain: "Pudgy · Ethereum",
    style: "from-violet-400 via-fuchsia-300 to-sky-300",
    art: "🐧",
  },
  {
    name: "CloneX #1047",
    chain: "CloneX · Ethereum",
    style: "from-stone-400 via-slate-500 to-emerald-300",
    art: "◉",
  },
]

function PanelTitle({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
        {children}
      </h2>
      {action}
    </div>
  )
}

function AllocationChart() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
      <div
        className="relative grid size-32 shrink-0 place-items-center rounded-full"
        style={{
          background:
            "conic-gradient(#818cf8 0 59.4%, #38bdf8 59.4% 82.2%, #2dd4bf 82.2% 92.1%, #fbbf24 92.1% 100%)",
        }}
      >
        <div className="grid size-20 place-content-center rounded-full bg-[#0b1221] text-center">
          <span className="text-sm font-semibold text-white">$12,482</span>
          <span className="text-[10px] text-slate-400">Total value</span>
        </div>
      </div>
      <div className="w-full space-y-2.5">
        {[
          ["ETH", "59.4%", "$7,420", "bg-indigo-400"],
          ["USDC", "22.8%", "$2,840", "bg-sky-400"],
          ["USDT", "9.9%", "$1,240", "bg-teal-400"],
          ["Other", "7.9%", "$982", "bg-amber-300"],
        ].map(([name, share, value, color]) => (
          <div
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs"
            key={name}
          >
            <span className="flex items-center gap-2 text-slate-300">
              <span className={`size-2.5 rounded-full ${color}`} />
              {name}
            </span>
            <span className="text-slate-400">{share}</span>
            <span className="w-14 text-right text-slate-200">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioChart() {
  return (
    <svg
      className="mt-3 h-28 w-full overflow-visible"
      viewBox="0 0 360 112"
      role="img"
      aria-label="Portfolio value trending upward over seven days"
    >
      <defs>
        <linearGradient id="portfolio-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[15, 43, 71, 99].map((y) => (
        <line
          key={y}
          x1="0"
          x2="360"
          y1={y}
          y2={y}
          stroke="#263249"
          strokeDasharray="3 5"
        />
      ))}
      <path
        d="M0 76 L16 70 L31 78 L47 66 L62 72 L78 61 L94 67 L109 53 L125 58 L141 45 L156 52 L172 36 L188 43 L203 32 L219 40 L234 26 L250 32 L266 20 L281 29 L297 12 L313 18 L328 4 L344 11 L360 1 L360 112 L0 112 Z"
        fill="url(#portfolio-fill)"
      />
      <path
        d="M0 76 L16 70 L31 78 L47 66 L62 72 L78 61 L94 67 L109 53 L125 58 L141 45 L156 52 L172 36 L188 43 L203 32 L219 40 L234 26 L250 32 L266 20 L281 29 L297 12 L313 18 L328 4 L344 11 L360 1"
        fill="none"
        stroke="#818cf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {["Sep 19", "Sep 21", "Sep 23", "Sep 25"].map((date, index) => (
        <text key={date} x={index * 118} y="110" fill="#7f8ba3" fontSize="9">
          {date}
        </text>
      ))}
    </svg>
  )
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard?.writeText("0x71a3...A92F")
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <section className="relative isolate overflow-hidden rounded-lg border border-slate-800/80 bg-[radial-gradient(ellipse_at_80%_100%,rgba(30,64,175,0.28),transparent_48%),linear-gradient(115deg,#0b1221,#090f1c_64%,#0c1427)] px-5 py-6 sm:px-7 sm:py-7">
          <div className="relative z-10 max-w-2xl">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Welcome to ChainScope
            </p>
            <h1 className="mt-2 max-w-xl text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
              Understand what’s
              <br className="hidden sm:block" /> happening{" "}
              <span className="text-indigo-300">on-chain.</span>
            </h1>
            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-400 sm:text-sm">
              Track wallets. Analyze activity. Explore blockchain data.
              <br className="hidden sm:block" /> All in one place.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-slate-400">
              <span className="text-slate-500">Popular networks:</span>
              {networks.slice(0, 4).map((network) => (
                <span className="flex items-center gap-1.5" key={network.value}>
                  <img
                    src={network.logo}
                    alt=""
                    className="size-3.5 rounded-full"
                  />
                  {network.label}
                </span>
              ))}
            </div>
          </div>
          <img
            src="/hero.png"
            alt="Layered blockchain wallet and Ethereum illustration"
            className="pointer-events-none absolute top-1/2 right-2 hidden w-[34%] max-w-[340px] -translate-y-1/2 object-contain opacity-90 md:block"
          />
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-800/80 bg-[#0a101d]">
          <div className="flex flex-col justify-between gap-5 p-4 sm:p-5 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-500 text-white">
                <Wallet className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Wallet</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-mono text-sm font-semibold text-slate-100">
                    0x71a3...A92F
                  </h2>
                  <Button
                    aria-label="Copy wallet address"
                    title="Copy address"
                    variant="ghost"
                    size="icon-xs"
                    onClick={copyAddress}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied ? <Check /> : <Copy />}
                  </Button>
                  <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[9px] text-emerald-300">
                    Primary wallet
                  </Badge>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="h-7 w-32 border-slate-700 bg-slate-900 text-[10px] text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networks.map((network) => (
                        <SelectItem key={network.value} value={network.value}>
                          <span className="flex items-center gap-2">
                            <img
                              src={network.logo}
                              alt=""
                              className="size-4 rounded-full"
                            />
                            {network.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    $12,482.41
                  </span>
                  <Badge className="mb-1 border-emerald-400/20 bg-emerald-400/10 text-[9px] text-emerald-300">
                    ↗ 3.16% (24h)
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-500">Portfolio value</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
              <div className="grid grid-cols-3 divide-x divide-slate-800 sm:min-w-[330px]">
                {[
                  ["Total assets", "$12,482.41"],
                  ["Total NFTs", "37"],
                  ["Transactions", "1,284"],
                ].map(([label, value]) => (
                  <div className="px-3 first:pl-0 last:pr-0" key={label}>
                    <p className="text-[10px] text-slate-500">{label}</p>
                    <p className="mt-1 text-xs font-medium text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800"
                >
                  <Plus className="size-3.5" />
                  Save wallet
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  aria-label="More wallet options"
                  className="h-8 border-slate-700 bg-slate-900 text-slate-300"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="portfolio">
            <div className="border-y border-slate-800/80 bg-[#0c1422] px-4 sm:px-5">
              <TabsList
                variant="line"
                className="h-10 w-full justify-start gap-5 rounded-none p-0 sm:gap-8"
              >
                <TabsTrigger
                  value="portfolio"
                  className="h-10 flex-none px-1 text-[11px] text-slate-400 after:bg-indigo-400 data-active:text-indigo-300"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="h-10 flex-none px-1 text-[11px] text-slate-400 after:bg-indigo-400 data-active:text-indigo-300"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="nfts"
                  className="h-10 flex-none px-1 text-[11px] text-slate-400 after:bg-indigo-400 data-active:text-indigo-300"
                >
                  NFTs
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="h-10 flex-none px-1 text-[11px] text-slate-400 after:bg-indigo-400 data-active:text-indigo-300"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="portfolio" className="p-3 sm:p-4">
              <div className="grid gap-3 xl:grid-cols-[1.08fr_1.08fr_0.94fr]">
                <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
                  <CardHeader className="px-4 pb-0">
                    <CardTitle className="text-xs font-semibold">
                      Portfolio allocation{" "}
                      <CircleHelp className="inline size-3 text-slate-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pt-4">
                    <AllocationChart />
                  </CardContent>
                </Card>
                <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
                  <CardHeader className="px-4 pb-0">
                    <PanelTitle
                      action={
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-[10px] text-indigo-300"
                        >
                          View all <ArrowRight />
                        </Button>
                      }
                    >
                      Top assets
                    </PanelTitle>
                  </CardHeader>
                  <CardContent className="space-y-0 px-4">
                    {assets.map((asset, index) => (
                      <div
                        className="flex items-center gap-2.5 border-t border-slate-800/70 py-2 first:border-0 first:pt-0 last:pb-0"
                        key={asset.symbol}
                      >
                        <div
                          className="grid size-7 shrink-0 place-items-center rounded-full border border-white/10"
                          style={{ backgroundColor: `${asset.color}22` }}
                        >
                          <img
                            src={asset.logo}
                            alt=""
                            className="size-4 rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-slate-200">
                            {asset.name}{" "}
                            <span className="text-slate-500">
                              ({asset.symbol})
                            </span>
                          </p>
                          <p className="text-[9px] text-slate-500">
                            {asset.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-200">
                            {asset.value}
                          </p>
                          <p
                            className={`text-[9px] ${index === 3 ? "text-emerald-300" : "text-emerald-300"}`}
                          >
                            {asset.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
                  <CardHeader className="px-4 pb-0">
                    <PanelTitle
                      action={
                        <Select defaultValue="7d">
                          <SelectTrigger className="h-6 w-[90px] border-0 bg-transparent px-1 text-[10px] text-slate-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      }
                    >
                      Portfolio value
                    </PanelTitle>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold text-white">
                        $12,482.41
                      </span>
                      <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[9px] text-emerald-300">
                        ↗ 3.16%
                      </Badge>
                    </div>
                    <PortfolioChart />
                  </CardContent>
                </Card>

                <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0 xl:col-span-2">
                  <CardHeader className="px-4 pb-0">
                    <PanelTitle
                      action={
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-[10px] text-indigo-300"
                        >
                          View all <ArrowRight />
                        </Button>
                      }
                    >
                      Recent transactions
                    </PanelTitle>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="grid grid-cols-[minmax(90px,1fr)_minmax(95px,1fr)_minmax(130px,1.5fr)_minmax(90px,1fr)_85px_16px] gap-2 border-b border-slate-800 pb-2 text-[9px] text-slate-500 max-sm:hidden">
                      <span>Type</span>
                      <span>Asset</span>
                      <span>Amount</span>
                      <span>Value</span>
                      <span>Time</span>
                      <span />
                    </div>
                    {transactions.map((transaction) => {
                      const Icon = transaction.icon
                      return (
                        <div
                          className="grid grid-cols-[minmax(90px,1fr)_minmax(95px,1fr)_minmax(130px,1.5fr)_minmax(90px,1fr)_85px_16px] items-center gap-2 border-b border-slate-800/60 py-2 last:border-0 max-sm:grid-cols-[1fr_auto]"
                          key={`${transaction.type}-${transaction.time}`}
                        >
                          <span className="flex items-center gap-2 text-[10px] text-slate-300">
                            <span
                              className={`grid size-5 place-items-center rounded-full ${transaction.tone}`}
                            >
                              <Icon className="size-3" />
                            </span>
                            {transaction.type}
                          </span>
                          <span className="text-[10px] text-slate-300 max-sm:hidden">
                            {transaction.asset}
                          </span>
                          <span className="text-[10px] text-slate-300 max-sm:hidden">
                            {transaction.amount}
                          </span>
                          <span
                            className={`text-[10px] max-sm:hidden ${transaction.value.startsWith("+") ? "text-emerald-300" : "text-slate-300"}`}
                          >
                            {transaction.value}
                          </span>
                          <span className="text-right text-[9px] text-slate-500 sm:text-left">
                            {transaction.time}
                          </span>
                          <ChevronRight className="size-3 text-slate-600 max-sm:hidden" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
                    <CardHeader className="px-4 pb-0">
                      <PanelTitle>Quick actions</PanelTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 px-4">
                      {[
                        [Image, "View all NFTs"],
                        [Layers3, "Explore analytics"],
                        [Bell, "Set up alerts"],
                        [Eye, "Add to watchlist"],
                      ].map(([Icon, label]) => (
                        <Button
                          variant="ghost"
                          className="h-8 w-full justify-start gap-2 px-2 text-[10px] text-slate-300 hover:bg-slate-800/70 hover:text-white"
                          key={label as string}
                        >
                          <Icon className="size-3.5 text-slate-400" />
                          {label as string}
                          <ChevronRight className="ml-auto size-3 text-slate-500" />
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
                    <CardHeader className="px-4 pb-0">
                      <PanelTitle
                        action={
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-[10px] text-indigo-300"
                          >
                            View all <ArrowRight />
                          </Button>
                        }
                      >
                        Networks
                      </PanelTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4">
                      {[
                        [
                          ethereumLogo,
                          "Ethereum",
                          "$7,420",
                          "59.4%",
                          "w-[59%] bg-indigo-400",
                        ],
                        [
                          baseLogo,
                          "Base",
                          "$2,840",
                          "22.8%",
                          "w-[36%] bg-sky-400",
                        ],
                        [
                          arbitrumLogo,
                          "Arbitrum",
                          "$1,240",
                          "9.9%",
                          "w-[23%] bg-teal-400",
                        ],
                      ].map(([logo, name, value, share, bar]) => (
                        <div key={name}>
                          <div className="flex items-center gap-2 text-[10px]">
                            <img
                              src={logo}
                              alt=""
                              className="size-5 rounded-full"
                            />
                            <span className="flex-1 text-slate-300">
                              {name}
                            </span>
                            <span className="text-slate-400">{value}</span>
                            <span className="w-9 text-right text-slate-500">
                              {share}
                            </span>
                          </div>
                          <div className="mt-1.5 ml-7 h-1 rounded-full bg-slate-800">
                            <div className={`h-full rounded-full ${bar}`} />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0 xl:col-span-3">
                  <CardHeader className="px-4 pb-0">
                    <PanelTitle
                      action={
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-[10px] text-indigo-300"
                        >
                          View all <ArrowRight />
                        </Button>
                      }
                    >
                      NFTs{" "}
                      <Badge className="border-slate-700 bg-slate-800 text-[9px] text-slate-300">
                        37
                      </Badge>
                    </PanelTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-5">
                    {collections.map((item) => (
                      <div className="min-w-0" key={item.name}>
                        <div
                          className={`relative grid aspect-[1.55] place-items-center overflow-hidden rounded-md bg-gradient-to-br ${item.style}`}
                        >
                          <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.5),transparent_35%)]" />
                          <span className="relative text-4xl drop-shadow-lg">
                            {item.art}
                          </span>
                        </div>
                        <p className="mt-2 truncate text-[10px] font-medium text-slate-200">
                          {item.name}
                        </p>
                        <p className="truncate text-[9px] text-slate-500">
                          {item.chain}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="p-4">
              <h2 className="mb-3 text-sm font-semibold">All transactions</h2>
              <div className="space-y-1">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.time}
                    className="flex items-center gap-3 border-b border-slate-800 py-3 text-xs"
                  >
                    <span className="text-slate-300">{transaction.type}</span>
                    <span className="flex-1 text-slate-400">
                      {transaction.amount}
                    </span>
                    <span className="text-slate-500">{transaction.time}</span>
                    <ExternalLink className="size-3 text-slate-500" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent
              value="nfts"
              className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-5"
            >
              {collections.map((item) => (
                <div key={item.name}>
                  <div
                    className={`grid aspect-square place-items-center rounded-lg bg-gradient-to-br ${item.style}`}
                  >
                    <span className="text-5xl">{item.art}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-200">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.chain}</p>
                </div>
              ))}
            </TabsContent>
            <TabsContent
              value="analytics"
              className="grid gap-4 p-4 sm:grid-cols-3"
            >
              <Card className="rounded-lg border-slate-800 bg-[#0b1220] text-slate-100 ring-0">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Net worth change</p>
                  <p className="mt-2 text-xl font-semibold">+$1,284.08</p>
                  <p className="mt-1 text-xs text-emerald-300">
                    +11.5% this month
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-lg border-slate-800 bg-[#0b1220] text-slate-100 ring-0">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Transaction volume</p>
                  <p className="mt-2 text-xl font-semibold">$28,491</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Across 1,284 transactions
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-lg border-slate-800 bg-[#0b1220] text-slate-100 ring-0">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500">Active networks</p>
                  <p className="mt-2 text-xl font-semibold">5 networks</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Ethereum is your top network
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}
