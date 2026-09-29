import { useState } from "react"
import { AppSidebar } from "@/components/appSidebar"
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
import LandingPage from "@/pages/LandingPage"
import WalletPage from "@/pages/WalletPage"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./components/ui/input-group"
import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Button } from "@/components/ui/button"

type PageKey = "landing" | "wallet"

const items = [
  { label: "Ethereum", value: "ethereum", logo: ethereumLogo },
  { label: "Base", value: "base", logo: baseLogo },
  { label: "Arbitrum", value: "arbitrum", logo: arbitrumLogo },
  { label: "Solana", value: "solana", logo: solanaLogo },
  { label: "Polygon", value: "polygon", logo: polygonLogo },
]

export function App() {
  const [page, setPage] = useState<PageKey>("landing")

  const handleNavigate = (nextPage: PageKey) => {
    setPage(nextPage)
  }

  const renderPage = () => {
    switch (page) {
      case "wallet":
        return <WalletPage />
      case "landing":
        return <LandingPage />
      default:
        return null
    }
  }

  return (
    <SidebarProvider className="dark bg-[#070b14] text-slate-100">
      <AppSidebar currentPage={page} onNavigate={handleNavigate} />
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
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1">{renderPage()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
