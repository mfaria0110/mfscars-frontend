import { usePermissao }
  from "../modules/permissao/usePermissao"

export default function VeiculoFotos({

  preview,

  handleSelect,

  remover,

  upload,

  modo,

  veiculoId,

  definirPrincipal

}) {

  const { temPermissao } =
    usePermissao()

  return (

    <div>

      {/* INPUT FOTO */}
      {

        temPermissao(
          "veiculo.editar"
        ) && (

          <input
            type="file"
            multiple
            onChange={handleSelect}
          />

        )

      }

      {/* PREVIEW */}
      <div style={{

        display: "flex",

        gap: 10,

        marginTop: 10,

        flexWrap: "wrap"

      }}>

        {

          preview.map((p, i) => (

            <div

              key={i}

              style={{

                position: "relative",

                border:
                  p.principal
                    ? "3px solid #f59e0b"
                    : "2px solid #e2e8f0",

                borderRadius: 10,

                padding: 4,

                background: "#fff"

              }}
            >

              {/* FOTO */}
              <img

                src={p.url}

                width={120}

                height={90}

                style={{

                  objectFit: "cover",

                  borderRadius: 8,

                  display: "block"

                }}

              />

              {/* TAG PRINCIPAL */}
              {

                p.principal && (

                  <div style={{

                    position: "absolute",

                    bottom: 6,

                    left: 6,

                    background: "#f59e0b",

                    color: "#fff",

                    fontSize: 12,

                    padding: "4px 8px",

                    borderRadius: 6,

                    fontWeight: 600

                  }}>

                    ⭐ Principal

                  </div>

                )

              }

              {/* BOTÃO PRINCIPAL */}

              {

                temPermissao(
                  "veiculo.editar"
                ) && !p.principal && (

                  <button

                    type="button"

                    title="Definir como principal"

                    onClick={() =>
                      definirPrincipal(p.id)
                    }
                    
                    style={{

                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      background:
                        "#f59e0b",
                      color: "#fff",
                      border: 0,
                      borderRadius: 6,
                      cursor: "pointer",
                      padding: "4px 8px",
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >

                    ⭐

                  </button>

                )

              }

              {/* BOTÃO REMOVER */}

              {

                temPermissao(
                  "veiculo.editar"
                ) && (

                  <button

                    type="button"

                    onClick={() =>
                      remover(i)
                    }

                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background:
                        "#ef4444",
                      color: "#fff",
                      border: 0,
                      borderRadius: 6,
                      cursor: "pointer",
                      padding: "4px 6px",
                      fontSize: 12
                    }}
                  >

                    ❌

                  </button>

                )

              }

            </div>

          ))

        }

      </div>

      {/* BOTÃO UPLOAD */}
      {

        temPermissao(
          "veiculo.editar"
        ) && (

          <button

            type="button"

            onClick={() =>
              upload(Number(veiculoId))
            }

            disabled={modo === "create"}

            style={{

              marginTop: 20,

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

            Enviar fotos

          </button>

        )

      }

      {/* CREATE MODE */}
      {

        modo === "create" && (

          <p style={{

            marginTop: 10,

            color: "#64748b"

          }}>

            Salve o veículo primeiro

          </p>

        )

      }

    </div>
  )
}