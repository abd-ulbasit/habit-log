import { api } from "~/utils/api"
import { Checkbox } from "./ui/checkbox";
import { isDateToday } from "~/lib/utils"
import { useEffect, useState } from "react";
import { Trash, Trash2 } from "lucide-react";
import type { Habit, Tracking } from "@prisma/client"
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
import { useHabitStore } from "~/stores/habitstore";
interface HabitDataType extends Habit {
    Completed: Tracking[]
}
const HabitList = () => {
    const [habitData, setHabitData, updateTrackingLocallay, removeHabit] = useHabitStore(state => [state.habits, state.setHabits, state.updateTracking, state.removeHabit])
    // const [habitData, setHabitData] = useState<HabitDataType[]>([])
    const trpcCtx = api.useContext()
    const deleteHabit = api.habit.deleteHabit.useMutation({
        onSuccess: async () => {
            await trpcCtx.habit.getall.invalidate()
        }
    })
    // const habits = api.habit.getall.useQuery();
    // useEffect(() => {
    //     if (habits.data) {
    //         setHabitData(habits.data)
    //     }
    // }, [habits.data])
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
        habitData ? habitData.map((habit) => {
            const todayTracking = habit.Completed.find((t) => isDateToday(t.date))
            if (!todayTracking) {
                createTracking.mutate({ habitId: habit.id })
            }
        }) : null;
    }, [habitData])
    // if (habits.isLoading) return <div>Loading...</div>
    // if (habits.error) return <div>{habits.error.message}</div>
    const handleMarkComplete = (trackingId: string) => {
        // setHabitData((prev) => {
        //     return prev.map((habit) => {
        //         const todayTracking = habit.Completed.find((t) => isDateToday(t.date))
        //         if (todayTracking?.id === trackingId) {
        //             return {
        //                 ...habit,
        //                 Completed: habit.Completed.map((t) => {
        //                     if (t.id === trackingId) {
        //                         return {
        //                             ...t,
        //                             completed: !t.completed
        //                         }
        //                     }
        //                     return t
        //                 })
        //             }
        //         }
        //         return habit
        //     })
        // })
        updateTrackingLocallay(trackingId)

        // console.log(trackingId, );
        updatetracking.mutate({ id: trackingId })
    }
    const handleDeleteHabit = (id: string) => {
        // setHabitData((prev) => {
        //     return prev.filter((habit) => habit.id !== id)
        // })
        removeHabit(id)
        deleteHabit.mutate({
            id
        })
    }
    return (
        <div className="list-disc border rounded-lg p-4 flex gap-2 flex-col backdrop-blur-md">
            <p className="font-bold ">Things to follow</p>
            {
                habitData ? habitData.filter((habit) => habit.name !== "POMODORO").map((habit) => {
                    const todayTracking = habit.Completed.find((t) => isDateToday(t.date))
                    // console.log(todayTracking)
                    if (!todayTracking) {
                        return
                    }
                    return <li key={habit.id} className="flex items-center gap-2">
                        <Checkbox className="inline" onClick={() => handleMarkComplete(todayTracking.id)} checked={todayTracking.completed} disabled={updatetracking.status == "loading"} />
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
                        <p className="inline">{habit.name}</p>
                    </li>
                }) : null
            }
        </div>
    )
};
export default HabitList