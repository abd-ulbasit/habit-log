import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const LastYearProgress = () => {
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
                    return <Tooltip key={date.toISOString()} >
                        <TooltipTrigger className="w-3 h-3 rounded-sm bg-yellow-400"></TooltipTrigger>
                        <TooltipContent className="">{date.toLocaleDateString()}</TooltipContent>
                    </Tooltip>
                })
                }
            </div>
        </TooltipProvider >
    );

}

export default LastYearProgress;