import * as React from "react"
import {
  Bell,
  Compass,
  Home,
  Network,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  UserCog,
  Wallet,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { SidebarOptInForm } from "@/components/SidebarUpgradeForm"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { isAdminEmail } from "@/lib/roles"

export type PageKey =
  | "landing"
  | "wallet"
  | "explore"
  | "marketplace"
  | "watchlist"
  | "alerts"
  | "settings"
  | "admin"
  | "admin-users"
  | "admin-networks"

const userNav = [
  { id: "landing", title: "Home", icon: Home, to: "/dashboard" },
  { id: "wallet", title: "Wallets", icon: Wallet, to: "/wallet" },
  { id: "explore", title: "Explore", icon: Compass, to: "/explore" },
  {
    id: "marketplace",
    title: "Marketplace",
    icon: ShoppingBag,
    to: "/marketplace",
  },
  { id: "watchlist", title: "Watchlist", icon: Star, to: "/watchlist" },
  { id: "alerts", title: "Alerts", icon: Bell, to: "/alerts" },
  { id: "settings", title: "Settings", icon: Settings, to: "/settings" },
] as const

const adminNav = [
  { id: "admin", title: "Admin overview", icon: Shield, to: "/admin" },
  { id: "admin-users", title: "Users", icon: UserCog, to: "/admin/users" },
  {
    id: "admin-networks",
    title: "Networks",
    icon: Network,
    to: "/admin/networks",
  },
] as const

export function AppSidebar({
  currentPage,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentPage?: PageKey
}) {
  const { setOpenMobile } = useSidebar()
  const { user } = useAuth()
  const showAdmin = isAdminEmail(user?.email)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <NavLink
                  to="/dashboard"
                  onClick={() => setOpenMobile(false)}
                />
              }
            >
              <div className="flex aspect-square size-10 items-center justify-center">
                <img src="/logo.png" className="size-10" alt="ChainScope" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-xl font-bold">ChainScope</span>
                <span className="">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userNav} currentPage={currentPage} />
        {showAdmin && (
          <NavMain items={adminNav} currentPage={currentPage} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
