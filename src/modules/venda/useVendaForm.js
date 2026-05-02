import { useState } from "react"
import { criarVenda } from "./venda.service"
import { usePermissao } from "../permissao/usePermissao"

export function useVendaForm(veiculoId) {
  const { temPermissao } = usePermissao()

  const podeCriar = temPermissao("venda.criar")

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    data: "",
    valor: "",
    valor_entrada: "",
    valor_parcela: "",
    condicao: "A_VISTA",
    parcelas: "",
    banco: "",
    obs: "",
    vendedor: "",
    rg_comprador: "",
    estado: "",
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    email: "",
    profissao: "",
    data_nasc: "",
    renda: ""
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    if (!podeCriar) {
      throw new Error(
        "Sem permissão para criar venda"
      )
    }

    let { name, value } = e.target

    if (name === "vendedor") {
      value = value.trimStart()
    }

    if (name === "cpf") {
      value = maskCPF(value)
    }

    if (name === "telefone") {
      value = maskTelefone(value)
    }

    if (
      name === "valor" ||
      name === "valor_entrada" ||
      name === "valor_parcela"
    )
     {
      value = maskValor(value)
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function salvar(extra = {}) {
    if (!podeCriar) {
      throw new Error(
        "Sem permissão para criar venda"
      )
    }

    if (!veiculoId) {
      throw new Error(
        "Veículo obrigatório"
      )
    }

    if (!form.nome) {
      throw new Error(
        "Nome do comprador é obrigatório"
      )
    }

    if (!form.cpf) {
      throw new Error(
        "CPF ou CNPJ do comprador é obrigatório"
      )
    }

    if (!form.data) {
      throw new Error(
        "Data da venda é obrigatória"
      )
    }

    if (!form.vendedor) {
  throw new Error(
    "Vendedor é obrigatório"
      )
    }


const valorNumerico =
  Number(
    String(form.valor)
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  ) || 0

const valorEntradaNumerico =
  Number(
    String(form.valor_entrada)
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  ) || 0

const valorParcelaNumerico =
  Number(
    String(form.valor_parcela)
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  ) || 0


    if (!form.condicao) {
      throw new Error(
        "Condição de pagamento é obrigatória"
      )
    }

    if (
      form.condicao ===
      "FINANCIADO"
    ) {
      if (!form.parcelas) {
        throw new Error(
          "Parcelas são obrigatórias"
        )
      }

      if (!form.banco) {
        throw new Error(
          "Banco é obrigatório"
        )
      }
    }

    setLoading(true)

    try {
   const payload = {
  veiculo_id: veiculoId,
  data_venda: form.data,
  nome_comprador: form.nome,
  cpf_comprador: form.cpf,
  telefone_comprador: form.telefone,
  condicao_pagamento: form.condicao,
  parcelas: form.parcelas,
  banco_financiamento: form.banco,
  valor_venda: valorNumerico,
  valor_entrada: valorEntradaNumerico,
  valor_parcela: valorParcelaNumerico,
  observacoes: form.obs,
  vendedor: form.vendedor,
  rg_comprador: form.rg,
  estado: form.estado,
  cidade: form.cidade,
  bairro: form.bairro,
  endereco: form.endereco,
  numero: form.numero,
  complemento: form.complemento,
  cep: form.cep,
  email: form.email,
  profissao: form.profissao,
  data_nasc: form.data_nasc,
  renda: form.renda,

  ...extra
}

console.log(
  "PAYLOAD VENDA:",
  payload
)

const res =
  await criarVenda(
    payload
  )

      return res
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    setForm,
    handleChange,
    salvar,
    loading
  }
}

function maskCPF(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(
    /(\d{3})(\d)/,
    "$1.$2"
  )
  v = v.replace(
    /(\d{3})(\d)/,
    "$1.$2"
  )
  v = v.replace(
    /(\d{3})(\d{1,2})$/,
    "$1-$2"
  )
  return v
}

function maskTelefone(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(
    /^(\d{2})(\d)/g,
    "($1) $2"
  )
  v = v.replace(
    /(\d{5})(\d)/,
    "$1-$2"
  )
  return v
}

function maskValor(v) {
  v = v.replace(/\D/g, "")

  if (!v) return ""

  v =
    (
      parseInt(v) / 100
    ).toFixed(2) + ""

  v = v.replace(".", ",")
  v = v.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  )

  return "R$ " + v
}