"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  id: string
  title: string
  icon?: LucideIcon
}

export function NavMain({
  items,
  currentPage,
  onSelect,
}: {
  items: readonly NavItem[]
  currentPage?: string
  onSelect?: (page: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                type="button"
                isActive={currentPage === item.id}
                className="flex w-full items-center gap-2"
                onClick={() => onSelect?.(item.id)}
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
