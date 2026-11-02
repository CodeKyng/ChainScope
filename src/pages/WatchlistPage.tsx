import { useState } from "react"
import { Bell, Plus, Star, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ethereumLogo from "@/assets/ethereum.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"

type WatchItem = {
  id: number
  label: string
  address: string
  network: string
  logo: string
  notes: string
}

const seed: WatchItem[] = [
  {
    id: 1,
    label: "Treasury",
    address: "0x71a3...A92F",
    network: "Ethereum",
    logo: ethereumLogo,
    notes: "Primary treasury wallet",
  },
  {
    id: 2,
    label: "Competitor A",
    address: "0x9b74...821F",
    network: "Base",
    logo: baseLogo,
    notes: "Track funding rounds",
  },
  {
    id: 3,
    label: "Bridge ops",
    address: "0x3e2f...7Da1",
    network: "Arbitrum",
    logo: arbitrumLogo,
    notes: "Bridge liquidity",
  },
]

export default function WatchlistPage() {
  const [items, setItems] = useState(seed)
  const [label, setLabel] = useState("")
  const [address, setAddress] = useState("")
  const [showForm, setShowForm] = useState(false)

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim() || !address.trim()) return
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        label: label.trim(),
        address:
          address.length > 14
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : address.trim(),
        network: "Ethereum",
        logo: ethereumLogo,
        notes: "",
      },
    ])
    setLabel("")
    setAddress("")
    setShowForm(false)
  }

  const remove = (id: number) =>
    setItems((current) => current.filter((item) => item.id !== id))

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Watchlist
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Addresses you care about
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Save wallets to monitor balances and activity later.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="size-3.5" />
            Add address
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={addItem}
            className="grid gap-2 rounded-lg border border-slate-800 bg-[#0a101d] p-4 sm:grid-cols-[1fr_1.4fr_auto]"
          >
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label"
              className="h-9 border-slate-700 bg-slate-900 text-sm"
              required
            />
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or ENS"
              className="h-9 border-slate-700 bg-slate-900 font-mono text-sm"
              required
            />
            <Button type="submit" size="sm" className="h-9 bg-indigo-600">
              Save
            </Button>
          </form>
        )}

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="size-4 text-amber-300" />
              Saved addresses ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <img
                  src={item.logo}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">
                      {item.label}
                    </p>
                    <Badge className="border-slate-700 bg-slate-800 text-[9px] text-slate-300">
                      {item.network}
                    </Badge>
                  </div>
                  <p className="font-mono text-[11px] text-slate-500">
                    {item.address}
                  </p>
                  {item.notes && (
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {item.notes}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" className="border-slate-700 text-xs">
                  <Bell className="size-3.5" />
                  Alert
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-rose-300"
                  aria-label="Remove"
                  onClick={() => remove(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {!items.length && (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                Your watchlist is empty. Add an address to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
