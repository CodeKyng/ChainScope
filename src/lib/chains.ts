import {
  arbitrum,
  base,
  ethereum,
  polygon,
  sepolia,
  type Chain,
} from "thirdweb/chains"
import type { NetworkId } from "@/lib/networks"

/** Map app network ids to thirdweb Chain objects (EVM only). */
export function getThirdwebChain(networkId: NetworkId | string): Chain | null {
  switch (networkId) {
    case "ethereum":
      return ethereum
    case "base":
      return base
    case "arbitrum":
      return arbitrum
    case "polygon":
      return polygon
    case "sepolia":
      return sepolia
    case "solana":
      return null
    default:
      return ethereum
  }
}

export const EVM_NETWORK_IDS: NetworkId[] = [
  "ethereum",
  "base",
  "arbitrum",
  "polygon",
]
