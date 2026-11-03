import { useCallback, useEffect, useState } from "react"
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
  Loader2,
  RefreshCw,
  ShoppingBag,
  Tag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const account = useActiveAccount()
  const { connect } = useConnectModal()
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
        start: 0n,
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
    const active = await ensureWallet()
    if (!active && !account) return

    const buyer = account?.address
    if (!buyer) {
      setError("Connect a wallet to buy.")
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
        setError(message)
      }
    } finally {
      setBuyingId(null)
    }
  }

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!marketplace) return

    const active = await ensureWallet()
    if (!active && !account) return
    if (!account?.address) {
      setError("Connect a wallet to list an NFT.")
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
      setStatusMsg("Listing created successfully.")
      setListingForm({ assetContract: "", tokenId: "", price: "" })
      await loadListings()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create listing"
      if (!message.toLowerCase().includes("reject")) {
        setError(message)
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
              <ol className="list-decimal space-y-2 pl-5 text-slate-400">
                <li>
                  Deploy a{" "}
                  <a
                    href="https://thirdweb.com/thirdweb.eth/MarketplaceV3"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-300 underline"
                  >
                    MarketplaceV3
                  </a>{" "}
                  contract on the thirdweb dashboard.
                </li>
                <li>
                  Add to your <code className="text-slate-200">.env</code>:
                </li>
              </ol>
              <pre className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
{`VITE_MARKETPLACE_ADDRESS=0xYourMarketplaceAddress
VITE_MARKETPLACE_CHAIN_ID=11155111`}
              </pre>
              <p className="text-xs text-slate-500">
                Default chain is Sepolia (11155111). Restart the dev server after
                updating env vars.
              </p>
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
              Powered by thirdweb MarketplaceV3 ·{" "}
              <span className="font-mono text-xs text-slate-500">
                {shortAddr(MARKETPLACE_ADDRESS)} · chain {marketplaceChain.id}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!account && (
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-500"
                onClick={() => void connect({ client, wallets })}
              >
                Connect wallet
              </Button>
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
                <CardContent className="space-y-2 px-4 text-sm text-slate-500">
                  <ImageIcon className="mx-auto size-8 text-slate-600" />
                  <p>No active listings yet.</p>
                  <p className="text-xs">
                    List an NFT from the panel on the right, or create listings
                    in the thirdweb dashboard.
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
                            Buy
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
                <form onSubmit={handleCreateListing} className="space-y-3">
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
                      Price (native token)
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
                    You must own the NFT and approve the marketplace to transfer
                    it. Listing lasts 30 days by default.
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
                    Create listing
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
