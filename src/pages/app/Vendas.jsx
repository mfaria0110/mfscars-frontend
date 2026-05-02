import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../../modules/permissao/usePermissao"
import {
  formatarMoeda,
  limparMoeda
} from "../../utils/moeda"
import "../../components/styles/vendas.css"
import toast from "react-hot-toast"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export default function Vendas() {
  const usuario = useAppStore(
    state => state.usuario
  )

  const { temPermissao } =
    usePermissao()

  const isMaster =
    usuario?.master === true

  const podeVisualizar =
    isMaster ||
    temPermissao("venda.visualizar")

  const podeEditar =
    isMaster ||
    temPermissao("venda.editar")

  const [vendas, setVendas] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [modal, setModal] =
    useState(false)

  const [vendaAtual, setVendaAtual] =
    useState(null)

const [cidades, setCidades] =
  useState([])

  const [busca, setBusca] =
  useState("")

const [paginaAtual, setPaginaAtual] =
  useState(1)

const itensPorPagina = 10

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

  async function carregar() {
    try {
      const res =
        await api.get("/vendas")

      setVendas(
        res.data || []
      )
    } catch (e) {
      toast.error(
        "Erro ao carregar vendas"
      )
    } finally {
      setLoading(false)
    }
  }

async function handleExportar() {
  try {
    const res = await api.get("/vendas/exportar")

    gerarExcel(res.data)

  } catch (e) {
    console.error(e)
    toast.error("Erro ao exportar vendas")
  }
}


  useEffect(() => {
    if (podeVisualizar) {
      carregar()
    }
  }, [])

async function abrirEditar(venda) {
  if (!podeEditar) {
    toast.error("Sem permissão")
    return
  }

  if (venda.status === "CANCELADA") {
    toast.error(
      "Venda cancelada não pode ser alterada"
    )
    return
  }

  try {
    const res = await api.get(
      `/vendas/${venda.id}`
    )

    setVendaAtual(res.data)
    setModal(true)

  } catch (e) {
    toast.error(
      "Erro ao carregar detalhes da venda"
    )
  }
}

  async function salvarEdicao() {
    try {
      await api.put(
        `/vendas/${vendaAtual.id}`,
        vendaAtual
      )

      toast.success(
        "Venda atualizada"
      )

      setModal(false)

      carregar()
    } catch (e) {
      toast.error(
        "Erro ao editar venda"
      )
    }
  }

  if (!podeVisualizar) {
    return (
      <div style={{ padding: 30 }}>
        🚫 Sem permissão
      </div>
    )
  }

  if (loading) {
    return <p>Carregando...</p>
  }

const vendasFiltradas =
  vendas.filter(v => {
    const termo =
      busca.toLowerCase()

    return (
      v.nome_comprador
        ?.toLowerCase()
        .includes(termo) ||

      v.marca
        ?.toLowerCase()
        .includes(termo) ||

      v.modelo
        ?.toLowerCase()
        .includes(termo) ||

      v.placa
        ?.toLowerCase()
        .includes(termo) ||

      String(v.id)
        .includes(termo)
    )
  })

const indiceInicial =
  (paginaAtual - 1) *
  itensPorPagina

const indiceFinal =
  indiceInicial +
  itensPorPagina

const vendasPaginadas =
  vendasFiltradas.slice(
    indiceInicial,
    indiceFinal
  )

const totalPaginas =
  Math.ceil(
    vendasFiltradas.length /
    itensPorPagina
  )

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

function adicionarVeiculoEntradaEdicao() {
  setVendaAtual(prev => ({
    ...prev,
    veiculos_entrada: [
      ...(prev.veiculos_entrada || []),
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
    ]
  }))
}

return (
  <div className="vendas-page">

<div className="vendas-header" style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>

  <h2>💰 Lista de Vendas</h2>

  {(
    usuario?.master ||
    usuario?.tipo === "admin" ||
    usuario?.tipo === "financeiro"
  ) && (
    <button
      className="btn-exportar"
      onClick={handleExportar}
    >
      📊 Exportar Excel
    </button>
  )}

</div>

    {/* CAMPO DE BUSCA */}
<div className="vendas-top-bar">

  <div className="vendas-filtros">
    <input
      type="text"
      placeholder="🔍 Buscar comprador, veículo, placa ou ID..."
      value={busca}
      onChange={(e) => {
        setBusca(e.target.value)
        setPaginaAtual(1)
      }}
    />
  </div>

  <div className="vendas-total">
    Total: {vendasFiltradas.length} venda(s)
  </div>

</div>

    <table className="vendas-table">

  <thead>
    <tr>
      <th>ID</th>
      <th>Placa</th>
      <th>Comprador</th>
      <th>Telefone</th>
      <th>Veículo</th>
      <th>Valor</th>
      <th>Data Venda</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>

  <tbody>
  {vendasPaginadas.map(v => (
      <tr key={v.id}>
        <td>{v.id}</td>

        <td>{v.placa || "-"}</td>

        <td>
          {v.nome_comprador || "-"}
        </td>

        <td>
          {v.telefone_comprador || "-"}
        </td>

        <td>
          {v.marca} / {v.modelo}
        </td>

        <td>
          {Number(
            v.valor_venda || 0
          ).toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL"
            }
          )}
        </td>

        <td>
          {new Date(
            v.data_venda
          ).toLocaleDateString(
            "pt-BR"
          )}
        </td>

        <td>{v.status}</td>

        <td>
          {podeEditar &&
            v.status !== "CANCELADA" && (
              <button
                className="btn-edit-sale"
                onClick={() => abrirEditar(v)}
              >
                ✏️
              </button>
          )}

{v.status !== "CANCELADA" && (
  <button
    className="btn-contract-sale"
    title="Gerar contrato"
    onClick={async () => {
      try {
        

const response = await api.get(
  `/vendas/${v.id}/contrato-pdf`,
  {
    responseType: "blob"
  }
)
        const file = new Blob(
          [response.data],
          {
            type:
              "application/pdf"
          }
        )

const fileURL = URL.createObjectURL(file)

window.open(fileURL, "_blank")

setTimeout(() => {
  URL.revokeObjectURL(fileURL)
}, 1000)

      } catch (e) {
        console.log(e)

        toast.error(
          "Erro ao gerar contrato"
        )
      }
    }}
  >
    📄 Contrato
  </button>
)}
          
        </td>
      </tr>
    ))}


  </tbody>
