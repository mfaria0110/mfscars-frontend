import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import PrivateRoute from "./PrivateRoute"

import PublicLayout from "../layouts/PublicLayout"
import PrivateLayout from "../layouts/PrivateLayout"

import Dashboard from "../pages/app/Dashboard"

import Login from "../pages/public/Login"

import Veiculos from "../pages/app/Veiculos"
import VeiculoForm from "../pages/app/VeiculoForm"

import VendaForm from "../pages/app/VendaForm"
import Vendas from "../pages/app/Vendas"

import Lojas from "../pages/app/Lojas"
import Usuarios from "../pages/app/Usuarios"
import Leads from "../pages/app/Leads"
import Permissoes from "../pages/app/Permissoes"

import PagamentoSucesso
from "../pages/app/PagamentoSucesso"

import PagamentoFalha
from "../pages/app/PagamentoFalha"

import Assinatura from "../pages/app/Assinatura"

import Financeiro
  from "../pages/app/Financeiro"

import Juridico
  from "../pages/app/Juridico"

import {
  usePermissao
} from "../modules/permissao/usePermissao"

function ProtectedPermissionRoute({
  children,
  permissao
}) {

  const {
    temPermissao
  } = usePermissao()

  if (
    permissao &&
    !temPermissao(permissao)
  ) {

    return (
      <Navigate
        to="/app/veiculos"
        replace
      />
    )
  }

  return children
}

export default function Router() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            🌐 PÚBLICO
        ========================== */}
        <Route
          element={
            <PublicLayout />
          }
        >

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/pagamento/sucesso"
            element={<PagamentoSucesso />}
          />

          <Route
            path="/pagamento/falha"
            element={<PagamentoFalha />}
          />
        </Route>

        {/* =========================
            🔒 PRIVADO
        ========================== */}
        <Route
          element={
            <PrivateRoute />
          }
        >

          <Route
            element={
              <PrivateLayout />
            }
          >

            {/* ASSINATURA */}

            <Route
              path="/app/assinatura"
              element={<Assinatura />}
            />

            <Route
              path="/app/financeiro"
              element={<Financeiro />}
            />

            {/* DASHBOARD */}

            <Route
              path="/app/dashboard"
              element={<Dashboard />}
            />

            {/* VEÍCULOS */}

            <Route
              path="/app/veiculos"
              element={
                <ProtectedPermissionRoute permissao="veiculo.visualizar">

                  <Veiculos />

                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/veiculos/novo"
              element={
                <ProtectedPermissionRoute permissao="veiculo.criar">

                  <VeiculoForm />

                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/veiculos/editar/:id"
              element={
                <ProtectedPermissionRoute permissao="veiculo.editar">

                  <VeiculoForm />

                </ProtectedPermissionRoute>
              }
            />

            {/* VENDAS */}

            <Route
              path="/app/vendas"
              element={
                <ProtectedPermissionRoute permissao="venda.visualizar">

                  <Vendas />

                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/vendas/nova"
              element={
                <ProtectedPermissionRoute permissao="venda.criar">

                  <VendaForm />

                </ProtectedPermissionRoute>
              }
            />

            {/* LOJAS */}

            <Route
              path="/app/lojas"
              element={
                <ProtectedPermissionRoute permissao="loja.visualizar">

                  <Lojas />

                </ProtectedPermissionRoute>
              }
            />

            {/* USUÁRIOS */}

            <Route
              path="/app/usuarios"
              element={
                <ProtectedPermissionRoute permissao="usuario.visualizar">

                  <Usuarios />

                </ProtectedPermissionRoute>
              }
            />

            {/* LEADS */}

            <Route
              path="/app/leads"
              element={
                <ProtectedPermissionRoute permissao="lead.visualizar">

                  <Leads />

                </ProtectedPermissionRoute>
              }
            />

            {/* PERMISSÕES */}

            <Route
              path="/app/permissoes"
              element={
                <ProtectedPermissionRoute permissao="permissao.visualizar">

                  <Permissoes />

                </ProtectedPermissionRoute>
              }
            />

          </Route>

        </Route>

        {/* =========================
            🔥 REDIRECTS
        ========================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

      <Route

  path="/juridico"

  element={

    usuario?.master

      ? <Juridico />

      : <Navigate to="/" />

  }
/>

    </BrowserRouter>
  )
}