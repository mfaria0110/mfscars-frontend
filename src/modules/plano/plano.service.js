import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"

/* ===============================
   VALIDA PERMISSÃO
=============================== */
function validarPermissao(
  chave
) {

  const {
    usuario,
    permissoes
  } =
    useAppStore.getState()

  /*
    MASTER LIBERADO
  */
  if (
    usuario?.master
  ) {
    return true
  }

  return Array.isArray(
    permissoes
  )
    ? permissoes.includes(
        chave
      )
    : false
}

/* ===============================
   LISTA PLANOS
=============================== */
export async function getPlanos() {

  if (
    !validarPermissao(
      "plano.visualizar"
    )
  ) {
    return []
  }

  try {

    const { data } =
      await api.get(
        "/planos"
      )

    return data || []

  } catch (e) {

    console.error(e)

    return []
  }
}

/* ===============================
   PLANO ATUAL
=============================== */
export async function getPlanoAtual() {

  const state =
    useAppStore.getState()

  const lojaId =
    state.lojaId

  const isChangingLoja =
    state.isChangingLoja

  /*
    evita corrida ao trocar loja
  */
  if (
    !lojaId ||
    isChangingLoja
  ) {

    console.warn(
      "Bloqueado getPlanoAtual -> loja não pronta"
    )

    return null
  }

  if (
    !validarPermissao(
      "plano.visualizar"
    )
  ) {
    return null
  }

  try {

    const { data } =
      await api.get(
        "/planos/atual"
      )

    return data || null

  } catch (e) {

    /*
      loja sem plano
    */
    if (
      e.response?.status === 400
    ) {
      return null
    }

    console.error(e)

    throw e
  }
}

/* ===============================
   UPGRADE LOCAL
=============================== */
export async function upgradePlano(
  plano_id,
  loja_id
) {

  const podeAssinar =
    validarPermissao(
      "billing.assinar"
    )

  const podeUpgrade =
    validarPermissao(
      "billing.upgrade"
    )

  if (
    !podeAssinar &&
    !podeUpgrade
  ) {

    throw new Error(
      "Sem permissão para alterar plano"
    )
  }

  const { data } =
    await api.post(
      "/planos/upgrade",
      {
        plano_id,
        loja_id
      }
    )

  return data
}

/* ===============================
   ASSINAR PLANO
=============================== */
export async function assinarPlano(
  plano_id
) {

  /*
    billing próprio SaaS
  */
  if (
    !validarPermissao(
      "billing.assinar"
    )
  ) {

    throw new Error(
      "Sem permissão para assinar plano"
    )
  }

  const { data } =
    await api.post(
      "/billing/assinar",
      {
        plano_id
      }
    )

  return data
}