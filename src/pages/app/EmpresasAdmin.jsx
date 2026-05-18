import {
  useEffect,
  useState
} from "react"

import api
  from "../../api/api"

import toast
  from "react-hot-toast"

import "./empresasAdmin.css"

export default function EmpresasAdmin(){

  const [empresas, setEmpresas] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [empresaSelecionada,
    setEmpresaSelecionada] =
      useState(null)

  const [senha, setSenha] =
    useState("")

  const [motivo, setMotivo] =
    useState("")

  const [observacao,
    setObservacao] =
      useState("")

  /* =========================
     CARREGAR
  ========================= */

  async function carregar(){

    try {

      const { data } =
        await api.get(
          "/empresa-admin"
        )

      setEmpresas(data)

    } catch(e){

      console.error(e)

      toast.error(
        "Erro ao carregar empresas"
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    carregar()

  }, [])

  /* =========================
     DESATIVAR
  ========================= */

  async function confirmarDesativacao(){

    try {

      await api.post(

        `/empresa-admin/${empresaSelecionada.id}/desativar`,

        {
          senha,
          motivo,
          observacao
        }

      )

      toast.success(
        "Empresa desativada"
      )

      setEmpresaSelecionada(null)

      setSenha("")
      setMotivo("")
      setObservacao("")

      carregar()

    } catch(e){

      console.error(e)

      toast.error(

        e.response?.data?.erro ||

        "Erro ao desativar"

      )
    }
  }

  /* =========================
     RESTAURAR
  ========================= */

  async function restaurar(id){

    try {

      await api.post(

        `/empresa-admin/${id}/restaurar`

      )

      toast.success(
        "Empresa restaurada"
      )

      carregar()

    } catch(e){

      console.error(e)

      toast.error(
        "Erro ao restaurar"
      )
    }
  }

  if (loading) {

    return (
      <div>
        Carregando...
      </div>
    )
  }

  return (

    <div className="empresas-admin">

      <h1>
        Empresas
      </h1>

      <table className="empresas-table">

        <thead>

          <tr>

            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cidade</th>
            <th>Status</th>
            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          {

            empresas.map(e => (

              <tr key={e.id}>

                <td>{e.id}</td>

                <td>{e.nome}</td>

                <td>{e.email}</td>

                <td>
                  {e.cidade}/{e.estado}
                </td>

                <td>

                  {

                    e.ativo

                    ? "🟢 Ativa"

                    : "🔴 Desativada"

                  }

                </td>

                <td>

                  {

                    e.ativo ? (

                      <button

                        className="btn-danger"

                        onClick={() =>
                          setEmpresaSelecionada(e)
                        }

                      >

                        Desativar

                      </button>

                    ) : (

                      <button

                        className="btn-success"

                        onClick={() =>
                          restaurar(e.id)
                        }

                      >

                        Restaurar

                      </button>

                    )

                  }

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

      {/* =========================
         MODAL
      ========================= */}

      {

        empresaSelecionada && (

          <div className="modal-overlay">

            <div className="modal-box">

              <h2>
                Confirmar desativação
              </h2>

              <p>

                Esta ação bloqueará
                o acesso da empresa.

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

                  onClick={() =>
                    setEmpresaSelecionada(null)
                  }

                >

                  Cancelar

                </button>

                <button

                  className="btn-danger"

                  onClick={
                    confirmarDesativacao
                  }

                >

                  Confirmar

                </button>

              </div>

            </div>

          </div>

        )

      }

    </div>
  )
}