import { useState, useEffect } from "react"
import { useUsuarios } from "../../modules/usuario/useUsuarios"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../../modules/permissao/usePermissao"
import api from "../../api/api"
import "../../components/styles/usuarios.css"

export default function Usuarios() {

  const { temPermissao } = usePermissao()

  const { usuarios, loading, salvar, alterarStatus, excluir } = useUsuarios()

  const usuarioLogado = useAppStore(state => state.usuario)
  
const lojas = useAppStore(state => state.lojas)
const [lojasModal, setLojasModal] = useState([])
  
  const lojaId = useAppStore(state => state.lojaId)

  /* ===============================
     🔥 DEBUG GLOBAL
  ============================== */
  console.log("🟡 usuarioLogado:", usuarioLogado)
  console.log("🟡 lojaId:", lojaId)
  console.log("🟡 lojas (store):", lojas)

  /* ===============================
     🔥 DESCOBRE LOJA ATUAL
  ============================== */
/* ===============================
   MASTER vê todas as lojas
============================== */
const lojasFiltradas = temPermissao("loja.visualizar")
  ? lojasModal
  : lojasModal.filter(
      l =>
        Number(l.empresa_id) ===
        Number(usuarioLogado?.empresa_id)
    )

  console.log("🟡 lojasFiltradas:", lojasFiltradas)

  /* ===============================
     FORM
  ============================== */
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "usuario",
    ativo: true,
    empresa_id: null,
    lojas: []
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const podeDefinirPerfilPorLoja =
  form.tipo === "usuario"

  /* ===============================
     🔥 CARREGAR LOJAS (GARANTIA)
  ============================== */
useEffect(() => {

  async function carregarLojas() {

    try {
      const res = await api.get("/lojas")

      console.log("🟢 lojas atualizadas:", res.data)

      setLojasModal(res.data || [])

    } catch (e) {
      console.error(e)
    }
  }

  carregarLojas()

}, [])

useEffect(() => {
  if (form.tipo !== "usuario") {
    setForm(prev => ({
      ...prev,
      lojas: []
    }))
  }
}, [form.tipo])

  /* ===============================
     🔐 BLOQUEIO
  ============================== */
if (!temPermissao("usuario.visualizar")) {
  return (
    <div style={{ padding: 40 }}>
      🚫 Sem permissão para visualizar usuários
    </div>
  )
}

  /* ===============================
     NOVO
  ============================== */
function abrirNovo() {
  if (!temPermissao("usuario.criar")) {
    alert("Sem permissão para criar usuários")
    return
  }

  setUsuarioSelecionado(null)

  setForm({
    nome: "",
    email: "",
    senha: "",
    tipo: "usuario",
    ativo: true,

    // master usa própria empresa apenas como fallback
    empresa_id: usuarioLogado?.empresa_id || null,

    lojas: []
  })

  setModalOpen(true)
}

  /* ===============================
     EDITAR
  ============================== */
async function editarUsuario(u) {

  if (!temPermissao("usuario.editar")) {
    alert("Sem permissão para editar usuários")
    return
  }

  try {
    const res = await api.get(`/usuarios/${u.id}`)

    const usuario = res.data

    const lojasUsuario = usuario.lojas || []

    setUsuarioSelecionado(usuario)

    setForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      tipo: usuario.tipo || "usuario",
      ativo: usuario.ativo ?? true,
      empresa_id: usuario.empresa_id,
      lojas: lojasUsuario.map(l => ({
        loja_id: Number(l.loja_id),
        perfil: l.perfil || "vendedor"
      }))
    })

    setModalOpen(true)

  } catch (e) {
    console.error(e)
    alert("Erro ao carregar usuário")
  }
}


  /* ===============================
     SALVAR
  ============================== */
  async function handleSalvar() {

    const lojasAtualizadas = Array.from(
      new Map(
        form.lojas.map(l => [Number(l.loja_id), l])
      ).values()
    )

if (
  form.tipo === "usuario" &&
  !lojasAtualizadas.length
) {
  alert("Selecione ao menos uma loja")
  return
}

      const dados = {
        ...form,
        lojas:
          form.tipo === "usuario"
            ? lojasAtualizadas.map(l => ({
                loja_id: l.loja_id,
                perfil: l.perfil
              }))
            : []
      }

    await salvar({
      dados,
      id: usuarioSelecionado?.id
    })

    setModalOpen(false)
setUsuarioSelecionado(null)

setForm({
  nome: "",
  email: "",
  senha: "",
  tipo: "usuario",
  ativo: true,
  empresa_id: null,
  lojas: []
})
  }

  /* ===============================
     LOADING
  ============================== */
  if (loading) {
    return <div style={{ padding: 40 }}>Carregando...</div>
  }

  return (
    <div className="usuarios-page">

      <div className="usuarios-header">
        <h2>👤 Usuários</h2>
        {temPermissao("usuario.criar") && (
  <button onClick={abrirNovo}>
    ➕ Novo
  </button>
)}
      </div>

      {/* LISTA */}
      <div className="usuarios-lista">
        {usuarios.map(u => (
          <div key={u.id} className="usuarios-card">

            <div>
              <strong>{u.nome}</strong>
              <div>{u.email} / Perfil: {u.tipo}</div>
              <div>{u.ativo ? "🟢 Ativo" : "🔴 Inativo"}</div>
            </div>

            <div className="card-actions">
              {temPermissao("usuario.editar") && (
  <button onClick={() => editarUsuario(u)}>
    ✏️
  </button>
)}

{temPermissao("usuario.editar") && (
  <button
    onClick={() =>
      alterarStatus({
        id: u.id,
        ativo: !u.ativo
      })
    }
  >
    {u.ativo ? "🚫" : "✅"}
  </button>
)}

{temPermissao("usuario.excluir") && (
  <button
    onClick={async () => {
      if (!confirm("Excluir usuário?")) return

      try {
        await excluir(u.id)
      } catch {
        alert("Erro ao excluir usuário")
      }
    }}
  >
    🗑️
  </button>
)}

            </div>

          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="usuarios-modal">
          <div className="usuarios-form">

            <h2>{usuarioSelecionado ? "Editar" : "Novo"} Usuário</h2>

            {/* CAMPOS */}
            <div className="usuarios-grid">
              <div className="campo">
                <label>Nome</label>
                <input
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div className="campo">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="usuarios-grid">
              <div className="campo">
                <label>Senha</label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={e => setForm({ ...form, senha: e.target.value })}
                />
              </div>

              <div className="campo">
                <label>Tipo</label>
                <select
                  value={form.tipo}
                  onChange={e => setForm({ ...form, tipo: e.target.value })}
                >
                  <option value="usuario">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="usuarios-status">
              <label>
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) =>
                    setForm({ ...form, ativo: e.target.checked })
                  }
                />
                Ativo
              </label>
            </div>

            {/* 🔥 LOJAS */}
            {podeDefinirPerfilPorLoja && (
              <div className="usuarios-lojas">

              {!lojasModal.length && (
                  <p>🔄 Carregando lojas...</p>
                )}

                {lojasModal.length > 0 && !lojasFiltradas.length && (
                  <p>⚠️ Nenhuma loja encontrada</p>
                )}

              {lojasFiltradas.map(l => {

                const selecionado = form.lojas.find(
                  x => Number(x.loja_id) === Number(l.id)
                )

                return (
                  <div key={l.id} className="loja-row">

                    <div className="loja-left">
                      <input
                        type="checkbox"
                        checked={!!selecionado}
                        onChange={(e) => {

                          const checked = e.target.checked

                          setForm(prev => {

                            let novas = [...prev.lojas]

                            if (checked) {
                              if (!novas.find(x => x.loja_id === l.id)) {
                                novas.push({
                                  loja_id: l.id,
                                  perfil: "vendedor"
                                })
                              }
                            } else {
                              novas = novas.filter(x => x.loja_id !== l.id)
                            }

                            return { ...prev, lojas: novas }
                          })
                        }}
                      />

                      <span>{l.nome}</span>
                    </div>

                    <div className="loja-right">

                      {selecionado && podeDefinirPerfilPorLoja && (
                          <select
                          value={selecionado.perfil}
                          onChange={(e) => {

                            const perfil = e.target.value

                            setForm(prev => ({
                              ...prev,
                              lojas: prev.lojas.map(x =>
                                x.loja_id === l.id
                                  ? { ...x, perfil }
                                  : x
                              )
                            }))
                          }}
                        >
                          <option value="vendedor">Vendedor</option>
                          <option value="financeiro">Financeiro</option>
                        </select>
                      )}

                    </div>

                  </div>
                )
              })}

            </div>
            )}

            <div className="usuarios-actions">

              {(
                usuarioSelecionado
                  ? temPermissao("usuario.editar")
                  : temPermissao("usuario.criar")
              ) && (
                <button
                  className="btn-primary"
                  onClick={handleSalvar}
                >
                  Salvar
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={() => {
                    setModalOpen(false)
                    setUsuarioSelecionado(null)

                    setForm({
                      nome: "",
                      email: "",
                      senha: "",
                      tipo: "usuario",
                      ativo: true,
                      empresa_id: null,
                      lojas: []
                    })
                  }}
              >
                Cancelar
              </button>
              
            </div>

          </div>
        </div>
      )}

    </div>
  )
}