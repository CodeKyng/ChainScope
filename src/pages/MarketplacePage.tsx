import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  useActiveAccount,
  useConnectModal,
  useSendTransaction,
} from "thirdweb/react"
import {
  buyFromListing,
  createListing,
  getAllValidListings,
  type DirectListing,
} from "thirdweb/extensions/marketplace"
import { NATIVE_TOKEN_ADDRESS } from "thirdweb"
import {
  ExternalLink,
  ImageIcon,
  Info,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useUserData } from "@/context/UserDataContext"
import {
  client,
  getMarketplaceContract,
  MARKETPLACE_ADDRESS,
  marketplaceChain,
  wallets,
} from "@/lib/thirdweb"
import { cn } from "@/lib/utils"

function shortAddr(addr?: string) {
  if (!addr) return "—"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function formatPrice(listing: DirectListing) {
  const value = listing.currencyValuePerToken
  if (!value) return "—"
  const display =
    typeof value.displayValue === "string"
      ? value.displayValue
      : String(value.displayValue ?? "")
  const symbol = value.symbol ?? "ETH"
  return `${display} ${symbol}`
}

function nftImage(listing: DirectListing) {
  const meta = listing.asset?.metadata as
    | { image?: string; name?: string }
    | undefined
  const image = meta?.image
  if (!image) return null
  if (image.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${image.replace("ipfs://", "")}`
  }
  return image
}

function nftName(listing: DirectListing) {
  const meta = listing.asset?.metadata as { name?: string } | undefined
  return meta?.name || `Token #${listing.tokenId.toString()}`
}

type MarketTab = "all" | "listed" | "list"

export default function MarketplacePage() {
  const { user } = useAuth()
  const { linkedWallet, profile } = useUserData()
  const account = useActiveAccount()
  const { connect, isConnecting } = useConnectModal()
  const { mutateAsync: sendTx, isPending } = useSendTransaction()

  const [listings, setListings] = useState<DirectListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [listingForm, setListingForm] = useState({
    assetContract: "",
    tokenId: "",
    price: "",
  })
  const [listingBusy, setListingBusy] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<MarketTab>("all")

  const marketplace = getMarketplaceContract()

  const loadListings = useCallback(async () => {
    if (!marketplace) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAllValidListings({
        contract: marketplace,
        start: 0,
        count: 50n,
      })
      setListings(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load listings"
      setError(message)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [marketplace])

  useEffect(() => {
    void loadListings()
  }, [loadListings])

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return listings
    return listings.filter((l) => {
      const name = nftName(l).toLowerCase()
      const seller = (l.creatorAddress ?? "").toLowerCase()
      const token = l.tokenId.toString()
      const contract = (l.assetContractAddress ?? "").toLowerCase()
      return (
        name.includes(q) ||
        seller.includes(q) ||
        token.includes(q) ||
        contract.includes(q)
      )
    })
  }, [listings, query])

  const ensureWallet = async () => {
    if (account) return account
    await connect({ client, wallets })
    return null
  }

  const handleBuy = async (listing: DirectListing) => {
    if (!marketplace) return
    await ensureWallet()
    const buyer = account?.address
    if (!buyer) {
      setError(
        "Connect a wallet (Sepolia) to buy. Approve the purchase in your wallet when prompted."
      )
      return
    }

    setBuyingId(listing.id.toString())
    setError(null)
    setStatusMsg(null)
    try {
      const tx = buyFromListing({
        contract: marketplace,
        listingId: listing.id,
        quantity: 1n,
        recipient: buyer,
      })
      await sendTx(tx)
      setStatusMsg(`Purchased ${nftName(listing)}`)
      await loadListings()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Purchase failed"
      if (!message.toLowerCase().includes("reject")) {
        setError(
          message.toLowerCase().includes("insufficient")
            ? `${message} — ensure you have Sepolia ETH for gas and the listing price.`
            : message
        )
      }
    } finally {
      setBuyingId(null)
    }
  }

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!marketplace) return

    await ensureWallet()
    if (!account?.address) {
      setError(
        "Connect a wallet on Sepolia to list. You must own the NFT and approve the marketplace to transfer it."
      )
      return
    }

    const { assetContract, tokenId, price } = listingForm
    if (!assetContract || !tokenId || !price) {
      setError("Fill in contract, token ID, and price.")
      return
    }

    setListingBusy(true)
    setError(null)
    setStatusMsg(null)
    try {
      const now = Math.floor(Date.now() / 1000)
      const tx = createListing({
        contract: marketplace,
        assetContractAddress: assetContract as `0x${string}`,
        tokenId: BigInt(tokenId),
        quantity: 1n,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        pricePerToken: price,
        startTimestamp: new Date(now * 1000),
        endTimestamp: new Date((now + 60 * 60 * 24 * 30) * 1000),
        isReservedListing: false,
      })
      await sendTx(tx)
      setStatusMsg(
        "Listing created. If the tx asked for NFT approval first, confirm that, then list again if needed."
      )
      setListingForm({ assetContract: "", tokenId: "", price: "" })
      await loadListings()
      setTab("all")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create listing"
      if (!message.toLowerCase().includes("reject")) {
        setError(
          /approv|allowance|owner/i.test(message)
            ? `${message} — approve the marketplace contract on the NFT, then retry.`
            : message
        )
      }
    } finally {
      setListingBusy(false)
    }
  }

  if (!MARKETPLACE_ADDRESS) {
    return (
      <div className="min-h-full bg-[#070b14] text-slate-100">
        <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300">
              <Sparkles className="size-3.5 text-indigo-400" />
              Marketplace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              NFT Marketplace
            </h1>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="font-medium text-amber-200">
              Marketplace contract not configured
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Add these env vars on Vercel (or locally) and redeploy.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
{`VITE_MARKETPLACE_ADDRESS=0x...
VITE_MARKETPLACE_CHAIN_ID=11155111`}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  const showBrowse = tab === "all" || tab === "listed"
  const showListForm = tab === "all" || tab === "list"

  return (
    <div className="min-h-full bg-[#070b14] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.22), transparent 55%), radial-gradient(ellipse 45% 40% at 95% 15%, rgba(168,85,247,0.1), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
                <ShoppingBag className="size-3.5 text-indigo-400" />
                Marketplace · Sepolia
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Buy &amp; list NFTs on-chain
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                MarketplaceV3 on Sepolia. Browse active listings, buy with one
                click, or list an NFT you own — wallet approval required.
              </p>
              <p className="mt-2 font-mono text-[11px] text-slate-500">
                {shortAddr(MARKETPLACE_ADDRESS)} · chain {marketplaceChain.id}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!account ? (
                <Button
                  className="h-10 rounded-full bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                  disabled={isConnecting}
                  onClick={() => void connect({ client, wallets })}
                >
                  <Wallet className="size-3.5" />
                  {isConnecting ? "Connecting…" : "Connect wallet"}
                </Button>
              ) : (
                <Badge className="h-10 items-center gap-2 rounded-full border-emerald-400/25 bg-emerald-400/10 px-3.5 font-mono text-xs text-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {shortAddr(account.address)}
                </Badge>
              )}
              <Button
                variant="outline"
                className="h-10 rounded-full border-slate-700 bg-slate-900/50 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => void loadListings()}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("size-3.5", loading && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search + tabs */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, seller, token ID…"
                className="h-11 rounded-xl border-slate-700/80 bg-slate-900/70 pl-11 text-sm placeholder:text-slate-500 focus-visible:ring-indigo-500/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "all" as const, label: "Browse" },
                  {
                    id: "listed" as const,
                    label: "Listings",
                    count: String(listings.length),
                  },
                  { id: "list" as const, label: "List NFT" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                    tab === t.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "border border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  )}
                >
                  {t.label}
                  {"count" in t && t.count && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px]",
                        tab === t.id
                          ? "bg-slate-200 text-slate-700"
                          : "bg-slate-800 text-slate-500"
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {!account && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3.5 text-sm text-indigo-100">
            <Info className="mt-0.5 size-4 shrink-0 text-indigo-300" />
            <div className="space-y-1">
              <p className="font-medium text-indigo-50">
                Wallet required for buy &amp; list
              </p>
              <p className="text-xs text-indigo-200/90">
                Connect a wallet on <strong>Sepolia</strong>. Listing needs NFT
                ownership and a one-time approval so the marketplace can
                transfer the token. Buying needs Sepolia ETH for price + gas.
              </p>
              {user && !profile?.walletAddress && (
                <p className="text-xs text-indigo-200/80">
                  Tip: connect while signed in to{" "}
                  <Link to="/settings" className="underline">
                    link the wallet to your account
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        )}

        {account && user && profile?.walletAddress && (
          <p className="mb-4 text-xs text-slate-500">
            Linked profile wallet:{" "}
            <span className="font-mono text-slate-400">
              {shortAddr(linkedWallet ?? undefined)}
            </span>
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {error}
          </div>
        )}
        {statusMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
            {statusMsg}
          </div>
        )}

        <div
          className={cn(
            "grid gap-8",
            showBrowse && showListForm
              ? "xl:grid-cols-[1fr_340px]"
              : "grid-cols-1"
          )}
        >
          {/* Listings grid */}
          {showBrowse && (
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Active listings
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {filteredListings.length} of {listings.length} shown
                    </p>
                  </div>
                </div>
              </div>

              {loading && !listings.length ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-sm text-slate-500">
                  <Loader2 className="size-4 animate-spin" />
                  Loading listings…
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
                  <ImageIcon className="mx-auto size-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    {query ? "No listings match your search" : "No active listings yet"}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                    {query
                      ? "Try a different name, seller, or token ID."
                      : "Use List NFT with an NFT you own on Sepolia. Your wallet will prompt to approve the marketplace, then confirm the listing."}
                  </p>
                  {!query && (
                    <Button
                      className="mt-5 h-9 rounded-full bg-white px-4 text-xs font-medium text-slate-900 hover:bg-slate-100"
                      onClick={() => setTab("list")}
                    >
                      <Tag className="size-3.5" />
                      List an NFT
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredListings.map((listing) => {
                    const img = nftImage(listing)
                    const name = nftName(listing)
                    const isBuying = buyingId === listing.id.toString()
                    return (
                      <article
                        key={listing.id.toString()}
                        className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] transition hover:border-slate-700 hover:bg-[#0d1524]"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-900/80">
                          {img ? (
                            <img
                              src={img}
                              alt={name}
                              className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-slate-600">
                              <ImageIcon className="size-12" />
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3 border-0 bg-black/60 text-[10px] text-white backdrop-blur-sm">
                            #{listing.tokenId.toString()}
                          </Badge>
                        </div>
                        <div className="space-y-3 p-4">
                          <div>
                            <h3 className="truncate text-sm font-medium text-white">
                              {name}
                            </h3>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              Seller {shortAddr(listing.creatorAddress)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                            <div>
                              <p className="text-[10px] tracking-wide text-slate-500 uppercase">
                                Price
                              </p>
                              <p className="text-sm font-semibold text-indigo-200">
                                {formatPrice(listing)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="h-9 rounded-full bg-white px-4 text-xs font-medium text-slate-900 hover:bg-slate-100"
                              disabled={isPending || isBuying}
                              onClick={() => void handleBuy(listing)}
                            >
                              {isBuying ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <ShoppingBag className="size-3.5" />
                              )}
                              {account ? "Buy" : "Connect & buy"}
                            </Button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* List panel */}
          {showListForm && (
            <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
              <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220]">
                <div className="border-b border-slate-800/80 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                      <Tag className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        List an NFT
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        30-day listing · native ETH
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={(e) => void handleCreateListing(e)}
                  className="space-y-4 p-5"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">
                      NFT contract address
                    </Label>
                    <Input
                      value={listingForm.assetContract}
                      onChange={(e) =>
                        setListingForm((f) => ({
                          ...f,
                          assetContract: e.target.value,
                        }))
                      }
                      placeholder="0x…"
                      className="h-10 rounded-xl border-slate-700 bg-slate-900/80 font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Token ID</Label>
                    <Input
                      value={listingForm.tokenId}
                      onChange={(e) =>
                        setListingForm((f) => ({
                          ...f,
                          tokenId: e.target.value,
                        }))
                      }
                      placeholder="0"
                      className="h-10 rounded-xl border-slate-700 bg-slate-900/80 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">
                      Price (Sepolia ETH)
                    </Label>
                    <Input
                      value={listingForm.price}
                      onChange={(e) =>
                        setListingForm((f) => ({ ...f, price: e.target.value }))
                      }
                      placeholder="0.01"
                      className="h-10 rounded-xl border-slate-700 bg-slate-900/80 text-sm"
                      required
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Wallet must own the NFT. First tx may be an{" "}
                    <span className="text-slate-400">approval</span>; second
                    creates the listing.
                  </p>
                  <Button
                    type="submit"
                    className="h-10 w-full rounded-full bg-white text-sm font-medium text-slate-900 hover:bg-slate-100"
                    disabled={listingBusy || isPending}
                  >
                    {listingBusy ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Tag className="size-3.5" />
                    )}
                    {account ? "Create listing" : "Connect & list"}
                  </Button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-[#0b1220] p-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Contract
                </h3>
                <p className="mt-2 break-all font-mono text-[11px] text-slate-300">
                  {MARKETPLACE_ADDRESS}
                </p>
                <a
                  href={`https://thirdweb.com/${marketplaceChain.id}/${MARKETPLACE_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:underline"
                >
                  Open in thirdweb
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
