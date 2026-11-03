import { SiteHeader } from "@/components/marketing/site-header"
import { HeroSection } from "@/components/marketing/hero-section"
import { FeatureBento } from "@/components/marketing/feature-bento"
import { StatsStrip } from "@/components/marketing/stats-strip"
import { CtaBanner } from "@/components/marketing/cta-banner"
import { SiteFooter } from "@/components/marketing/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-svh bg-[#05080f] text-slate-100 antialiased">
      <SiteHeader />
      <main>
        <HeroSection />
        <StatsStrip />
        <FeatureBento />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  )
}
