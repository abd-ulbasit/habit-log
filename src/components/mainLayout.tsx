import { signOut, useSession } from "next-auth/react"
import React from "react"
import { ModeToggle } from "./ui/modeToggler";
import { Button } from "./ui/button";
import { useRouter } from "next/router";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { status, data } = useSession();
    const handleLogin = () => {
        if (status == "authenticated") {
            void signOut().then().catch()
        } else {
            void router.push("/login").then().catch()
        }
    }
    return (
        <>
            <nav className="flex p-2 items-center justify-between">
                <p>{status == "authenticated" ? `Welcome ${data?.user.name}` : "You are gay"}</p>
                <div className="flex gap-2">
                    <ModeToggle></ModeToggle>
                    <Button onClick={handleLogin} >{status == "authenticated" ? "LogOut" : "Go to Login Page"}</Button>
                </div>
            </nav>
            {children}
        </>
    )
}