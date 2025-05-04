"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/firebase/firebaseFunctions";

const AuthCheck = ({ children }) => {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return null;

  if (!user) {
    return null; // Don't render children, but also don't navigate here
  }

  return <>{children}</>;
};

export default AuthCheck;
