import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"
import toast from "react-hot-toast"

export function useOpcionais(id) {
  const lojaId = useAppStore(state => state.lojaId)

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("veiculo.visualizar")
  const podeEditar = temPermissao("veiculo.editar")

  const [lista, setLista] = useState([])
  const [selecionados, setSelecionados] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lojaId || !podeVisualizar) {
      setLista([])
      return
    }

    async function carregar() {
      try {
        setLoading(true)

        const res = await api.get("/veiculos/opcionais")

        setLista(res.data || [])
      } catch (e) {
        console.error("Erro opcionais:", e)

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar opcionais"
        )
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [lojaId, podeVisualizar])

  useEffect(() => {
    if (!id || !lojaId || !podeVisualizar) {
      setSelecionados([])
      return
    }

    async function carregarVeiculo() {
      try {
        setLoading(true)

        const res = await api.get(`/veiculos/${id}`)

        const opcionais =
          res.data?.opcionais || []

        setSelecionados(
          opcionais.map(o => o.id)
        )
      } catch (e) {
        console.error(
          "Erro veículo opcionais:",
          e
        )

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar opcionais do veículo"
        )
      } finally {
        setLoading(false)
      }
    }

    carregarVeiculo()
  }, [id, lojaId, podeVisualizar])

  function toggle(opcionalId) {
    if (!podeEditar) {
      toast.error(
        "Sem permissão para editar opcionais"
      )
      return
    }

    setSelecionados(prev =>
      prev.includes(opcionalId)
        ? prev.filter(i => i !== opcionalId)
        : [...prev, opcionalId]
    )
  }

  return {
    lista,
    selecionados,
    loading,
    toggle
  }
}