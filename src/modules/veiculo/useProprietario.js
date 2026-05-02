import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"
import toast from "react-hot-toast"

export function useProprietario(veiculoId) {
  const lojaId = useAppStore(state => state.lojaId)

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("proprietario.visualizar")
  const podeEditar = temPermissao("proprietario.editar")

  const [form, setForm] = useState({
    nome: "",
    cpf_cnpj: "",
    telefone: "",
    email: "",
    endereco: ""
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!veiculoId || !lojaId || !podeVisualizar) return

    async function carregar() {
      try {
        setLoading(true)

        const res = await api.get(
          `/veiculo-proprietario/${veiculoId}`
        )

        if (res.data) {
          setForm(res.data)
        }
      } catch (e) {
        console.error(e)

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar proprietário"
        )
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [veiculoId, lojaId, podeVisualizar])

  function handleChange(e) {
    if (!podeEditar) {
      toast.error(
        "Sem permissão para editar proprietário"
      )
      return
    }

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function salvar(veiculoId) {
    if (!podeEditar) {
      toast.error(
        "Sem permissão para salvar proprietário"
      )
      return
    }

    if (!veiculoId) return

    try {
      setLoading(true)

      await api.post(
        "/veiculo-proprietario",
        {
          ...form,
          veiculo_id: veiculoId
        }
      )

      toast.success(
        "Proprietário salvo com sucesso"
      )
    } catch (e) {
      console.error(e)

      toast.error(
        e.response?.data?.erro ||
        "Erro ao salvar proprietário"
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    handleChange,
    salvar
  }
}