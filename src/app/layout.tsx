import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ClerkWrapper from "@/components/ClerkWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MedClarity | AI Lab Interpreter",
  description: "Understand your blood tests instantly with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F0F9F8] min-h-screen text-slate-900`}>
        {/* We ONLY wrap children in Clerk. If Header is breaking the build, move it inside the wrapper later */}
        <ClerkWrapper>
           <Header />
           <main>{children}</main>
        </ClerkWrapper>
      </body>
    </html>
  );
}