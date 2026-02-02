"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function Home() {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/m/dashboard-home");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
