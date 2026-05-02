import { useEffect, useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../../modules/permissao/usePermissao"
import "../../components/styles/leads.css"

export default function Leads() {
  const lojaId = useAppStore(state => state.lojaId)

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao(
    "lead.visualizar"
  )

  const podeExcluir = temPermissao(
    "lead.excluir"
  )

  const [leads, setLeads] = useState([])
  const [loading, setLoading] =
    useState(true)

  const [erro, setErro] =
    useState(null)

  useEffect(() => {
    async function carregar() {
      if (!lojaId) {
        setLeads([])
        setLoading(false)
        return
      }

      if (!podeVisualizar) {
        setErro(
          "Sem permissão para visualizar leads"
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErro(null)

        const res =
          await api.get(
            "/leads/empresa"
          )

        setLeads(
          res.data || []
        )
      } catch (e) {
        console.error(e)

        setErro(
          e.response?.data
            ?.erro ||
            "Erro ao carregar leads"
        )
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [
    lojaId,
    podeVisualizar
  ])

  async function excluirLead(id) {
    if (!podeExcluir) {
      alert(
        "Sem permissão para excluir leads"
      )
      return
    }

    const confirmar =
      confirm(
        "Deseja excluir este lead?"
      )

    if (!confirmar) return

    try {
      await api.delete(
        `/leads/${id}`
      )

      setLeads(prev =>
        prev.filter(
          l => l.id !== id
        )
      )
    } catch (e) {
      console.error(e)
      alert(
        e.response?.data
          ?.erro ||
          "Erro ao excluir lead"
      )
    }
  }

  function formatarTelefone(
    tel
  ) {
    if (!tel) return "-"

    let t = tel.replace(
      /\D/g,
      ""
    )

    if (
      !t.startsWith("55")
    ) {
      t = "55" + t
    }

    return t
  }

  if (loading) {
    return (
      <p style={{ padding: 20 }}>
        Carregando leads...
      </p>
    )
  }

  if (!lojaId) {
    return (
      <p style={{ padding: 20 }}>
        Selecione uma loja
      </p>
    )
  }

  if (erro) {
    return (
      <p
        style={{
          padding: 20,
          color: "red"
        }}
      >
        {erro}
      </p>
    )
  }

  if (leads.length === 0) {
    return (
      <p
        style={{
          padding: 20,
          color: "#777"
        }}
      >
        Nenhum lead recebido ainda
      </p>
    )
  }

  return (
    <div className="leads-page">
      <h2>
        📩 Leads recebidos
      </h2>

      <div className="leads-list">
        {leads.map(l => {
          const telefone =
            formatarTelefone(
              l.telefone
            )

          return (
            <div
              key={l.id}
              className="lead-card"
            >
              <strong>
                {l.nome || "-"}
              </strong>

              <div className="lead-info">
                📞{" "}
                <a
                  href={`https://wa.me/${telefone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.telefone ||
                    "-"}
                </a>
              </div>

              <div className="lead-info">
                🚗{" "}
                {l.marca ||
                  "-"}{" "}
                {l.modelo ||
                  ""}
              </div>

              <div className="lead-info">
                💬{" "}
                {l.mensagem ||
                  "-"}
              </div>

              <div className="lead-date">
                {new Date(
                  l.data
                ).toLocaleString(
                  "pt-BR"
                )}
              </div>

              {podeExcluir && (
                <button
                  className="btn excluir"
                  onClick={() =>
                    excluirLead(
                      l.id
                    )
                  }
                >
                  Excluir
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}