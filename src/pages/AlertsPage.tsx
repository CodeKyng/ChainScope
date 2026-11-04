import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Mail,
  Smartphone,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserData } from "@/context/UserDataContext"
import { cn } from "@/lib/utils"

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

type AlertsTab = "rules" | "feed" | "all"

export default function AlertsPage() {
  const {
    alertRules,
    notifications,
    unreadCount,
    toggleAlertRule,
    markAllNotificationsRead,
  } = useUserData()

  const [tab, setTab] = useState<AlertsTab>("all")

  const enabledCount = useMemo(
    () => alertRules.filter((r) => r.enabled).length,
    [alertRules]
  )

  const showRules = tab === "all" || tab === "rules"
  const showFeed = tab === "all" || tab === "feed"

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(244,63,94,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 10%, rgba(99,102,241,0.16), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <Bell className="size-3.5 text-rose-400" />
                Alerts · {enabledCount} rules on
                {unreadCount > 0 && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-rose-300">{unreadCount} unread</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Stay on top of on-chain events
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Toggle rules for large transfers, NFT activity, and price moves.
                Notifications sync with your account and appear in the header
                bell. Arm more from{" "}
                <Link to="/watchlist" className="text-indigo-300 hover:underline">
                  Watchlist
                </Link>
                .
              </p>
            </div>

            {notifications.some((n) => !n.read) && (
              <Button
                className="h-10 shrink-0 rounded-full border border-slate-700 bg-slate-900/60 px-5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                variant="outline"
                onClick={() => void markAllNotificationsRead()}
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                { id: "all" as const, label: "Overview" },
                {
                  id: "rules" as const,
                  label: "Rules",
                  count: String(alertRules.length),
                },
                {
                  id: "feed" as const,
                  label: "Feed",
                  count:
                    unreadCount > 0
                      ? String(unreadCount)
                      : String(notifications.length),
                },
              ] as const
            ).map((t) => (
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
                {"count" in t && t.count && (
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

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid gap-8",
            showRules && showFeed
              ? "lg:grid-cols-[1.15fr_0.85fr]"
              : "grid-cols-1"
          )}
        >
          {/* Alert rules */}
          {showRules && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Alert rules
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {enabledCount} enabled · {alertRules.length - enabledCount}{" "}
                    off
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {alertRules.map((rule) => (
                  <article
                    key={rule.id}
                    className={cn(
                      "flex flex-wrap items-start gap-4 rounded-2xl border p-4 transition",
                      rule.enabled
                        ? "border-slate-800/80 bg-[#0b1220] hover:border-slate-700"
                        : "border-slate-800/50 bg-slate-950/40 opacity-80"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl",
                        rule.enabled
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "bg-slate-800/80 text-slate-500"
                      )}
                    >
                      {rule.enabled ? (
                        <Bell className="size-5" />
                      ) : (
                        <BellOff className="size-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium text-white">
                          {rule.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="h-5 gap-1 border-slate-700 bg-slate-800/60 px-1.5 text-[9px] font-normal text-slate-400"
                        >
                          {rule.channel === "Email" ? (
                            <Mail className="size-2.5" />
                          ) : (
                            <Smartphone className="size-2.5" />
                          )}
                          {rule.channel}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {rule.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={rule.enabled}
                      onClick={() => void toggleAlertRule(rule.id)}
                      className={cn(
                        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                        rule.enabled ? "bg-indigo-500" : "bg-slate-700"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
                          rule.enabled && "translate-x-5"
                        )}
                      />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Notification feed */}
          {showFeed && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recent notifications
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {notifications.length === 0
                      ? "None yet"
                      : `${notifications.length} total`}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-14 text-center">
                    <CheckCircle2 className="mx-auto size-9 text-slate-600" />
                    <p className="mt-3 text-sm font-medium text-slate-300">
                      No notifications yet
                    </p>
                    <p className="mx-auto mt-1.5 max-w-xs text-xs text-slate-500">
                      Add a watchlist item or toggle rules to start receiving
                      in-app alerts.
                    </p>
                    <Link
                      to="/watchlist"
                      className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
                    >
                      Go to Watchlist
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-800/60">
                    {notifications.map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3.5 transition",
                          !item.read && "bg-emerald-500/[0.04]"
                        )}
                      >
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            !item.read ? "text-emerald-400" : "text-slate-600"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm leading-snug",
                              !item.read ? "text-slate-100" : "text-slate-400"
                            )}
                          >
                            {item.text}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {timeAgo(item.time)}
                          </p>
                        </div>
                        {!item.read && (
                          <Badge className="shrink-0 border-emerald-400/25 bg-emerald-400/10 text-[9px] text-emerald-300">
                            New
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
