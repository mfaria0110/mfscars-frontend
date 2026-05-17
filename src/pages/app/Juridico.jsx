import { useEffect, useState } from "react"

import api from "../../api/api"

export default function Juridico() {

  const [termos, setTermos] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  async function carregar() {

    try {

      const res =
        await api.get("/juridico")

      setTermos(
        res.data || []
      )

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao carregar termos"
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    carregar()

  }, [])

  async function salvar(termo) {

    try {

      await api.put(

        `/juridico/${termo.id}`,

        {

          titulo:
            termo.titulo,

          conteudo:
            termo.conteudo,

          ativo:
            termo.ativo

        }

      )

      alert(
        "Termo salvo!"
      )

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao salvar"
      )
    }
  }

  if (loading) {

    return (

      <div style={{
        padding: 20
      }}>

        Carregando...

      </div>
    )
  }

async function novaVersao(id){

  try {

    await api.post(

      `/juridico/nova-versao/${id}`

    )

    carregar()

  } catch(e){

    console.error(e)

    alert(
      "Erro ao criar versão"
    )
  }
}

  return (

    <div style={{
      padding: 20
    }}>

      <h1 style={{
        marginTop: 0,
        marginBottom: 20
      }}>

        📜 Jurídico

      </h1>

      {

        termos.map(termo => (

          <div
            key={termo.id}
            style={{

              background: "#fff",

              border:
                "1px solid #e2e8f0",

              borderRadius: 16,

              padding: 20,

              marginBottom: 20
            }}
          >

            <div style={{
              marginBottom: 10
            }}>

              <strong>
                Tipo:
              </strong>

              {" "}

              {termo.tipo}

            </div>

            <div style={{
              marginBottom: 16
            }}>

              <strong>
                Versão:
              </strong>

              {" "}

              {termo.versao}

            </div>

            <input

              value={termo.titulo}

              onChange={(e) => {

                setTermos(prev =>

                  prev.map(t =>

                    t.id === termo.id

                      ? {
                          ...t,
                          titulo:
                            e.target.value
                        }

                      : t
                  )
                )
              }}

              style={{

                width: "100%",

                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #cbd5e1",

                marginBottom: 12
              }}
            />

            <textarea

              rows={18}

              value={termo.conteudo}

              onChange={(e) => {

                setTermos(prev =>

                  prev.map(t =>

                    t.id === termo.id

                      ? {
                          ...t,
                          conteudo:
                            e.target.value
                        }

                      : t
                  )
                )
              }}

              style={{

                width: "100%",

                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #cbd5e1",

                marginBottom: 12,

                fontFamily:
                  "inherit"
              }}
            />

            <label style={{
              display: "flex",
              gap: 10,
              marginBottom: 16
            }}>

              <input

                type="checkbox"

                checked={termo.ativo}

                onChange={(e) => {

                  setTermos(prev =>

                    prev.map(t =>

                      t.id === termo.id

                        ? {
                            ...t,
                            ativo:
                              e.target.checked
                          }

                        : t
                    )
                  )
                }}
              />

              Ativo

            </label>

            <button

              onClick={() =>
                salvar(termo)
              }

              style={{

                background:
                  "#2563eb",

                color: "#fff",

                border: 0,

                borderRadius: 10,

                padding:
                  "10px 18px",

                cursor: "pointer",

                fontWeight: 600
              }}
            >

              Salvar

            </button>

<button

  onClick={() =>
    novaVersao(
      termo.id
    )
  }

  style={{

    marginLeft: 10,

    background:
      "#0f172a",

    color: "#fff",

    border: 0,

    borderRadius: 10,

    padding:
      "10px 18px",

    cursor: "pointer",

    fontWeight: 600
  }}
>

  Nova versão

</button>

          </div>
        ))
      }

    </div>
  )
}