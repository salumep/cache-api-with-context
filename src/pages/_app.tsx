import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ContextCacheProvider } from '@/context/cacheContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextCacheProvider>
      <Component {...pageProps} />
    </ContextCacheProvider>
  );
}
