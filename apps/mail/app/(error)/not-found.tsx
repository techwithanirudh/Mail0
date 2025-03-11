"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import blackIcon from "@/public/black-icon.svg";
import whiteIcon from "@/public/white-icon.svg";
import Marquee from "./_components/marquee";

export function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 md:px-0">
      <div className="absolute h-full w-full opacity-15">
        <Marquee direction="diagonal" speed={0.1} squareSize={40} />
      </div>

      <div className="z-10 flex flex-col items-center justify-center">
        {/* 
          Sizing ratios:
          - h1 text: 8.75vw (35/4)
          - Image width: 6.25vw (25/4)
          - Negative margin-bottom: 3.125vw ((25/4)/2) for vertical alignment
        */}
        <div className="relative -mb-[3.125vw] flex select-none items-center justify-center gap-2 font-bold text-[#151517] dark:text-white">
          <h1 className="text-[8.75vw]">4</h1>
          <div className="flex items-center">
            <Image
              src={blackIcon}
              alt="0"
              sizes="6.25vw"
              className="drag-none h-auto w-[6.25vw] transition-transform duration-300 hover:rotate-90 dark:hidden"
              priority
            />
            <Image
              src={whiteIcon}
              alt="0"
              sizes="6.25vw"
              className="drag-none hidden h-auto w-[6.25vw] transition-transform duration-300 hover:rotate-90 dark:block"
              priority
            />
          </div>
          <h1 className="text-[8.75vw]">4</h1>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-center text-sm sm:text-base md:text-lg">
            The page you are looking for does not exist.
          </p>
          <Button onClick={handleBack} variant="link" size="lg">
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
