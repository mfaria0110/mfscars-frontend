import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"

function validarPermissao(
  chave
) {
  const {
    usuario,
    permissoes
  } =
    useAppStore.getState()

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
    return []
  }
}

export async function getPlanoAtual() {
  const state =
    useAppStore.getState()

  const lojaId =
    state.lojaId

  const isChangingLoja =
    state.isChangingLoja

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
    if (
      e.response?.status === 400
    ) {
      return null
    }

    throw e
  }
}

export async function upgradePlano(
  plano_id,
  loja_id
) {
  if (
    !validarPermissao(
      "plano.editar"
    )
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