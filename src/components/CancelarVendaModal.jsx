import { useState } from "react"
import "./styles/modal.css"

export default function CancelarVendaModal({
  open,
  onClose,
  onConfirm
}) {
  const [motivo, setMotivo] = useState("")

  if (!open) return null

  function handleConfirm() {
    if (!motivo || motivo.trim().length < 3) {
      alert("Informe um motivo válido")
      return
    }

    onConfirm(motivo)
    setMotivo("")
  }

return (
  <div className="modal-overlay">
    <div className="modal-box">

      <h2>Cancelar venda</h2>

      <label>Motivo do cancelamento</label>

      <textarea
        placeholder="Descreva o motivo..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="btn-secondary"
          onClick={onClose}
        >
          Fechar
        </button>

        <button
          className="btn-danger"
          onClick={handleConfirm}
        >
          Confirmar cancelamento
        </button>
      </div>

    </div>
  </div>
)
  
}