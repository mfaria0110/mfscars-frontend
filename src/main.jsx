import ReactDOM from "react-dom/client"
import Router from "./routes"
import "./index.css"
import "leaflet/dist/leaflet.css"

import { Toaster } from "react-hot-toast"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"

import { iniciarIdleLogout } from "./utils/idleLogout"

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus:
          false,

        retry: false,

        staleTime:
          1000 * 60 * 2
      }
    }
  })

/* dark mode */
const dark =
  localStorage.getItem(
    "dark"
  ) === "true"

if (dark) {
  document.documentElement.classList.add(
    "dark"
  )
}

const token =
  localStorage.getItem("token")

if (token) {
  iniciarIdleLogout()
}

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <QueryClientProvider
    client={queryClient}
  >
    <Router />

    <Toaster
      position="top-right"
    />
  </QueryClientProvider>
)