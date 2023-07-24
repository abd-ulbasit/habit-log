import React from "react"


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <nav className="border border-red-400 bg-purple-400">
                This is navbar
            </nav>
            {children}
        </>
    )
}