import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import ethereumLogo from "@/assets/ethereum.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import solanaLogo from "@/assets/solana.png"
import polygonLogo from "@/assets/Polygon.png"

const networks = [
  { label: "Ethereum", logo: ethereumLogo },
  { label: "Base", logo: baseLogo },
  { label: "Arbitrum", logo: arbitrumLogo },
  { label: "Solana", logo: solanaLogo },
  { label: "Polygon", logo: polygonLogo },
]

export function HeroSection() {
  return (
    <section id="product" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#05080f_0%,#070b14_100%)]" />
        <div className="absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-40 right-0 h-[280px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-300 shadow-sm backdrop-blur">
            <Sparkles className="size-3.5 text-indigo-300" />
            Multi-chain wallet intelligence
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:inline" />
            <span className="hidden text-slate-500 sm:inline">
              Now with marketplace
            </span>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            See every wallet the way an analyst would
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
            ChainScope turns addresses into readable portfolios — balances,
            activity, NFTs, and alerts across Ethereum, L2s, and Solana.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-white px-6 text-slate-950 shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)] hover:bg-slate-100"
              )}
            >
              Start free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/10 bg-white/[0.03] px-6 text-slate-200 backdrop-blur hover:bg-white/[0.06]"
              )}
            >
              Log in
            </Link>
          </div>

          <div
            id="networks"
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {networks.map((n) => (
              <span
                key={n.label}
                className="inline-flex items-center gap-2 text-sm text-slate-400"
              >
                <img
                  src={n.logo}
                  alt=""
                  className="size-5 rounded-full ring-1 ring-white/10"
                />
                {n.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0f1a] shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <span className="size-2.5 rounded-full bg-rose-500/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-3 font-mono text-[11px] text-slate-500">
                app.chainscope · dashboard
              </span>
            </div>
            <div className="relative aspect-[16/9] sm:aspect-[21/10]">
              <img
                src="/hero.png"
                alt="ChainScope dashboard preview"
                className="size-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
