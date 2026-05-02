import { useQuery } from "@tanstack/react-query"
import api from "../../api/api"
import { usePermissao } from "../permissao/usePermissao"

export function useMenus() {
  const { temPermissao } = usePermissao()

  const podeVisualizarMenu = true

  const query = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await api.get("/menus")

      const menus = res.data || []

      return menus.filter(menu => {
        if (!menu.permissao) return true

        return temPermissao(menu.permissao)
      })
    },
    enabled: podeVisualizarMenu
  })

  return {
    menus: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null
  }
}