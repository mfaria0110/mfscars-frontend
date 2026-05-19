import { usePlano } from "../../modules/plano/usePlano"

export default function Assinatura() {

const {

  planoAtual,
  planos,
  loading,
  founders,

  handleAssinar,
  pixData,
  showPixModal,
  setShowPixModal

} = usePlano()

  const usados =
    planoAtual?.usados || 0

  const limite =
    planoAtual?.limite_veiculos || 0

const lojasUsadas =
  planoAtual?.usados_lojas || 0

const lojasLimite =
  planoAtual?.limite_lojas || 0

const vendedoresUsados =
  planoAtual?.usados_vendedores || 0

const vendedoresLimite =
  planoAtual?.limite_vendedores


  const porcentagem =
    limite > 0
      ? Math.min(
          (usados / limite) * 100,
          100
        )
      : 0

  const status =
    String(
      planoAtual?.status || ""
    ).toUpperCase()

  const statusColor =
    status === "ATIVO"
      ? "#16a34a"
      : status === "INADIMPLENTE"
      ? "#dc2626"
      : "#f59e0b"

  /* =========================
     COPIAR PIX
  ========================= */

  async function copiarPix() {

    try {

      await navigator.clipboard.writeText(
        pixData?.copiaecola || ""
      )

      alert(
        "PIX copiado!"
      )

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao copiar PIX"
      )
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: 24
      }}>
        Carregando assinatura...
      </div>
    )
  }

  return (

    <div style={{
      padding: 24
    }}>


<div
  style={{
    marginBottom: 28
  }}
>

  <h1
    style={{
      fontSize: 38,
      fontWeight: 800,
      marginBottom: 12
    }}
  >
    Escolha o plano ideal
  </h1>

  <p
    style={{
      opacity: 0.7,
      fontSize: 18
    }}
  >
    Cresça sua operação com CRM,
    estoque, leads e multi lojas.
  </p>

</div>

      {/* =========================
          PLANO ATUAL
      ========================= */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 100%)",

          borderRadius: 24,
          padding: 18,
          color: "#fff",
          marginBottom: 32,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.25)"
        }}
      >

        <h1
          style={{
            fontSize: 22,
            marginBottom: 24
          }}
        >
          Plano Atual
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",

            gap: 24
          }}
        >

          <div>

            <div
              style={{
                opacity: 0.7,
                marginBottom: 6
              }}
            >
              Plano
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: "700"
              }}
            >
              {planoAtual?.nome || "-"}
            </div>

          </div>

          <div>

            <div
              style={{
                opacity: 0.7,
                marginBottom: 6
              }}
            >
              Status
            </div>

            <div
              style={{
                color: statusColor,
                fontWeight: "700",
                fontSize: 16
              }}
            >
              {status || "-"}
            </div>

          </div>

          <div>

            <div
              style={{
                opacity: 0.7,
                marginBottom: 6
              }}
            >
              Valor Mensal
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: "700"
              }}
            >
              R$ {planoAtual?.preco || "0.00"}
            </div>

          </div>

        </div>

{planoAtual?.nome !== "FREE" && (

  <div
    style={{
      marginBottom: 18,
      color: "#6ee7b7",
      fontSize: 13,
      fontWeight: "700"
    }}
  >
    🔥 30% OFF vitalício
  </div>

)}

        {/* =========================
            CONSUMO
        ========================= */}

        <div
          style={{
            marginTop: 16
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",

              marginBottom: 10,

              fontSize: 14
            }}
          >

            <span>
              Consumo
            </span>

            <strong>
              {usados} / {limite} veículos
            </strong>

          </div>

          <div
            style={{
              width: "100%",
              height: 6,
              background: "#1e293b",
              borderRadius: 999,
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width:
                  `${porcentagem}%`,

                height: "100%",

                background:
                  porcentagem >= 90
                    ? "#dc2626"
                    : porcentagem >= 70
                    ? "#f59e0b"
                    : "#2563eb",

                transition:
                  "0.3s ease"
              }}
            />

          </div>

        </div>

{/* =========================
    RESUMO USO
========================= */}

<div
  style={{
    marginTop: 24,

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px,1fr))",

    gap: 16
  }}
>

  {/* LOJAS */}

  <div
    style={{
      background: "#111827",

      borderRadius: 16,

      padding: 16
    }}
  >

    <div
      style={{
        opacity: 0.7,
        marginBottom: 8
      }}
    >
      🏪 Lojas
    </div>

    <div
      style={{
        fontSize: 24,
        fontWeight: 700
      }}
    >
      {

        planoAtual?.usados_lojas || 0

      }

      {" / "}

      {

        planoAtual?.limite_lojas === null

          ? "∞"

          : planoAtual?.limite_lojas || 0
      }
    </div>

  </div>

  {/* VENDEDORES */}

  <div
    style={{
      background: "#111827",

      borderRadius: 16,

      padding: 16
    }}
  >

    <div
      style={{
        opacity: 0.7,
        marginBottom: 8
      }}
    >
      👥 Vendedores
    </div>

    <div
      style={{
        fontSize: 24,
        fontWeight: 700
      }}
    >
      {

        planoAtual?.usados_vendedores || 0

      }

      {" / "}

      {

        planoAtual?.limite_vendedores === null

          ? "∞"

          : planoAtual?.limite_vendedores || 0
      }
    </div>

  </div>

</div>

      </div>