</table>

<div className="paginacao-container">

  <div className="paginacao-info">
    Mostrando {indiceInicial + 1} até{" "}
    {Math.min(
      indiceFinal,
      vendasFiltradas.length
    )} de{" "}
    {vendasFiltradas.length} registros
  </div>

  <div className="paginacao-vendas">
    <button
      disabled={paginaAtual === 1}
      onClick={() =>
        setPaginaAtual(
          paginaAtual - 1
        )
      }
    >
      ← Anterior
    </button>

    <span>
      Página {paginaAtual} de {totalPaginas || 1}
    </span>

    <button
      disabled={
        paginaAtual === totalPaginas ||
        totalPaginas === 0
      }
      onClick={() =>
        setPaginaAtual(
          paginaAtual + 1
        )
      }
    >
      Próxima →
    </button>
  </div>

</div>

{modal && vendaAtual && (
  <div className="modal">
    <div className="modal-content1 venda-modal">

      <div className="modal-header">
        
        <div>
  <h3>
    ✏️ Editar Venda #{vendaAtual.id}
  </h3>

  <div className="veiculo-venda-info">
    <span>
      <strong>Placa:</strong>{" "}
      {vendaAtual.placa || "-"}
    </span>

    <span>
      <strong>Marca:</strong>{" "}
      {vendaAtual.marca || "-"}
    </span>

    <span>
      <strong>Modelo:</strong>{" "}
      {vendaAtual.modelo || "-"}
    </span>

    <span>
      <strong>Ano:</strong>{" "}
      {vendaAtual.ano_modelo || "-"}
    </span>
  </div>
</div>

        <button
          className="modal-close"
          onClick={() => setModal(false)}
        >
          ✕
        </button>
      </div>

<div className="venda-form-container">

  {/* DADOS PRINCIPAIS */}
  <div className="venda-grid-top">

    <div className="form-group">
      <label>Nome comprador</label>
      <input
        value={vendaAtual.nome_comprador || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            nome_comprador:
  e.target.value.toUpperCase()
          })
        }
      />
    </div>

    <div className="form-group center-field">
      <label>CPF/CNPJ</label>
