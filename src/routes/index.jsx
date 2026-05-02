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

import { usePermissao } from "../modules/permissao/usePermissao"

import Vendas from "../pages/app/Vendas"


function ProtectedPermissionRoute({
  children,
  permissao
}) {
  const { temPermissao } =
    usePermissao()

  if (
    permissao &&
    !temPermissao(
      permissao
    )
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
        <Route
          element={
            <PublicLayout />
          }
        >
          <Route
            path="/login"
            element={<Login />}
          />
        </Route>

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
  path="/app/vendas"
  element={
    <ProtectedPermissionRoute permissao="venda.visualizar">
      <Vendas />
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

            <Route
              path="/app/vendas/nova"
              element={
                <ProtectedPermissionRoute permissao="venda.criar">
                  <VendaForm />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/lojas"
              element={
                <ProtectedPermissionRoute permissao="loja.visualizar">
                  <Lojas />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/usuarios"
              element={
                <ProtectedPermissionRoute permissao="usuario.visualizar">
                  <Usuarios />
                </ProtectedPermissionRoute>
              }
            />

            <Route
              path="/app/leads"
              element={
                <ProtectedPermissionRoute permissao="lead.visualizar">
                  <Leads />
                </ProtectedPermissionRoute>
              }
            />

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

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}