import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="mx-auto mt-8 w-full max-w-5xl overflow-y-hidden px-4">
      <div className="relative items-center justify-center rounded-xl border border-muted bg-sidebar/50 p-1 shadow-xl shadow-background backdrop-blur-lg md:flex md:animate-move-up md:p-5">
        <Image
          src="/homepage-image.png"
          alt="hero"
          width={800}
          height={600}
          className="h-full w-full rounded-xl shadow-xl shadow-foreground invert dark:shadow-background dark:invert-0 md:rounded-lg"
        />
      </div>
    </div>
  );
};

export default HeroImage;
