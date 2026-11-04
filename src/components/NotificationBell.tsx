import { useNavigate } from "react-router-dom"
import { Bell, CheckCheck, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserData } from "@/context/UserDataContext"
import { cn } from "@/lib/utils"

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function NotificationBell() {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    clearNotifications,
  } = useUserData()

  const recent = notifications.slice(0, 8)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-md text-slate-300 outline-none hover:bg-slate-800 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-[#070b14]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,20rem)] border border-slate-700 bg-slate-900 p-0 text-slate-100 shadow-xl"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2 px-3 py-2.5 font-normal">
            <div>
              <p className="text-sm font-semibold text-white">Notifications</p>
              <p className="text-[10px] text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : notifications.length
                    ? "All caught up"
                    : "No activity yet"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-indigo-300 hover:bg-slate-800 hover:text-indigo-200"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void markAllNotificationsRead()
                  }}
                >
                  <CheckCheck className="size-3" />
                  Mark all
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-slate-500 hover:bg-slate-800 hover:text-rose-300"
                  title="Clear all"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void clearNotifications()
                  }}
                >
                  <Trash2 className="size-3" />
                </button>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0 bg-slate-700" />

        <div className="max-h-72 overflow-y-auto">
          {recent.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="mx-auto size-8 text-slate-600" />
              <p className="mt-2 text-xs font-medium text-slate-400">
                No notifications yet
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                Watchlist and wallet events show up here.
              </p>
            </div>
          ) : (
            recent.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  "flex w-full gap-2.5 border-b border-slate-800/80 px-3 py-2.5 text-left transition last:border-0 hover:bg-slate-800/60",
                  !n.read && "bg-indigo-500/[0.06]"
                )}
                onClick={() => {
                  if (!n.read) void markNotificationRead(n.id)
                  navigate("/alerts")
                }}
              >
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    n.read ? "bg-transparent" : "bg-indigo-400"
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-xs leading-snug",
                      n.read ? "text-slate-400" : "text-slate-100"
                    )}
                  >
                    {n.text}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-500">
                    {timeAgo(n.time)}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0 bg-slate-700" />

        <DropdownMenuItem
          className="cursor-pointer justify-center rounded-none py-2.5 text-xs text-indigo-300 focus:bg-slate-800 focus:text-indigo-200"
          onClick={() => navigate("/alerts")}
        >
          Open Alerts page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
