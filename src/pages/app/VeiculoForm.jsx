import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import api from "../../api/api"

import { useQueryClient } from "@tanstack/react-query"

import { useVeiculoForm } from "../../modules/veiculo/useVeiculoForm"
import { useVeiculoFotos } from "../../modules/veiculo/useVeiculoFotos"
import { useOpcionais } from "../../modules/veiculo/useOpcionais"
import { useMarcaModelo } from "../../modules/veiculo/useMarcaModelo"
import { useProprietario } from "../../modules/veiculo/useProprietario"
import { useDocumentos } from "../../modules/veiculo/useDocumentos"
import { usePermissao } from "../../modules/permissao/usePermissao"

import VeiculoFotos from "../../components/VeiculoFotos"
import VeiculoTabs from "../../components/VeiculoTabs"
import VeiculoOpcionais from "../../components/VeiculoOpcionais"

import { formatarMoeda } from "../../utils/moeda"
import { maskCNPJ, maskTelefone } from "../../utils/masks"

import { useAppStore } from "../../store/useAppStore"

import "../../components/styles/veiculo-detalhes.css"

export default function VeiculoForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const lojaId = useAppStore(state => state.lojaId)

  const { temPermissao } = usePermissao()

  const podeCriar = temPermissao("veiculo.criar")
  const podeEditar = temPermissao("veiculo.editar")
  const podeVisualizar = temPermissao("veiculo.visualizar")

  const modo = id ? "edit" : "create"

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!lojaId) {
      toast.error(
        "Selecione uma loja antes de continuar"
      )
      navigate("/app/veiculos")
      return
    }

    if (modo === "create" && !podeCriar) {
      toast.error(
        "Sem permissão para criar veículo"
      )
      navigate("/app/veiculos")
      return
    }

    if (modo === "edit" && !podeEditar) {
      toast.error(
        "Sem permissão para editar veículo"
      )
      navigate("/app/veiculos")
    }
  }, [
    lojaId,
    navigate,
    modo,
    podeCriar,
    podeEditar
  ])

  if (!podeVisualizar && modo === "edit") {
    return (
      <p style={{ padding: 20 }}>
        Sem permissão para visualizar veículo
      </p>
    )
  }

  const {
    form,
    setForm,
    handleChange,
    salvar,
    loading
  } = useVeiculoForm(id)

  const marcaModelo = useMarcaModelo(
    form.marca_id
  )

  const opcionais = useOpcionais(id)
  const fotos = useVeiculoFotos(id)
  const proprietario = useProprietario(id)

const [veiculoIdAtual, setVeiculoIdAtual] = useState(id || null)

const documentos = useDocumentos(veiculoIdAtual)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const veiculo =
        await salvar(
          opcionais.selecionados
        )

      if (!veiculo && !id) {
        throw new Error(
          "Erro ao salvar veículo"
        )
      }

const veiculoId = id
  ? Number(id)
  : veiculo?.id || veiculo?.veiculo?.id
  setVeiculoIdAtual(veiculoId)

      if (!veiculoId) {
        throw new Error(
          "ID inválido"
        )
      }

      if (
        proprietario.form.nome
      ) {
        await proprietario.salvar(
          veiculoId
        )
      }

if (documentos.file) {
  await documentos.upload(veiculoId)
}

if (veiculoId) {
  await fotos.upload(
    veiculoId
  )
}

/* força atualizar lista */
window.dispatchEvent(
  new Event("veiculoUpdated")
)

await queryClient.invalidateQueries({
  queryKey: ["veiculos"],
  exact: false
})

await queryClient.invalidateQueries({
  queryKey: ["dashboard"],
  exact: false
})

window.dispatchEvent(
  new Event("veiculoUpdated")
)

toast.success(
  "Veículo salvo com sucesso"
)

