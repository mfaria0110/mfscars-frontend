import toast from "react-hot-toast"

export function tratarErro(e) {

  const mensagem =
    e?.response?.data?.erro ||
    e?.message ||
    "Erro inesperado"

  /* =========================
     ERROS JÁ TRATADOS
     GLOBALMENTE
  ========================= */

  const erroGlobal =

  mensagem?.includes(
    "Limite de veículos atingido"
  ) ||

  mensagem?.includes(
    "Limite de lojas atingido"
  ) ||

  mensagem?.includes(
    "Limite de vendedores atingido"
  ) ||

  mensagem?.includes(
    "Nenhum plano ativo"
  ) ||

  mensagem?.includes(
    "inadimplente"
  ) ||

  mensagem?.includes(
    "Plano vencido"
  )

  if (erroGlobal) {
    return
  }

  toast.error(mensagem)
}