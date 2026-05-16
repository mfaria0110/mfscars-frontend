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

  /*
    fallback reload
  */

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

  /*
    SEM LOGIN
  */

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  /*
  MASTER
*/

if (usuario?.master) {

  return <Outlet />
}
  

  /*
    PLANO
  */

  const {
    planoAtual,
    loading
  } = usePlano()

  /*
    carregando
  */

  if (loading) {

    return null
  }

  /*
    sem plano
  */

  if (!planoAtual) {

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

  /*
    STATUS
  */

  const status =
    planoAtual.status

  /*
    FREE
  */

  if (
    planoAtual?.nome?.toLowerCase() === "free"
  ) {

    return <Outlet />
  }

  /*
    ATIVO
  */

  if (
    status === "ativo"
  ) {

    return <Outlet />
  }

  /*
    PENDENTE
  */

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

  /*
    INADIMPLENTE
  */

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

  /*
    CANCELADO
  */

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

  /*
    PAUSADO
  */

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

  /*
    fallback
  */

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