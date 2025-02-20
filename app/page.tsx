"use client";

import { Spotlight } from "@/components/ui/spotlight";
import HeroImage from "@/components/home/hero-image";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/home/navbar";
import { redirect } from "next/navigation";
import Hero from "@/components/home/hero";

export default function Home() {
  const { data: session } = useSession();
  // if (session) {
  //   redirect("/mail/inbox");
  // }

  return (
    <div className="relative h-screen min-h-screen w-full overflow-y-auto scroll-smooth bg-grid-small-black/[0.039] dark:bg-grid-small-white/[0.025]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[900px] w-[900px] rounded-full bg-gradient-to-r from-white/5 via-white/5 to-white/5 blur-[200px]" />
      </div>
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60 [&_ellipse]:!fill-foreground" />
      <div className="relative z-10 mx-auto mb-4 flex max-w-7xl flex-col">
        <Navbar />
        <Hero />
        <HeroImage />
      </div>
    </div>
  );
}
