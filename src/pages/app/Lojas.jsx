import { useState, useEffect } from "react"
import { useLojas } from "../../modules/loja/useLojas"
import { usePermissao } from "../../modules/permissao/usePermissao"
import { useAppStore } from "../../store/useAppStore"
import api from "../../api/api"
import { buscarCNPJ } from "../../utils/buscarCNPJ"
import { buscarCEP } from "../../utils/buscarCEP"
import {
  maskCNPJ,
  maskTelefone,
  maskCEP
} from "../../utils/masks"
import toast from "react-hot-toast"

import "../../components/styles/lojas.css"
import { lazy, Suspense } from "react"
import TipTapEditor from "../../components/TipTapEditor"

const MapPicker = lazy(() =>
  import("../../components/MapPicker")
)

const API_URL =
  import.meta.env.VITE_API_URL

export default function Lojas() {

  /* ===============================
     🔐 USUÁRIO / PERMISSÃO
  ============================== */
const usuario = useAppStore(
  state => state.usuario
)

const isMaster =
  usuario?.master === true

const {
  temPermissao
} = usePermissao()

const podeVisualizar =
  temPermissao(
    "loja.visualizar"
  )

const podeCriar =
  temPermissao(
    "loja.criar"
  )

const podeEditar =
  temPermissao(
    "loja.editar"
  )

const podeExcluir =
  temPermissao(
    "loja.excluir"
  )

  /* ===============================
     🔥 HOOK
  ============================== */
  const { salvar, buscar, excluir } = useLojas()

  /* ===============================
     🎯 STATE
  ============================== */
const [lojas, setLojas] = useState([])
const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)

  const [form, setForm] = useState({

  nome: "",
  cnpj: "",
  telefone: "",
  cidade: "",
  estado: "",
  endereco: "",
  numero: "",
  bairro: "",
  cep: "",
  latitude: "",
  longitude: "",
  descricao: "",
  instagram: "",
  facebook: "",
  site: "",
  horario_funcionamento: "",
  status: "ATIVO",
  logo: "",

  clausulas: "",
  garantia: "",
  transferencia: ""
})

  const [logoFile, setLogoFile] =
  useState(null)

  const [senha, setSenha] = useState("")
  const [modalSenha, setModalSenha] = useState(false)
  const [lojaParaExcluir, setLojaParaExcluir] = useState(null)


