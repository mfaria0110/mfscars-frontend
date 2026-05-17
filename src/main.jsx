import ReactDOM from "react-dom/client"
import Router from "./routes"
import "./index.css"
import "leaflet/dist/leaflet.css"

import { Toaster } from "react-hot-toast"

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"

import { iniciarIdleLogout }
  from "./utils/idleLogout"

import { useAppStore }
  from "./store/useAppStore"

import ModalAceiteTermos
  from "./components/ModalAceiteTermos"

const queryClient =
  new QueryClient({

    defaultOptions: {

      queries: {

        refetchOnWindowFocus: false,

        retry: false,

        staleTime:
          1000 * 60 * 2

      }
    }
  })

/* ===========================
   DARK MODE
=========================== */

const dark =
  localStorage.getItem("dark") === "true"

if (dark) {

  document.documentElement
    .classList.add("dark")
}

/* ===========================
   IDLE LOGOUT
=========================== */

const token =
  localStorage.getItem("token")

if (token) {

  iniciarIdleLogout()
}

/* ===========================
   ROOT
=========================== */

function Root() {

  const modalAceite =
    useAppStore(
      s => s.modalAceite
    )

  const pendentesAceite =
    useAppStore(
      s => s.pendentesAceite
    )

  const fecharAceite =
    useAppStore(
      s => s.fecharAceite
    )

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <Router />

      <Toaster
        position="top-right"
      />

      <ModalAceiteTermos

        aberto={modalAceite}

        pendentes={
          pendentesAceite
        }

        onAceitou={() => {

          fecharAceite()
        }}
      />

    </QueryClientProvider>
  )
}

/* ===========================
   RENDER APP
=========================== */

ReactDOM.createRoot(

  document.getElementById(
    "root"
  )

).render(

  <Root />

)