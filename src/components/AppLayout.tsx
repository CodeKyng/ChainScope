import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react"
import { AppSidebar, type PageKey } from "@/components/appSidebar"
import { NetworkIcon } from "@/components/NetworkIcon"
import { NotificationBell } from "@/components/NotificationBell"
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
import { LogOut, Search } from "lucide-react"
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

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { networkId, setNetworkId, networks, network } = useNetwork()
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
                <SelectTrigger className="h-8 w-auto min-w-[7.5rem] max-w-[11rem] border-slate-700 bg-slate-900/70 text-xs sm:min-w-[9rem]">
                  <SelectValue>
                    <span className="flex items-center gap-1.5">
                      <NetworkIcon networkId={networkId} sizeClass="size-4" />
                      <span className="truncate">{network.label}</span>
                      {network.testnet && (
                        <span className="rounded bg-amber-500/20 px-1 py-px text-[9px] font-semibold text-amber-300">
                          Test
                        </span>
                      )}
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
                          {item.testnet && (
                            <span className="rounded bg-amber-500/20 px-1 py-px text-[9px] font-semibold text-amber-300">
                              Test
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <NotificationBell />

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
