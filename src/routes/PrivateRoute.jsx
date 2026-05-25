import {
  Navigate,
  Outlet
} from "react-router-dom"

import {
  useAppStore
} from "../store/useAppStore"


export default function PrivateRoute() {

  const accessToken =
    useAppStore(
      (state) =>
        state.accessToken
    )

  const token =
    accessToken ||

    sessionStorage.getItem(
      "accessToken"
    )

  const usuario =
    JSON.parse(

      sessionStorage.getItem(
        "usuario"
      ) || "{}"

    )

  /* =========================
     SEM LOGIN
  ========================= */

  if (!token) {

    return (

      <Navigate
        to="/login"
        replace
      />

    )
  }

  /* =========================
     MASTER
  ========================= */

  const isMaster =

    usuario?.master === true ||

    usuario?.master === "true" ||

    usuario?.master === 1 ||

    usuario?.master === "1"

  /* =========================
     MASTER IGNORA TUDO
  ========================= */

  if (isMaster) {

    return <Outlet />
  }

  /* =========================
     PLANO
  ========================= */

return <Outlet />
}

/* =========================
   VALIDADOR PLANO
========================= */

