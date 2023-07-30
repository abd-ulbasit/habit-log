import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { Habit as HABIT, Tracking } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { api } from "~/utils/api";
import { areDatesSame } from "~/lib/utils";
import { useHabitStore } from "~/stores/habitstore";
function getColor(count: number, highestCount: number, _color: string): string {
    const x = count / highestCount;
    if (x == 0) {
        return `border bg-white`
    }
    else if (x <= .2) {
        return `bg-green-300`
    } else if (x <= .4) {
        return `bg-green-400`
    } else if (x <= .6) {
        return `bg-green-500`
    } else if (x <= 0.8) {
        return `bg-green-600`
    } else {
        return `bg-green-700`
    }
}
// interface Tracking extends Completed { }
interface habit extends HABIT {
    Completed: Tracking[]
}
const LastYearProgress = () => {
    const [habits, setHabits] = useState<habit[]>([])
    const [habitNames, setHabitNames] = useState<string[]>();
    const scrollableref = useRef<HTMLDivElement>(null)
    // const gethabit = api.habit.getall.useQuery();
    const HabitsFromStore = useHabitStore(store => store.habits)
    // if (gethabit.isFetching) {
    // <div>Loading</div>
    // }
    useEffect(() => {
        setHabits(HabitsFromStore)
    }, [HabitsFromStore])
    useEffect(() => {
        setHabits(HabitsFromStore ? HabitsFromStore.filter((habit) => habitNames?.includes(habit.name)) as habit[] : [])
    }, [habitNames])
    const allTracking = habits?.flatMap((habit) => habit.Completed)
    const completedCountByDay = new Map<string, number>();

    // Use forEach() to count the completed items for each day
    if (allTracking) {

        allTracking.forEach((tracking) => {
            const { date, completed } = tracking;
            if (completed) {
                const completedCount = completedCountByDay.get(date.toDateString()) ?? 0;
                completedCountByDay.set(date.toDateString(), completedCount + 1);
            }
        });
    }

    const highestCount = Math.max(...completedCountByDay.values())

    const [dates, setDates] = useState<Date[]>([])
    useEffect(() => {
        const today = new Date();
        const pastYearDates = [];

        // Loop through each day of the past year
        for (let i = 365; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            pastYearDates.push(date);
        }

        setDates(pastYearDates);

    }, [])
    useEffect(() => {
        if (scrollableref.current) {
            const scrollableElement = scrollableref.current;
            scrollableElement.scrollLeft = scrollableElement.scrollHeight + 30
        }
    }, [scrollableref.current])
    return (
        <div className=" w-4/5 mx-auto lg:w-auto " >

            <TooltipProvider  >
                < div className="rounded-md grid grid-rows-7 grid-flow-col gap-1 p-2 pb-4  backdrop-blur" ref={scrollableref}>
                    {dates.map((date) => {
                        const dayTraking = allTracking?.filter((t) => areDatesSame(date, t.date));
                        const count = dayTraking?.filter(t => t.completed == true).length ?? 0
                        return <Tooltip key={date.toISOString()} >
                            <TooltipTrigger className={`w-3 h-3 rounded-sm  ${getColor(count, highestCount, `green`)} `}></TooltipTrigger>
                            <TooltipContent  >{`${date.toDateString()} - ${count} points`}</TooltipContent>
                        </Tooltip>
                    })
                    }
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Filter</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Show Graph of:</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {HabitsFromStore.map((habit) => {
                            return (

                                <DropdownMenuCheckboxItem
                                    checked={habitNames?.includes(habit.name)}
                                    onCheckedChange={() => {
                                        console.log("flipped");
                                        if (habitNames?.includes(habit.name)) {
                                            setHabitNames((prev) => { return prev?.filter((x) => { return x != habit.name }) })
                                        }
                                        else {
                                            setHabitNames((prev) => { return [...(prev ? prev : []), habit.name] as string[] })
                                        }
                                    }}
                                    key={habit.id}
                                >{habit.name}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </TooltipProvider >
        </div>
    );

}

export default LastYearProgress;
