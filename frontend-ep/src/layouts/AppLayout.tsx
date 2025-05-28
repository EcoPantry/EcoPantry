// src/layouts/AppLayout.tsx
// Sidebar and main area, only for main app pages (authenticated routes)

import Sidebar from "@/components/layout/Sidebar"
import { Outlet } from "@tanstack/react-router"
import { useEffect } from "react"

const AppLayout = () => {
  useEffect(() => {
    console.log("AppLayout mounted")
    console.log("API URL:", import.meta.env.VITE_API_URL)
    console.log("haha")
    fetch(`${import.meta.env.VITE_API_URL}/`, {
      method: "GET",
      credentials: "include", // Needed for cookies/auth headers
    }
    )

  }, [])
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
export default AppLayout