<input
  value={vendaAtual.cpf_comprador || ""}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length <= 11) {
      // CPF
      value = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
      // CNPJ
      value = value
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
    }

    setVendaAtual({
      ...vendaAtual,
      cpf_comprador: value
    })
  }}
/>
    </div>

    <div className="form-group center-field">
      <label>Telefone</label>
<input
  value={vendaAtual.telefone_comprador || ""}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, "")

    value = value.slice(0, 11)

    if (value.length > 10) {
      value = value.replace(
        /(\d{2})(\d{5})(\d+)/,
        "($1) $2-$3"
      )
    } else if (value.length > 6) {
      value = value.replace(
        /(\d{2})(\d{4})(\d+)/,
        "($1) $2-$3"
      )
    } else if (value.length > 2) {
      value = value.replace(
        /(\d{2})(\d+)/,
        "($1) $2"
      )
    }

    setVendaAtual({
      ...vendaAtual,
      telefone_comprador: value
    })
  }}
/>
    </div>

    <div className="form-group center-field">
      <label>RG</label>
      <input
        value={vendaAtual.rg_comprador || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            rg_comprador: e.target.value
          })
        }
      />
    </div>

  </div>

  {/* DADOS COMPLEMENTARES */}
  <div className="venda-grid-middle">

    <div className="form-group center-field">
      <label>Data nascimento</label>
      <input
        type="date"
        value={
          vendaAtual.data_nasc
            ? vendaAtual.data_nasc.split("T")[0]
            : ""
        }
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            data_nasc: e.target.value
          })
        }
      />
    </div>

    <div className="form-group">
      <label>Profissão</label>
      <input
        value={vendaAtual.profissao || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            profissao: e.target.value
          })
        }
      />
    </div>

    <div className="form-group center-field">
      <label>Renda</label>
<input
  value={
    vendaAtual.renda
      ? formatarMoeda(
          vendaAtual.renda
        )
      : ""
  }
  onChange={(e) => {
    const valor =
      e.target.value

    setVendaAtual({
      ...vendaAtual,
      renda: valor
        ? limparMoeda(valor)
        : ""
    })
  }}
/>
    </div>

    <div className="form-group">
      <label>Email</label>
      <input
        value={vendaAtual.email || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            email: e.target.value
          })
        }
      />
    </div>

  </div>

  {/* ENDEREÇO */}
  <div className="venda-grid-address">

    <div className="form-group">
      <label>Estado</label>
<select
  value={vendaAtual.estado || ""}
  onChange={(e) => {
    const uf = e.target.value

    setVendaAtual({
      ...vendaAtual,
      estado: uf,
      cidade: ""
    })

    buscarCidades(uf)
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

    <div className="form-group">
      <label>Cidade</label>
<select
  value={vendaAtual.cidade || ""}
  onChange={(e) =>
    setVendaAtual({
      ...vendaAtual,
      cidade: e.target.value
    })
  }
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



    <div className="form-group center-field">
      <label>CEP</label>
<input
  value={vendaAtual.cep || ""}
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

    setVendaAtual({
      ...vendaAtual,
      cep: value
    })

    const cepLimpo =
      value.replace(/\D/g, "")

    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        )

        const data =
          await res.json()

        if (!data.erro) {
          setVendaAtual(prev => ({
            ...prev,
            cep: value,
            endereco:
              data.logradouro || "",
            bairro:
              data.bairro || "",
            cidade:
              data.localidade || "",
            estado:
              data.uf || ""
          }))

          buscarCidades(
            data.uf
          )
        }
      } catch (e) {
        console.error(e)
      }
    }
  }}
