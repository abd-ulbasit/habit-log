import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import { Button } from "~/components/ui/button";
export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="It's a habit builder/Tracker.It's inspired by the green github contribution graph." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#cab3eb] to-[#71afa7]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1>
            {hello.data ? `${hello.data.greeting}` : "Loading..."}
          </h1>
          <p>{status == "authenticated" ? "Welcome beloved User" : "You are gay"}</p>
          <Link href="/login">Go to Login</Link>
          <Button>Hll</Button>
        </div>
      </main>
    </>
  );
}

