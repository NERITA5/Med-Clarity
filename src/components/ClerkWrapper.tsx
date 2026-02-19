"use client"; 
import { ClerkProvider } from "@clerk/nextjs"; 

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  // If we are on the server (build time), window is undefined.
  // We skip the Provider entirely to avoid the useContext/useState errors.
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
