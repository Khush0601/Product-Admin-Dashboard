"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

// Root just redirects to the right place.
export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isLoggedIn() ? "/products" : "/login");
  }, [router]);

  return null;
}