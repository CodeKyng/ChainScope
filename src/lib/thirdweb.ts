import { createThirdwebClient } from "thirdweb"
import { createWallet, inAppWallet } from "thirdweb/wallets"

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID ?? "d38cf60616775215991525e26e22c608",
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
