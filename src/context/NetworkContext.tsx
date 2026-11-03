import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { NETWORKS, getNetwork, type NetworkId } from "@/lib/networks"

const STORAGE_KEY = "chainscope.network"

type NetworkContextType = {
  networkId: NetworkId
  setNetworkId: (id: NetworkId) => void
  network: ReturnType<typeof getNetwork>
  networks: typeof NETWORKS
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

function readStored(): NetworkId {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && NETWORKS.some((n) => n.id === v)) return v as NetworkId
  } catch {
    /* ignore */
  }
  return "ethereum"
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkId, setNetworkIdState] = useState<NetworkId>(readStored)

  const setNetworkId = useCallback((id: NetworkId) => {
    setNetworkIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (NETWORKS.some((n) => n.id === e.newValue)) {
          setNetworkIdState(e.newValue as NetworkId)
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const value = useMemo(
    () => ({
      networkId,
      setNetworkId,
      network: getNetwork(networkId),
      networks: NETWORKS,
    }),
    [networkId, setNetworkId]
  )

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

export function useNetwork() {
  const ctx = useContext(NetworkContext)
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider")
  return ctx
}
