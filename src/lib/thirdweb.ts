import { createThirdwebClient, getContract, type ThirdwebContract } from "thirdweb"
import { defineChain, sepolia } from "thirdweb/chains"
import { createWallet, inAppWallet } from "thirdweb/wallets"

export const client = createThirdwebClient({
  clientId:
    import.meta.env.VITE_THIRDWEB_CLIENT_ID ??
    "d38cf60616775215991525e26e22c608",
})

/** Default wallets: in-app (email + social) + popular external wallets */
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "discord",
        "x",
        "email",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("walletConnect"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
]

/** Marketplace chain — set VITE_MARKETPLACE_CHAIN_ID (default Sepolia 11155111) */
const chainId = Number(
  import.meta.env.VITE_MARKETPLACE_CHAIN_ID ?? "11155111"
)
export const marketplaceChain =
  chainId === 11155111 ? sepolia : defineChain(chainId)

/** MarketplaceV3 contract address from thirdweb dashboard */
export const MARKETPLACE_ADDRESS = (
  import.meta.env.VITE_MARKETPLACE_ADDRESS ?? ""
).trim()

/** Cached so callers get a stable reference across renders */
let _marketplaceContract: ThirdwebContract | null | undefined

export function getMarketplaceContract() {
  if (!MARKETPLACE_ADDRESS) return null
  if (_marketplaceContract === undefined) {
    _marketplaceContract = getContract({
      client,
      chain: marketplaceChain,
      address: MARKETPLACE_ADDRESS,
    })
  }
  return _marketplaceContract
}
