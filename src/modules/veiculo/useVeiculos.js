import {
  useState,
  useEffect
} from "react"

import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

import { useAppStore } from "../../store/useAppStore"
import { getVeiculos } from "./veiculo.service"
import { getFoto } from "../../utils/getFoto"
import { usePermissao } from "../permissao/usePermissao"

export function useVeiculos() {

  const lojaId = useAppStore(
    state => state.lojaId
  )

  const { temPermissao } =
    usePermissao()

  const podeVisualizar =
    temPermissao("veiculo.visualizar")

  const queryClient =
    useQueryClient()

  const [filtros, setFiltros] =
    useState({})

  const [
    filtrosDebounced,
    setFiltrosDebounced
  ] = useState({})

  const [erro, setErro] =
    useState(null)

  /* ===============================
     DEBOUNCE
  ============================== */

  useEffect(() => {

    const delay =
      setTimeout(() => {

        setFiltrosDebounced(
          filtros
        )

      }, 500)

    return () =>
      clearTimeout(delay)

  }, [filtros])

  /* ===============================
     QUERY
  ============================== */

  const query = useQuery({

    queryKey: [
      "veiculos",
      lojaId,
      JSON.stringify(
        filtrosDebounced
      )
    ],

    queryFn: async () => {

      if (!lojaId) {
        return []
      }

      const lista =
        await getVeiculos(
          filtrosDebounced
        )

      return lista.map(v => ({
        ...v,
        foto: getFoto(v.foto)
      }))
    },

    enabled: !!lojaId,

    retry: false,

    refetchOnWindowFocus: false,

    staleTime: 1000 * 30
  })

  /* ===============================
     CAPTURA ERRO
  ============================== */

  useEffect(() => {

    if (query.error?.message) {

      setErro(
        query.error.message
      )

    }

  }, [query.error])

  /* ===============================
     INVALIDATE
  ============================== */

  const invalidate =
    async () => {

      await queryClient.invalidateQueries({
        queryKey: ["veiculos"],
        exact: false
      })
    }

  /* ===============================
     RETURN
  ============================== */

  return {

    veiculos:
      query.data || [],

    total:
      query.data?.length || 0,

    loading:
      query.isLoading,

    error:
      erro,

    limparErro:
      () => setErro(null),

    filtros,
    setFiltros,

    refetch:
      query.refetch,

    invalidate,

    podeVisualizar
  }
}