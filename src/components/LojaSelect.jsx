import { useEffect, useState } from "react"
import { useLoja } from "../modules/loja/useLoja"
import { useAppStore } from "../store/useAppStore"
import { useQueryClient } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"

export default function LojaSelect() {

  const lojaId = useAppStore(state => state.lojaId)
  const { trocarLoja } = useLoja()

  const queryClient = useQueryClient()
  const { temPermissao } = usePermissao()

  const [lojas, setLojas] = useState([])

  useEffect(() => {
    const l = JSON.parse(localStorage.getItem("lojas") || "[]")
    setLojas(l)
  }, [])

function handleChange(e) {

  if (!temPermissao("loja.trocar")) {
    alert("Sem permissão para trocar loja")
    return
  }

  const id = Number(e.target.value)

  trocarLoja(id)

  queryClient.invalidateQueries()
}

return (
  <>
    {temPermissao("loja.trocar") ? (

      <select
        value={lojaId || ""}
        onChange={handleChange}
      >
        <option value="">
          Selecione uma loja
        </option>

        {lojas.map(l => (
          <option key={l.id} value={l.id}>
            {l.nome || `Loja ${l.id}`}
          </option>
        ))}

      </select>

    ) : (

      <div>
        {
          lojas.find(l => Number(l.id) === Number(lojaId))?.nome
          || "Sem permissão para trocar loja"
        }
      </div>

    )}
  </>
)
  
}