import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import DashboardStats from "../components/DashboardStats"

import "../components/styles/layout.css"

import { useAppStore } from "../store/useAppStore"
import { useDashboard } from "../modules/dashboard/useDashboard"
import { usePermissao } from "../modules/permissao/usePermissao"
import TelaLojaInativa from "../components/TelaLojaInativa"

import PlanoBloqueioModal
from "../components/PlanoBloqueioModal"

export default function PrivateLayout() {
  const isChangingLoja =
    useAppStore(
      (state) =>
        state.isChangingLoja
    )

  const lojaInativa = useAppStore(
  (state) => state.lojaInativa
  )

  const paywall =
    useAppStore(
      state => state.paywall
    )

  const paywallMensagem =
    useAppStore(
      state =>
        state.paywallMensagem
    )

  const fecharPaywall =
    useAppStore(
      state =>
        state.fecharPaywall
    )

  const { temPermissao } =
    usePermissao()

  const podeVerDashboard =
    temPermissao(
      "dashboard.visualizar"
    )

  const {
    data,
    loading
  } = useDashboard()

  const stats = data
    ? {
        veiculos:
          data.veiculos || 0,
        leads:
          data.leads || 0,
        vendas:
          data.vendas || 0,
        plano:
          data.plano
      }
    : null

if (isChangingLoja) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="page-content" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          fontSize: "18px",
          fontWeight: "600"
        }}>
          Trocando loja...
        </div>
      </div>
    </div>
  )
}

/* 🔥 BLOQUEIO LOJA INATIVA */
if (lojaInativa) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <TelaLojaInativa />
      </div>
    </div>
  )
}

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        {/* DASHBOARD GLOBAL */}
        {podeVerDashboard &&
          !loading &&
          stats && (
            <DashboardStats
              stats={stats}
            />
          )}

        <div className="page-content">
          <Outlet />
        </div>

      </div>

      <PlanoBloqueioModal

      aberto={paywall}

      mensagem={
        paywallMensagem
      }

      onClose={
        fecharPaywall
      }
    />

      
    </div>
  )
}