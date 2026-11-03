import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.18),_transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Open a wallet. Get the full picture.
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Create an account in under a minute — then connect a wallet when
            you are ready to trade or list.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-white px-6 text-slate-950 hover:bg-slate-100"
              )}
            >
              Create free account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 text-slate-300 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
