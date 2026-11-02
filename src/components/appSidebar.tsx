import * as React from "react"
import { Home, Wallet } from "lucide-react"
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

type PageKey = "landing" | "wallet"

const data = {
  navMain: [
    { id: "landing", title: "Home", icon: Home, to: "/" },
    { id: "wallet", title: "Wallet", icon: Wallet, to: "/wallet" },
  ],
} as const

export function AppSidebar({
  currentPage,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentPage?: PageKey
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <NavLink to="/" onClick={() => setOpenMobile(false)} />
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
        <NavMain items={data.navMain} currentPage={currentPage} />
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
