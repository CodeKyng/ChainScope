import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import ethereumLogo from "@/assets/ethereum.png"
import solanaLogo from "@/assets/solana.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import polygonLogo from "@/assets/Polygon.png"

const items = [
  { label: "Ethereum", value: "ethereum", logo: ethereumLogo },
  { label: "Base", value: "base", logo: baseLogo },
  { label: "Arbitrum", value: "arbitrum", logo: arbitrumLogo },
  { label: "Solana", value: "solana", logo: solanaLogo },
  { label: "Polygon", value: "polygon", logo: polygonLogo },
]

function HeroSection() {
  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-8 text-white shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-[0.2em] text-violet-200 uppercase">
            Welcome to ChainScope
          </span>
          <div className="">
            <h1 className="mt-5 bg-gradient-to-r from-white from-30% to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Understand what's happening on-chain.
            </h1>
          </div>
          <p className="mt-4 max-w-lg text-base text-slate-300 md:text-lg">
            Track wallets. Analyze activities. Explore blockchain data. All in
            one place.
          </p>

          <div className="my-6 flex flex-wrap gap-3">
            <InputGroup className="max-w-xs">
              <InputGroupInput placeholder="Enter wallet address, ENS or tokens ..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Select items={items}>
              <SelectTrigger className="w-full max-w-48">
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
          </div>
          <div className="flex gap-2">
            <h1>Popular Networks:</h1>
            {items.map((item) => (
                    <div key={item.value}>
                      <span className="flex items-center gap-1">
                        <img
                          src={item.logo}
                          alt={item.label}
                          className="size-4 rounded-full border border-white object-cover"
                        />
                        {item.label}
                      </span>
                    </div>
                  ))}
          </div>
        </div>
        <img src="hero.png" alt="ChainScope Hero Image" />
      </div>
    </section>
  )
}

export default HeroSection
