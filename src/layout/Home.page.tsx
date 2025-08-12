import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Toaster } from "@/components/ui/sonner"

export default function HomePage({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderSection />
        <body>
        <main className="flex-grow">{children}</main>
        <Toaster />
        </body>
        <FooterSection />

      </div>
    );
  }