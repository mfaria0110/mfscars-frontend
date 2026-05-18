import { useDashboard } from "../../modules/dashboard/useDashboard"

import { usePermissao }
  from "../../modules/permissao/usePermissao"

import "../../components/styles/dashboard.css"

export default function Dashboard() {

  const { temPermissao } =
    usePermissao()

  const {
    stats,
    loading,
    error
  } = useDashboard()

  /* ===============================
     🔐 PERMISSÃO
  ============================== */
  if (
    !temPermissao(
      "dashboard.visualizar"
    )
  ) {

    return (
      <div style={{ padding: 40 }}>
        🚫 Sem permissão para visualizar dashboard
      </div>
    )
  }

  /* ===============================
     ⏳ LOADING
  ============================== */
  if (loading) {

    return (
      <div>
        Carregando...
      </div>
    )
  }

  /* ===============================
     ❌ ERRO
  ============================== */
  if (error) {

    return (
      <div style={{ padding: 40 }}>
        ❌ {error}
      </div>
    )
  }

  const plano =
    stats?.plano

  return (

    <div className="dashboard">

      {/* ===============================
          🚨 ALERTAS
      ============================== */}

      {plano?.alerta === "limite" && (

        <div className="dashboard-alert alert-danger">

          🚫 Seu plano atingiu o limite

        </div>
      )}

      {plano?.alerta === "quase" && (

        <div className="dashboard-alert alert-warning">

          ⚠️ Restam apenas {plano.restante} vagas

        </div>
      )}

      {/* ===============================
          📊 CARDS
      ============================== */}

      <div className="dashboard-cards">

        {/* VEÍCULOS */}
        <div className="dashboard-card card-blue">

          <div className="dashboard-title">
            Veículos ativos
          </div>

          <div className="dashboard-value">
            {stats?.veiculos || 0}
          </div>

        </div>

        {/* LEADS */}
        <div className="dashboard-card card-green">

          <div className="dashboard-title">
            Leads recebidos
          </div>

          <div className="dashboard-value">
            {stats?.leads || 0}
          </div>

        </div>

        {/* VENDAS */}
        <div className="dashboard-card card-yellow">

          <div className="dashboard-title">
            Vendas
          </div>

          <div className="dashboard-value">
            {stats?.vendas || 0}
          </div>

        </div>

        {/* PLANO */}
        <div className="dashboard-card card-red">

          <div className="dashboard-title">
            Plano
          </div>

          <div className="dashboard-value">

            {plano?.nome || "--"} (
            {plano?.usados || 0}/
            {plano?.limite || 0}
            )

          </div>

        </div>

      </div>

    </div>
  )
}