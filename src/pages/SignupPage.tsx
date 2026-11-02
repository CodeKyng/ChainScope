import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#070b14] p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="ChainScope" className="size-12" />
          <span className="text-xl font-bold text-white">ChainScope</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
