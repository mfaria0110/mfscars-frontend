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

export default function Financeiro() {

  const [resumo, setResumo] =
    useState(null)

  const [cobrancas, setCobrancas] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const usuario =
  JSON.parse(
    localStorage.getItem(
      "usuario"
    )
  )

  if (

  !usuario?.master &&

  usuario?.tipo !== "admin"

) {

  return (

    <div style={{
      padding: 24
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

  }, [])

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
          "/financeiro/cobrancas"
        )

      ])

      setResumo(
        resumoRes.data
      )

      setCobrancas(
        cobrancasRes.data || []
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
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8
        }}>
          Financeiro
        </h1>

        <p style={{
          color: "#64748b"
        }}>
          Gestão financeira do SaaS
        </p>

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