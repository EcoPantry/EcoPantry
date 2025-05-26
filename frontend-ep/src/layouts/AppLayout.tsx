// src/layouts/AppLayout.tsx
// Sidebar and main area, only for main app pages (authenticated routes)

import Sidebar from "@/components/layout/Sidebar"
import { Outlet } from "@tanstack/react-router"

const AppLayout = () => {
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