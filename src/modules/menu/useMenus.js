import { useQuery }
  from "@tanstack/react-query"

import api
  from "../../api/api"

import { usePermissao }
  from "../permissao/usePermissao"

import { useAppStore }
  from "../../store/useAppStore"

export function useMenus() {

  const { temPermissao } =
    usePermissao()

const usuario =
  useAppStore(
    s => s.usuario
  )

  const podeVisualizarMenu =
    true

  const query = useQuery({

    queryKey: ["menus"],

    queryFn: async () => {

      const res =
        await api.get("/menus")

      const menus =
        res.data || []

      return menus.filter(menu => {

        /* =========================
           EMPRESAS = MASTER ONLY
        ========================= */

        if (

          menu.rota === "/app/empresas" &&

          !usuario?.master

        ) {

          return false
        }

        /* =========================
           SEM PERMISSÃO
        ========================= */

        if (!menu.permissao) {

          return true
        }

        /* =========================
           PERMISSÃO
        ========================= */

        return temPermissao(
          menu.permissao
        )

      })
    },

    enabled:
      podeVisualizarMenu

  })

  return {

    menus:
      query.data || [],

    loading:
      query.isLoading,

    error:
      query.error?.message || null
  }
}