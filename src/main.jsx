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

    <QueryClientProvider client={queryClient}>

      <Router />

      <Toaster position="top-right" />

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