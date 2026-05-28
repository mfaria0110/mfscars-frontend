import api from "../../api/api"

export const getDashboard =
  async () => {

    const { data } =
      await api.get(
        "/dashboard"
      )

    return {

      veiculos:
        data?.veiculos || 0,

      leads:
        data?.leads || 0,

      views:
        data?.views || 0,

      vendas:
        data?.vendas || 0,

      plano:
        data?.plano || null
    }
  }
