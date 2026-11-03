import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

const links = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#networks", label: "Networks" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05080f]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <img src="/logo.png" alt="" className="size-5 object-contain" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            ChainScope
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-slate-300 hover:bg-white/[0.06] hover:text-white"
            )}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-white text-slate-950 shadow-sm hover:bg-slate-100"
            )}
          >
            Get started
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/[0.06] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#05080f] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "outline" }), "border-white/10")}
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants(), "bg-white text-slate-950 hover:bg-slate-100")}
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
