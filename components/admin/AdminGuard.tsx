'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/Auth.context";
import { useRouter } from "next/navigation";
import SpinnerUltra from "../spinners/SpinnerUltra";

export default function AdminGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [role, setRole] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      // Only run on client
      setRole(localStorage.getItem("role"));
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!loading && mounted) {
        if (!user || !role || role === "user") {
          router.replace("/admin/auth/login");
        }
      }
    }, [loading, mounted, user, role, router]);

    // 🔥 Block rendering until auth is resolved
    if (loading || !mounted) return <SpinnerUltra fill="#E6A500" width={48} height={48} />;

    if (!user || !role || role === "user") return <SpinnerUltra fill="#E6A500" width={48} height={48} />;

    return <WrappedComponent {...props} />;
  };
}