{founders && (

  <div
    style={{

      marginBottom: 28,

      background:
        "linear-gradient(135deg,#065f46,#064e3b)",

      color: "#fff",

      borderRadius: 20,

      padding: 20,

      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      flexWrap: "wrap",

      gap: 16
    }}
  >

    <div>

      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 8
        }}
      >
        🔥 Oferta Founders
      </div>

      <div
        style={{
          opacity: 0.9
        }}
      >
        Garanta 30% OFF vitalício
        nos planos pagos.
      </div>

    </div>

    <div
      style={{
        fontSize: 28,
        fontWeight: 800
      }}
    >
      {founders.restantes}
      {" "}
      vagas restantes
    </div>

  </div>

)}


      {/* =========================
          PLANOS DISPONÍVEIS
      ========================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: 24
        }}
      >

        {Array.isArray(planos) &&
          planos.map(plano => {

            const isAtual =
              Number(plano.id) ===
              Number(planoAtual?.plano_id)

            const isFree =
              Number(plano.preco) < 0.5

            const usuario =
            JSON.parse(
              sessionStorage.getItem(
                "usuario"
              ) || "{}"
            )

            const isMaster =
              usuario?.master === true

return (

  <div
    key={plano.id}

    style={{

      background:

        plano.nome === "PREMIUM"

          ? "linear-gradient(135deg,#312e81,#1e1b4b)"

          : "linear-gradient(135deg,#111827,#1e293b)",

      borderRadius: 20,

      padding: 18,

      color: "#fff",

      border:
        isAtual
          ? "2px solid #2563eb"
          : "2px solid transparent",

      position: "relative",

      boxShadow:
        "0 8px 24px rgba(0,0,0,0.15)"
    }}
  >

    {plano.nome === "BUSINESS" && (

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "#16a34a",
          padding: "5px 12px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: "700"
        }}
      >
        MAIS POPULAR
      </div>

    )}

                <h2
                  style={{
                    fontSize: 25,
                    marginBottom: 15
                  }}
                >
                  {plano.nome}
                </h2>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    marginBottom: 12
                  }}
                >
                  R$ {plano.preco}
                </div>

<div
  style={{
    opacity: 0.9,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 1.8
  }}
>

  <div>
    🚗 {plano.limite_veiculos} veículos
  </div>

  <div>
    🏪 {plano.limite_lojas || "∞"} lojas
  </div>

  <div>
    👥 {

      plano.limite_vendedores === null

        ? "Vendedores ilimitados"

        : `${plano.limite_vendedores} vendedores por loja`
    }
  </div>

</div>

                <button

                  onClick={() => {

                    if (!isAtual) {

                      handleAssinar(
                        plano
                      )
                    }
                  }}

                  disabled={
                    isAtual ||

                    (
                      isFree &&
                      !isMaster
                    )
                  }

                  style={{

                    width: "100%",
                    padding: 10,
                    borderRadius: 14,
                    border: 0,

                    cursor:

                      isAtual ||

                      (
                        isFree &&
                        !isMaster
                      )

                        ? "default"
                        : "pointer",

                    fontSize: 16,
                    fontWeight: "700",

                    background:

                      isAtual ||

                      (
                        isFree &&
                        !isMaster
                      )

                        ? "#334155"
                        : "#2563eb",

                    opacity:

                      isAtual ||

                      (
                        isFree &&
                        !isMaster
                      )

                        ? 0.7
                        : 1,

                    color: "#fff"
                  }}
                >

                  {

                    isAtual

                      ? "Plano Atual"

                      : (

                          isFree &&
                          !isMaster

                        )

                          ? "Plano Gratuito"

                          : "Escolher Plano"
                  }

                </button>


              </div>
            )
          })
        }

      </div>

      {/* =========================
          MODAL PIX
      ========================= */}

      {showPixModal && (

        <div
          style={{

            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: window.innerWidth < 768
            ? 16
            : 24
          }}
        >

          <div
            style={{

              width: "100%",
              maxWidth: 520,
              background:
                "#0f172a",
              borderRadius: 24,
              padding: 32,
              color: "#fff",
              textAlign: "center",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.4)"
            }}
          >




            <h2
              style={{
                fontSize: 32,
                marginBottom: 24
              }}
            >
              Pagamento PIX
            </h2>

            {/* =====================
                QR CODE
            ===================== */}

            {pixData?.qr_code && (

              <img
                src={
                  `data:image/png;base64,${pixData.qr_code}`
                }

                alt="PIX"

                style={{

                  width: 260,
                  height: 260,
                  background: "#fff",
                  padding: 12,
                  borderRadius: 16,
                  marginBottom: 24
                }}
              />

            )}

            {/* =====================
                PIX COPIA E COLA
            ===================== */}

            <textarea

              readOnly

              value={
                pixData?.copiaecola || ""
              }

              style={{

                width: "100%",
                minHeight: 120,
                borderRadius: 14,
                padding: 16,
                border: 0,
                resize: "none",
                marginBottom: 18,
                background: "#1e293b",
                color: "#fff",
                fontSize: 14
              }}
            />

            {/* =====================
                BOTÕES
            ===================== */}

            <div
              style={{

                display: "flex",
                gap: 12
              }}
            >

              <button

                onClick={copiarPix}

                style={{

                  flex: 1,
                  padding: 14,
                  borderRadius: 14,
                  border: 0,
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Copiar PIX
              </button>

              <button

                onClick={() =>
                  setShowPixModal(false)
                }

                style={{

                  flex: 1,
                  padding: 14,
                  borderRadius: 14,
                  border: 0,
                  background: "#334155",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Fechar
              </button>

            </div>

            {/* =====================
                STATUS
            ===================== */}

            <div
              style={{

                marginTop: 24,
                opacity: 0.7,
                fontSize: 14
              }}
            >
              Aguardando confirmação automática do pagamento...
            </div>

          </div>

        </div>
      )}

    </div>
  )
}