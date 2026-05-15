export default function PagamentoSucesso() {

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

        color: "#16a34a",

        marginBottom: 24
      }}>
        Pagamento iniciado
      </h1>

      <p style={{

        fontSize: 18,

        maxWidth: 600,

        textAlign: "center",

        lineHeight: 1.6
      }}>
        Sua assinatura foi criada com sucesso.
        O sistema irá liberar automaticamente
        após confirmação do Mercado Pago.
      </p>

    </div>
  )
}