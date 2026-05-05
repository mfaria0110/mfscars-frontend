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
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 2
      }
    }
  })

/* dark mode */
const dark =
  localStorage.getItem("dark") === "true"

if (dark) {
  document.documentElement.classList.add("dark")
}

const token =
  localStorage.getItem("token")

if (token) {
  iniciarIdleLogout()
}

/* ===========================
   🌐 CONTROLE DE DOMÍNIO
=========================== */
const host = window.location.hostname
const path = window.location.pathname

// 👉 se NÃO for app e estiver na raiz
if (!host.startsWith("app.") && path === "/") {
  window.location.replace("/home")
}

/* ===========================
   🚀 RENDER APP
=========================== */
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <QueryClientProvider client={queryClient}>
    <Router />
    <Toaster position="top-right" />
  </QueryClientProvider>
)