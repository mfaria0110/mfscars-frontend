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

  /*
    fallback para reload
  */
  const token =
    accessToken ||
    sessionStorage.getItem(
      "accessToken"
    )

  // ✅ somente token
  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}