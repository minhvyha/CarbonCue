// src/contexts/loading-context.tsx
'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type LoadingContextType = { loading: boolean };

const LoadingContext = createContext<LoadingContextType>({ loading: false });

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // turn on
    setLoading(true);

    // simulate “done” after 300ms (or whatever)
    const tid = window.setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => {
      window.clearTimeout(tid);
    };
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
}
