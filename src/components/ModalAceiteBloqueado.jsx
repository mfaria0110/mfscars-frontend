import "./styles/modalAceiteBloqueado.css"

export default function ModalAceiteBloqueado({

  aberto,

  onClose

}) {

  if (!aberto) return null

  return (

    <div className="modal-bloqueio-overlay">

      <div className="modal-bloqueio">

        <div className="modal-bloqueio-icon">

          ⚠️

        </div>

        <h2>

          Novos termos disponíveis

        </h2>

        <p>

          Solicite ao administrador da empresa
          que faça login e realize o aceite
          dos novos termos de uso,
          privacidade e cookies.

        </p>

        <button

          onClick={onClose}

          className="modal-bloqueio-btn"

        >

          Entendi

        </button>

      </div>

    </div>
  )
}