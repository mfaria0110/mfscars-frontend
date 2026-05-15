export default function PagamentoFalha() {

  return (

    <div style={{

      minHeight: "70vh",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      flexDirection: "column",

      padding: 32
    }}>

      <h1 style={{

        fontSize: 42,

        color: "#dc2626",

        marginBottom: 24
      }}>
        Pagamento não concluído
      </h1>

      <p style={{

        fontSize: 18,

        maxWidth: 600,

        textAlign: "center",

        lineHeight: 1.6
      }}>
        O pagamento foi cancelado
        ou não pôde ser processado.
      </p>

    </div>
  )
}