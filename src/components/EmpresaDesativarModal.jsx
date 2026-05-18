import { useState }
  from "react"

import "./styles/empresaDesativarModal.css"

export default function EmpresaDesativarModal({

  empresa,
  aberto,
  onClose,
  onConfirmar

}) {

  const [senha, setSenha] =
    useState("")

  const [motivo, setMotivo] =
    useState("")

  const [observacao,
    setObservacao] =
      useState("")

  const [loading,
    setLoading] =
      useState(false)

  if (!aberto) return null

  async function handleConfirmar(){

    try {

      setLoading(true)

      await onConfirmar({

        senha,
        motivo,
        observacao

      })

      setSenha("")
      setMotivo("")
      setObservacao("")

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          Confirmar desativação
        </h2>

        <p>

          Você está desativando:

          <strong>

            {" "}
            {empresa?.nome}

          </strong>

        </p>

        <p>

          Esta ação bloqueará
          imediatamente o acesso
          da empresa ao sistema.

        </p>

        <p className="alert-danger-text">

          Após 90 dias os dados
          poderão ser excluídos
          permanentemente.

        </p>

        <input

          type="password"

          placeholder="Senha master"

          value={senha}

          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }

        />

        <textarea

          placeholder="Motivo"

          value={motivo}

          onChange={(e) =>
            setMotivo(
              e.target.value
            )
          }

        />

        <textarea

          placeholder="Observação"

          value={observacao}

          onChange={(e) =>
            setObservacao(
              e.target.value
            )
          }

        />

        <div className="modal-actions">

          <button
            onClick={onClose}
          >

            Cancelar

          </button>

          <button

            className="btn-danger"

            disabled={

              loading ||

              !senha ||

              motivo.trim().length < 10

            }

            onClick={
              handleConfirmar
            }

          >

            {

              loading

                ? "Desativando..."

                : "Confirmar"

            }

          </button>

        </div>

      </div>

    </div>
  )
}