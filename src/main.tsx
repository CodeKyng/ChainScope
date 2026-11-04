import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { AutoConnect, ThirdwebProvider } from "thirdweb/react"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { client, wallets } from "@/lib/thirdweb"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThirdwebProvider>
      <AutoConnect client={client} wallets={wallets} timeout={15000} />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ThirdwebProvider>
  </StrictMode>
)
