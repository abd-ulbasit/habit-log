import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"
import { UserAuthForm } from "~/components/ui/user-auth-form"
// import { UserAuthForm } from "@/app/examples/authentication/components/user-auth-form"

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