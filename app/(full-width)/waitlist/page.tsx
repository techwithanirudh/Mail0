"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lanyard from "@/components/ui/lanyard";
import { useRouter } from "next/navigation";
import React from "react";

const LAST_UPDATED = "February 19, 2025";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Back Button */}
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </div>
  );
}
