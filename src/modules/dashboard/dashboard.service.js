import api from "../../api/api"

export const getDashboard = async () => {
  try {

    const { data } = await api.get("/dashboard")

    return {
      veiculos: data?.veiculos || 0,
      leads: data?.leads || 0,
      views: data?.views || 0,
      vendas: data?.vendas || 0,
      plano: data?.plano || null
    }

  } catch (e) {

    console.error("Erro dashboard:", e)

    if (e.response?.status === 403) {
      throw new Error("Sem permissão para visualizar dashboard")
    }

    throw new Error(
      e.response?.data?.erro ||
      "Erro ao carregar dashboard"
    )
  }
}