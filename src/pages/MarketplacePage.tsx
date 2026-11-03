import { useCallback, useEffect, useState } from "react"
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
  ShoppingBag,
  Tag,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      setError("Connect a wallet (Sepolia) to buy. Approve the purchase in your wallet when prompted.")
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
      const message =
        err instanceof Error ? err.message : "Purchase failed"
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
      <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[720px] space-y-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Marketplace
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              NFT Marketplace
            </h1>
          </div>
          <Card className="rounded-lg border border-amber-500/30 bg-amber-500/5 py-6 text-slate-100 ring-0">
            <CardContent className="space-y-3 px-5 text-sm text-slate-300">
              <p className="font-medium text-amber-200">
                Marketplace contract not configured
              </p>
              <pre className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
{`VITE_MARKETPLACE_ADDRESS=0x...
VITE_MARKETPLACE_CHAIN_ID=11155111`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#070b14] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Marketplace
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Buy & list NFTs
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Sepolia MarketplaceV3 ·{" "}
              <span className="font-mono text-xs text-slate-500">
                {shortAddr(MARKETPLACE_ADDRESS)} · chain {marketplaceChain.id}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!account ? (
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-500"
                disabled={isConnecting}
                onClick={() => void connect({ client, wallets })}
              >
                <Wallet className="size-3.5" />
                {isConnecting ? "Connecting…" : "Connect wallet"}
              </Button>
            ) : (
              <Badge className="h-8 items-center gap-1.5 border-emerald-400/20 bg-emerald-400/10 px-2.5 font-mono text-[11px] text-emerald-200">
                <Wallet className="size-3" />
                {shortAddr(account.address)}
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-xs"
              onClick={() => void loadListings()}
              disabled={loading}
            >
              <RefreshCw
                className={`size-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {!account && (
          <div className="flex gap-3 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
            <Info className="mt-0.5 size-4 shrink-0 text-indigo-300" />
            <div className="space-y-1">
              <p className="font-medium text-indigo-50">Wallet required for buy & list</p>
              <p className="text-xs text-indigo-200/90">
                Connect a wallet on <strong>Sepolia</strong>. Listing needs NFT
                ownership and a one-time approval so the marketplace can transfer
                the token. Buying needs Sepolia ETH for price + gas.
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
          <p className="text-xs text-slate-500">
            Linked profile wallet:{" "}
            <span className="font-mono text-slate-400">
              {shortAddr(linkedWallet ?? undefined)}
            </span>
          </p>
        )}

        {error && (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}
        {statusMsg && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {statusMsg}
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">
                Active listings{" "}
                <span className="text-slate-500">({listings.length})</span>
              </h2>
            </div>

            {loading && !listings.length ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                Loading listings…
              </div>
            ) : listings.length === 0 ? (
              <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-12 text-center ring-0">
                <CardContent className="space-y-3 px-4 text-sm text-slate-500">
                  <ImageIcon className="mx-auto size-8 text-slate-600" />
                  <p className="text-slate-300">No active listings yet</p>
                  <p className="mx-auto max-w-md text-xs leading-relaxed">
                    Use the panel on the right with an NFT you own on Sepolia.
                    Your wallet will prompt to <strong className="text-slate-400">approve</strong>{" "}
                    the marketplace, then confirm the listing transaction.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => {
                  const img = nftImage(listing)
                  const name = nftName(listing)
                  const isBuying = buyingId === listing.id.toString()
                  return (
                    <Card
                      key={listing.id.toString()}
                      className="overflow-hidden rounded-lg border border-slate-800/80 bg-[#0b1220] py-0 text-slate-100 ring-0"
                    >
                      <div className="relative aspect-square bg-slate-900/80">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-slate-600">
                            <ImageIcon className="size-10" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 border-slate-700/80 bg-slate-950/80 text-[9px]">
                          #{listing.tokenId.toString()}
                        </Badge>
                      </div>
                      <CardContent className="space-y-3 px-3 py-3">
                        <div>
                          <p className="truncate text-sm font-medium text-white">
                            {name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Seller {shortAddr(listing.creatorAddress)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[10px] text-slate-500">Price</p>
                            <p className="text-sm font-semibold text-indigo-200">
                              {formatPrice(listing)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-500"
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
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="space-y-3">
            <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
              <CardHeader className="px-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Tag className="size-4 text-indigo-300" />
                  List an NFT
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <form onSubmit={(e) => void handleCreateListing(e)} className="space-y-3">
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
                      placeholder="0x..."
                      className="h-9 border-slate-700 bg-slate-900 font-mono text-xs"
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
                      className="h-9 border-slate-700 bg-slate-900 text-sm"
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
                      className="h-9 border-slate-700 bg-slate-900 text-sm"
                      required
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Wallet must own the NFT. First tx may be an{" "}
                    <span className="text-slate-400">approval</span>; second
                    creates the listing (30 days).
                  </p>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-500"
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
              </CardContent>
            </Card>

            <Card className="rounded-lg border border-slate-800/80 bg-[#0b1220] py-4 text-slate-100 ring-0">
              <CardHeader className="px-4 pb-2">
                <CardTitle className="text-sm">Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 text-xs text-slate-400">
                <p className="break-all font-mono text-[11px] text-slate-300">
                  {MARKETPLACE_ADDRESS}
                </p>
                <a
                  href={`https://thirdweb.com/${marketplaceChain.id}/${MARKETPLACE_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-300 hover:underline"
                >
                  Open in thirdweb
                  <ExternalLink className="size-3" />
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
