import { useState, useEffect } from "react"
import "./styles/sidebar.css"
import { NavLink } from "react-router-dom"
import { useAppStore } from "../store/useAppStore"
import { usePermissao } from "../modules/permissao/usePermissao"

import { useMenus } from "../modules/menu/useMenus"

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false)

  const usuario = useAppStore(state => state.usuario)
  const lojaId = useAppStore(state => state.lojaId)
  const lojas = useAppStore(state => state.lojas)

  const { temPermissao } = usePermissao()

  const { menus, loading } = useMenus()

  const lojaAtual = lojas.find(
    l => Number(l.id) === Number(lojaId)
  )

  const isMaster = usuario?.master === true

  function MenuItem({
    to,
    icon,
    label,
    permissao,
      badge
   }) {

    const permitido =
      !permissao || isMaster || temPermissao(permissao)

    if (!permitido) return null

    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          "sidebar-item" +
          (isActive ? " active" : "")
        }
      >
        <span className="sidebar-icon">{icon}</span>

        <span className="sidebar-text">
          {label}
          {badge && <span className="badge">{badge}</span>}
        </span>
      </NavLink>
    )
  }

  useEffect(() => {
    function handleResize() {
      setCollapsed(window.innerWidth <= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const faltando = 0

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-logo">
        🚗 <span className="sidebar-text">MFS Cars</span>
      </div>

      <div className="sidebar-toggle">
        <button onClick={() => setCollapsed(prev => !prev)}>
          ☰
        </button>
      </div>

<div className="sidebar-menu">

  {loading && (
    <div className="sidebar-loading">
      Carregando menus...
    </div>
  )}

{!loading && menus.map(menu => (
  <MenuItem
    key={menu.id}
    to={menu.rota}
    icon={menu.icone}
    label={menu.nome}
    permissao={menu.permissao}
  />
))}

{

  isMaster && (

    <MenuItem
      to="/juridico"
      icon="📜"
      label="Jurídico"
    />

  )
}

</div>

<div className="sidebar-footer">

  <div style={{
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6
  }}>

    MFS Cars Marketplace © 2026

  </div>

  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 13
  }}>

    <span>
      📧
    </span>

    <span style={{
      color: "#22c55e"
    }}>
      mfaria2016@outlook.com
    </span>

    <span style={{
      color: "#94a3b8"
    }}>
      |
    </span>

    <span>
      📱
    </span>

    <span style={{
      color: "#22c55e"
    }}>
      (24) 99972-6811
    </span>

  </div>

</div>

    </div>
  )
}