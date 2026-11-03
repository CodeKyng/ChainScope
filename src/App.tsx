import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { NetworkProvider } from "@/context/NetworkContext"
import { UserDataProvider } from "@/context/UserDataContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminRoute } from "@/components/AdminRoute"
import { AppLayout } from "@/components/AppLayout"
import HomePage from "@/pages/HomePage"
import LandingPage from "@/pages/LandingPage"
import WalletPage from "@/pages/WalletPage"
import ExplorePage from "@/pages/ExplorePage"
import WatchlistPage from "@/pages/WatchlistPage"
import AlertsPage from "@/pages/AlertsPage"
import SettingsPage from "@/pages/SettingsPage"
import MarketplacePage from "@/pages/MarketplacePage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import AdminUsersPage from "@/pages/admin/AdminUsersPage"
import AdminNetworksPage from "@/pages/admin/AdminNetworksPage"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NetworkProvider>
          <UserDataProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<LandingPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/networks" element={<AdminNetworksPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UserDataProvider>
        </NetworkProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
