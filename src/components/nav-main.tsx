"use client"

import { type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  id: string
  title: string
  icon?: LucideIcon
  to: string
}

export function NavMain({
  items,
  currentPage,
}: {
  items: readonly NavItem[]
  currentPage?: string
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={currentPage === item.id}
                className="flex w-full items-center gap-2"
                render={
                  <NavLink
                    to={item.to}
                    onClick={() => setOpenMobile(false)}
                  />
                }
              >
                {Icon ? <Icon className="size-4" /> : null}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
