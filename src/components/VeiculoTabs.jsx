import { useState } from "react"
import toast from "react-hot-toast"

export default function VeiculoTabs({ children }) {

  const [tab, setTab] = useState("dados")

  return (
    <div>

      {/* 🔥 HEADER */}
      <div className="tabs-header">

        <button
          type="button" // 🔥 FIX CRÍTICO
          className={tab === "dados" ? "active" : ""}
          onClick={() => setTab("dados")}
        >
          Dados
        </button>

        <button
          type="button" // 🔥 FIX CRÍTICO
          className={tab === "fotos" ? "active" : ""}
          onClick={() => {
            setTab("fotos")
            toast("Aba Fotos")
          }}
        >
          Fotos
        </button>

        <button
          type="button" // 🔥 FIX CRÍTICO
          className={tab === "opcionais" ? "active" : ""}
          onClick={() => setTab("opcionais")}
        >
          Opcionais
        </button>

          {/* 🔥 AQUI */}
  <button
    type="button"
    className={tab === "proprietario" ? "active" : ""}
    onClick={() => setTab("proprietario")}
  >
    Proprietário
  </button>

  <button
    type="button"
    className={tab === "documentos" ? "active" : ""}
    onClick={() => setTab("documentos")}
  >
    Documentos
  </button>

      </div>

      {/* 🔥 CONTEÚDO */}
      <div className="tabs-content">
        {children(tab)}
      </div>

    </div>
  )
}