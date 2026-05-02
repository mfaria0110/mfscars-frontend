import { useState } from "react"
import { usePermissoes } from "../../modules/permissao/usePermissoes"
import { usePermissao } from "../../modules/permissao/usePermissao"
import "../../components/styles/permissoes.css"

export default function Permissoes() {
  const {
    permissoes,
    roles,
    loading,
    salvar,
    excluir,
    getPermissoesRole
  } = usePermissoes()

  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("permissao.visualizar")
  const podeEditar = temPermissao("permissao.editar")
  const podeExcluir = temPermissao("permissao.excluir")

  const [nome, setNome] = useState("")
  const [selecionadas, setSelecionadas] = useState([])
  const [editando, setEditando] = useState(null)

  if (!podeVisualizar) {
    return <p style={{ padding: 20 }}>Sem permissão</p>
  }

  if (loading) return <p>Carregando...</p>

  function togglePermissao(id) {
    if (!podeEditar) return

    setSelecionadas(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  async function handleSalvar() {
    if (!podeEditar) return

    try {
      await salvar({
        nome,
        permissoesIds: selecionadas,
        roleId: editando
      })

      setNome("")
      setSelecionadas([])
      setEditando(null)
    } catch {}
  }

  function selecionarRole(role) {
    if (!podeEditar) return

    const perms = getPermissoesRole(role.id)

    setEditando(role.id)
    setNome(role.nome)
    setSelecionadas(perms)
  }

  function novo() {
    if (!podeEditar) return

    setEditando(null)
    setNome("")
    setSelecionadas([])
  }

  const permissoesAgrupadas = permissoes.reduce((acc, p) => {
    const nome = p.nome || p.chave || ""
    const [modulo, acao] = nome.split(".")

    if (!acc[modulo]) {
      acc[modulo] = []
    }

    acc[modulo].push({
      ...p,
      acao
    })

    return acc
  }, {})

  return (
    <div className="permissoes-page">
      <h2>🔐 Permissões</h2>

      <div className="permissoes-topo">
        <input
          placeholder="Nome da role"
          value={nome}
          onChange={e => setNome(e.target.value)}
          disabled={!podeEditar}
        />

        <button
          onClick={handleSalvar}
          disabled={!podeEditar || !nome || selecionadas.length === 0}
        >
          {editando ? "Atualizar" : "Salvar"}
        </button>

        <button onClick={novo} disabled={!podeEditar}>
          + Novo
        </button>
      </div>

      {editando && (
        <div className="editando-info">
          Editando role: <strong>{nome}</strong>
        </div>
      )}

      <div className="permissoes-layout">
        <div className="permissoes-col">
          <h3>Permissões</h3>

          {Object.entries(permissoesAgrupadas).map(([modulo, items]) => {
            const selecionadasCount =
              items.filter(i => selecionadas.includes(i.id)).length

            const incompleto = selecionadasCount !== items.length

            return (
              <div key={modulo} className="perm-grupo">
                <h4 className={`perm-titulo ${incompleto ? "incompleto" : ""}`}>
                  {modulo.toUpperCase()}

                  <span className="perm-count">
                    {selecionadasCount} / {items.length}
                  </span>
                </h4>

                {items.map(p => (
                  <label key={p.id} className="perm-item">
                    <input
                      type="checkbox"
                      checked={selecionadas.includes(p.id)}
                      onChange={() => togglePermissao(p.id)}
                      disabled={!podeEditar}
                    />

                    <span>{p.acao}</span>
                  </label>
                ))}
              </div>
            )
          })}
        </div>

        <div className="permissoes-col">
          <h3>Roles</h3>

          {roles.map(r => {
            const total = getPermissoesRole(r.id).length

            return (
              <div key={r.id} className="role-card">
                <div
                  className="role-info"
                  onClick={() => selecionarRole(r)}
                  style={{ cursor: podeEditar ? "pointer" : "default" }}
                >
                  <strong>{r.nome}</strong>
                  <span>{total} permissões</span>
                </div>

                {podeExcluir && (
                  <button
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm("Excluir role?")) {
                        excluir(r.id)
                      }
                    }}
                  >
                    🗑
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}