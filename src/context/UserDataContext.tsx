import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { isAdminEmail } from "@/lib/roles"
import type { NetworkId } from "@/lib/networks"

export type WatchItem = {
  id: string
  label: string
  address: string
  network: NetworkId
  notes: string
  createdAt?: number
}

export type AlertRule = {
  id: string
  title: string
  description: string
  enabled: boolean
  channel: "Email" | "In-app"
}

export type AppNotification = {
  id: string
  text: string
  time: number
  read: boolean
}

export type UserProfile = {
  uid: string
  email: string | null
  displayName: string
  photoURL?: string | null
  walletAddress?: string | null
  role: "user" | "admin"
  status: "Active" | "Suspended"
  plan: "Free" | "Pro" | "Team"
  createdAt?: number
  updatedAt?: number
}

const DEFAULT_RULES: AlertRule[] = [
  {
    id: "inbound",
    title: "Large inbound transfer",
    description: "Notify when any watched wallet receives > $10,000",
    enabled: true,
    channel: "Email",
  },
  {
    id: "outbound",
    title: "Large outbound transfer",
    description: "Notify when any watched wallet sends > $10,000",
    enabled: true,
    channel: "In-app",
  },
  {
    id: "nft",
    title: "New NFT mint",
    description: "Alert when a watched wallet mints or receives an NFT",
    enabled: false,
    channel: "In-app",
  },
  {
    id: "price",
    title: "Token price move",
    description: "Daily digest when ETH moves more than 5%",
    enabled: true,
    channel: "Email",
  },
]

