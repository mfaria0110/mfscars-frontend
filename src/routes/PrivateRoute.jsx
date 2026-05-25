import {
  Navigate,
  Outlet
} from "react-router-dom"

import {
  useAppStore
} from "../store/useAppStore"

import {
  usePlano
} from "../modules/plano/usePlano"

import PlanoBloqueioModal
  from "../components/PlanoBloqueioModal"

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

  return <PlanoValidator />
}

/* =========================
   VALIDADOR PLANO
========================= */

function PlanoValidator() {

  const {
    planoAtual,
    loading
  } = usePlano()

  if (loading) {

    return null
  }

  if (semPlano) {

    return (

      <PlanoBloqueioModal

        aberto={true}

        mensagem={
          "Sua empresa ainda não possui um plano ativo."
        }

        onClose={() => {}}

      />

    )
  }

  const status =
    planoAtual?.status
      ?.toLowerCase?.()

  if (

    planoAtual?.nome
      ?.toLowerCase?.() ===
      "free"

  ) {

    return <Outlet />
  }

  if (
    status === "ativo"
  ) {

    return <Outlet />
  }

  if (
    status === "pendente"
  ) {

    return (

      <PlanoBloqueioModal

        aberto={true}

        mensagem={
          "Seu pagamento ainda está pendente de confirmação."
        }

        onClose={() => {}}

      />

    )
  }

  if (
    status === "inadimplente"
  ) {

    return (

      <PlanoBloqueioModal

        aberto={true}

        mensagem={
          "Seu pagamento foi recusado ou está inadimplente."
        }

        onClose={() => {}}

      />

    )
  }

  if (
    status === "cancelado"
  ) {

    return (

      <PlanoBloqueioModal

        aberto={true}

        mensagem={
          "Sua assinatura foi cancelada."
        }

        onClose={() => {}}

      />

    )
  }

  if (
    status === "pausado"
  ) {

    return (

      <PlanoBloqueioModal

        aberto={true}

        mensagem={
          "Sua assinatura está pausada."
        }

        onClose={() => {}}

      />

    )
  }

  return (

    <PlanoBloqueioModal

      aberto={true}

      mensagem={
        "Seu acesso está bloqueado."
      }

      onClose={() => {}}

    />

  )
}