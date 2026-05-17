import ReactDOM from "react-dom/client"

import "./index.css"

import "leaflet/dist/leaflet.css"

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"

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

function Root() {

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <div style={{

        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontSize: 40,

        fontWeight: 700

      }}>

        TESTE OK

      </div>

    </QueryClientProvider>
  )
}

ReactDOM.createRoot(

  document.getElementById(
    "root"
  )

).render(

  <Root />

)