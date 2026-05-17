import { useEffect }
  from "react"

import api
  from "../api/api"

export default function ModalAceiteTermos({

  aberto,
  pendentes,
  onAceitou

}) {

  /* ===============================
     CONTROLE GLOBAL
  =============================== */

  useEffect(() => {

    if (aberto) {

      document.body.style.overflow =
        "hidden"

      window.onbeforeunload =
        () => true
    }

    return () => {

      document.body.style.overflow =
        "auto"

      window.onbeforeunload =
        null
    }

  }, [aberto])

  if (!aberto) return null

  /* ===============================
     ACEITAR
  =============================== */

  async function aceitar() {

    const confirmou =
      document.getElementById(
        "confirmar-aceite"
      )?.checked

    if (!confirmou) {

      alert(
        "Você precisa confirmar o aceite."
      )

      return
    }

    try {

      for (const termo of pendentes) {

        await api.post(

          "/juridico/aceitar",

          {

            versao:
              termo.versao

          }

        )
      }

      onAceitou()

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao aceitar termos"
      )
    }
  }

  return (

    <div style={{

      position: "fixed",

      inset: 0,

      background:
        "rgba(0,0,0,.6)",

      zIndex: 999999,

      display: "flex",

      alignItems: "center",

      justifyContent: "center"

    }}>

      <div style={{

        width: 600,

        background: "#fff",

        borderRadius: 20,

        padding: 30

      }}>

        <h2>

          📜 Novos Termos

        </h2>

        <p>

          Você precisa aceitar
          os novos termos para
          continuar utilizando
          a plataforma.

        </p>

        <div style={{
          marginTop: 20
        }}>

          {

            pendentes.map(t => (

              <div

                key={t.versao}

                style={{

                  marginBottom: 14,

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "space-between",

                  gap: 20,

                  paddingBottom: 10,

                  borderBottom:
                    "1px solid #e2e8f0"

                }}
              >

                <div>

                  📄 {t.tipo}
                  {" "}
                  v{t.versao}

                </div>

                <a

                  href={
                    `/termos.html?tipo=${t.tipo}`
                  }

                  target="_blank"

                  rel="noreferrer"

                  style={{

                    color: "#2563eb",

                    fontWeight: 600,

                    textDecoration:
                      "none"

                  }}
                >

                  Visualizar

                </a>

              </div>
            ))
          }

        </div>

        <label style={{

          display: "flex",

          gap: 10,

          marginTop: 24,

          alignItems: "flex-start"

        }}>

          <input
            type="checkbox"
            id="confirmar-aceite"
          />

          <span>

            Li e concordo com
            os documentos acima.

          </span>

        </label>

        <button

          onClick={aceitar}

          style={{

            marginTop: 30,

            background:
              "#2563eb",

            color: "#fff",

            border: 0,

            borderRadius: 12,

            padding:
              "12px 20px",

            cursor: "pointer",

            fontWeight: 600

          }}
        >

          Aceitar e continuar

        </button>

      </div>

    </div>
  )
}