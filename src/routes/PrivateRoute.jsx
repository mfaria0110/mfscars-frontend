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

  const usuario =
    useAppStore(
      (state) =>
        state.usuario
    )

  /*
    fallback para reload da aba
  */
  const token =
    accessToken ||
    sessionStorage.getItem(
      "accessToken"
    )

  if (!token || !usuario) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}