import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"
import toast from "react-hot-toast"

export function useMarcaModelo(marca_id) {
  const lojaId = useAppStore(state => state.lojaId)

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("veiculo.visualizar")

  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [loadingMarcas, setLoadingMarcas] = useState(false)
  const [loadingModelos, setLoadingModelos] = useState(false)

  useEffect(() => {
    if (!lojaId || !podeVisualizar) {
      setMarcas([])
      return
    }

    async function carregarMarcas() {
      try {
        setLoadingMarcas(true)

        const res = await api.get("/veiculos/marcas")

        setMarcas(res.data || [])
      } catch (e) {
        console.error("Erro marcas:", e)

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar marcas"
        )
      } finally {
        setLoadingMarcas(false)
      }
    }

    carregarMarcas()
  }, [lojaId, podeVisualizar])

  useEffect(() => {
    if (!marca_id || !lojaId || !podeVisualizar) {
      setModelos([])
      return
    }

    async function carregarModelos() {
      try {
        setLoadingModelos(true)

        const res = await api.get(
          `/veiculos/modelos?marca_id=${marca_id}`
        )

        setModelos(res.data || [])
      } catch (e) {
        console.error("Erro modelos:", e)

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar modelos"
        )
      } finally {
        setLoadingModelos(false)
      }
    }

    carregarModelos()
  }, [marca_id, lojaId, podeVisualizar])

  return {
    marcas,
    modelos,
    loadingMarcas,
    loadingModelos
  }
}