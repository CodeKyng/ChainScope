import { Link } from "react-router-dom"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#05080f]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600">
              <img src="/logo.png" alt="" className="size-4" />
            </span>
            <span className="text-sm font-semibold text-white">ChainScope</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            On-chain visibility for wallets, alerts, and NFT marketplace flows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="font-medium text-slate-300">Product</p>
            <ul className="mt-3 space-y-2 text-slate-500">
              <li>
                <a href="#features" className="hover:text-slate-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#networks" className="hover:text-slate-300">
                  Networks
                </a>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-slate-300">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-300">Account</p>
            <ul className="mt-3 space-y-2 text-slate-500">
              <li>
                <Link to="/login" className="hover:text-slate-300">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-slate-300">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-300">Build</p>
            <ul className="mt-3 space-y-2 text-slate-500">
              <li>
                <span className="text-slate-600">Firebase Auth</span>
              </li>
              <li>
                <span className="text-slate-600">thirdweb</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-slate-600 sm:px-6">
          <span>© {new Date().getFullYear()} ChainScope</span>
          <span>Built for clearer on-chain insight</span>
        </div>
      </div>
    </footer>
  )
}
