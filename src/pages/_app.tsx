import type { AppProps } from "next/app";
import { EvoluProvider } from "@evolu/react";
import { evolu } from "@/states/evolu";
import { Suspense } from "react";

const LoadingScreen = () => <main>Loading...</main>;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EvoluProvider value={evolu}>
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <Component {...pageProps} />
        </Suspense>
      </main>
    </EvoluProvider>
  );
}
