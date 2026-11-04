import { useEffect, useState } from "react"
import {
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react"
import { updateProfile } from "firebase/auth"
import {
  Check,
  Link2,
  Settings2,
  Shield,
  Unplug,
  User,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useNetwork } from "@/context/NetworkContext"
import { useUserData } from "@/context/UserDataContext"
import { auth } from "@/lib/firebase"
import { client, wallets } from "@/lib/thirdweb"
import { cn } from "@/lib/utils"

function shortAddr(addr?: string | null) {
  if (!addr) return "—"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function SettingsPage() {
  const { user } = useAuth()
  const account = useActiveAccount()
  const activeWallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { connect, isConnecting } = useConnectModal()
  const { network } = useNetwork()
  const { profile, saveProfile, linkedWallet } = useUserData()
  const [displayName, setDisplayName] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(
      profile?.displayName ||
        user?.displayName ||
        user?.email?.split("@")[0] ||
        ""
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

  const linkWallet = async () => {
    setError(null)
    try {
      await connect({ client, wallets })
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.toLowerCase().includes("reject")
      ) {
        setError(err.message)
      }
    }
  }

  const unlinkSessionWallet = async () => {
    if (!activeWallet) return
    try {
      await disconnect(activeWallet)
    } catch {
      /* ignore */
    }
  }

  const isLinked =
    !!user &&
    !!account?.address &&
    profile?.walletAddress?.toLowerCase() === account.address.toLowerCase()

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(ellipse 45% 40% at 90% 15%, rgba(56,189,248,0.08), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
            <Settings2 className="size-3.5 text-indigo-400" />
            Settings
            {profile?.plan && (
              <>
                <span className="text-slate-600">·</span>
                <span>{profile.plan} plan</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Account preferences
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
            Link email and wallet on one profile so marketplace, watchlist, and
            alerts share the same identity.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[900px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Profile */}
        <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
          <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <User className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Profile</h2>
              <p className="text-[11px] text-slate-500">
                Display name and email on your account
              </p>
            </div>
          </div>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-xs text-slate-400">
                  Display name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-10 rounded-xl border-slate-700 bg-slate-900/80 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Email</Label>
                <Input
                  value={user?.email ?? "Not signed in with email"}
                  disabled
                  className="h-10 rounded-xl border-slate-700 bg-slate-900/40 text-sm text-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="h-10 rounded-full bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                {saved ? (
                  <>
                    <Check className="size-3.5" />
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              {saved && (
                <span className="text-xs text-emerald-400">
                  Profile updated
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Linked identity */}
        <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
          <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Link2 className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Linked identity
              </h2>
              <p className="text-[11px] text-slate-500">
                One account · email + wallet
              </p>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs leading-relaxed text-slate-500">
              Sign in with email, then connect a wallet. We store the address on
              your user profile so both methods belong to one account.
            </p>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
                <Wallet className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-wide text-slate-500 uppercase">
                  Wallet
                </p>
                <p className="truncate font-mono text-sm text-slate-200">
                  {linkedWallet ? shortAddr(linkedWallet) : "No wallet linked"}
                </p>
                {linkedWallet && linkedWallet.length > 12 && (
                  <p className="mt-0.5 truncate font-mono text-[10px] text-slate-600">
                    {linkedWallet}
                  </p>
                )}
              </div>
              {isLinked ? (
                <Badge className="border-emerald-400/25 bg-emerald-400/10 text-[10px] text-emerald-300">
                  Linked
                </Badge>
              ) : account?.address ? (
                <Badge className="border-amber-400/25 bg-amber-400/10 text-[10px] text-amber-200">
                  Session only
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {!account ? (
                <Button
                  className="h-10 rounded-full bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                  disabled={isConnecting || !user}
                  onClick={() => void linkWallet()}
                >
                  <Wallet className="size-3.5" />
                  {isConnecting ? "Connecting…" : "Connect & link wallet"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-slate-700 bg-transparent px-5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => void unlinkSessionWallet()}
                >
                  <Unplug className="size-3.5" />
                  Disconnect session
                </Button>
              )}
            </div>
            {!user && (
              <p className="text-[11px] text-amber-200/90">
                Sign in with email first to persist the wallet on your profile.
              </p>
            )}
          </div>
        </section>

        {/* Preferences */}
        <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
          <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
              <Shield className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Preferences</h2>
              <p className="text-[11px] text-slate-500">
                Network, plan, and role
              </p>
            </div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {(
              [
                {
                  label: "Active network",
                  value: network.label,
                  hint: "Change from the header selector",
                },
                {
                  label: "Plan",
                  value: profile?.plan ?? "Free",
                  hint: null,
                },
                {
                  label: "Role",
                  value: profile?.role ?? "user",
                  hint: null,
                },
                {
                  label: "Account status",
                  value: profile?.status ?? "Active",
                  hint: null,
                },
              ] as const
            ).map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <div>
                  <p className="text-sm text-slate-200">{row.label}</p>
                  {row.hint && (
                    <p className="text-[11px] text-slate-500">{row.hint}</p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-slate-700 bg-slate-800/60 text-[11px] font-medium capitalize text-slate-300",
                    row.label === "Account status" &&
                      (profile?.status === "Suspended"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300")
                  )}
                >
                  {row.value}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
