import "./styles/dashboardStats.css"

export default function DashboardStats({ stats }) {

  return (
    <div className="stats">

      <div className="stat-card">
        <div>Veículos ativos</div>
        <strong>{stats.veiculos}</strong>
      </div>

      <div className="stat-card">
        <div>Leads recebidos</div>
        <strong>{stats.leads}</strong>
      </div>

      <div className="stat-card">
        <div>Vendas</div>
        <strong>{stats.vendas}</strong>
      </div>

      <div className="stat-card">
        <div>Plano</div>
        <strong>
          {stats.plano?.nome || "--"} ({stats.plano?.usados || 0}/{stats.plano?.limite || 0})
        </strong>
      </div>

    </div>
  )
}