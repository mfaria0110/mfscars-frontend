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

  const isChangingLoja =
    useAppStore(
      state => state.isChangingLoja
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
     🔥 DEBOUNCE FILTROS
  ============================== */
  useEffect(() => {
    const delay = setTimeout(() => {
      setFiltrosDebounced(filtros)
    }, 500)

    return () => clearTimeout(delay)
  }, [filtros])

  /* ===============================
     🔥 QUERY VEÍCULOS
  ============================== */
  const query = useQuery({
    queryKey: [
      "veiculos",
      lojaId,
      JSON.stringify(filtrosDebounced)
    ],

    queryFn: async () => {

      if (!lojaId) return []

      console.log("🔥 CHAMANDO API VEICULOS")

      const lista =
        await getVeiculos(filtrosDebounced)

      return lista.map(v => ({
        ...v,
        foto: getFoto(v.foto)
      }))
    },

    enabled: !!lojaId, // 🔥 SIMPLES E CORRETO

    retry: false,

    refetchOnMount: true,
    refetchOnWindowFocus: true,

    staleTime: 0
  })

  /* ===============================
     🔥 REFETCH AO TROCAR LOJA
  ============================== */
  useEffect(() => {
    if (lojaId) {
      console.log("🔥 refetch por mudança de loja:", lojaId)
      query.refetch()
    }
  }, [lojaId])

  /* ===============================
     🔥 INVALIDAR
  ============================== */
  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["veiculos"],
      exact: false
    })

    await query.refetch()
  }

  const limparErro = () =>
    setErro(null)

  return {
    veiculos: query.data || [],

    total:
      query.data?.length || 0,

    loading: query.isLoading,

    error:
      erro ||
      query.error?.message ||
      null,

    limparErro,

    filtros,
    setFiltros,

    refetch: query.refetch,

    invalidate,

    podeVisualizar // 👈 agora só pra UI
  }
}