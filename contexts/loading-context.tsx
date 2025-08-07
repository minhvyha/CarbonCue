"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Suspense,
} from "react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { usePathname, useSearchParams } from "next/navigation";

type LoadingContextType = {
  show: () => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Ensure overlay only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.href.startsWith("#") && !link.target) {
        // Check if it's an internal link
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          show();
        }
      }
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      hide();
      hide();
    }, 300);
  }, [pathname, searchParams]);
  return (
      <LoadingContext.Provider value={{ show, hide }}>
        {children}
        {/* Only render overlay once mounted */}
        {mounted && <LoadingOverlay isVisible={isVisible} />}
      </LoadingContext.Provider>
  );
}
// Public provider wrapped in Suspense for CSR bailout
export function LoadingProviderOuter({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoadingProvider>{children}</LoadingProvider>
    </Suspense>
  );
}
export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return ctx;
}
