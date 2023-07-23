import type { Metadata } from "next"
import * as React from "react"
import { Icons } from "~/components/ui/icons"
import { Button } from "~/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { cn } from "~/lib/utils"
export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <div className="flex  items-center justify-center h-screen" >
      <div className=" w-full md:w-3/12" >
        <UserAuthForm />
      </div>
    </div>
  )
}

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const loginWithGithub = () => {
    setIsLoading(true)
    signIn("github").then(() => {
      setIsLoading(false)
      // void router.push("/").then().catch()
    }).catch((err) => {
      console.log(err)
    })
  }
  const loginWithGoogle = () => {
    setIsLoading(true)
    signIn("google").then(() => {
      setIsLoading(false)
      void router.push("/").then().catch()
    }).catch((err) => {
      console.log(err)
    })
  }
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
      <Button variant="outline" type="button" disabled={isLoading} onClick={loginWithGithub}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
      <Button variant="outline" type="button" disabled={isLoading} onClick={loginWithGoogle}>
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