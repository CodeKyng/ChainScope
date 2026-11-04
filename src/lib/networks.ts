import ethereumLogo from "@/assets/ethereum.png"
import baseLogo from "@/assets/Base.png"
import arbitrumLogo from "@/assets/arbitrum.png"
import polygonLogo from "@/assets/Polygon.png"
import solanaLogo from "@/assets/solana.png"

export type NetworkId =
  | "ethereum"
  | "base"
  | "arbitrum"
  | "polygon"
  | "solana"

export type NetworkDef = {
  id: NetworkId
  label: string
  value: NetworkId
  logo: string
  chainId: string
  explorer: string
  rpc: string
  /** Brand color for letter fallbacks */
  color: string
}

export const NETWORKS: NetworkDef[] = [
  {
    id: "ethereum",
    label: "Ethereum",
    value: "ethereum",
    logo: ethereumLogo,
    chainId: "1",
    explorer: "https://etherscan.io",
    rpc: "https://eth.llamarpc.com",
    color: "#627EEA",
  },
  {
    id: "base",
    label: "Base",
    value: "base",
    logo: baseLogo,
    chainId: "8453",
    explorer: "https://basescan.org",
    rpc: "https://mainnet.base.org",
    color: "#0052FF",
  },
  {
    id: "arbitrum",
    label: "Arbitrum",
    value: "arbitrum",
    logo: arbitrumLogo,
    chainId: "42161",
    explorer: "https://arbiscan.io",
    rpc: "https://arb1.arbitrum.io/rpc",
    color: "#28A0F0",
  },
  {
    id: "polygon",
    label: "Polygon",
    value: "polygon",
    logo: polygonLogo,
    chainId: "137",
    explorer: "https://polygonscan.com",
    rpc: "https://polygon-rpc.com",
    color: "#8247E5",
  },
  {
    id: "solana",
    label: "Solana",
    value: "solana",
    logo: solanaLogo,
    chainId: "mainnet-beta",
    explorer: "https://solscan.io",
    rpc: "https://api.mainnet-beta.solana.com",
    color: "#9945FF",
  },
]

export function getNetwork(id: string | null | undefined): NetworkDef {
  return NETWORKS.find((n) => n.id === id) ?? NETWORKS[0]
}

export function explorerAddressUrl(networkId: string, address: string) {
  const net = getNetwork(networkId)
  if (net.id === "solana") return `${net.explorer}/account/${address}`
  return `${net.explorer}/address/${address}`
}
