import * as React from "react"
import { Home, Wallet } from "lucide-react"

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
    { id: "landing", title: "Home", icon: Home },
    { id: "wallet", title: "Wallet", icon: Wallet },
  ],
} as const

export function AppSidebar({
  currentPage,
  onNavigate,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentPage?: PageKey
  onNavigate?: (page: PageKey) => void
}) {
  const { setOpenMobile } = useSidebar()

  const navigateToPage = (page: PageKey) => {
    onNavigate?.(page)
    setOpenMobile(false)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              type="button"
              onClick={() => navigateToPage("landing")}
            >
              <div className="flex aspect-square size-10 items-center justify-center">
                <img src="logo.png" className="size-10" />
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
        <NavMain
          items={data.navMain}
          currentPage={currentPage}
          onSelect={(page) => navigateToPage(page as PageKey)}
        />
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
