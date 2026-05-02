import { useState, useEffect } from "react"
import {
  useSearchParams,
  useNavigate
} from "react-router-dom"

import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import api from "../../api/api"

import { useVendaForm } from "../../modules/venda/useVendaForm"
import { usePermissao } from "../../modules/permissao/usePermissao"

import {
  formatarMoeda
} from "../../utils/moeda"

import { useAppStore } from "../../store/useAppStore"

import "../../components/styles/vendas.css"

export default function VendaForm() {

  const setVendaAtiva = useAppStore(state => state.setVendaAtiva)

  const [params] =
    useSearchParams()

  const navigate =
    useNavigate()

  const queryClient =
    useQueryClient()

  const veiculoId =
    params.get("veiculo_id")

  const { temPermissao } =
    usePermissao()

  const podeCriar =
    temPermissao("venda.criar")

const {
  form,
  setForm,
  handleChange,
  salvar,
  loading
} = useVendaForm(veiculoId)

  const [
    veiculosEntrada,
    setVeiculosEntrada
  ] = useState([])

  const [
    veiculoSelecionado,
    setVeiculoSelecionado
  ] = useState(null)

  const [
  cidades,
  setCidades
  ] = useState([])

  const [vendedores, setVendedores] = useState([])

  const usuario = useAppStore(state => state.usuario)

const estados = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
]

  /* =========================
     CARREGAR VEÍCULO
  ========================= */
useEffect(() => {
  async function carregarVeiculo() {
    if (!veiculoId) return

    try {
      const res = await api.get(
        `/veiculos/${veiculoId}`
      )

      console.log(
        "VEICULO:",
        res.data
      )

      setVeiculoSelecionado(
        res.data.veiculo
      )

    } catch (e) {
      console.error(e)

      toast.error(
        "Erro ao carregar veículo"
      )
    }
  }

  carregarVeiculo()
}, [veiculoId])

  if (!podeCriar) {
    return (
      <div
        style={{
          padding: 40
        }}
      >
        🚫 Sem permissão para registrar vendas
      </div>
    )
  }


/*============================
  CARREGAR VENDEDORES
=================*/
useEffect(() => {
  async function carregarUsuariosEmpresa() {
    try {
      const res = await api.get("/usuarios/empresa-simples")

      console.log("USUÁRIOS:", res.data)

      setVendedores(res.data)

    } catch (e) {
      console.error("Erro ao carregar usuários", e)

      toast.error("Erro ao carregar vendedores")
    }
  }

  // 🔥 garante que só roda quando usuário está carregado
  if (usuario && usuario.empresa_id) {
    carregarUsuariosEmpresa()
  }

}, [usuario])


useEffect(() => {
  setVendaAtiva(true)

  return () => {
    setVendaAtiva(false)
  }
}, [])


  /* =========================
     ADICIONAR ENTRADA
  ========================= */
function adicionarEntrada() {
  setVeiculosEntrada(prev => [
    ...prev,
    {
      marca: "",
      modelo: "",
      tipo: "",
      ano_modelo: "",
      renavam: "",
      chassi: "",
      placa: "",
      cor: "",
      numero_motor: "",
      combustivel: "",
      potencia: "",
      km: "",
      valor_entrada: ""
    }
  ])
}

function alterarEntrada(
  index,
  campo,
  valor
) {
  const copia =
    [...veiculosEntrada]

  copia[index][campo] =
    valor

  setVeiculosEntrada(
    copia
  )
}

function removerEntrada(index) {
  setVeiculosEntrada(prev =>
    prev.filter((_, i) => i !== index)
  )
}

