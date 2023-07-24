import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout,
  session: Session | null,
}
const MyApp: AppType<AppPropsWithLayout> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout: (page: ReactElement) => ReactNode = (Component as NextPageWithLayout).getLayout ?? ((page) => page);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