/>
    </div>

    <div className="form-group">
      <label>Bairro</label>
      <input
        value={vendaAtual.bairro || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            bairro: e.target.value
          })
        }
      />
    </div>
    

  </div>

  {/* ENDEREÇO 2 */}
  <div className="venda-grid-address2">

    <div className="form-group">
      <label>Endereço</label>
      <input
        value={vendaAtual.endereco || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            endereco: e.target.value
          })
        }
      />
    </div>

    <div className="form-group center-field">
      <label>Número</label>
      <input
        value={vendaAtual.numero || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            numero: e.target.value
          })
        }
      />
    </div>

    <div className="form-group">
      <label>Complemento</label>
      <input
        value={vendaAtual.complemento || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            complemento: e.target.value
          })
        }
      />
    </div>

  </div>

  {/* VENDA */}
  <div className="venda-grid-bottom">

    <div className="form-group">
      <label>Vendedor</label>
      <input
        value={vendaAtual.vendedor || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            vendedor: e.target.value
          })
        }
      />
    </div>

    <div className="form-group center-field">
      <label>Data venda</label>
      <input
        type="date"
        value={
          vendaAtual.data_venda
            ? vendaAtual.data_venda.split("T")[0]
            : ""
        }
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            data_venda: e.target.value
          })
        }
      />
    </div>

    <div className="form-group center-field">
      <label>Valor venda</label>
<input
  value={
    vendaAtual.valor_venda
      ? formatarMoeda(
          vendaAtual.valor_venda
        )
      : ""
  }
  onChange={(e) => {
    const valor =
      e.target.value

    setVendaAtual({
      ...vendaAtual,
      valor_venda: valor
        ? limparMoeda(valor)
        : ""
    })
  }}
/>
    </div>


<div className="form-group center-field">
  <label>Entrada em dinheiro</label>

  <input
    value={
      vendaAtual.valor_entrada
        ? formatarMoeda(
            vendaAtual.valor_entrada
          )
        : ""
    }
    onChange={(e) => {
      const valor =
        e.target.value

      setVendaAtual({
        ...vendaAtual,
        valor_entrada: valor
          ? limparMoeda(valor)
          : ""
      })
    }}
  />
</div>


  </div>

  {/* PAGAMENTO */}
  <div className="venda-grid-payment">

    <div className="form-group">
      <label>Pagamento</label>
      <select
        value={
          vendaAtual.condicao_pagamento || ""
        }
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            condicao_pagamento:
              e.target.value
          })
        }
      >
        <option value="A_VISTA">
          À vista
        </option>
        <option value="PARCELADO">
          Parcelado
        </option>
        <option value="FINANCIADO">
          Financiado
        </option>
      </select>
    </div>

    {vendaAtual.condicao_pagamento !== "A_VISTA" && (
  <div className="form-group center-field">
      <label>Parcelas</label>
      <input
        value={vendaAtual.parcelas || ""}
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            parcelas: e.target.value
          })
        }
      />
  </div>
)}

    {vendaAtual.condicao_pagamento !== "A_VISTA" && (
  <div className="form-group center-field">
    <label>Valor Parcela</label>

    <input
      value={
        vendaAtual.valor_parcela
          ? formatarMoeda(
              vendaAtual.valor_parcela
            )
          : ""
      }
      onChange={(e) => {
        const valor =
          e.target.value

        setVendaAtual({
          ...vendaAtual,
          valor_parcela: valor
            ? limparMoeda(valor)
            : ""
        })
      }}
    />
  </div>
)}

    <div className="form-group">
      <label>Banco</label>
      <input
        value={
          vendaAtual.banco_financiamento || ""
        }
        onChange={(e) =>
          setVendaAtual({
            ...vendaAtual,
            banco_financiamento:
              e.target.value
          })
        }
      />
    </div>
  </div>

