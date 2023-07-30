import { type FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRouter } from "next/router";
import { useHabitStore } from "~/stores/habitstore";

export default function CreateHabit() {
    const addHabitToState = useHabitStore(state => state.addHabit)
    const { status, data: SessionData } = useSession()
    const router = useRouter()
    const trpcContext = api.useContext()
    const addHabit = api.habit.create.useMutation({
        onSuccess: async () => {
            await trpcContext.habit.invalidate()
            if (inputref.current?.value) {
                inputref.current.value = "";
            }
        }
    });
    const inputref = useRef<HTMLInputElement>(null);
    // inputref.current?.focus();
    const handleCreateHabit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        if (!inputref.current?.value) {
            return;
        }
        addHabitToState({
            name: inputref.current?.value,
            userId: SessionData?.user?.id ?? "" as string,
            id: "",
            Completed: [{ id: "", date: new Date(), habitId: "", completed: false }]
        })
        addHabit.mutate({
            name: inputref.current?.value
        })
    }
    return (
        <form onSubmit={handleCreateHabit} className=" p-2 rounded-md flex flex-col gap-2 mx-auto w-4/5 sm:w-auto pb-4 pr-0 md:pr-4 backdrop-blur-md">
            <Label>Start A Habit</Label>
            <Input placeholder="Name it" ref={inputref} minLength={3} />
            {status === "authenticated" && <Button type="submit">Start Building</Button>}
            {status === "unauthenticated" &&
                <AlertDialog>
                    <AlertDialogTrigger className="bg-primary py-2 rounded-md text-primary-foreground">
                        Start Building
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Login To Start Tracking</AlertDialogTitle>
                            <AlertDialogDescription>
                                You need to login to start tracking your habits as it will be saved in your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { void router.push("/login") }}  >Go To Login Page</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
        </form>
    )
}