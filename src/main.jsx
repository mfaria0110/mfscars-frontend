import ReactDOM from "react-dom/client"
import Router from "./routes"
import "./index.css"
import "leaflet/dist/leaflet.css"

import { Toaster }
  from "react-hot-toast"

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"

import {
  iniciarIdleLogout
} from "./utils/idleLogout"

import {
  useAppStore
} from "./store/useAppStore"

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
   CONTROLE DOMÍNIO
=========================== */

const host =
  window.location.hostname

const path =
  window.location.pathname

if (

  !host.startsWith("app.")

  &&

  path === "/"

) {

  window.location.replace(
    "/home"
  )
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

    position="top-center"

    toastOptions={{

      duration: 4000,

      style: {

        background: "#fff",

        color: "#111827",

        borderRadius: "14px",

        padding: "14px 16px",

        fontSize: "14px"

      }

    }}
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