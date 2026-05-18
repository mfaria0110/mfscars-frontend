import "./styles/empresaAdminTable.css"

export default function EmpresaAdminTable({

  empresas,
  onDesativar,
  onRestaurar,
  onEditar

}) {

  return (

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

          empresas.map(empresa => (

            <tr key={empresa.id}>

              <td>
                {empresa.id}
              </td>

              <td>
                {empresa.nome}
              </td>

              <td>
                {empresa.email}
              </td>

              <td>

                {empresa.cidade}/
                {empresa.estado}

              </td>

              <td>

                {

                  empresa.ativo

                    ? (
                      <span className="badge-active">

                        Ativa

                      </span>
                    )

                    : (
                      <span className="badge-inactive">

                        Desativada

                      </span>
                    )

                }

              </td>

              <td className="acoes">

                <button

                  className="btn-edit"

                  onClick={() =>
                    onEditar(empresa)
                  }

                >

                  Editar

                </button>

                {

                  empresa.ativo ? (

                    <button

                      className="btn-danger"

                      onClick={() =>
                        onDesativar(empresa)
                      }

                    >

                      Desativar

                    </button>

                  ) : (

                    <button

                      className="btn-success"

                      onClick={() =>
                        onRestaurar(empresa.id)
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
  )
}