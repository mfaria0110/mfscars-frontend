import { useState, useEffect } from "react"
import api from "../../api/api"
import { limparMoeda } from "../../utils/moeda"
import { useUIStore } from "../../store/uiStore"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { usePermissao } from "../permissao/usePermissao"
import { tratarErro }
  from "../../utils/tratarErro"

export function useVeiculoForm(id) {
  const modo = id ? "edit" : "create"

  const { temPermissao } = usePermissao()

  const podeCriar = temPermissao("veiculo.criar")
  const podeEditar = temPermissao("veiculo.editar")
  const podeVisualizar = temPermissao("veiculo.visualizar")

  const [loading, setLoading] = useState(false)

  const setLoadingGlobal = useUIStore(
    state => state.setLoading
  )

  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    marca: "",
    marca_id: null,
    modelo: "",
    versao: "",
    ano_modelo: "",
    valor: "",
    cor: "",
    placa: "",
    descricao: "",
    quilometragem: "",
    cambio: "Manual",
    carroceria: "Sedã",
    combustivel: "Flex",
    renavam: "",
    aceita_troca: "true",
    licenciado: "true",
    opcionais: []
  })

  useEffect(() => {
    if (!id || !podeVisualizar) return

    async function carregar() {
      try {
        setLoading(true)
        setLoadingGlobal(true)

        const res = await api.get(`/veiculos/${id}`)
        const data = res.data
        const v = data.veiculo || {}

        setForm({
          marca: v.marca || "",
          marca_id: v.marca_id || null,
          modelo: v.modelo || "",
          versao: v.versao || "",
          ano_modelo: v.ano_modelo || "",
          valor: v.valor || "",
          cor: v.cor || "",
          placa: v.placa || "",
          descricao: v.descricao || "",
          quilometragem: v.quilometragem || "",
          cambio: v.cambio || "Manual",
          carroceria: v.carroceria || "Sedã",
          combustivel: v.combustivel || "Flex",
          renavam: v.renavam || "",
          aceita_troca: String(
            v.aceita_troca ?? "true"
          ),
          licenciado: String(
            v.licenciado ?? "true"
          ),
          opcionais: (
            data.opcionais || []
          ).map(o => o.id)
        })
      } catch (e) {
        console.error(e)

        toast.error(
          e.response?.data?.erro ||
          "Erro ao carregar veículo"
        )
      } finally {
        setLoading(false)
        setLoadingGlobal(false)
      }
    }

    carregar()
  }, [id, podeVisualizar, setLoadingGlobal])

  function handleChange(e) {
    if (
      modo === "edit" &&
      !podeEditar
    ) {
      toast.error(
        "Sem permissão para editar veículo"
      )
      return
    }

    if (
      modo === "create" &&
      !podeCriar
    ) {
      toast.error(
        "Sem permissão para criar veículo"
      )
      return
    }

    const { name, value } = e.target

    if (name === "ano_modelo") {
      if (!value) {
        setForm(prev => ({
          ...prev,
          ano_modelo: ""
        }))
        return
      }

      setForm(prev => ({
        ...prev,
        ano_modelo: value
      }))
      return
    }

    if (name === "valor") {
      setForm(prev => ({
        ...prev,
        valor: limparMoeda(value)
      }))
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "marca"
        ? { modelo: "" }
        : {})
    }))
  }

  async function salvar(
    opcionaisSelecionados = []
  ) {
    if (
      modo === "create" &&
      !podeCriar
    ) {
      toast.error(
        "Sem permissão para criar veículo"
      )
      return
    }

    if (
      modo === "edit" &&
      !podeEditar
    ) {
      toast.error(
        "Sem permissão para editar veículo"
      )
      return
    }

    try {
      setLoading(true)
      setLoadingGlobal(true)

      if (!form.marca || !form.modelo) {
        throw new Error(
          "Preencha marca e modelo"
        )
      }

      const ano = parseInt(
        form.ano_modelo
      )

      if (
        ano &&
        (ano < 1900 || ano > 2050)
      ) {
        throw new Error(
          "Ano deve estar entre 1900 e 2050"
        )
      }

      const dados = {
        ...form,

        valor: (() => {
          let v = String(
            form.valor
          ).trim()

          if (!v) return 0

          if (v.includes(",")) {
            v = v.replace(/\./g, "")
            v = v.replace(",", ".")
          }

          return Number(v) || 0
        })(),

        quilometragem:
          Number(
            form.quilometragem
          ) || 0,

        ano_modelo:
          form.ano_modelo
            ? String(form.ano_modelo).trim()
            : null,

        placa: form.placa
          ? form.placa
              .replace(/\W/g, "")
              .toUpperCase()
          : null,

        aceita_troca:
          form.aceita_troca ===
            "true" ||
          form.aceita_troca === true,

        licenciado:
          form.licenciado ===
            "true" ||
          form.licenciado === true,

        opcionais:
          opcionaisSelecionados
      }

      let res

      if (modo === "edit") {
        res = await api.put(
          `/veiculos/${id}`,
          dados
        )
      } else {

      /* ===============================
         PLACA OBRIGATÓRIA
      ============================== */

      if (!form.placa?.trim()) {
        toast.error(
          "Informe a placa do veículo"
        )
        return
      }

      /* ===============================
         VALOR MÁXIMO
      ============================== */

        const valorNumerico = dados.valor

        if (!valorNumerico || valorNumerico <= 0) {
          toast.error(
            "Informe um valor válido para o veículo"
          )
          return
        }

        if (valorNumerico > 9999999999.99) {
          toast.error(
            "Valor do veículo excede o limite permitido"
          )
          return
        }
        
        res = await api.post(
          `/veiculos`,
          dados
        )
      }

      queryClient.invalidateQueries({
        queryKey: ["veiculos"]
      })

      toast.success(
        modo === "edit"
          ? "Veículo atualizado"
          : "Veículo criado"
      )

      return res.data
    } 


catch (e) {

  console.error(e)

  tratarErro(e)

  throw e

} 


    finally {
      setLoading(false)
      setLoadingGlobal(false)
    }
  }

  return {
    form,
    setForm,
    handleChange,
    salvar,
    loading,
    modo
  }
}