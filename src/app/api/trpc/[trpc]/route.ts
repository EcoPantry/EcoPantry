import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root"; // Contains all backend procedures
import { createTRPCContext } from "~/server/api/trpc"; // Function to build context (e.g auth, headers, DB) per request

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 * This allows backend procedures to access context e.g req.headers, user session
 * Context is a special object that you create per request and pass into every procedure (endpoint). 
 * It gives each procedure access to shared resources or request-specific data.
 */

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
        : undefined,
  });

export { handler as GET, handler as POST }; // Use the same handler for both GET and POST requests