/*
 força tela desmontar e montar novamente
*/
if (!id && veiculoId) {
  navigate(`/app/veiculos/editar/${veiculoId}`)
}


    } catch (e) {
      console.error(
        "ERRO:",
        e
      )

      toast.error(
        e.response?.data
          ?.erro ||
          e.message
      )
    }
  }

  return (
    <div className="editar-veiculo-page">
      <h3>
        {modo === "edit"
          ? "Editar veículo"
          : "Novo veículo"}
      </h3>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="editar-veiculo-tabs">
          <VeiculoTabs>
            {(tab) => (
              <>
                {tab ===
                  "dados" && (
                  <div className="editar-veiculo-content">
                    <div className="proprietario-grid">
                      <div className="proprietario-group">
                        <label>
                          Marca
                        </label>

                        <input
                          name="marca"
                          list="listaMarcas"
                          value={
                            form.marca
                          }
                          onChange={(
                            e
                          ) => {
                            const nome =
                              e
                                .target
                                .value

                            const marcaSelecionada =
                              marcaModelo.marcas.find(
                                m =>
                                  m.nome.toLowerCase() ===
                                  nome.toLowerCase()
                              )

                            setForm(
                              prev => ({
                                ...prev,
                                marca:
                                  nome,
                                marca_id:
                                  marcaSelecionada?.id ||
                                  null,
                                modelo:
                                  ""
                              })
                            )
                          }}
                        />

                        <datalist id="listaMarcas">
                          {marcaModelo.marcas.map(
                            m => (
                              <option
                                key={
                                  m.id
                                }
                                value={
                                  m.nome
                                }
                              />
                            )
                          )}
                        </datalist>
                      </div>

                      <div className="proprietario-group">
                        <label>
                          Modelo
                        </label>

                        <input
                          name="modelo"
                          list="listaModelos"
                          value={
                            form.modelo
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <datalist id="listaModelos">
                          {marcaModelo.modelos.map(
                            m => (
                              <option
                                key={
                                  m.id
                                }
                                value={
                                  m.nome
                                }
                              />
                            )
                          )}
                        </datalist>
                      </div>

                    {/* VERSÃO */}
                    <div className="proprietario-group">
                      <label>Versão</label>
                      <input
                        name="versao"
                        value={form.versao}
                        onChange={handleChange}
                      />
                    </div>

                      <div className="proprietario-group">
                        <label>
                          Valor
                        </label>

                        <input
                          name="valor"
                          value={formatarMoeda(
                            form.valor
                          )}
                          onChange={
                            handleChange
                          }
                        />
                      </div>

                      <div className="proprietario-group">
                        <label>
                          Ano
                        </label>

                        <input
                          name="ano_modelo"
                          type="text"
                          value={
                            form.ano_modelo
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>


                    <div className="proprietario-group">
                      <label>Km</label>
                      <input name="quilometragem" value={form.quilometragem} onChange={handleChange} />
                    </div>

                    <div className="proprietario-group">
                      <label>Câmbio</label>
                      <select name="cambio" value={form.cambio} onChange={handleChange}>
                        <option>Manual</option>
                        <option>Automático</option>
                      </select>
                    </div>


<div className="proprietario-group">
<label>Carroceria</label>
<select name="carroceria" value={form.carroceria} onChange={handleChange}>
  <option>Sedã</option>
  <option>Hatch</option>
  <option>SUV</option>
  <option>Picape</option>
</select>
</div>



<div className="proprietario-group">
  <label>Combustível</label>
<select
  name="combustivel"
  value={form.combustivel}
  onChange={handleChange}
>
  <option>Gasolina</option>
  <option>Flex</option>
  <option>Diesel</option>
  <option>Elétrico</option>
</select>
</div>



                      <div className="proprietario-group">
                        <label>
                          Placa
                        </label>

                        <input
                          name="placa"
                          value={
                            form.placa
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>

<div className="proprietario-group">
<label>Renavam</label>
<input name="renavam" value={form.renavam} onChange={handleChange} />
</div>


                      <div className="proprietario-group">
                        <label>
                          Cor
                        </label>

                        <input
                          name="cor"
                          value={
                            form.cor
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>


<div className="proprietario-group">
  <label>AceitaTroca?</label>
<select
  name="aceita_troca"
  value={form.aceita_troca}
  onChange={handleChange}
>
  <option value="true">Sim</option>
  <option value="false">Não</option>
</select>
</div>

<div className="proprietario-group">
  <label>Licenciado?</label>
<select
  name="licenciado"
  value={form.licenciado}
  onChange={handleChange}
>
  <option value="true">Sim</option>
  <option value="false">Não</option>
</select>
</div>



                    </div>

                    <div className="proprietario-group2">
                      <label>
                        Observações
                      </label>

                      <textarea
                        name="descricao"
                        value={
                          form.descricao
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>
                  </div>
                )}

                {tab ===
                  "fotos" && (
                  <VeiculoFotos
                    preview={
                      fotos.preview
                    }
                    handleSelect={
                      fotos.handleSelect
                    }
                    remover={
                      fotos.remover
                    }
                    upload={
                      fotos.upload
                    }
                    veiculoId={id}
                    modo={modo}
                  />
                )}

                {tab ===
                  "opcionais" && (
                  <VeiculoOpcionais
                    lista={
                      opcionais.lista
                    }
                    selecionados={
                      opcionais.selecionados
                    }
                    toggle={
                      opcionais.toggle
                    }
                  />
                )}

{tab === "proprietario" && (
  <div className="proprietario-container">

    <div className="proprietario-grid">

      <div className="proprietario-group">
        <label>Nome</label>
        <input
          name="nome"
          value={proprietario.form.nome}
          onChange={proprietario.handleChange}
        />
      </div>

      <div className="proprietario-group">
        <label>CPF/CNPJ</label>
<input
  name="cpf_cnpj"
  value={proprietario.form.cpf_cnpj}
  onChange={(e) =>
    proprietario.handleChange({
      target: {
        name: "cpf_cnpj",
        value: maskCNPJ(e.target.value)
      }
    })
  }
/>


      </div>

      <div className="proprietario-group">
        <label>Telefone</label>
<input
  name="telefone"
  value={proprietario.form.telefone}
  onChange={(e) =>
    proprietario.handleChange({
      target: {
        name: "telefone",
        value: maskTelefone(e.target.value)
      }
    })
  }
/>
      </div>

      <div className="proprietario-group">
        <label>Email</label>
        <input
          name="email"
          value={proprietario.form.email}
          onChange={proprietario.handleChange}
        />
      </div>

      <div className="proprietario-group">
        <label>&nbsp;</label>

        <button
          type="button"
          className="btn-delete-documento"
          onClick={
            proprietario.excluir
          }
        >
          🗑 Excluir
        </button>
      </div>

    </div>
  </div>
)}

{tab === "documentos" && (
  <div className="documentos-container">

    {/* UPLOAD */}
    <div className="documentos-upload">

      <select
        value={documentos.tipo}
        onChange={(e) => documentos.setTipo(e.target.value)}
      >
        <option>CRLV</option>
        <option>DUT</option>
        <option>Contrato</option>
        <option>IPVA</option>
        <option>Vistoria Cautelar</option>
        <option>Outros</option>
      </select>

      <input
        type="file"
        onChange={(e) => documentos.setFile(e.target.files[0])}
      />

      <button
        type="button"
        onClick={() => {
          if (!id) {
            toast.error("Salve o veículo antes de enviar documentos")
            return
          }
          documentos.upload(id)
        }}
      >
        Upload
      </button>

    </div>

    {/* LISTA */}
    <div className="documentos-lista">

{documentos.lista.map(doc => (
  <div
    className="documento-item"
    key={doc.id}
  >
    <div className="documento-info">
      <span className="documento-tipo">
        {doc.tipo}
      </span>

<a
  className="documento-link"
  href={doc.arquivo}
  target="_blank"
  rel="noreferrer"
>
  Ver arquivo
</a>

    </div>

<button
  type="button"
  className="btn-delete-documento"
  onClick={async () => {
    try {
      await api.delete(
        `/veiculo-documento/${doc.id}`
      )

      toast.success(
        "Documento excluído com sucesso"
      )

      await documentos.carregar()

    } catch (e) {
      console.error(e)

      toast.error(
        e.response?.data?.erro ||
        "Erro ao excluir documento"
      )
    }
  }}
>
  🗑 Excluir
</button>
    
  </div>
))}

    </div>

  </div>
)}

            </>
          )}


          </VeiculoTabs>
        </div>

        {(podeCriar ||
          podeEditar) && (
          <button
            type="submit"
            disabled={
              loading
            }
            className={`btn-save ${
              loading
                ? "loading"
                : ""
            }`}
          >
            {loading
              ? "Salvando..."
              : "Salvar"}
          </button>
        )}
      </form>
    </div>
  )
}