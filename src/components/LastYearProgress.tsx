import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { api } from "~/utils/api";
import { areDatesSame } from "~/lib/utils";

const LastYearProgress = () => {
    const gethabit = api.habit.getall.useQuery();
    if (gethabit.isFetching) {
        <div>Loading</div>
    }
    const allTracking = gethabit.data?.flatMap((habit) => habit.Completed)
    console.log({ allTracking });

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
    return (
        <TooltipProvider >
            < div className="grid grid-rows-7 grid-flow-col gap-1">

                {dates.map((date) => {
                    const dayTraking = allTracking?.filter((t) => areDatesSame(date, t.date));
                    const count = dayTraking?.length
                    return <Tooltip key={date.toISOString()} >
                        <TooltipTrigger className={`w-3 h-3 rounded-sm bg-green-200`}></TooltipTrigger>
                        <TooltipContent className="">{`${date.toDateString()} - ${count} commits`}</TooltipContent>
                    </Tooltip>
                })
                }
            </div>
        </TooltipProvider >
    );

}

export default LastYearProgress;