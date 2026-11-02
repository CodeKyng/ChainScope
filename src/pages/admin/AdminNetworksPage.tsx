import { useState } from "react"
import { Network, Power } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ethereumLogo from "@/assets/ethereum.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import polygonLogo from "@/assets/Polygon.png"
import solanaLogo from "@/assets/solana.png"

type NetworkRow = {
  id: string
  name: string
  logo: string
  chainId: string
  status: "Online" | "Maintenance"
  rpc: string
}

const seed: NetworkRow[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    logo: ethereumLogo,
    chainId: "1",
    status: "Online",
    rpc: "https://eth.llamarpc.com",
  },
  {
    id: "base",
    name: "Base",
    logo: baseLogo,
    chainId: "8453",
    status: "Online",
    rpc: "https://mainnet.base.org",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    logo: arbitrumLogo,
    chainId: "42161",
    status: "Maintenance",
    rpc: "https://arb1.arbitrum.io/rpc",
  },
  {
    id: "polygon",
    name: "Polygon",
    logo: polygonLogo,
    chainId: "137",
    status: "Online",
    rpc: "https://polygon-rpc.com",
  },
  {
    id: "solana",
    name: "Solana",
    logo: solanaLogo,
    chainId: "mainnet-beta",
    status: "Online",
    rpc: "https://api.mainnet-beta.solana.com",
  },
]

export default function AdminNetworksPage() {
  const [networks, setNetworks] = useState(seed)

  const toggle = (id: string) =>
    setNetworks((current) =>
      current.map((n) =>
        n.id === id
          ? {
              ...n,
              status: n.status === "Online" ? "Maintenance" : "Online",
            }
          : n
      )
    )

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <div className="flex items-center gap-2">
          <Network className="size-5 text-indigo-300" />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-white">Networks</h1>
            <p className="text-sm text-slate-400">
              Enable or pause indexed networks for the product.
            </p>
          </div>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="text-sm">Configured chains</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {networks.map((network) => (
              <div
                key={network.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <img
                  src={network.logo}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">
                      {network.name}
                    </p>
                    <Badge className="border-slate-700 bg-slate-800 text-[9px]">
                      Chain {network.chainId}
                    </Badge>
                    <span
                      className={
                        network.status === "Online"
                          ? "text-[11px] text-emerald-300"
                          : "text-[11px] text-amber-300"
                      }
                    >
                      {network.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-slate-500">
                    {network.rpc}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-xs"
                  onClick={() => toggle(network.id)}
                >
                  <Power className="size-3.5" />
                  {network.status === "Online" ? "Set maintenance" : "Bring online"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