{/* VEÍCULOS DE ENTRADA */}
<div className="form-full">

  <div className="form-divider">
    Veículos de Entrada
  </div>

  <button
    type="button"
    className="btn-add-entrada"
    onClick={adicionarVeiculoEntradaEdicao}
    style={{
      marginBottom: "20px"
    }}
  >
    + Adicionar veículo
  </button>

  {vendaAtual.veiculos_entrada?.length > 0 &&
    vendaAtual.veiculos_entrada.map(
      (item, index) => (
        <div
          key={index}
          className="entrada-box"
        >
          <div className="entrada-header">
            <h4>
              Veículo Entrada #{index + 1}
            </h4>

            <button
              type="button"
              className="btn-remove-entrada"
              onClick={() => {
                const novas =
                  vendaAtual.veiculos_entrada.filter(
                    (_, i) => i !== index
                  )

                setVendaAtual({
                  ...vendaAtual,
                  veiculos_entrada: novas
                })
              }}
            >
              🗑 Remover
            </button>
          </div>

          {/* linha 1 */}
          <div className="entrada-grid1">

            <div>
              <label>Marca</label>
              <input
                value={item.marca || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].marca =
                    e.target.value.toUpperCase()

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Modelo</label>
              <input
                value={item.modelo || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].modelo =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Tipo</label>
              <input
                value={item.tipo || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].tipo =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Ano Modelo</label>
              <input
                value={item.ano_modelo || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].ano_modelo =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Renavam</label>
              <input
                value={item.renavam || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].renavam =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Chassi</label>
              <input
                value={item.chassi || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].chassi =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Placa</label>
              <input
                value={item.placa || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].placa =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Cor</label>
              <input
                value={item.cor || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].cor =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

          </div>

          {/* linha 2 */}
          <div className="entrada-grid2">

            <div>
              <label>Número Motor</label>
              <input
                value={item.numero_motor || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].numero_motor =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Combustível</label>
              <input
                value={item.combustivel || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].combustivel =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Potência</label>
              <input
                value={item.potencia || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].potencia =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>KM</label>
              <input
                value={item.km || ""}
                onChange={(e) => {
                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].km =
                    e.target.value

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

            <div>
              <label>Valor Entrada</label>
              <input
                value={
                  item.valor_entrada
                    ? formatarMoeda(
                        item.valor_entrada
                      )
                    : ""
                }
                onChange={(e) => {
                  const valor =
                    e.target.value

                  const novas = [
                    ...vendaAtual.veiculos_entrada
                  ]

                  novas[index].valor_entrada =
                    valor
                      ? limparMoeda(valor)
                      : ""

                  setVendaAtual({
                    ...vendaAtual,
                    veiculos_entrada: novas
                  })
                }}
              />
            </div>

          </div>
        </div>
      )
    )}
</div>

  <div className="form-group">
    <label>Observações</label>
    <textarea
      rows="4"
      value={
        vendaAtual.observacoes || ""
      }
      onChange={(e) =>
        setVendaAtual({
          ...vendaAtual,
          observacoes:
            e.target.value
        })
      }
    />
  </div>

</div>

      <div className="venda-actions">
        <button onClick={salvarEdicao}>
          Salvar
        </button>

        <button
          onClick={() => setModal(false)}
        >
          Fechar
        </button>
      </div>

    </div>
  </div>
)}

    </div>

  )
}

// 👇👇👇 COLE AQUI (FORA DO COMPONENTE)

function gerarExcel(dados) {
  if (!dados || dados.length === 0) {
    toast.error("Nenhuma venda para exportar")
    return
  }

const lista = dados.map(v => ({
  ID: v.id,
  Data: new Date(v.data_venda).toLocaleDateString("pt-BR"),

  Empresa: v.empresa,
  Loja: v.loja,

  Cliente: v.nome_comprador,
  Veículo: `${v.marca} ${v.modelo}`,
  Placa: v.placa,

  "Valor Venda": Number(v.valor_venda || 0),
  "Valor Entrada": Number(v.valor_entrada || 0),
  "Valor Veículo Entrada": Number(v.valor_veiculo_entrada || 0),
  "Valor Financiado": Number(v.valor_financiado || 0),
  "Valor Parcela": Number(v.valor_parcela || 0),

  "Forma Pagamento": v.condicao_pagamento,
  Banco: v.banco_financiamento,
  Parcelas: v.parcelas,

  Vendedor: v.vendedor,
  Status: v.status
}))
  const ws = XLSX.utils.json_to_sheet(lista)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, "Vendas")

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array"
  })

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream"
  })

  saveAs(blob, "vendas.xlsx")
}