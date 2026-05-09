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

  /* debounce */
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

  /* query */
  const query = useQuery({

    queryKey: [
      "veiculos",
      lojaId,
      JSON.stringify(
        filtrosDebounced
      )
    ],

    queryFn: async () => {

      if (!lojaId) return []

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

  const invalidate =
    async () => {

      await queryClient.invalidateQueries({
        queryKey: ["veiculos"],
        exact: false
      })
    }

  return {

    veiculos:
      query.data || [],

    total:
      query.data?.length || 0,

    loading:
      query.isLoading,

    error:
      erro ||
      query.error?.message ||
      null,

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