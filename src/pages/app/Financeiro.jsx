import {
  useEffect,
  useState
} from "react"

import api from "../../api/api"

import {
  DollarSign,
  Wallet,
  Clock3,
  CreditCard
} from "lucide-react"

import { useAppStore } from "../../store/useAppStore"

export default function Financeiro() {

  const [resumo, setResumo] =
    useState(null)

  const [cobrancas, setCobrancas] =
    useState([])

  const [loading, setLoading] =
    useState(true)

{/* =====================
    FILTROS
===================== */}

const [page, setPage] =
  useState(1)

const [pages, setPages] =
  useState(1)

const [status, setStatus] =
  useState("")

const [loja, setLoja] =
  useState("")

const [plano, setPlano] =
  useState("")

const [dataInicio, setDataInicio] =
  useState("")

const [dataFim, setDataFim] =
  useState("")


  const usuario = useAppStore(
    state => state.usuario
  )

  const campoStyle = {

  width: "100%",

  padding: 12,

  borderRadius: 12,

  border: "1px solid #cbd5e1",

  background: "#fff",

  fontSize: 15,

  outline: "none"
}

  if (

  !usuario?.master &&

  usuario?.tipo !== "admin"

) {

  return (

    <div style={{

      padding: "16px 24px 24px",
      maxWidth: 1600,
      margin: "0 auto"
    }}>

      Sem permissão

    </div>
  )
}

  /* =========================
     LOAD
  ========================= */

useEffect(() => {

  carregar()

}, [

  page,

  status,

  loja,

  plano,

  dataInicio,

  dataFim

])
  /* =========================
     API
  ========================= */

  async function carregar() {

    try {

      setLoading(true)

      const [

        resumoRes,

        cobrancasRes

      ] = await Promise.all([

        api.get(
          "/financeiro/resumo"
        ),

        api.get(
          "/financeiro/cobrancas",
          {
            params: {

              page,

              limit: 20,

              status:
                status || null,

              loja:
                loja || null,

              plano:
                plano || null,

              dataInicio:
                dataInicio || null,

              dataFim:
                dataFim || null
            }
          }
        )

      ])

      setResumo(
        resumoRes.data
      )

      setCobrancas(
        cobrancasRes.data.items || []
      )

      setPages(
        cobrancasRes.data.pages || 1
      )

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao carregar financeiro"
      )

    } finally {

      setLoading(false)
    }
  }

  /* =========================
     HELPERS
  ========================= */

  function moeda(valor) {

    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    )
  }

  function data(data) {

    if (!data) return "-"

    return new Date(
      data
    ).toLocaleString(
      "pt-BR",
      {
        timeZone:
          "America/Sao_Paulo"
      }
    )
  }

  function corStatus(status) {

    switch (status) {

      case "pago":
        return "#16a34a"

      case "pendente":
        return "#f59e0b"

      case "cancelado":
        return "#dc2626"

      case "expirado":
        return "#6b7280"

      default:
        return "#64748b"
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div style={{
        padding: 24
      }}>
        Carregando financeiro...
      </div>
    )
  }

  /* =========================
     RENDER
  ========================= */

  return (

    <div style={{
      padding: 24
    }}>

      {/* =====================
          HEADER
      ====================== */}

      <div style={{
        marginBottom: 28
      }}>

      <h1 style={{
        margin: 0,
        fontSize: 32,
        fontWeight: 800,
        color: "#0f172a"
      }}>

        Financeiro

      </h1>

      <p style={{
        marginTop: 8,
        marginBottom: 24,
        color: "#64748b",
        fontSize: 18
      }}>

        Gestão financeira do SaaS

      </p>

      </div>

      {/* =====================
          FILTROS
      ===================== */}
      <div style={{

      display: "grid",

      gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",

      gap: 16,

      marginBottom: 28,

      background: "#fff",

      padding: 20,

      borderRadius: 18,

      boxShadow:
        "0 4px 20px rgba(0,0,0,0.06)"

    }}>

      {/* STATUS */}

      <select

        value={status}

        onChange={e => {

          setPage(1)

          setStatus(
            e.target.value
          )
        }}

        style={campoStyle}

      >

        <option value="">
          Todos Status
        </option>

        <option value="pago">
          Pago
        </option>

        <option value="pendente">
          Pendente
        </option>

        <option value="cancelado">
          Cancelado
        </option>

      </select>

      {/* LOJA */}

      <input

        placeholder="Filtrar loja"

        value={loja}

        onChange={e => {

          setPage(1)

          setLoja(
            e.target.value
          )
        }}

        style={campoStyle}

      />

      {/* PLANO */}

      <input

        placeholder="Filtrar plano"

        value={plano}

        onChange={e => {

          setPage(1)

          setPlano(
            e.target.value
          )
        }}

        style={campoStyle}

      />

      {/* DATA INICIAL */}

      <input

        type="date"

        value={dataInicio}

        onChange={e => {

          setPage(1)

          setDataInicio(
            e.target.value
          )
        }}

        style={campoStyle}

      />

      {/* DATA FINAL */}

      <input

        type="date"

        value={dataFim}

        onChange={e => {

          setPage(1)

          setDataFim(
            e.target.value
          )
        }}

        style={campoStyle}

      />

    </div>


      {/* =====================
          CARDS
      ====================== */}

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 18,
        marginBottom: 28
      }}>

        <Card
          titulo="Faturamento Total"
          valor={moeda(
            resumo?.faturamento_total
          )}
          icon={<DollarSign size={20} />}
        />

        <Card
          titulo="Faturamento Mês"
          valor={moeda(
            resumo?.faturamento_mes
          )}
          icon={<Wallet size={20} />}
        />

        <Card
          titulo="Pagamentos Hoje"
          valor={
            resumo?.pagamentos_hoje || 0
          }
          icon={<CreditCard size={20} />}
        />

        <Card
          titulo="PIX Pendentes"
          valor={
            resumo?.pix_pendentes || 0
          }
          icon={<Clock3 size={20} />}
        />

      </div>

      {/* =====================
          TABELA
      ====================== */}

      <div style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        border:
          "1px solid #e2e8f0"
      }}>

        <div style={{
          padding: 18,
          borderBottom:
            "1px solid #e2e8f0",
          fontWeight: 600
        }}>
          Últimas cobranças
        </div>

        <div style={{
          overflowX: "auto"
        }}>

          <table style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}>

            <thead>

              <tr style={{
                background: "#f8fafc"
              }}>

                <Th>Loja</Th>

                <Th>Plano</Th>

                <Th>Valor</Th>

                <Th>Status</Th>

                <Th>Gateway</Th>

                <Th>Data</Th>

              </tr>

            </thead>

            <tbody>

              {cobrancas.map(
                cobranca => (

                <tr
                  key={cobranca.id}
                  style={{
                    borderBottom:
                      "1px solid #f1f5f9"
                  }}
                >

                  <Td>
                    {cobranca.loja}
                  </Td>

                  <Td>
                    {cobranca.plano}
                  </Td>

                  <Td>
                    {moeda(
                      cobranca.valor
                    )}
                  </Td>

                  <Td>

                    <span style={{

                      background:
                        corStatus(
                          cobranca.status
                        ),

                      color: "#fff",

                      padding:
                        "4px 10px",

                      borderRadius: 999,

                      fontSize: 12,

                      fontWeight: 600,

                      textTransform:
                        "uppercase"
                    }}>

                      {cobranca.status}

                    </span>

                  </Td>

                  <Td>
                    {cobranca.gateway}
                  </Td>

                  <Td>
                    {data(
                      cobranca.criado_em
                    )}
                  </Td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <div style={{

  display: "flex",

  justifyContent: "center",

  gap: 12,

  padding: 20

}}>

  <button

    disabled={page <= 1}

    onClick={() =>
      setPage(prev =>
        prev - 1
      )
    }

  >
    Anterior
  </button>

  <span>

    Página {page} de {pages}

  </span>

  <button

    disabled={page >= pages}

    onClick={() =>
      setPage(prev =>
        prev + 1
      )
    }

  >
    Próxima
  </button>

</div>

    </div>
  )
}

/* =========================
   CARD
========================= */

function Card({

  titulo,

  valor,

  icon

}) {

  return (

    <div style={{

      background: "#fff",

      border:
        "1px solid #e2e8f0",

      borderRadius: 18,

      padding: 18

    }}>

      <div style={{

        display: "flex",

        alignItems: "center",

        justifyContent:
          "space-between",

        marginBottom: 12

      }}>

        <span style={{

          color: "#64748b",

          fontSize: 14

        }}>

          {titulo}

        </span>

        {icon}

      </div>

      <div style={{

        fontSize: 26,

        fontWeight: 700

      }}>

        {valor}

      </div>

    </div>
  )
}

/* =========================
   TABLE
========================= */

function Th({ children }) {

  return (

    <th style={{

      textAlign: "left",

      padding: 14,

      fontSize: 13,

      color: "#64748b"

    }}>

      {children}

    </th>
  )
}

function Td({ children }) {

  return (

    <td style={{

      padding: 14,

      fontSize: 14

    }}>

      {children}

    </td>
  )
}