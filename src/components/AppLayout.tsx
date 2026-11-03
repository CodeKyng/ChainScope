import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react"
import { AppSidebar, type PageKey } from "@/components/appSidebar"
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
import ethereumLogo from "@/assets/ethereum.png"
import solanaLogo from "@/assets/solana.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import polygonLogo from "@/assets/Polygon.png"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Bell, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

const items = [
  { label: "Ethereum", value: "ethereum", logo: ethereumLogo },
  { label: "Base", value: "base", logo: baseLogo },
  { label: "Arbitrum", value: "arbitrum", logo: arbitrumLogo },
  { label: "Solana", value: "solana", logo: solanaLogo },
  { label: "Polygon", value: "polygon", logo: polygonLogo },
]

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

  const currentPage = pageFromPath(location.pathname)

  const handleLogout = async () => {
    try {
      if (wallet) {
        await disconnect(wallet)
      }
    } catch {
      // ignore disconnect errors
    }
    try {
      await logout()
    } catch {
      // ignore if no Firebase session
    }
    navigate("/")
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
          <SidebarTrigger className="mr-4 -ml-1" />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">
              <InputGroup className="w-full border-slate-700 bg-slate-900/70 sm:w-lg">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput
                  className="text-xs placeholder:text-slate-500"
                  placeholder="Search wallet address, ENS, tokens or collection..."
                />
              </InputGroup>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Select items={items}>
                <SelectTrigger className="h-8 w-32 border-slate-700 bg-slate-900/70 text-xs sm:w-36">
                  <SelectValue placeholder="Pick a Network ..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Networks</SelectLabel>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        <span className="flex items-center gap-2">
                          <img
                            src={item.logo}
                            alt={item.label}
                            className="size-4 rounded-full object-cover"
                          />
                          {item.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Notifications"
                className="relative text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-400" />
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14]"
                >
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

        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
