import { usePermissao } from "../modules/permissao/usePermissao"

export default function VeiculoFotos({
  preview,
  handleSelect,
  remover,
  upload,
  modo,
  veiculoId 
}) {

 const { temPermissao } = usePermissao()

  return (
    <div>

{temPermissao("veiculo.editar") && (
  <input
    type="file"
    multiple
    onChange={handleSelect}
  />
)}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>

        {preview.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={p.url}
              width={100}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />

{temPermissao("veiculo.editar") && (
  <button
    onClick={() => remover(i)}
    style={{
      position: "absolute",
      top: 0,
      right: 0
    }}
  >
    ❌
  </button>
)}

            
          </div>
        ))}

      </div>

{temPermissao("veiculo.editar") && (
  <button
    type="button"
    onClick={() => upload(Number(veiculoId))}
    disabled={modo === "create"}
  >
    Enviar fotos
  </button>
)}

      {modo === "create" && (
        <p>Salve o veículo primeiro</p>
      )}

    </div>
  )
}