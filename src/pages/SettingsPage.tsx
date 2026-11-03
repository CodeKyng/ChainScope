import { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import { updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function SettingsPage() {
  const { user } = useAuth()
  const account = useActiveAccount()
  const { network } = useNetwork()
  const { profile, saveProfile } = useUserData()
  const [displayName, setDisplayName] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(
      profile?.displayName || user?.displayName || user?.email?.split("@")[0] || ""
    )
  }, [profile?.displayName, user?.displayName, user?.email])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (auth.currentUser && displayName.trim()) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
        })
      }
      await saveProfile({
        displayName: displayName.trim(),
        walletAddress: account?.address ?? profile?.walletAddress ?? null,
      })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    }
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
            Profile saves to Firebase Auth + Firestore when available.
          </p>
        </div>

        <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
              {error && (
                <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {error}
                </div>
              )}
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
              <span>Active network</span>
              <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                {network.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2.5">
              <span>Plan</span>
              <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                {profile?.plan ?? "Free"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2.5">
              <span>Role</span>
              <Badge className="border-slate-700 bg-slate-800 text-[10px]">
                {profile?.role ?? "user"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
