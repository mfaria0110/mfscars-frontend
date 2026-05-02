import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"

export async function getVeiculos(
  filtros = {}
) {
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
      "Bloqueado getVeiculos -> loja não pronta"
    )
    return []
  }

  try {
    const { data } =
      await api.get(
        "/veiculos/empresa",
        {
          params: filtros
        }
      )

    return data || []

  } catch (e) {
    if (
      e.response?.status === 400
    ) {
      return []
    }

    throw e
  }
}

export async function criarVeiculo(
  payload
) {
  const { data } =
    await api.post(
      "/veiculos",
      payload
    )

  return data
}

export async function atualizarVeiculo(
  id,
  payload
) {
  const { data } =
    await api.put(
      `/veiculos/${id}`,
      payload
    )

  return data
}

export async function excluirVeiculo(
  id
) {
  const { data } =
    await api.delete(
      `/veiculos/${id}`
    )

  return data
}