import { Link } from "react-router-dom"
import {
  ArrowRight,
  Eye,
  Layers3,
  LineChart,
  Search,
  Shield,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ethereumLogo from "@/assets/ethereum.png"
import solanaLogo from "@/assets/solana.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import polygonLogo from "@/assets/Polygon.png"

const networks = [
  { label: "Ethereum", logo: ethereumLogo },
  { label: "Base", logo: baseLogo },
  { label: "Arbitrum", logo: arbitrumLogo },
  { label: "Solana", logo: solanaLogo },
  { label: "Polygon", logo: polygonLogo },
]

const features = [
  {
    icon: Wallet,
    title: "Wallet intelligence",
    description:
      "Track any address, portfolio value, token balances, and activity history across multiple chains in one view.",
  },
  {
    icon: LineChart,
    title: "On-chain analytics",
    description:
      "See allocation breakdowns, recent transactions, and portfolio movement without leaving the dashboard.",
  },
  {
    icon: Layers3,
    title: "NFT overview",
    description:
      "Browse collections held by a wallet with clear chain context and visual cards that stay readable at a glance.",
  },
  {
    icon: Search,
    title: "Fast lookup",
    description:
      "Search wallets, ENS names, tokens, or collections and jump straight into the data that matters.",
  },
  {
    icon: Eye,
    title: "Activity clarity",
    description:
      "Received, sent, swapped, and NFT activity presented cleanly so you can understand flow without noise.",
  },
  {
    icon: Shield,
    title: "Secure access",
    description:
      "Email authentication keeps your saved wallets and preferences private while you explore public chain data.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-[#070b14] text-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="ChainScope" className="size-9" />
            <span className="text-lg font-semibold tracking-tight">ChainScope</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="bg-indigo-500 text-white hover:bg-indigo-400"
            >
              <Link to="/signup">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-indigo-300 uppercase">
                On-chain visibility
              </p>
              <h1 className="mt-4 max-w-xl text-4xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Understand what's happening on-chain.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                Track wallets, analyze activity, and explore blockchain data
                across Ethereum, Base, Arbitrum, Solana, and Polygon — all in
                one focused workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-indigo-500 px-5 text-white hover:bg-indigo-400"
                >
                  <Link to="/signup">
                    Create free account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800"
                >
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                  Supported networks
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {networks.map((network) => (
                    <span
                      key={network.label}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <img
                        src={network.logo}
                        alt=""
                        className="size-5 rounded-full object-cover"
                      />
                      {network.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-indigo-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0a101d] shadow-2xl shadow-indigo-950/40">
                <img
                  src="/hero.png"
                  alt="ChainScope product preview"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Everything you need to read a wallet
              </h2>
              <p className="mt-3 text-slate-400">
                ChainScope turns raw on-chain activity into a clear picture of
                balances, movement, and holdings.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-slate-800/80 bg-[#0a101d] p-5"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-base font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Value strip */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-8 rounded-2xl border border-slate-800/80 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.14),_transparent_50%),#0a101d] p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Start with any wallet. Build clarity from there.
                </h2>
                <p className="mt-3 text-slate-400">
                  Create an account, open the dashboard, and explore portfolio
                  value, transactions, and NFTs without switching tools.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-indigo-500 text-white hover:bg-indigo-400"
                >
                  <Link to="/signup">
                    Get started free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
                >
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="size-7" />
            <span className="text-sm font-medium text-slate-300">ChainScope</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ChainScope. Built for clearer on-chain
            insight.
          </p>
        </div>
      </footer>
    </div>
  )
}
