// utils/withAuth.tsx
'use client';
import { useEffect } from "react";
import { useAuth } from "@/context/Auth.context";
import { useRouter } from "next/navigation";

export default function AuthGuard<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  return (props: P) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/auth/login"); // redirect to login
      }
    }, [user, router]);

    if (!user) return null; // or a loading spinner while redirecting

    return <WrappedComponent {...props} />;
  };
}
