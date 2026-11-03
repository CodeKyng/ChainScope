import {
  Bell,
  Compass,
  LineChart,
  ShoppingBag,
  Wallet,
} from "lucide-react"
import { cn } from "cn"

const items = [
  {
    icon: Wallet,
    title: "Wallet intelligence",
    body: "Balances, allocation, and history for any address — organized so you can scan in seconds.",
    className: "md:col-span-2",
  },
  {
    icon: LineChart,
    title: "Live activity",
    body: "Transfers, swaps, and mints with clear direction and context.",
    className: "",
  },
  {
    icon: Compass,
    title: "Explore",
    body: "Search addresses and tokens, filtered by the network you care about.",
    className: "",
  },
  {
    icon: Bell,
    title: "Alerts & watchlists",
    body: "Save wallets and arm rules. Notifications stay on your account.",
    className: "md:col-span-2",
  },
  {
    icon: ShoppingBag,
    title: "NFT marketplace",
    body: "List and buy on Sepolia MarketplaceV3 with wallet-native flows.",
    className: "md:col-span-3 lg:col-span-1",
  },
]

export function FeatureBento() {
  return (
    <section id="features" className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-300/90">Product</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for reading the chain, not fighting it
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400">
            One workspace for wallets, exploration, alerts, and marketplace —
            without the usual tool sprawl.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-colors hover:border-white/[0.12]",
                  item.className
                )}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-indigo-300">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                    {item.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
