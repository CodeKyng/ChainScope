import { useState } from "react"
import { getNetwork, type NetworkId } from "@/lib/networks"
import { cn } from "@/lib/utils"

const FALLBACK_COLORS: Record<string, string> = {
  ethereum: "bg-[#627EEA]",
  base: "bg-[#0052FF]",
  arbitrum: "bg-[#28A0F0]",
  polygon: "bg-[#8247E5]",
  solana: "bg-gradient-to-br from-[#9945FF] to-[#14F195]",
  sepolia: "bg-[#CFB5F0]",
}

type NetworkIconProps = {
  networkId?: string | null
  src?: string | null
  label?: string
  className?: string
  /** Tailwind size classes e.g. size-4 size-8 */
  sizeClass?: string
}

/**
 * Network / chain logo with color letter fallback if the image fails to load.
 */
export function NetworkIcon({
  networkId,
  src,
  label,
  className,
  sizeClass = "size-4",
}: NetworkIconProps) {
  const net = networkId ? getNetwork(networkId) : null
  const logo = src ?? net?.logo
  const name = label ?? net?.label ?? "Network"
  const id = (networkId ?? net?.id ?? "ethereum") as NetworkId
  const [failed, setFailed] = useState(false)

  if (!logo || failed) {
    const letter = name.charAt(0).toUpperCase()
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ring-white/10",
          sizeClass,
          FALLBACK_COLORS[id] ?? "bg-slate-600",
          className
        )}
        title={name}
        aria-hidden
      >
        {letter}
      </span>
    )
  }

  return (
    <img
      src={logo}
      alt=""
      title={name}
      className={cn(
        "inline-block shrink-0 rounded-full bg-slate-800 object-cover ring-1 ring-white/10",
        sizeClass,
        className
      )}
      onError={() => setFailed(true)}
    />
  )
}
