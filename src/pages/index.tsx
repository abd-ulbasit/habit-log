import Head from "next/head";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactNode } from "react";
import MainLayout from "~/components/mainLayout";
import CreateHabit from "~/components/CreateHabit";
import HabitList from "~/components/HabitList";
import LastYearProgress from "~/components/LastYearProgress";
import Draggable from "~/components/Draggable";
import { Button } from "~/components/ui/button";
const Home: NextPageWithLayout = () => {
  const [initialPositions, setInitialPositions] = useState<{ x: number, y: number }[]>([]);

  const saveInitialPosition = (index: number, x: number, y: number) => {
    if (initialPositions[index] === undefined) {
      const newInitialPositions = [...initialPositions];
      newInitialPositions[index] = { x, y };
      setInitialPositions(newInitialPositions);
    }
  };

  const resetPositions = () => {
    // Update the positions of all items to their initial positions
    setInitialPositions([]);
  };
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="It's a habit builder/Tracker.It's inspired by the green github contribution graph." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#cab3eb] to-[#71afa7] dark:from-[#674f8a] dark:to-[#1e534c] select-none">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 relative">
          <h1>
            {hello.data ? `${hello.data.greeting}` : "Loading..."}
          </h1>
          <Button onClick={resetPositions} disabled={initialPositions.length === 0}>
            Reset All
          </Button>
          <Draggable resetPositions={resetPositions} initialPosition={initialPositions[0] ?? { x: 0, y: 0 }} >
            <div className="p-4" onMouseDown={(e) => saveInitialPosition(0, e.clientX, e.clientY)}>
              <CreateHabit />
            </div>
          </Draggable>
          <Draggable resetPositions={resetPositions} initialPosition={initialPositions[1] ?? { x: 0, y: 0 }} >
            <div className="p-4" onMouseDown={(e) => saveInitialPosition(1, e.clientX, e.clientY)}>
              <HabitList />
            </div>
          </Draggable>
          <LastYearProgress></LastYearProgress>
        </div >
      </main >
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