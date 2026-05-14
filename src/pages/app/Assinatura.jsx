import {
  useEffect,
  useState
} from "react"

import {
  getPlanos,
  getPlanoAtual,
  assinarPlano
} from "../../modules/plano/plano.service"

export default function Assinatura() {

  const [planos, setPlanos] =
    useState([])

  const [planoAtual, setPlanoAtual] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  async function carregar() {
    try {

      const [
        planosData,
        planoAtualData
      ] = await Promise.all([
        getPlanos(),
        getPlanoAtual()
      ])

      setPlanos(planosData)
      setPlanoAtual(planoAtualData)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleAssinar(
    planoId
  ) {
    try {

      const response =
        await assinarPlano(
          planoId
        )

      if (
        response?.init_point
      ) {
        window.location.href =
          response.init_point
      }

    } catch (err) {

      console.error(err)

      alert(
        err.message ||
        "Erro ao iniciar assinatura"
      )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    )
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Assinatura
      </h1>

      {planoAtual && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">

          <h2 className="text-lg font-bold mb-2">
            Plano Atual
          </h2>

          <p>
            {planoAtual.nome}
          </p>

          <p>
            {planoAtual.usados}
            {" / "}
            {planoAtual.limite_veiculos}
            {" "}veículos
          </p>

          <p>
            Status:
            {" "}
            {planoAtual.status}
          </p>

          <p>
            Renova em:
            {" "}
            {planoAtual.ciclo_fim}
          </p>

        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {planos.map((plano) => (

          <div
            key={plano.id}
            className="bg-white rounded-xl shadow p-4"
          >

            <h2 className="text-xl font-bold mb-2">
              {plano.nome}
            </h2>

            <p className="text-green-600 text-2xl font-bold mb-2">
              R$ {plano.valor}
            </p>

            <p className="mb-4">
              {plano.limite_veiculos}
              {" "}veículos
            </p>

            <button
              onClick={() =>
                handleAssinar(
                  plano.id
                )
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Escolher Plano
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}