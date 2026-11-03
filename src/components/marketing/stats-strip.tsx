const stats = [
  { value: "5", label: "Networks in one UI" },
  { value: "Hybrid", label: "Email + wallet auth" },
  { value: "Sepolia", label: "Marketplace ready" },
  { value: "Realtime", label: "Watchlist alerts" },
]

export function StatsStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-6 py-10 text-center sm:px-4"
          >
            <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
