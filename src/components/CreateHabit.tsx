import { type FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

export default function CreateHabit() {
    const { status } = useSession()
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
        if (status === "unauthenticated") {
            alert("You need to login first")
            return;
        }
        addHabit.mutate({
            name: inputref.current?.value
        })
    }
    return (
        <form onSubmit={handleCreateHabit} className=" p-2 rounded-md flex flex-col gap-2 mx-auto w-4/5 sm:w-auto pb-4 pr-0 md:pr-4 backdrop-blur-md">
            <Label>Start A Habit</Label>
            <Input placeholder="Name it" ref={inputref} minLength={3} />
            <Button type="submit">Start Building</Button>
        </form>
    )
}