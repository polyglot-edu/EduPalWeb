import type { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useLoading } from './GlobalLoading';

type AppWrapperProps = {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
};

export function AppWrapper({ Component, pageProps }: AppWrapperProps) {
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, setLoading]);

  return <Component {...pageProps} />;
}
