import { usePermissao } from "../modules/permissao/usePermissao"
export default function VeiculoOpcionais({
  lista,
  selecionados,
  toggle
}) {

   const { temPermissao } = usePermissao()

  return (
    <div className="opcionais-grid">

      {lista.map(op => (
        <label key={op.id} className="op-item">

<input
  type="checkbox"
  checked={selecionados.includes(op.id)}
  onChange={() => {
    if (temPermissao("veiculo.editar")) {
      toggle(op.id)
    }
  }}
  disabled={!temPermissao("veiculo.editar")}
/>

          <span>{op.nome}</span>

        </label>
      ))}

    </div>
  )
}