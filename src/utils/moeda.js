/* ===============================
   FORMATAR (EXIBIÇÃO)
================================ */
export function formatarMoeda(valor) {
  if (!valor) return ""

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

/* ===============================
   LIMPAR (INPUT → NUMBER)
================================ */
export function limparMoeda(valor) {
  if (!valor) return 0

  return Number(
    valor
      .replace(/\D/g, "")
  ) / 100
}