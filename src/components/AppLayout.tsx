import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react"
import { AppSidebar, type PageKey } from "@/components/appSidebar"
import { NetworkIcon } from "@/components/NetworkIcon"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Bell, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import type { NetworkId } from "@/lib/networks"

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function pageFromPath(pathname: string): PageKey {
  if (pathname.startsWith("/admin/users")) return "admin-users"
  if (pathname.startsWith("/admin/networks")) return "admin-networks"
  if (pathname.startsWith("/admin")) return "admin"
  if (pathname.startsWith("/wallet")) return "wallet"
  if (pathname.startsWith("/explore")) return "explore"
  if (pathname.startsWith("/marketplace")) return "marketplace"
  if (pathname.startsWith("/watchlist")) return "watchlist"
  if (pathname.startsWith("/alerts")) return "alerts"
  if (pathname.startsWith("/settings")) return "settings"
  return "landing"
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { networkId, setNetworkId, networks, network } = useNetwork()
  const { notifications, unreadCount, markAllNotificationsRead } = useUserData()
  const [search, setSearch] = useState("")

  const currentPage = pageFromPath(location.pathname)

  const handleLogout = async () => {
    try {
      if (wallet) await disconnect(wallet)
    } catch {
      /* ignore */
    }
    try {
      await logout()
    } catch {
      /* ignore */
    }
    navigate("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) {
      navigate("/explore")
      return
    }
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    (account?.address ? shortAddress(account.address) : "User")

  const subtitle = user?.email || (account?.address ? account.address : null)

  const initials = user
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : account?.address
      ? account.address.slice(2, 4).toUpperCase()
      : "U"

  return (
    <SidebarProvider className="dark bg-[#070b14] text-slate-100">
      <AppSidebar currentPage={currentPage} />
      <SidebarInset className="bg-[#070b14]">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-800/80 bg-[#070b14] px-4 text-slate-100">
          <SidebarTrigger className="mr-1 -ml-1 shrink-0" />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-sm text-muted-foreground sm:gap-3">
            <form
              onSubmit={handleSearch}
              className="min-w-0 flex-1 font-medium text-foreground"
            >
              <InputGroup className="w-full max-w-full border-slate-700 bg-slate-900/70 sm:max-w-md lg:max-w-lg">
                <InputGroupAddon>
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  className="text-xs placeholder:text-slate-500"
                  placeholder="Search address, ENS, tokens…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </form>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Select
                value={networkId}
                onValueChange={(v) => {
                  if (v) setNetworkId(v as NetworkId)
                }}
              >
                <SelectTrigger className="h-8 w-auto min-w-[7.5rem] max-w-[10rem] border-slate-700 bg-slate-900/70 text-xs sm:min-w-[8.5rem]">
                  <SelectValue>
                    <span className="flex items-center gap-1.5">
                      <NetworkIcon
                        networkId={networkId}
                        sizeClass="size-4"
                      />
                      <span className="truncate">{network.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border border-slate-700 bg-slate-900 text-slate-100">
                  <SelectGroup>
                    <SelectLabel>Networks</SelectLabel>
                    {networks.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        <span className="flex items-center gap-2">
                          <NetworkIcon
                            networkId={item.id}
                            sizeClass="size-4"
                          />
                          {item.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className="relative inline-flex size-8 items-center justify-center rounded-md text-slate-300 outline-none hover:bg-slate-800 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-72 border border-slate-700 bg-slate-900 text-slate-100 shadow-xl"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center justify-between font-normal">
                      <span className="text-sm font-medium">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          className="text-[10px] text-indigo-300 hover:underline"
                          onClick={() => void markAllNotificationsRead()}
                        >
                          Mark all read
                        </button>
                      )}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  {notifications.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        className="flex cursor-default flex-col items-start gap-0.5 py-2"
                        onClick={() => navigate("/alerts")}
                      >
                        <span
                          className={`text-xs ${n.read ? "text-slate-400" : "text-slate-100"}`}
                        >
                          {n.text}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {timeAgo(n.time)}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="justify-center text-xs text-indigo-300"
                    onClick={() => navigate("/alerts")}
                  >
                    View all alerts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14]">
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback className="bg-slate-800 text-slate-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="min-w-48 border border-slate-700 bg-slate-900 text-slate-100 shadow-xl"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal text-slate-200">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {displayName}
                        </p>
                        {subtitle && (
                          <p className="max-w-[200px] truncate text-xs leading-none text-slate-400">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => void handleLogout()}
                    className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
