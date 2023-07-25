import { api } from "~/utils/api"
import { Checkbox } from "./ui/checkbox";
import { isDateToday } from "~/lib/utils"
import { useEffect } from "react";

const HabitList = () => {
    const trpcCtx = api.useContext()
    const habits = api.habit.getall.useQuery();
    const createTracking = api.habit.createTrcking.useMutation({
        onSuccess: async () => {
            await trpcCtx.habit.getall.invalidate()
        }
    })
    const updatetracking = api.habit.UpdateTracking.useMutation({
        onSuccess: async () => {
            await trpcCtx.habit.getall.invalidate()
        }
    })
    useEffect(() => {
        habits.data ? habits.data.map((habit) => {
            const todayTracking = habit.Completed.find((t) => isDateToday(t.date))
            if (!todayTracking) {
                console.log("creating traking ");

                createTracking.mutate({ habitId: habit.id })
            }
        }) : null;
    }, [habits.data])
    if (habits.isLoading) return <div>Loading...</div>
    const handleMarkComplete = (trackingId: string) => {
        // console.log(trackingId, );
        updatetracking.mutate({ id: trackingId })
    }
    return (
        <div className="list-disc ">
            {
                habits.data ? habits.data.map((habit) => {
                    const todayTracking = habit.Completed.find((t) => isDateToday(t.date))
                    if (!todayTracking) {
                        return
                    }
                    console.log({ todayTracking });

                    return <li key={habit.id} className="flex items-center gap-2">
                        <Checkbox className="inline" onClick={() => handleMarkComplete(todayTracking.id)} checked={todayTracking.completed} disabled={updatetracking.status == "loading"} />
                        <p className="inline">{habit.name}</p>
                    </li>
                }) : null
            }
        </div>
    )
};
export default HabitList