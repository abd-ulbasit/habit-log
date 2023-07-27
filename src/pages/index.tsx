import Head from "next/head";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactNode, useEffect } from "react";
import MainLayout from "~/components/mainLayout";
import CreateHabit from "~/components/CreateHabit";
import HabitList from "~/components/HabitList";
import LastYearProgress from "~/components/LastYearProgress";
import Draggable from "~/components/Draggable";
import { Button } from "~/components/ui/button";
import Pomodoro from "~/components/Pomodoro";
import TodoList from "~/components/TodoList";
// import { set } from "zod";
enum Elements {
  POMODORO = 'POMODORO',
  HABBIT_LIST = 'HABBIT LIST',
  CREATE_HABIT = 'CREATE HABIT',
  TODO_LIST = 'TODO LIST',
  YEAR_PROGRESS = "PROGRESS"
}
const NO_OF_DRAGGABLES = 6
const Home: NextPageWithLayout = () => {
  const [visibleElements, setVisibleElements] = useState<string[]>(Object.values(Elements));
  const [initialPositions, setInitialPositions] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    const n = Array(NO_OF_DRAGGABLES).fill({ x: 0, y: 0 });
    setInitialPositions(n);
    const storedVisibleElements = JSON.parse(localStorage.getItem('visibleElements') ?? '[]') as string[];
    if (storedVisibleElements) {
      setVisibleElements(storedVisibleElements);
    }
  }, [])
  const resetPositions = () => {
    // Update the positions of all items to their initial positions
    setInitialPositions(Array(NO_OF_DRAGGABLES).fill({ x: 0, y: 0 }));
  };
  const toggleElement = (element: string) => {
    setVisibleElements((prevVisibleElements) => {
      const updatedVisibleElements = prevVisibleElements.includes(element)
        ? prevVisibleElements.filter((el) => el !== element)
        : [...prevVisibleElements, element];
      localStorage.setItem('visibleElements', JSON.stringify(updatedVisibleElements));
      return updatedVisibleElements;
    });
  };
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="It's a habit builder/Tracker.It's inspired by the green github contribution graph." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#cab3eb] to-[#71afa7] dark:from-[#674f8a] dark:to-[#1e534c] select-none overflow-hidden ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 relative">
          <Draggable resetPositions={resetPositions} initialPosition={initialPositions[5] ?? { x: 0, y: 0 }} >
            <div className="flex flex-col gap-1 float-left">
              <Button onClick={resetPositions}>
                Reset All
              </Button>
              {
                Object.values(Elements).map((element) => (
                  <Button
                    key={element}
                    onClick={() => toggleElement(element)}

                    variant={visibleElements.includes(element) ? 'outline' : 'default'}
                  >
                    {element}
                  </Button>
                ))
              }
            </div>
          </Draggable>
          {
            visibleElements.includes(Elements.POMODORO) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[0] ?? { x: 0, y: 0 }}  >
              <Pomodoro ></Pomodoro>
            </Draggable>
          }
          {

            visibleElements.includes(Elements.HABBIT_LIST) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[1] ?? { x: 0, y: 0 }} >
              <HabitList />
            </Draggable>
          }
          {

            visibleElements.includes(Elements.TODO_LIST) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[3] ?? {
              x: 0, y: 0
            }} >
              <TodoList></TodoList>
            </Draggable>
          }
          {

            visibleElements.includes(Elements.CREATE_HABIT) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[2] ?? { x: 0, y: 0 }}>
              <CreateHabit />
            </Draggable>
          }
          {visibleElements.includes(Elements.YEAR_PROGRESS) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[4] ?? { x: 0, y: 0 }} >
              <LastYearProgress></LastYearProgress>
            </Draggable>
          }
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