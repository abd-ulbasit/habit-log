import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="It's a habit builder/Tracker.It's inspired by the green github contribution graph." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#cab3eb] to-[#71afa7]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {hello.data ? `${hello.data.greeting}` : "Loading..."}
        </div>
      </main>
    </>
  );
}

