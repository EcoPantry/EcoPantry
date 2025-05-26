// src/layouts/AppLayout.tsx
// Wraps all routes for global providers (context, theme, toasts)

import { Outlet } from "@tanstack/react-router"
import { UserProvider } from "@/context/UserProvider"

const RootLayout = () => {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  )
}
export default RootLayout

