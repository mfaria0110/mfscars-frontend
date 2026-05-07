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
import Lojas from "../pages/app/Lojas"
import Usuarios from "../pages/app/Usuarios"
import Leads from "../pages/app/Leads"
import Permissoes from "../pages/app/Permissoes"
import Vendas from "../pages/app/Vendas"

import { usePermissao } from "../modules/permissao/usePermissao"

function ProtectedPermissionRoute({
  children,
  permissao
}) {

  const { temPermissao } =
    usePermissao()

  if (
    permissao &&
    !temPermissao(permissao)
  ) {
    return (
      <Navigate
        to="/veiculos"
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
          element={<PublicLayout />}
        >

          <Route
            path="/login"
            element={<Login />}
          />

        </Route>

        {/* =========================
            🔒 PRIVADO
        ========================== */}
        <Route
          element={<PrivateRoute />}
        >

          <Route
            element={<PrivateLayout />}
          >

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* VEÍCULOS */}
            <Route
              path="/veiculos"
              element={
                <ProtectedPermissionRoute permissao="veiculo.visualizar">
                  <Veiculos />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/veiculos/novo"
              element={
                <ProtectedPermissionRoute permissao="veiculo.criar">
                  <VeiculoForm />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/veiculos/editar/:id"
              element={
                <ProtectedPermissionRoute permissao="veiculo.editar">
                  <VeiculoForm />
                </ProtectedPermissionRoute>
              }
            />

            {/* VENDAS */}
            <Route
              path="/vendas"
              element={
                <ProtectedPermissionRoute permissao="venda.visualizar">
                  <Vendas />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/vendas/nova"
              element={
                <ProtectedPermissionRoute permissao="venda.criar">
                  <VendaForm />
                </ProtectedPermissionRoute>
              }
            />

            {/* LOJAS */}
            <Route
              path="/lojas"
              element={
                <ProtectedPermissionRoute permissao="loja.visualizar">
                  <Lojas />
                </ProtectedPermissionRoute>
              }
            />

            {/* USUÁRIOS */}
            <Route
              path="/usuarios"
              element={
                <ProtectedPermissionRoute permissao="usuario.visualizar">
                  <Usuarios />
                </ProtectedPermissionRoute>
              }
            />

            {/* LEADS */}
            <Route
              path="/leads"
              element={
                <ProtectedPermissionRoute permissao="lead.visualizar">
                  <Leads />
                </ProtectedPermissionRoute>
              }
            />

            {/* PERMISSÕES */}
            <Route
              path="/permissoes"
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

        {/* LOGIN PADRÃO */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* QUALQUER OUTRA */}
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

    </BrowserRouter>
  )
}