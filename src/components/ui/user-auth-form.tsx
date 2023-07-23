/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import * as React from "react"

import { cn } from "~/lib/utils"
import { Icons } from "./icons"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading} onClick={async () => { setIsLoading(true); await signIn("github"); setIsLoading(false); void router.replace("/").then().catch() }}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                Github
            </Button>
            <Button variant="outline" type="button" disabled={isLoading} onClick={async () => { setIsLoading(true); await signIn("google"); setIsLoading(false); void router.replace("/").then().catch() }}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
        </div>
    )
}