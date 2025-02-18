"use client";

import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { SettingsNavigation } from "./settings-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SettingsLayoutSkeleton />}>
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </Suspense>
  );
}

function SettingsLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("from") || "/mail";
  const mailPath = returnPath.startsWith("/mail/settings") ? "/mail" : returnPath;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden overflow-y-auto border bg-card shadow-sm md:flex md:rounded-2xl md:shadow-sm">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-1.5 p-2">
        <SidebarToggle className="h-fit px-2" />
        <h1 className="flex-1 text-center text-sm font-medium capitalize">Settings</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(mailPath)}
            className="gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full flex-1 pb-0 md:px-2 md:pb-0 lg:px-4 lg:pb-0">
        <div className="flex flex-col gap-8 pt-4 md:flex-row">
          <div className="md:sticky md:top-[15px] md:h-fit">
            <SettingsNavigation />
          </div>

          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-360px)] pb-4 md:h-[calc(100vh-320px)]">
              {children}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsLayoutSkeleton() {
  return (
    <div className="flex h-full w-full flex-col border bg-card shadow-sm md:flex md:rounded-2xl md:shadow-sm">
      <div className="mx-auto w-full max-w-[1600px] flex-1 p-4 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0">
        <div className="animate-pulse">
          <div className="h-8 w-24 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
