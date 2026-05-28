import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"

function validarPermissao(chave) {

  const {
    usuario,
    permissoes
  } = useAppStore.getState()

  if (usuario?.master) {
    return true
  }

  if (!Array.isArray(permissoes)) {
    return false
  }

  return permissoes.includes(chave)
}

/* ===============================
   💰 CRIAR VENDA
============================== */
export async function criarVenda(data) {

  if (
    !validarPermissao(
      "venda.criar"
    )
  ) {

    throw new Error(
      "Sem permissão para criar venda"
    )
  }

  const res =
    await api.post(
      "/vendas",
      data
    )

  window.dispatchEvent(
    new Event(
      "dashboardAtualizado"
    )
  )

  window.dispatchEvent(
    new Event(
      "veiculosAtualizados"
    )
  )

  return res.data
}
