import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-teal-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold text-[#0FB9B1] tracking-tight">
          Med<span className="text-slate-700">Clarity</span>
        </Link>
      </div>

      <nav className="flex items-center gap-6">
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#0FB9B1]">
            Dashboard
          </Link>
          {/* This is the magic button that handles logout and profile */}
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10 border-2 border-[#0FB9B1]"
              }
            }}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#0FB9B1] rounded-lg hover:bg-[#098d87] transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
}