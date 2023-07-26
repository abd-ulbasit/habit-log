import { api } from "~/utils/api"
import { Checkbox } from "./ui/checkbox";
import { isDateToday } from "~/lib/utils"
import { useEffect } from "react";
import { Trash, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"

const HabitList = () => {
    const trpcCtx = api.useContext()
    const deleteHabit = api.habit.deleteHabit.useMutation({
        onSuccess: async () => {
            await trpcCtx.habit.getall.invalidate()
        }
    })
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
    if (habits.error) return <div>{habits.error.message}</div>
    const handleMarkComplete = (trackingId: string) => {
        // console.log(trackingId, );
        updatetracking.mutate({ id: trackingId })
    }
    const handleDeleteHabit = (id: string) => {
        deleteHabit.mutate({
            id
        })
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
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Trash2 />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your progress
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => { handleDeleteHabit(habit.id) }} disabled={deleteHabit.isLoading} >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </li>
                }) : null
            }
        </div>
    )
};
export default HabitList