function storageKey(uid: string | null, suffix: string) {
  return `chainscope.${uid ?? "anon"}.${suffix}`
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

type UserDataContextType = {
  profile: UserProfile | null
  watchlist: WatchItem[]
  alertRules: AlertRule[]
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  adminUsers: UserProfile[]
  adminUsersLoading: boolean
  addWatchItem: (item: Omit<WatchItem, "id" | "createdAt">) => Promise<void>
  removeWatchItem: (id: string) => Promise<void>
  toggleAlertRule: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  pushNotification: (text: string) => Promise<void>
  saveProfile: (data: Partial<Pick<UserProfile, "displayName" | "walletAddress">>) => Promise<void>
  setUserStatus: (uid: string, status: "Active" | "Suspended") => Promise<void>
  refreshAdminUsers: () => Promise<void>
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const uid = user?.uid ?? null

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [watchlist, setWatchlist] = useState<WatchItem[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_RULES)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUsers, setAdminUsers] = useState<UserProfile[]>([])
  const [adminUsersLoading, setAdminUsersLoading] = useState(false)

  // Local bootstrap + Firestore sync
  useEffect(() => {
    setWatchlist(loadJson(storageKey(uid, "watchlist"), []))
    setAlertRules(loadJson(storageKey(uid, "alertRules"), DEFAULT_RULES))
    setNotifications(loadJson(storageKey(uid, "notifications"), []))
    setLoading(false)

    if (!uid) {
      setProfile(null)
      return
    }

    const ref = doc(db, "users", uid)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile
          setProfile({ ...data, uid })
          if (Array.isArray(data.watchlist)) {
            setWatchlist(data.watchlist as WatchItem[])
            saveJson(storageKey(uid, "watchlist"), data.watchlist)
          }
          if (Array.isArray((data as { alertRules?: AlertRule[] }).alertRules)) {
            const rules = (data as { alertRules: AlertRule[] }).alertRules
            setAlertRules(rules)
            saveJson(storageKey(uid, "alertRules"), rules)
          }
          if (Array.isArray((data as { notifications?: AppNotification[] }).notifications)) {
            const n = (data as { notifications: AppNotification[] }).notifications
            setNotifications(n)
            saveJson(storageKey(uid, "notifications"), n)
          }
        } else {
          const role = isAdminEmail(user?.email) ? "admin" : "user"
          const created: UserProfile = {
            uid,
            email: user?.email ?? null,
            displayName: user?.displayName ?? user?.email?.split("@")[0] ?? "User",
            photoURL: user?.photoURL ?? null,
            role,
            status: "Active",
            plan: "Free",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          void setDoc(ref, {
            ...created,
            watchlist: [],
            alertRules: DEFAULT_RULES,
            notifications: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }).catch(() => {
            /* offline / rules */
          })
          setProfile(created)
        }
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [uid, user?.email, user?.displayName, user?.photoURL])

  const persistUserFields = useCallback(
    async (fields: Record<string, unknown>) => {
      if (!uid) return
      try {
        await updateDoc(doc(db, "users", uid), {
          ...fields,
          updatedAt: serverTimestamp(),
        })
      } catch {
        try {
          await setDoc(
            doc(db, "users", uid),
            { uid, ...fields, updatedAt: serverTimestamp() },
            { merge: true }
          )
        } catch {
          /* local only */
        }
      }
    },
    [uid]
  )

  const addWatchItem = useCallback(
    async (item: Omit<WatchItem, "id" | "createdAt">) => {
      const next: WatchItem = {
        ...item,
        id: `${Date.now()}`,
        createdAt: Date.now(),
      }
      const list = [next, ...watchlist]
      setWatchlist(list)
      saveJson(storageKey(uid, "watchlist"), list)
      await persistUserFields({ watchlist: list })
    },
    [watchlist, uid, persistUserFields]
  )

  const removeWatchItem = useCallback(
    async (id: string) => {
      const list = watchlist.filter((w) => w.id !== id)
      setWatchlist(list)
      saveJson(storageKey(uid, "watchlist"), list)
      await persistUserFields({ watchlist: list })
    },
    [watchlist, uid, persistUserFields]
  )

  const toggleAlertRule = useCallback(
    async (id: string) => {
      const rules = alertRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
      setAlertRules(rules)
      saveJson(storageKey(uid, "alertRules"), rules)
      await persistUserFields({ alertRules: rules })
    },
    [alertRules, uid, persistUserFields]
  )

  const markAllNotificationsRead = useCallback(async () => {
    const n = notifications.map((x) => ({ ...x, read: true }))
    setNotifications(n)
    saveJson(storageKey(uid, "notifications"), n)
    await persistUserFields({ notifications: n })
  }, [notifications, uid, persistUserFields])

  const pushNotification = useCallback(
    async (text: string) => {
      const n: AppNotification = {
        id: `${Date.now()}`,
        text,
        time: Date.now(),
        read: false,
      }
      const list = [n, ...notifications].slice(0, 50)
      setNotifications(list)
      saveJson(storageKey(uid, "notifications"), list)
      await persistUserFields({ notifications: list })
    },
    [notifications, uid, persistUserFields]
  )

  const saveProfile = useCallback(
    async (data: Partial<Pick<UserProfile, "displayName" | "walletAddress">>) => {
      if (profile) {
        setProfile({ ...profile, ...data, updatedAt: Date.now() })
      }
      await persistUserFields(data)
    },
    [profile, persistUserFields]
  )

  const refreshAdminUsers = useCallback(async () => {
    if (!isAdminEmail(user?.email)) return
    setAdminUsersLoading(true)
    try {
      const snap = await getDocs(collection(db, "users"))
      const rows: UserProfile[] = snap.docs.map((d) => {
        const data = d.data() as UserProfile
        return { ...data, uid: d.id }
      })
      setAdminUsers(rows)
    } catch {
      setAdminUsers(profile ? [profile] : [])
    } finally {
      setAdminUsersLoading(false)
    }
  }, [user?.email, profile])

  const setUserStatus = useCallback(
    async (targetUid: string, status: "Active" | "Suspended") => {
      try {
        await updateDoc(doc(db, "users", targetUid), {
          status,
          updatedAt: serverTimestamp(),
        })
        setAdminUsers((rows) =>
          rows.map((r) => (r.uid === targetUid ? { ...r, status } : r))
        )
      } catch {
        /* rules may block */
      }
    },
    []
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const value = useMemo(
    () => ({
      profile,
      watchlist,
      alertRules,
      notifications,
      unreadCount,
      loading,
      adminUsers,
      adminUsersLoading,
      addWatchItem,
      removeWatchItem,
      toggleAlertRule,
      markAllNotificationsRead,
      pushNotification,
      saveProfile,
      setUserStatus,
      refreshAdminUsers,
    }),
    [
      profile,
      watchlist,
      alertRules,
      notifications,
      unreadCount,
      loading,
      adminUsers,
      adminUsersLoading,
      addWatchItem,
      removeWatchItem,
      toggleAlertRule,
      markAllNotificationsRead,
      pushNotification,
      saveProfile,
      setUserStatus,
      refreshAdminUsers,
    ]
  )

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  )
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider")
  return ctx
}