/* =========================
   BUSCAR CIDADES
========================= */
async function buscarCidades(uf) {
  if (!uf) {
    setCidades([])
    return
  }

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    )

    const data = await res.json()

    setCidades(
      data.map(c => c.nome)
    )

  } catch (e) {
    console.error(e)

    toast.error(
      "Erro ao carregar cidades"
    )
  }
}


  async function handleSubmit(e) {
    e.preventDefault()

    if (!veiculoId) {
      toast.error("Veículo inválido")
      return
    }

    if (!form.nome) {
      toast.error("Nome obrigatório")
      return
    }

    if (!form.cpf) {
      toast.error("CPF ou CNPJ obrigatório")
      return
    }

    if (!form.data) {
      toast.error("Data obrigatória")
      return
    }

    if (!form.valor) {
      toast.error("Valor da venda obrigatório")
      return
    }

try {
  const totalVeiculosEntrada =
    veiculosEntrada.reduce(
      (total, item) => {
        const valorLimpo = String(
          item.valor_entrada || 0
        )
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/[^\d.]/g, "")

        return (
          total +
          Number(valorLimpo || 0)
        )
      },
      0
    )

  const valorEntradaDinheiro =
    Number(
      String(
        form.valor_entrada || 0
      )
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, "")
    ) || 0

  await salvar({
    // entrada em dinheiro
    valor_entrada:
      valorEntradaDinheiro,

    // total veículos recebidos
    valor_veiculos_entrada:
      totalVeiculosEntrada,

veiculos_entrada: veiculosEntrada
  .filter(item => {
    return (
      item.marca?.trim() ||
      item.modelo?.trim() ||
      item.placa?.trim() ||
      item.renavam?.trim() ||
      item.chassi?.trim() ||
      item.valor_entrada
    )
  })
  .map(item => ({
    ...item,

    ano_modelo: item.ano_modelo
      ? item.ano_modelo
      : null,

    km: item.km
      ? Number(item.km)
      : null,

    valor_entrada:
      Number(
        String(
          item.valor_entrada || 0
        )
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/[^\d.]/g, "")
      ) || 0
  }))
      
  })

  toast.success(
    "Venda registrada"
  )

      queryClient.invalidateQueries({
        queryKey: ["veiculos"],
        exact: false
      })

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        exact: false
      })

      navigate("/app/veiculos")

    } catch (e) {
      console.error(e)

      const msg =
        e.response?.data?.erro ||
        e.message ||
        "Erro ao registrar venda"

      toast.error(msg)
    }
  }

  return (
    <div className="form-page">

      <div className="venda-header-info">
  <h2>Registrar venda</h2>

  {veiculoSelecionado && (
    <div className="veiculo-venda-info">
      <span>
        <strong>Placa:</strong>{" "}
        {veiculoSelecionado.placa || "-"}
      </span>

      <span>
        <strong>Marca:</strong>{" "}
        {veiculoSelecionado.marca || "-"}
      </span>

      <span>
        <strong>Modelo:</strong>{" "}
        {veiculoSelecionado.modelo || "-"}
      </span>
    </div>
  )}
</div>

      <form
        onSubmit={handleSubmit}
        //className="form-grid"
      >

<div className="form-grid">
 <div>
  <label>Nome comprador</label>
  <input
    name="nome"
    value={form.nome}
    onChange={handleChange}
  />
</div>

<div>
  <label>CPF/CNPJ</label>
  <input
    name="cpf"
    value={form.cpf}
    onChange={handleChange}
    style={{ textAlign: "center" }}
  />
</div>

<div>
  <label>Telefone</label>
  <input
    type="text"
    name="telefone"
    value={form.telefone || ""}
    style={{ textAlign: "center" }}
    onChange={(e) => {
      let value = e.target.value.replace(/\D/g, "")
      value = value.slice(0, 11)

      if (value.length > 6) {
        value = value.replace(
          /(\d{2})(\d{5})(\d+)/,
          "($1) $2-$3"
        )
      } else if (value.length > 2) {
        value = value.replace(
          /(\d{2})(\d+)/,
          "($1) $2"
        )
      }

      handleChange({
        target: {
          name: "telefone",
          value
        }
      })
    }}
  />
</div>

<div>
  <label>RG</label>
  <input
    name="rg"
    value={form.rg}
    onChange={handleChange}
    style={{ textAlign: "center" }}
  />
</div>
</div>


{/* =========================
   DADOS COMPLEMENTARES CLIENTE
========================= */}
<div className="form-divider">
  Dados complementares do cliente
</div>


<div className="form-grid2">
<div>
  <label>Data nascimento</label>
  <input
    type="date"
    name="data_nasc"
    value={form.data_nasc}
    onChange={handleChange}
    style={{ textAlign: "center" }}
  />
</div>

<div>
  <label>Profissão</label>
  <input
    name="profissao"
    value={form.profissao}
    onChange={handleChange}
  />
</div>

<div>
  <label>Renda</label>
  <input
    name="renda"
    value={form.renda}
    onChange={handleChange}
    style={{ textAlign: "center" }}
  />
</div>

<div>
  <label>Email</label>
  <input
    name="email"
    value={form.email}
    onChange={handleChange}
  />
</div>
</div>

<div className="form-divider">
  Endereço do cliente
</div>

<div className="form-grid3">

<div>
  <label>Estado</label>

  <select
    name="estado"
    value={form.estado}
    onChange={(e) => {
      handleChange(e)
      buscarCidades(e.target.value)
    }}
  >
    <option value="">
      Selecione
    </option>

{estados.map(estado => (
  <option
    key={estado.sigla}
    value={estado.sigla}
  >
    {estado.nome}
  </option>
))}


  </select>
</div>

<div>
  <label>Cidade</label>

  <select
    name="cidade"
    value={form.cidade}
    onChange={handleChange}
  >
    <option value="">
      Selecione
    </option>

    {cidades.map(cidade => (
      <option
        key={cidade}
        value={cidade}
      >
        {cidade}
      </option>
    ))}
  </select>
</div>

<div>
  <label>CEP</label>

  <input
    name="cep"
    value={form.cep}
onChange={async (e) => {
  let value =
    e.target.value.replace(/\D/g, "")

  value = value.slice(0, 8)

  if (value.length > 5) {
    value = value.replace(
      /(\d{5})(\d+)/,
      "$1-$2"
    )
  }

  handleChange({
    target: {
      name: "cep",
      value
    }
  })

  const cepLimpo =
    value.replace(/\D/g, "")

  if (cepLimpo.length === 8) {
    try {
      const res =
        await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        )

      const data =
        await res.json()

      if (!data.erro) {
        handleChange({
          target: {
            name: "endereco",
            value:
              data.logradouro || ""
          }
        })

        handleChange({
          target: {
            name: "bairro",
            value:
              data.bairro || ""
          }
        })

        handleChange({
          target: {
            name: "cidade",
            value:
              data.localidade || ""
          }
        })

        handleChange({
          target: {
            name: "estado",
            value:
              data.uf || ""
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}}
    style={{
      textAlign: "center"
    }}
  />
</div>

<div>
  <label>Bairro</label>
  <input
    name="bairro"
    value={form.bairro}
    onChange={handleChange}
  />
</div>

</div>

<div className="form-grid4">
<div>
  <label>Endereço</label>
  <input
    name="endereco"
    value={form.endereco}
    onChange={handleChange}
  />
</div>

<div>
  <label>Número</label>
  <input
    name="numero"
    value={form.numero}
    onChange={handleChange}
  />
</div>

<div>
  <label>Complemento</label>
  <input
    name="complemento"
    value={form.complemento}
    onChange={handleChange}
  />
</div>


</div>

<div className="form-divider">
  Dados internos
</div>

<div className="form-grid5">  
<div className="vendedor-field">

  <label>Vendedor *</label>

  <input
    name="vendedor"
    list="lista-vendedores"
    value={form.vendedor}
    onChange={handleChange}
    placeholder="Digite ou selecione o vendedor"
  />

  <datalist id="lista-vendedores">
    {vendedores.map(v => (
      <option key={v.id} value={v.nome} />
    ))}
  </datalist>

</div>

<div className="data-field">
  <label>Data venda</label>
  <input
    type="date"
    name="data"
    value={form.data}
    onChange={handleChange}
    style={{ textAlign: "center" }}
  />
</div>

<div className="valor-field">
  <label>Valor venda</label>
  <input
    type="text"
    name="valor"
    value={form.valor || ""}
    style={{ textAlign: "center" }}
    onChange={(e) => {
      const clean =
        e.target.value.replace(/[^\d.,]/g, "")

      handleChange({
        target: {
          name: "valor",
          value: clean
        }
      })
    }}
  />
</div>

<div className="valor-field">
  <label>Entrada em dinheiro</label>

<input
  type="text"
  name="valor_entrada"
  value={form.valor_entrada || ""}
  style={{ textAlign: "center" }}
  onChange={handleChange}
/>

</div>

  <div className="pagamento-field pagamento-width">
    <label>Forma pagamento</label>
    <select
      name="condicao"
      value={form.condicao}
      onChange={handleChange}
    >
      <option value="A_VISTA">À vista</option>
      <option value="PARCELADO">Parcelado</option>
      <option value="FINANCIADO">Financiado</option>
    </select>
  </div>

{form.condicao !== "A_VISTA" && (
  <div className="parcelas-field parcelas-width">
    <label>Parcelas</label>
    <input
      name="parcelas"
      value={form.parcelas}
      onChange={handleChange}
    />
  </div>
)}

{form.condicao !== "A_VISTA" && (
  <div className="valor-field">
    <label>Valor Parcela</label>
    <input
      type="text"
      name="valor_parcela"
      value={form.valor_parcela || ""}
      style={{ textAlign: "center" }}
      onChange={handleChange}
    />
  </div>
)}

{form.condicao === "FINANCIADO" && (
  <div className="banco-field banco-width">
    <label>Banco financiamento</label>
    <input
      name="banco"
      value={form.banco}
      onChange={handleChange}
    />
  </div>
)}

</div>


<div className="form-full entrada-section">
  <h4>
    Veículos de Entrada
  </h4>

  <button
    type="button"
    className="btn-add-entrada"
    onClick={adicionarEntrada}
  >
    + Adicionar veículo
  </button>
</div>

{veiculosEntrada.map(
  (item, index) => (
    <div
      key={index}
      className="entrada-box form-full"
    >
<div className="entrada-header">
  <h4>
    Veículo Entrada #{index + 1}
  </h4>

  <button
    type="button"
    className="btn-remove-entrada"
    onClick={() =>
      removerEntrada(index)
    }
  >
    🗑 Excluir
  </button>
</div>

<div className="entrada-grid1">

  {/* LINHA 1 */}
  <div>
    <label>Marca</label>
    <input
      value={item.marca}
      onChange={(e) =>
        alterarEntrada(
          index,
          "marca",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Modelo</label>
    <input
      value={item.modelo}
      onChange={(e) =>
        alterarEntrada(
          index,
          "modelo",
          e.target.value
        )
      }
    />
  </div>

  {/* LINHA 2 */}
  <div>
    <label>Tipo</label>

    <input
      list={`tipos-${index}`}
      value={item.tipo}
      onChange={(e) =>
        alterarEntrada(
          index,
          "tipo",
          e.target.value
        )
      }
      placeholder="Selecione ou digite"
    />

    <datalist id={`tipos-${index}`}>
      <option value="CARRO" />
      <option value="MOTO" />
      <option value="LOTE" />
      <option value="CASA" />
    </datalist>
  </div>

  <div>
    <label>Ano Modelo</label>
    <input
      value={item.ano_modelo}
      onChange={(e) =>
        alterarEntrada(
          index,
          "ano_modelo",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Renavam</label>
    <input
      value={item.renavam}
      onChange={(e) =>
        alterarEntrada(
          index,
          "renavam",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Chassi</label>
    <input
      value={item.chassi}
      onChange={(e) =>
        alterarEntrada(
          index,
          "chassi",
          e.target.value
        )
      }
    />
  </div>

  {/* LINHA 3 */}
  <div>
    <label>Placa</label>
    <input
      value={item.placa}
      onChange={(e) =>
        alterarEntrada(
          index,
          "placa",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Cor</label>
    <input
      value={item.cor}
      onChange={(e) =>
        alterarEntrada(
          index,
          "cor",
          e.target.value
        )
      }
    />
  </div>

</div>


<div className="entrada-grid2">
  <div>
    <label>Número Motor</label>
    <input
      value={item.numero_motor}
      onChange={(e) =>
        alterarEntrada(
          index,
          "numero_motor",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Combustível</label>
    <input
      value={item.combustivel}
      onChange={(e) =>
        alterarEntrada(
          index,
          "combustivel",
          e.target.value
        )
      }
    />
  </div>

  {/* LINHA 4 */}
  <div>
    <label>Potência</label>
    <input
      value={item.potencia}
      onChange={(e) =>
        alterarEntrada(
          index,
          "potencia",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>KM</label>
    <input
      value={item.km}
      onChange={(e) =>
        alterarEntrada(
          index,
          "km",
          e.target.value
        )
      }
    />
  </div>

  <div>
    <label>Valor Entrada</label>
    <input
      value={
  typeof item.valor_entrada === "number"
    ? formatarMoeda(
        String(item.valor_entrada)
          .replace(".", "")
      )
    : item.valor_entrada || ""
}
      onChange={(e) =>
        alterarEntrada(
          index,
          "valor_entrada",
          e.target.value
        )
      }
    />
  </div>
  </div>

</div>
  )
)}


{veiculosEntrada.length > 0 && (
  <div className="form-full total-entrada-box">
    <strong>
      Total entrada:{" "}
      {formatarMoeda(
        veiculosEntrada.reduce(
          (total, item) => {
            const valor =
              Number(
                String(
                  item.valor_entrada || 0
                )
                  .replace(/\./g, "")
                  .replace(",", ".")
                  .replace(
                    /[^\d.]/g,
                    ""
                  )
              ) || 0

            return total + valor
          },
          0
        )
      )}
    </strong>
  </div>
)}


        <textarea
          name="obs"
          placeholder="Observações"
          value={form.obs}
          onChange={handleChange}
          className="form-full"
        />

        <div className="form-actions">
          <button disabled={loading}>
            {loading
              ? "Salvando..."
              : "Registrar venda"}
          </button>
        </div>
      </form>
    </div>
  )
}