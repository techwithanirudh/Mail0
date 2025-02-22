import { Button } from "@/components/ui/button";
import Lanyard from "@/components/ui/lanyard";
import { Share2 } from "lucide-react";

const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      {/* Grid Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-2">
          {/* Left Column - Welcome Message */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Thank you for joining our waitlist!
              </h1>
              <p className="text-lg text-foreground">
                We're thrilled to have you on board. Your exclusive membership card is ready.
              </p>
            </div>

            <Button
              variant="outline"
              className="group transition-colors hover:bg-primary hover:text-white"
            >
              <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Share with friends
            </Button>

            <p className="text-sm text-muted-foreground">
              We'll keep you updated on your position and next steps.
            </p>
          </div>

          {/* Right Column - Placeholder for additional content */}

          <div className="relative min-h-[50vh] w-full">
            <Lanyard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
