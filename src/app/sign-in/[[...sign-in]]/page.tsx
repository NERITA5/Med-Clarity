import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E8F6F5]">
      <SignIn appearance={{
        elements: {
          formButtonPrimary: 'bg-[#0FB9B1] hover:bg-[#098d87] text-sm',
        }
      }} />
    </div>
  );
}