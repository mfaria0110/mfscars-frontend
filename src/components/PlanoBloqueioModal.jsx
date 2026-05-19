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

        padding: 24,

        backdropFilter:
          "blur(4px)"
      }}
    >

      <div
        style={{

          width: "100%",

          maxWidth: 540,

          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 100%)",

          borderRadius: 28,

          padding: 38,

          color: "#fff",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 30px 80px rgba(0,0,0,0.35)"
        }}
      >

        {/* BADGE */}

        <div
          style={{

            display: "inline-flex",

            alignItems: "center",

            gap: 8,

            padding:
              "8px 14px",

            borderRadius: 999,

            background:
              "rgba(37,99,235,0.15)",

            color: "#93c5fd",

            fontSize: 13,

            fontWeight: 700,

            marginBottom: 24
          }}
        >
          🚀 Upgrade disponível
        </div>

        {/* ICON */}

        <div
          style={{
            fontSize: 56,
            marginBottom: 20
          }}
        >
          💎
        </div>

        {/* TITLE */}

        <h2
          style={{
            fontSize: 34,
            marginBottom: 18,
            fontWeight: 800,
            lineHeight: 1.1
          }}
        >
          Limite do plano atingido
        </h2>

        {/* MESSAGE */}

        <p
          style={{

            opacity: 0.82,

            marginBottom: 28,

            lineHeight: 1.7,

            fontSize: 17
          }}
        >
          {mensagem}
        </p>

        {/* FOUNDERS */}

        <div
          style={{

            background:
              "rgba(16,185,129,0.12)",

            border:
              "1px solid rgba(16,185,129,0.25)",

            borderRadius: 18,

            padding: 18,

            marginBottom: 28
          }}
        >

          <div
            style={{
              fontWeight: 700,
              marginBottom: 8,
              color: "#6ee7b7"
            }}
          >
            🔥 Oferta Founders
          </div>

          <div
            style={{
              opacity: 0.82,
              lineHeight: 1.6
            }}
          >
            Os primeiros clientes
            garantem até
            <strong>
              {" "}30% OFF vitalício
            </strong>
            nos planos pagos.
          </div>

        </div>

        {/* BUTTONS */}

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

              background:
                "linear-gradient(135deg,#2563eb,#1d4ed8)",

              color: "#fff",

              fontWeight: "700",

              fontSize: 16,

              cursor: "pointer",

              boxShadow:
                "0 10px 30px rgba(37,99,235,0.35)"
            }}
          >
            Ver planos
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
            Agora não
          </button>

        </div>

      </div>

    </div>
  )
}