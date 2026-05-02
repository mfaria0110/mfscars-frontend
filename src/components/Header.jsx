import "./styles/header.css"
import { useAppStore } from "../store/useAppStore"
import { useLoja } from "../modules/loja/useLoja"
import { usePermissao } from "../modules/permissao/usePermissao"

export default function Header() {

  const usuario = useAppStore(state => state.usuario)
  const lojas = useAppStore(state => state.lojas) || []
  const lojaId = useAppStore(state => state.lojaId)
  const plano = useAppStore(state => state.plano)
  const perfil = useAppStore(state => state.perfil)

  const logout = useAppStore(state => state.logout)

  const { trocarLoja } = useLoja()
  const { temPermissao } = usePermissao()

  function handleLogout() {
    logout()
  }

  /* ===============================
     🔥 PERMISSÃO TROCAR LOJA
  ============================== */
const podeTrocarLoja =
  usuario?.master ||
  usuario?.tipo === "admin" ||
  lojas.length >= 1 ||
  temPermissao("loja.trocar");
  
  /* ===============================
     🔥 LOJAS (SEM FILTRO FRONT)
  ============================== */
  const lojasFiltradas = Array.isArray(lojas)
    ? lojas
    : []

  /* ===============================
     🔥 LOJA ATUAL
  ============================== */
  const lojaAtual = lojasFiltradas.find(
    l => Number(l.id) === Number(lojaId)
  )

  /* ===============================
     🔥 STATUS
  ============================== */
  const status = String(lojaAtual?.status || "")
    .trim()
    .toUpperCase()

  const statusLabel =
    status === "ATIVO"
      ? "🟢 Loja ativa"
      : status === "INATIVO"
      ? "🔴 Loja inativa"
      : "⚪ Sem status"

  const statusColor =
    status === "ATIVO"
      ? "#16a34a"
      : status === "INATIVO"
      ? "#dc2626"
      : "#6b7280"

  return (
    <div className="header">

      <div className="header-left">

        <div className="header-loja">
          <strong>{lojaAtual?.nome || "Selecione loja"}</strong>

          <span style={{ color: statusColor }}>
            {lojaId ? statusLabel : "⚪ Nenhuma loja selecionada"}
          </span>
        </div>

        <div className="header-select-wrapper">

          {podeTrocarLoja ? (

            <select
              className="header-select"
              value={lojaId || ""}
              onChange={(e) => {
                const value = e.target.value
                trocarLoja(value ? Number(value) : null)
              }}
            >
              <option value="">Selecione</option>

              {lojasFiltradas.map((l, index) => {
                const id = l.id || l.loja_id || index

                return (
                  <option key={id} value={id}>
                    {l.nome}
                  </option>
                )
              })}
            </select>

          ) : (

            <div className="header-select disabled">
              {lojaAtual?.nome || "Sem permissão para trocar loja"}
            </div>

          )}

        </div>

        {plano && temPermissao("plano.visualizar") && (
          <div className="header-plano">
            {plano.nome} ({plano.usados}/{plano.limite})
          </div>
        )}

      </div>

      <div className="header-right">

        <div className="header-user-group">

          {perfil && (
            <span className="header-perfil">
              {perfil?.toUpperCase()}
            </span>
          )}

          <span className="header-user">
            {usuario?.nome}
          </span>

          <button className="header-btn">🌙</button>

          <button
            className="header-btn header-logout"
            onClick={handleLogout}
          >
            Sair
          </button>

        </div>

      </div>

    </div>
  )
}