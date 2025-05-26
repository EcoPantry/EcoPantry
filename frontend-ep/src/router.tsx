import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router"
import RootLayout from "@/layouts/RootLayout"
import AppLayout from "@/layouts/AppLayout"
import { lazy } from "react"

const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Profile = lazy(() => import("@/pages/Profile"))
const SignIn = lazy(() => import("@/pages/SignIn"))
const SignUp = lazy(() => import("@/pages/SignUp"))

const rootRoute = createRootRoute({
  component: RootLayout,
})

// Only wrap main app pages in AppLayout!
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: Dashboard,
})

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/profile",
  component: Profile,
})

// SignIn/SignUp are direct children of RootLayout (NOT under AppLayout!)
const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignIn,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUp,
})

const router = createRouter({
  routeTree: rootRoute.addChildren([
    appLayoutRoute.addChildren([dashboardRoute, profileRoute]),
    signInRoute,
    signUpRoute,
  ]),
})

export default router
