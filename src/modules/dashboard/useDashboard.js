import { useEffect } from "react"

import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

import { useAppStore }
  from "../../store/useAppStore"

import { getDashboard }
  from "./dashboard.service"

import { usePermissao }
  from "../permissao/usePermissao"

export function useDashboard() {

  const lojaId =
    useAppStore(
      state => state.lojaId
    )

  const queryClient =
    useQueryClient()

  const { temPermissao } =
    usePermissao()

  const podeVisualizarDashboard =
    temPermissao(
      "dashboard.visualizar"
    )

  /* ===============================
     📊 QUERY
  ============================== */
  const query = useQuery({

    queryKey: [
      "dashboard",
      lojaId
    ],

    queryFn:
      getDashboard,

    enabled:
      !!lojaId &&
      podeVisualizarDashboard,

    /* evita cache velho */
    staleTime:
      1000 * 10,

    /* evita refetch desnecessário */
    refetchOnWindowFocus:
      false,

    retry: false
  })

  /* ===============================
     🔄 ATUALIZAÇÕES
  ============================== */
  useEffect(() => {

    function atualizar() {

      if (
        !podeVisualizarDashboard
      ) return

      queryClient.invalidateQueries({

        queryKey: [
          "dashboard",
          lojaId
        ]

      })
    }

    window.addEventListener(
      "lojaChanged",
      atualizar
    )

    window.addEventListener(
      "planoAtualizado",
      atualizar
    )

    return () => {

      window.removeEventListener(
        "lojaChanged",
        atualizar
      )

      window.removeEventListener(
        "planoAtualizado",
        atualizar
      )
    }

  }, [

    lojaId,

    queryClient,

    podeVisualizarDashboard
  ])

  /* ===============================
     📤 RETURN
  ============================== */
  return {

    stats:
      query.data || {

        veiculos: 0,

        leads: 0,

        views: 0,

        vendas: 0,

        plano: null
      },

    loading:
      query.isLoading,

    error:
      query.error?.message ||
      null,

    refetch:
      query.refetch
  }
}