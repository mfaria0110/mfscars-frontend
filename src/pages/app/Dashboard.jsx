import { useDashboard } from "../../modules/dashboard/useDashboard"

import "../../components/styles/dashboard.css"

export default function Dashboard() {

  const { temPermissao } = usePermissao()

  const { data, loading } = useDashboard()

  if (!temPermissao("dashboard.visualizar")) {
  return (
    <div style={{ padding: 40 }}>
      🚫 Sem permissão para visualizar dashboard
    </div>
  )
}

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!data) {
    return <div>Erro ao carregar</div>
  }

  const plano = data.plano

  return (
    <div className="dashboard">

      {/* ALERTAS */}
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

      {/* CARDS */}
      <div className="dashboard-cards">

        <div className="dashboard-card card-blue">
          <div className="dashboard-title">Veículos</div>
          <div className="dashboard-value">{data.veiculos}</div>
        </div>

        <div className="dashboard-card card-green">
          <div className="dashboard-title">Leads</div>
          <div className="dashboard-value">{data.leads}</div>
        </div>

        <div className="dashboard-card card-yellow">
          <div className="dashboard-title">Vendas</div>
          <div className="dashboard-value">{data.vendas}</div>
        </div>

        <div className="dashboard-card card-red">
          <div className="dashboard-title">Plano</div>
          <div className="dashboard-value">
            {plano?.nome || "--"}
          </div>
        </div>

      </div>

    </div>
  )
}