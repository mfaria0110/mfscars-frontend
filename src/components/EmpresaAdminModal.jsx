import { useEffect, useState }
  from "react"

import "./styles/empresaAdminModal.css"

export default function EmpresaAdminModal({

  empresa,
  aberto,
  onClose,
  onSalvar

}) {

  const [form, setForm] =
    useState({

      nome: "",
      email: "",
      telefone: "",
      cidade: "",
      estado: "",
      cnpj: ""

    })

  useEffect(() => {

    if (empresa) {

      setForm({

        nome:
          empresa.nome || "",

        email:
          empresa.email || "",

        telefone:
          empresa.telefone || "",

        cidade:
          empresa.cidade || "",

        estado:
          empresa.estado || "",

        cnpj:
          empresa.cnpj || ""

      })
    }

  }, [empresa])

  if (!aberto) return null

  function handleChange(
    campo,
    valor
  ) {

    setForm(prev => ({

      ...prev,

      [campo]: valor

    }))
  }

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          Editar empresa
        </h2>

        <input

          placeholder="Nome"

          value={form.nome}

          onChange={(e) =>
            handleChange(
              "nome",
              e.target.value
            )
          }

        />

        <input

          placeholder="Email"

          value={form.email}

          onChange={(e) =>
            handleChange(
              "email",
              e.target.value
            )
          }

        />

        <input

          placeholder="Telefone"

          value={form.telefone}

          onChange={(e) =>
            handleChange(
              "telefone",
              e.target.value
            )
          }

        />

        <input

          placeholder="Cidade"

          value={form.cidade}

          onChange={(e) =>
            handleChange(
              "cidade",
              e.target.value
            )
          }

        />

        <input

          placeholder="Estado"

          value={form.estado}

          onChange={(e) =>
            handleChange(
              "estado",
              e.target.value
            )
          }

        />

        <input

          placeholder="CNPJ"

          value={form.cnpj}

          onChange={(e) =>
            handleChange(
              "cnpj",
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

            className="btn-success"

            onClick={() =>
              onSalvar(form)
            }

          >

            Salvar

          </button>

        </div>

      </div>

    </div>
  )
}