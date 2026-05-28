import { useState, useEffect } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"
import toast from "react-hot-toast"
import { tratarErro }
  from "../../utils/tratarErro"

export function useDocumentos(veiculoId) {
const lojaId = useAppStore(
  state => state.lojaId
)

const lojas = useAppStore(
  state => state.lojas
)

const lojaAtual =
  lojas.find(
    l => l.id === lojaId
  )

const empresaId =
  lojaAtual?.empresa_id

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("veiculo.visualizar")
  const podeEditar = temPermissao("veiculo.editar")

  const [lista, setLista] = useState([])
  const [file, setFile] = useState(null)
  const [tipo, setTipo] = useState("CRLV")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!veiculoId || !lojaId || !podeVisualizar) return

    carregar()
  }, [veiculoId, lojaId, podeVisualizar])

  async function carregar() {

     if (!veiculoId) return

    try { 
      setLoading(true)

      const res = await api.get(
        `/veiculo-documento/${veiculoId}`
      )

      setLista(res.data || [])
    } 

catch (e) {

  console.error(e)

  tratarErro(e)
}

    finally {
      setLoading(false)
    }
  }

  async function upload(veiculoId) {
 
    if (!file || !veiculoId) {
      toast.error("Selecione um arquivo")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append("arquivo", file)
      formData.append("veiculo_id", veiculoId)
      formData.append("empresa_id", empresaId)
      formData.append("loja_id", lojaId)
      formData.append("tipo", tipo)

      await api.post(
        "/veiculo-documento",
        formData
      )

      toast.success(
        "Documento enviado com sucesso"
      )

      setFile(null)

      await carregar()
    } 

catch (e) {

  console.error(e)

  tratarErro(e)
}

    finally {
      setLoading(false)
    }
  }

  return {
    lista,
    file,
    setFile,
    tipo,
    setTipo,
    loading,
    upload,
    carregar
  }

}