import { useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

export default function SettingsPage() {
  const { user } = useAuth()
  const account = useActiveAccount()
  const [displayName, setDisplayName] = useState(user?.displayName ?? "")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[720px] space-y-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
            Settings
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Account preferences
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage how ChainScope identifies you and which networks you prefer.
          </p>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-xs text-slate-400">
                  Display name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-9 border-slate-700 bg-slate-900 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Email</Label>
                <Input
                  value={user?.email ?? "Not signed in with email"}
                  disabled
                  className="h-9 border-slate-700 bg-slate-900/50 text-sm text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Connected wallet</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    value={account?.address ?? "No wallet connected"}
                    disabled
                    className="h-9 flex-1 border-slate-700 bg-slate-900/50 font-mono text-xs text-slate-400"
                  />
                  {account?.address && (
                    <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300">
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Save changes
                </Button>
                {saved && (
                  <span className="text-xs text-emerald-300">Saved</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="text-sm">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2.5">
              <span>Default network</span>
              <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                Ethereum
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2.5">
              <span>Currency display</span>
              <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                USD
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2.5">
              <span>Email digests</span>
              <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300">
                Weekly
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
