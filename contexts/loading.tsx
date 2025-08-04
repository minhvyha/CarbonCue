// src/contexts/loading-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingOverlay } from "@/components/loading-overlay";
import { set } from "mongoose";

type LoadingContextType = {
  loading: boolean;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  showOverlay: false,
  setShowOverlay: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

// Inner provider that uses navigation hooks
function LoadingProviderInner({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);



  useEffect(() => {
    setLoading(true);

    setShowOverlay(false);
    setIsNavigating(false);
    const tid = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(tid);
  }, [pathname, searchParams]);
  // Listen for navigation start events
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
          setShowOverlay(true);
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showOverlay, setShowOverlay }}>
      <LoadingOverlay isVisible={showOverlay || isNavigating} />
      {children}
    </LoadingContext.Provider>
  );
}

// Public provider wrapped in Suspense for CSR bailout
export function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
}
