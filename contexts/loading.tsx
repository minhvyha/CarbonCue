// src/contexts/loading-context.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type LoadingContextType = { loading: boolean };

const LoadingContext = createContext<LoadingContextType>({ loading: false });

export function useLoading() {
  return useContext(LoadingContext);
}

// Inner provider that uses navigation hooks
function LoadingProviderInner({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const tid = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(tid);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ loading }}>
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
