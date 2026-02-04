// utils/AuthGuard.tsx
'use client';
import { useEffect } from "react";
import { useAuth } from "@/context/Auth.context";
import { useRouter } from "next/navigation";

export default function AuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [loading, user, router]);

    // 🔥 Block rendering until auth is resolved
    if (loading) return null; // or <Spinner />

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };
}
