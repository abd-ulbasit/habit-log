import Head from "next/head";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "./_app";
import type { ReactNode } from "react";
import MainLayout from "~/components/mainLayout";
const Home: NextPageWithLayout = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="It's a habit builder/Tracker.It's inspired by the green github contribution graph." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#cab3eb] to-[#71afa7] dark:from-[#674f8a] dark:to-[#1e534c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1>
            {hello.data ? `${hello.data.greeting}` : "Loading..."}
          </h1>
        </div>
      </main>
    </>
  );
}
Home.getLayout = function getLayout(page: ReactNode): ReactNode {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}
export default Home;