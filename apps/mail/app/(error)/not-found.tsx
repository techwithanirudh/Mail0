import blackIcon from "@/public/black-icon.svg";
import whiteIcon from "@/public/white-icon.svg";
import Marquee from "./_components/marquee";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden px-4 md:px-0">
      <div className="absolute h-full w-full">
        <Marquee direction="diagonal" speed={0.5} squareSize={40} />
      </div>

      <div className="absolute left-4 top-0">
        <Link
          href="/"
          className={cn(
            "font-pixel text-4xl font-bold uppercase tracking-tighter transition-opacity hover:opacity-80 focus:underline focus:outline-none md:text-5xl lg:text-6xl",
          )}
        >
          {"<<<"} Home
        </Link>
      </div>
      <div className="tracking-tightest z-10 flex flex-col items-center justify-center text-center">
        <div className="relative flex select-none items-center justify-center gap-2 font-bold text-[#151517] dark:text-white">
          <h1 className="text-[35vw]">4</h1>
          <div className="size-fill flex items-center gap-2">
            <Image
              src={blackIcon}
              alt="0"
              sizes="25vw"
              className="h-auto w-[25vw] transition-transform duration-300 hover:rotate-90 dark:hidden drag-none"
              priority
            />
            <Image
              src={whiteIcon}
              alt="0"
              sizes="25vw"
              className="hidden h-auto w-[25vw] transition-transform duration-300 hover:rotate-90 dark:block drag-none"
              priority
            />
          </div>
          <h1 className="text-[35vw]">4</h1>
        </div>
      </div>
    </div>
  );
}
