import { useState } from "react"
import { Bell, Plus, Star, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import { getNetwork, type NetworkId } from "@/lib/networks"

export default function WatchlistPage() {
  const { networkId, networks } = useNetwork()
  const { watchlist, addWatchItem, removeWatchItem, pushNotification } =
    useUserData()
  const [label, setLabel] = useState("")
  const [address, setAddress] = useState("")
  const [itemNetwork, setItemNetwork] = useState<NetworkId>(networkId)
  const [showForm, setShowForm] = useState(false)

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim() || !address.trim()) return
    const addr = address.trim()
    await addWatchItem({
      label: label.trim(),
      address: addr,
      network: itemNetwork,
      notes: "",
    })
    await pushNotification(`Added ${label.trim()} to watchlist`)
    setLabel("")
    setAddress("")
    setShowForm(false)
  }

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
              Saved locally and synced to your account when signed in.
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
            onSubmit={(e) => void addItem(e)}
            className="grid gap-2 rounded-lg border border-slate-800 bg-[#0a101d] p-4 sm:grid-cols-[1fr_1.2fr_140px_auto]"
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
            <Select
              value={itemNetwork}
              onValueChange={(v) => v && setItemNetwork(v as NetworkId)}
            >
              <SelectTrigger className="h-9 border-slate-700 bg-slate-900 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {networks.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" size="sm" className="h-9 bg-indigo-600">
              Save
            </Button>
          </form>
        )}

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0">
          <CardHeader className="border-b border-slate-800/80 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="size-4 text-amber-300" />
              Saved addresses ({watchlist.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800/80 p-0">
            {watchlist.map((item) => {
              const net = getNetwork(item.network)
              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <img
                    src={net.logo}
                    alt=""
                    className="size-8 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-100">
                        {item.label}
                      </p>
                      <Badge className="border-slate-700 bg-slate-800 text-[9px] text-slate-300">
                        {net.label}
                      </Badge>
                    </div>
                    <p className="font-mono text-[11px] text-slate-500">
                      {item.address}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                    onClick={() =>
                      void pushNotification(
                        `Alert armed for ${item.label} (${net.label})`
                      )
                    }
                  >
                    <Bell className="size-3.5" />
                    Alert
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-rose-300"
                    aria-label="Remove"
                    onClick={() => void removeWatchItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )
            })}
            {!watchlist.length && (
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
