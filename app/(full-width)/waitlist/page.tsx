"use client";
import { Button } from "@/components/ui/button";
import Lanyard from "@/components/ui/lanyard";
import { motion } from "motion/react";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [userId] = useState(`${Math.floor(Math.random() * 1000)}`);
  const [userName] = useState("New Member");

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Joined the Waitlist!",
          text: "I just joined the exclusive waitlist!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      {/* Grid Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-2">
          {/* Left Column - Welcome Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Thank you for joining our waitlist!
              </h1>
              <p className="text-lg text-foreground">
                We're thrilled to have you on board. Your exclusive membership card is ready.
              </p>
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              className="group transition-colors hover:bg-primary hover:text-white"
            >
              <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Share with friends
            </Button>

            <p className="text-sm text-muted-foreground">
              We'll keep you updated on your position and next steps.
            </p>
          </motion.div>

          {/* Right Column - Placeholder for additional content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            {/* Add more content here if needed */}
          </motion.div>
        </div>
      </div>

      {/* Absolutely Positioned Card Overlapping Both Columns */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center"
      >
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </motion.div>
    </div>
  );
};

export default Index;
