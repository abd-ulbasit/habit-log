import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ModeToggle } from "~/components/ui/modeToggler";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Head from "next/head";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactNode, useEffect } from "react";
import CreateHabit from "~/components/CreateHabit";
import HabitList from "~/components/HabitList";
import LastYearProgress from "~/components/LastYearProgress";
import Draggable from "~/components/Draggable";
import { Button } from "~/components/ui/button";
import Pomodoro from "~/components/Pomodoro";
import TodoList from "~/components/TodoList";
import { MenuIcon } from "lucide-react";
enum Elements {
  POMODORO = 'POMODORO',
  HABBIT_LIST = 'HABBIT LIST',
  CREATE_HABIT = 'CREATE HABIT',
  TODO_LIST = 'TODO LIST',
  YEAR_PROGRESS = "PROGRESS"
}
interface backGroundImage {
  name: string,
  url: string
}
const NO_OF_DRAGGABLES = 6
const allBackgrounds: backGroundImage[] = [{
  name: "Arabian Night",
  url: "/images/arabian_night.jpg"
},
{
  name: "Lofi Boy",
  url: "/images/lofi_boy.jpg"
}
  , {
  name: "Lofi Girl",
  url: "/images/lofi_girl.jpg"
},
{
  name: "Lofi Cat",
  url: "/images/lofi_cat.jpg"
}
  , {
  name: "Lofi Night",
  url: "/images/lofi_night.jpg"
}
]
const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const { status, data } = useSession();
  const handleLogin = () => {
    if (status == "authenticated") {
      void signOut().then().catch()
    } else {
      void router.push("/login").then().catch()
    }
  }
  const [bg, setBg] = useState<backGroundImage>(allBackgrounds[0]!)
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
      <main style={{ backgroundImage: `url(${bg.url})` }} className="bg-cover bg-center min-h-screen w-full  bg-gradient-to-b relative from-[#cab3eb] to-[#71afa7] dark:from-[#674f8a] dark:to-[#1e534c] select-none overflow-x-hidden overflow-y-scroll ">
        <nav className="flex p-2 items-center justify-between fixed  w-full backdrop-blur-none bg-opacity-95 z-30 mb-8">
          <p>{status == "authenticated" ? `Welcome ${data?.user.name}` : "You are gay"}</p>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger className="block lg:hidden"><MenuIcon></MenuIcon></SheetTrigger>
              <SheetContent className="pt-12">
                <SheetHeader>
                  <SheetDescription className="flex flex-col gap-2">

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
                    <Select onValueChange={(e) => { setBg(allBackgrounds.find((bg) => bg.name == e)!) }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wallpaper" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup >
                          <SelectLabel>WallPapers</SelectLabel>
                          {allBackgrounds.map((bg) => {

                            return <SelectItem value={bg.name} key={bg.url}>{bg.name}</SelectItem>
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select >

                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <ModeToggle></ModeToggle>
            <Button onClick={handleLogin} >{status == "authenticated" ? "LogOut" : "Go to Login Page"}</Button>
          </div>
        </nav>
        <div className="fixed top-16 left-2 flex flex-col gap-4 z-10 lg:block hidden" >
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
          <Select onValueChange={(e) => { setBg(allBackgrounds.find((bg) => bg.name == e)!) }}>
            <SelectTrigger className="w-[146px]">
              <SelectValue placeholder="Wallpaper" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup >
                <SelectLabel>WallPapers</SelectLabel>
                {allBackgrounds.map((bg) => {

                  return <SelectItem value={bg.name} key={bg.url}>{bg.name}</SelectItem>
                })}
              </SelectGroup>
            </SelectContent>
          </Select >
        </div>
        {/* <Image width={2500} height={1800} src={"/images/arabian_night.jpg"} alt="arabian_night"  ></Image> */}
        <div className="grid md:fixed md:right-20 md:top-20 grid-cols-1 sm:grid-cols-2 gap-6 relative pt-16 md:pt-0" >
          {
            visibleElements.includes(Elements.POMODORO) &&
            <div className="self-center  mx-auto w-4/5 sm:w-auto " >
              <Draggable resetPositions={resetPositions} initialPosition={initialPositions[0] ?? { x: 0, y: 0 }}  >
                <Pomodoro ></Pomodoro>
              </Draggable>
            </div>
          }
          {

            visibleElements.includes(Elements.TODO_LIST) &&
            <div className=" mx-auto w-4/5 sm:w-auto " >
              <Draggable resetPositions={resetPositions} initialPosition={initialPositions[3] ?? {
                x: 0, y: 0
              }} >
                <TodoList></TodoList>
              </Draggable>
            </div>
          }
          {

            visibleElements.includes(Elements.HABBIT_LIST) &&
            <div className="md:ml-auto  float-right pr-4  mx-auto w-4/5 sm:w-auto ">

              <Draggable resetPositions={resetPositions} initialPosition={initialPositions[1] ?? { x: 0, y: 0 }} >
                <HabitList />
              </Draggable>
            </div>
          }
          {

            visibleElements.includes(Elements.CREATE_HABIT) &&
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[2] ?? { x: 0, y: 0 }}>
              <CreateHabit />
            </Draggable>
          }
        </div>
        {visibleElements.includes(Elements.YEAR_PROGRESS) &&
          <div className="sm:fixed sm:bottom-2 sm:left-2  relative " >
            <Draggable resetPositions={resetPositions} initialPosition={initialPositions[4] ?? { x: 0, y: 0 }} >
              <LastYearProgress></LastYearProgress>
            </Draggable>
          </div>
        }
      </main >
    </>
  );
}
export default Home;