const lojaId = useAppStore(state => state.lojaId)

  useEffect(() => {
    async function carregar() {
      if (!podeVisualizar) {
        setLoading(false)
        return
      }

      try {
        const res =
          await api.get("/lojas")

        setLojas(
          res.data || []
        )
      } catch (e) {
        console.error(e)
        toast.error(
          "Erro ao carregar lojas"
        )
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [lojaId, podeVisualizar])


  /* ===============================
     ➕ NOVO
  ============================== */
function abrirNovo() {
  if (!podeCriar) {
    toast.error(
      "Sem permissão para criar loja"
    )
    return
  }

  setEditando(null)
  setForm({
  nome: "",
  cnpj: "",
  telefone: "",
  cidade: "",
  estado: "",
  endereco: "",
  numero: "",
  bairro: "",
  cep: "",
  latitude: "",
  longitude: "",
  descricao: "",
  instagram: "",
  facebook: "",
  site: "",
  horario_funcionamento: "",
  status: "ATIVO",
  logo: "",
  clausulas: "",

garantia: "",

transferencia: ""
})
  setLogoFile(null)
  setModal(true)
}

  /* ===============================
     ✏️ EDITAR
  ============================== */
async function editar(id) {

  if (!podeEditar) {

    toast.error(
      "Sem permissão para editar loja"
    )

    return
  }

  try {

    const res =
      await api.get(
        `/lojas/${id}`
      )

    const loja =
      res.data || {}

    let clausulas = {}

    try {

      const clausulasRes =
        await api.get(
          `/loja-clausula/${id}`
        )

      clausulas =
        clausulasRes.data || {}

    } catch(err) {

      console.log(
        "Sem cláusulas"
      )
    }

    setEditando(id)

    setForm({

      nome:
        loja.nome || "",

      cnpj:
        maskCNPJ(
          loja.cnpj || ""
        ),

      telefone:
        maskTelefone(
          loja.telefone || ""
        ),

      cidade:
        loja.cidade || "",

      estado:
        loja.estado || "",

      endereco:
        loja.endereco || "",

      numero:
        loja.numero || "",

      bairro:
        loja.bairro || "",

      cep:
        maskCEP(
          loja.cep || ""
        ),

      latitude:
        loja.latitude || "",

      longitude:
        loja.longitude || "",

      descricao:
        loja.descricao || "",

      instagram:
        loja.instagram || "",

      facebook:
        loja.facebook || "",

      site:
        loja.site || "",

      horario_funcionamento:
        loja.horario_funcionamento || "",

      status:
        loja.status || "ATIVO",

      logo:
        loja.logo || "",

      clausulas:
        clausulas?.clausulas || "",

      garantia:
        clausulas?.garantia || "",

      transferencia:
        clausulas?.transferencia || ""
    })

    setLogoFile(null)

    setModal(true)

  } catch (e) {

    console.error(e)

    toast.error(
      "Erro ao carregar loja"
    )
  }
}

  /* ===============================
     💾 SALVAR
  ============================== */
async function handleSalvar() {
  if (editando && !podeEditar) {
    toast.error(
      "Sem permissão para editar loja"
    )
    return
  }

  if (!editando && !podeCriar) {
    toast.error(
      "Sem permissão para criar loja"
    )
    return
  }

  try {
    if (!form.nome?.trim()) {
      toast.error(
        "Nome da loja é obrigatório"
      )
      return
    }

    if (!form.cnpj?.trim()) {
      toast.error(
        "CNPJ é obrigatório"
      )
      return
    }

    const cnpjLimpo =
      form.cnpj.replace(/\D/g, "")

    if (cnpjLimpo.length !== 14) {
      toast.error(
        "CNPJ inválido"
      )
      return
    }

const lojaDuplicada =
  lojas.find(l => {
    const cnpjExistente =
      String(
        l.cnpj || ""
      ).replace(/\D/g, "")

    return (
      cnpjExistente === cnpjLimpo &&
      Number(l.id) !== Number(editando)
    )
  })

    if (lojaDuplicada) {
      toast.error(
        "Já existe uma loja com este CNPJ"
      )
      return
    }

const formData = new FormData()

Object.entries(form).forEach(
  ([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      key !== "id" &&
      key !== "empresa_id" &&
      key !== "slug" &&
      key !== "data_cadastro" &&
      key !== "plano_id" &&
      key !== "created_at" &&
      key !== "updated_at" &&
      key !== "logo"
    ) {
      let valorFinal = value

      if (key === "cnpj") {
        valorFinal = String(value)
          .replace(/\D/g, "")
      }

      if (key === "telefone") {
        valorFinal = String(value)
          .replace(/\D/g, "")
      }

      if (key === "cep") {
        valorFinal = String(value)
          .replace(/\D/g, "")
      }

      formData.append(
        key,
        valorFinal
      )
    }
  }
)

if (logoFile) {
  formData.append(
    "logo",
    logoFile
  )
}

console.log("FORM:", form)

for (let pair of formData.entries()) {
  console.log(
    pair[0],
    pair[1]
  )
}

await salvar({
  dados: formData,
  id: editando
})

if(editando){

  await api.post(
    "/loja-clausula",
    {

      empresa_id:
        usuario?.empresa_id,
      loja_id:
        editando,
      clausulas:
        form.clausulas,
      garantia:
        form.garantia,
      transferencia:
        form.transferencia
    }
  )
}


    const res =
      await api.get("/lojas")

    setLojas(res.data || [])

    setModal(false)

    toast.success(
      editando
        ? "Loja atualizada com sucesso"
        : "Loja criada com sucesso"
    )

  } catch (e) {
    toast.error(
      e.response?.data?.erro ||
      e.response?.data?.message ||
      "Erro ao salvar loja"
    )
  }
}


  /* ===============================
     🗑️ EXCLUIR
  ============================== */
  function confirmarExclusao(
    loja
  ) {
    if (!podeExcluir) {
      toast.error(
        "Sem permissão para excluir loja"
      )
      return
    }

    setLojaParaExcluir(
      loja
    )

    setModalSenha(true)
  }

  async function executarExclusao() {
    if (!lojaParaExcluir)
      return

    if (!senha) {
      toast.error(
        "Digite sua senha"
      )
      return
    }

    try {
      await excluir({
        id: lojaParaExcluir.id,
        senha
      })

      const res =
        await api.get(
          "/lojas"
        )

      setLojas(
        res.data || []
      )

      setModalSenha(false)
      setSenha("")
      setLojaParaExcluir(
        null
      )

      toast.success(
        "Loja excluída com sucesso"
      )
    } catch (e) {
      toast.error(
        e.response?.data
          ?.erro ||
          "Erro ao excluir loja"
      )
    }
  }

if (!podeVisualizar) {
  return (
    <div style={{ padding: 30 }}>
      🚫 Sem permissão para visualizar lojas
    </div>
  )
}



  /* ===============================
     ⏳ LOADING
  ============================== */
    if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="lojas-page">

      {/* HEADER */}
      <div className="header">
        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
  🏪 Lojas
</h2>
        {podeCriar && (
  <button onClick={abrirNovo}>
    + Nova Loja
  </button>
)}
      </div>

      {/* LISTA */}
<div className="lista">
  {lojas.map((l) => (
    <div
      key={l.id}
      className="card"
    >
      <div>
        {l.logo && (
          <img
            src={`${API_URL}${l.logo}`}
            alt="logo"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              marginBottom: "10px"
            }}
          />
        )}

        <strong style={{ fontSize: "14px", fontWeight: 600 }}>
          {l.nome}
        </strong>

        <p style={{ fontSize: "13px", color: "#777" }}>
          {l.cidade || "-"} / {l.estado || "-"}
        </p>

      </div>

      <div className="card-actions">
        {podeEditar && (
          <button
            className="btn btn-edit"
            onClick={() =>
              editar(l.id)
            }
          >
            ✏️ Editar
          </button>
        )}

        {podeExcluir && (
          <button
            className="btn btn-delete"
            onClick={() =>
              confirmarExclusao(l)
            }
          >
            🗑️ Excluir
          </button>
        )}
      </div>
    </div>
  ))}
</div>

      {/* MODAL */}
     {modal && (
        <div className="modal">
          <div className="modal-content">

            <div className="modal-header">

  <h3>{editando ? "Editar Loja" : "Nova Loja"}</h3>

  <button
    className="modal-close"
    onClick={() => setModal(false)}
  >
    ✕
  </button>

</div>

            <div className="form-grid">

              {/* LINHA 1 */}
<div className="form-group col-3">
<label>CPF/CNPJ</label>
<input
  value={form.cnpj || ""}
  onChange={(e) => {
    const value =
      maskCNPJ(
        e.target.value
      )

    setForm(prev => ({
      ...prev,
      cnpj: value
    }))
  }}
  onBlur={async () => {
    if (
      !form.cnpj ||
      form.cnpj.length !== 18
    ) {
      return
    }

    const dados =
      await buscarCNPJ(
        form.cnpj
      )

    if (!dados) return

    setForm(prev => ({
      ...prev,
      ...dados
    }))
  }}
/>
</div>

<div className="form-group col-3">
<label>Telefone</label>
<input
  value={form.telefone || ""}
  onChange={(e) => {
    const value = maskTelefone(e.target.value)
    setForm({ ...form, telefone: value })
  }}
/>
</div>

              <div className="form-group col-6">
                <label>Nome *</label>
      
                <input value={form.nome || ""} onChange={e => setForm({ ...form, nome: e.target.value })}/>
 
              </div>

              {/* LINHA 2 */}
              <div className="form-group col-4">
                <label>Cidade</label>
                <input value={form.cidade || ""} onChange={e => setForm({ ...form, cidade: e.target.value })}/>
              </div>

<div className="form-group col-2">
  <label>Estado</label>

  <input
    maxLength={2}
    value={form.estado || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .slice(0, 2)

      setForm({
        ...form,
        estado: value
      })
    }}
  />
</div>

              <div className="form-group col-6">
                <label>Endereço</label>
                <input value={form.endereco || ""} onChange={e => setForm({ ...form, endereco: e.target.value })}/>
              </div>

              {/* LINHA 3 */}
              <div className="form-group col-2">
                <label>Número</label>
                <input value={form.numero || ""} onChange={e => setForm({ ...form, numero: e.target.value })}/>
              </div>

              <div className="form-group col-4">
                <label>Bairro</label>
                <input value={form.bairro || ""} onChange={e => setForm({ ...form, bairro: e.target.value })}/>
              </div>

<div className="form-group col-2">
<label>CEP</label>
<input
  value={form.cep || ""}
  onChange={(e) => {
    const value = maskCEP(e.target.value)

    setForm(prev => ({
      ...prev,
      cep: value
    }))

    if (value.length === 9) {
      buscarCEP(value, setForm, toast)
    }
  }}
/>
</div>
              <div className="form-group col-2">
                <label>Latitude</label>
                <input value={form.latitude || ""} onChange={e => setForm({ ...form, latitude: e.target.value })}/>
              </div>

              <div className="form-group col-2">
                <label>Longitude</label>
                <input value={form.longitude || ""} onChange={e => setForm({ ...form, longitude: e.target.value })}/>
              </div>

              {/* REDES */}
              <div className="form-group col-4">
                <label>Instagram</label>
                <input value={form.instagram || ""} onChange={e => setForm({ ...form, instagram: e.target.value })}/>
              </div>

              <div className="form-group col-4">
                <label>Facebook</label>
                <input value={form.facebook || ""} onChange={e => setForm({ ...form, facebook: e.target.value })}/>
              </div>

              <div className="form-group col-4">
                <label>Site</label>
                <input value={form.site || ""} onChange={e => setForm({ ...form, site: e.target.value })}/>
              </div>

              <div className="form-group col-3">
                <label>Horário de funcionamento</label>
                <input value={form.horario_funcionamento || ""} onChange={e => setForm({ ...form, horario_funcionamento: e.target.value })}/>
              </div>

                {isMaster && (
                  <div className="form-group col-3">
                    <label>Status</label>
                    <select
                      value={form.status || "ATIVO"}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="ATIVO">ATIVO</option>
                      <option value="INATIVO">INATIVO</option>
                    </select>
                  </div>
                )}


<div className="form-group col-6">
  <label>Logo da Loja</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setLogoFile(
        e.target.files[0]
      )
    }
  />
</div>

<div className="form-group col-6">
  {logoFile ? (
    <img
      src={URL.createObjectURL(
        logoFile
      )}
      alt="Preview"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "contain",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    />
  ) : form.logo ? (
    <img
      src={`${API_URL}${form.logo}`}
      alt="Logo"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "contain",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    />
  ) : null}
</div>
 

              {/* TEXTOS */}
              <div className="form-group col-12">
                <label>Descrição</label>
                <textarea value={form.descricao || ""} onChange={e => setForm({ ...form, descricao: e.target.value })}/>
              </div>


{/* MAPA */}

<div className="form-group col-12">
  <label>Localização no mapa</label>

  <Suspense
    fallback={<p>Carregando mapa...</p>}
  >

    <MapPicker
      lat={
        form.latitude
          ? Number(form.latitude)
          : -44.477584
      }

      lng={
        form.longitude
          ? Number(form.longitude)
          : -46.6333
      }

      setForm={setForm}
    />

  </Suspense>

</div>




<div className="form-group col-12">

  <h3
    style={{
      marginTop:"20px"
    }}
  >
    📄 Contrato da Loja
  </h3>

</div>

{/* CLÁUSULAS */}

<div className="form-group col-12">

  <label>
    CLÁUSULAS CONTRATUAIS
  </label>

<TipTapEditor

  value={form.clausulas}

  onChange={(value)=>
    setForm(prev=>({
      ...prev,
      clausulas:value
    }))
  }
/>

</div>

{/* GARANTIA */}

<div className="form-group col-12">

  <label>
    GARANTIA
  </label>

<TipTapEditor

  value={form.garantia}

  onChange={(value)=>
    setForm(prev=>({
      ...prev,
      garantia:value
    }))
  }
/>

</div>

{/* TRANSFERÊNCIA */}

<div className="form-group col-12">

  <label>
    TRANSFERÊNCIA
  </label>

<TipTapEditor

  value={form.transferencia}

  onChange={(value)=>
    setForm(prev=>({
      ...prev,
      transferencia:value
    }))
  }
/>

</div>

<div className="preview col-12">

  <h4>Preview</h4>

  <div className="preview-card">
    <strong>{form.nome || "Nome da loja"}</strong>

    <p>
      {form.endereco || "Endereço"} {form.numero || ""}
    </p>

    <p>
      {form.cidade || ""} - {form.estado || ""}
    </p>

    <p>{form.telefone || ""}</p>
  </div>

</div>


            </div>

            <div className="actions">
              <button onClick={handleSalvar}>Salvar</button>
              <button onClick={() => setModal(false)}>Fechar</button>
            </div>

          </div>
        </div>
      )}


{/* 🔐 MODAL DE SENHA */}
{modalSenha && (
  <div className="modal">
    <div className="modal-content modal-small">

      <h3>🔐 Confirmar Exclusão</h3>

      <p>Digite sua senha para excluir a loja. Somente Administrador </p>

      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Digite sua senha"
      />

      <div className="actions">
        <button onClick={executarExclusao}>
          Confirmar Exclusão
        </button>

        <button onClick={() => {
  setModalSenha(false)
  setSenha("")
}}>
          Cancelar
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  )
}


