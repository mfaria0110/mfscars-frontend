export default function PlanoBloqueioModal({
  aberto,
  mensagem,
  onClose
}) {

  if (!aberto) {
    return null
  }

  return (

    <div
      style={{

        position: "fixed",

        inset: 0,

        background:
          "rgba(0,0,0,0.72)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        zIndex: 9999,

        padding: 24
      }}
    >

      <div
        style={{

          width: "100%",

          maxWidth: 520,

          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 100%)",

          borderRadius: 28,

          padding: 36,

          color: "#fff",

          boxShadow:
            "0 30px 80px rgba(0,0,0,0.35)"
        }}
      >

        <div
          style={{
            fontSize: 54,
            marginBottom: 18
          }}
        >
          🚨
        </div>

        <h2
          style={{
            fontSize: 34,
            marginBottom: 18
          }}
        >
          Assinatura Necessária
        </h2>

        <p
          style={{
            opacity: 0.82,

            marginBottom: 32,

            lineHeight: 1.7,

            fontSize: 17
          }}
        >
          {mensagem}
        </p>

        <div
          style={{
            display: "flex",
            gap: 16
          }}
        >

          <button

            onClick={() => {

              window.location.href =
                "/app/assinatura"
            }}

            style={{

              flex: 1,

              padding: 16,

              borderRadius: 14,

              border: 0,

              background: "#2563eb",

              color: "#fff",

              fontWeight: "700",

              fontSize: 16,

              cursor: "pointer"
            }}
          >
            Ver Planos
          </button>

          <button

            onClick={onClose}

            style={{

              flex: 1,

              padding: 16,

              borderRadius: 14,

              border:
                "1px solid #334155",

              background:
                "transparent",

              color: "#fff",

              fontWeight: "700",

              fontSize: 16,

              cursor: "pointer"
            }}
          >
            Fechar
          </button>

        </div>

      </div>

    </div>
  )
}