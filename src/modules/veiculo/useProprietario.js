import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"
import toast from "react-hot-toast"
import { tratarErro }
  from "../../utils/tratarErro"

export function useProprietario(veiculoId) {
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
      } 

catch (e) {

  console.error(e)

  tratarErro(e)
}

       finally {
        setLoading(false)
      }
    }

    carregar()
  }, [veiculoId, lojaId, podeVisualizar])

  function handleChange(e) {

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
        veiculo_id: veiculoId,
        empresa_id: empresaId,
        loja_id: lojaId
      }
      )

      toast.success(
        "Proprietário salvo com sucesso"
      )
    } 

catch (e) {

  console.error(e)

  tratarErro(e)
}

     finally {
      setLoading(false)
    }
  }

  async function excluir() {

  if (!veiculoId) return

  const confirmar =
    window.confirm(
      "Deseja excluir o proprietário?"
    )

  if (!confirmar) return

  try {

    setLoading(true)

    await api.delete(
      `/veiculo-proprietario/${veiculoId}`
    )

    setForm({
      nome: "",
      cpf_cnpj: "",
      telefone: "",
      email: "",
      endereco: ""
    })

    toast.success(
      "Proprietário excluído"
    )

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
    form,
    loading,
    handleChange,
    salvar,
    excluir
  }

}