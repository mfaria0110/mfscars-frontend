import "./styles/footer.css"
import { usePlano } from "../modules/plano/usePlano"
import { usePermissao } from "../modules/permissao/usePermissao"
import { useAppStore } from "../store/useAppStore"

export default function Footer() {
  const lojaId = useAppStore(
    state => state.lojaId
  )

  const isChangingLoja =
    useAppStore(
      state => state.isChangingLoja
    )

  const { temPermissao } =
    usePermissao()

  /*
    HOOK SEMPRE EXECUTA
  */
  const {
    planos,
    planoAtual,
    trocar
  } = usePlano()

  /*
    Apenas bloqueia render
  */
  if (!lojaId) {
    return null
  }

  if (isChangingLoja) {
    return null
  }

  if (
    !temPermissao(
      "plano.visualizar"
    )
  ) {
    return null
  }

  return (
    <div className="footer">
      <div className="footer-planos">
        {planos.map((p) => {
          const isAtual =
            planoAtual &&
            p.id ===
              planoAtual.plano_id

          return (
            <div
              key={p.id}
              className={`plano-card 
              ${
                p.destaque
                  ? "destaque"
                  : ""
              }
              ${
                isAtual
                  ? "ativo"
                  : ""
              }`}
            >
              <h3>{p.nome}</h3>

              <div className="preco">
                R$ {p.preco}
              </div>

              <div className="limite">
                {
                  p.limite_veiculos
                } veículos
              </div>

              {isAtual ? (
                <button disabled>
                  Plano Atual
                </button>
              ) : temPermissao(
                  "plano.editar"
                ) ? (
                <button
                  onClick={() =>
                    trocar(p.id)
                  }
                >
                  Escolher
                </button>
              ) : (
                <button disabled>
                  Sem permissão
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}