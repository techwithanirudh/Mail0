import Squares from "./square"
import Image from 'next/image';
import blackIcon from '@/public/black-icon.svg';
import whiteIcon from '@/public/white-icon.svg';


export function NotFound() {
  return (
    <div className="relative flex w-full items-center justify-center px-4 md:px-0 overflow-hidden ">
      <div className="absolute w-full h-full">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center md:flex-row md:text-left  z-10 tracking-tightest">
        <div className="flex font-bold items-center justify-center gap-2 relative select-none">
          <div className="text-[35vw]">
            4
          </div>
          <div className="flex items-center gap-2 size-fill pointer-events-none">
            <Image
              src={blackIcon}
              alt="0.email Logo"
              sizes="100vw"
              className="dark:hidden h-auto w-[25vw]"
            />
            <Image
              src={whiteIcon}
              alt="0.email Logo"
              sizes="100vw"
              className="hidden dark:block h-auto w-[25vw]"
            />
          </div>
          <div className="text-[35vw]">
            4
          </div>
        </div>
      </div>
      {/* <div className="absolute">
        <a>Home</a>
      </div> */}
    </div>

  );
}