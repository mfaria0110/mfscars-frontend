import { useState } from "react"
import { getFoto } from "../utils/getFoto"
import "./styles/veiculoCard.css"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import toast from "react-hot-toast"

import { usePermissao } from "../modules/permissao/usePermissao"

import { useAppStore } from "../store/useAppStore"
import CancelarVendaModal from "./CancelarVendaModal"

export default function VeiculoCard({ v, invalidate, onCancelar }) {
  const navigate = useNavigate()

  const { temPermissao } = usePermissao()

  // ✅ HOOK TEM QUE FICAR AQUI DENTRO
  const permissoes = useAppStore(state => state.permissoes)

  function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

function handleVender() {
  navigate(`/app/vendas/nova?veiculo_id=${v.id}`)
}

  function handleEditar() {
    navigate(`/app/veiculos/editar/${v.id}`)
  }

  async function handleExcluir() {
    if (!confirm(`Deseja Excluir: ${v.marca} ${v.modelo}?`)) return

    try {
      await api.delete(`/veiculos/${v.id}`)
      toast.success("Veículo excluído")
      invalidate?.()
    } catch (e) {
      console.error(e)
      toast.error("Erro ao excluir")
    }
  }

  return (
    <div className="veiculo-card">

      <div className="veiculo-img">
        <img src={getFoto(v.foto)} alt={v.modelo} />
      </div>

      <div className="veiculo-info">

        <div className="modelo">
          {v.marca} / {v.modelo}
        </div>

        <div className="detalhes">
          Ano: {v.ano_modelo} / Placa: {v.placa || "-"}
        </div>

        <div className="valor">
          {formatarValor(v.valor)}
        </div>

        <div className="cor">
          Cor: {v.cor}
        </div>

        <div className="actions">

          {v.status === "vendido" ? (
            <>
              <span className="badge vendido">Vendido</span>

{temPermissao("venda.cancelar") && (

  <button
    className="btn cancelar"
    
    onClick={() => onCancelar(v.id)}
  >
    Cancelar
  </button>
)}
              
            </>
          ) : (
            <>
 {temPermissao("veiculo.editar") && (
  <button
    className="btn editar"
    onClick={handleEditar}
  >
    Editar
  </button>
)}

{temPermissao("veiculo.excluir") && (
  <button
    className="btn excluir"
    onClick={handleExcluir}
  >
    Excluir
  </button>
)}

{temPermissao("venda.criar") && (
  <button
    className="btn vender"
    onClick={handleVender}
  >
    Vender
  </button>
)}
              
            </>
          )}

        </div>

      </div>


    </div>
  )
}