import { useEffect, useState } from "react"
import { useVeiculos } from "../../modules/veiculo/useVeiculos"
import { usePermissao } from "../../modules/permissao/usePermissao"
import { useDashboard } from "../../modules/dashboard/useDashboard"
import DashboardStats from "../../components/DashboardStats"
import VeiculoCard from "../../components/VeiculoCard"
import { useAppStore } from "../../store/useAppStore"

import CancelarVendaModal from "../../components/CancelarVendaModal"
import api from "../../api/api"
import toast from "react-hot-toast"

import "../../components/styles/veiculos.css"

export default function Veiculos() {

  /* ===============================
     🔥 VALIDAÇÃO DE LOJA (PRIMEIRO)
  ============================== */
  const lojaId = useAppStore(state => state.lojaId)

  if (!lojaId) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}>
        <h2>🏢 Selecione uma loja</h2>
        <p>Escolha uma loja no topo para continuar.</p>
      </div>
    )
  }

  /* ===============================
     🔥 HOOKS (SÓ DEPOIS DA LOJA)
  ============================== */
  const { temPermissao } = usePermissao()

  const {
    stats,
    loading: dashboardLoading
  } = useDashboard()

  const podeVisualizar =
    temPermissao("veiculo.visualizar")

  const podeCriar =
    temPermissao("veiculo.criar")

  const {
    veiculos,
    loading,
    filtros,
    setFiltros,
    invalidate,
    error,
    limparErro
  } = useVeiculos()

  const [modalCancelar, setModalCancelar] = useState({
    open: false,
    veiculoId: null
  })


  /* ===============================
     🔥 ATUALIZA LISTA
  ============================== */
  useEffect(() => {
    const atualizarLista = async () => {
      await invalidate()
    }

    window.addEventListener(
      "veiculoUpdated",
      atualizarLista
    )

    return () => {
      window.removeEventListener(
        "veiculoUpdated",
        atualizarLista
      )
    }
  }, [invalidate])

  /* ===============================
     🔥 PERMISSÃO
  ============================== */
  if (!podeVisualizar) {
    return (
      <div style={{ padding: 40 }}>
        🚫 Sem permissão para visualizar veículos
      </div>
    )
  }

  function limparFiltros() {
    setFiltros({})
  }

  /* ===============================
     🔥 RENDER
  ============================== */
  return (

    <div
      className="veiculos-page"
      style={{

        minHeight: "100vh",

        display: "flex",

        flexDirection: "column"

      }}
    >

      {/* DASHBOARD */}
      <DashboardStats stats={stats} />

      {/* FILTROS */}
      <div className="veiculos-filtros">

        <input
          placeholder="Marca"
          value={filtros.marca || ""}
          onChange={(e) =>
            setFiltros((f) => ({
              ...f,
              marca: e.target.value
            }))
          }
        />

        <input
          placeholder="Modelo"
          value={filtros.modelo || ""}
          onChange={(e) =>
            setFiltros((f) => ({
              ...f,
              modelo: e.target.value
            }))
          }
        />

        <input
          placeholder="Cor"
          value={filtros.cor || ""}
          onChange={(e) =>
            setFiltros((f) => ({
              ...f,
              cor: e.target.value
            }))
          }
        />

        <input
          placeholder="Placa"
          value={filtros.placa || ""}
          onChange={(e) =>
            setFiltros((f) => ({
              ...f,
              placa: e.target.value
            }))
          }
        />

        <input
          placeholder="Ano mínimo"
          value={filtros.anoMin || ""}
          onChange={(e) => {

            const value = e.target.value

            setFiltros((f) => ({
              ...f,
              anoMin:
                value === ""
                  ? undefined
                  : Number(value)
            }))
          }}
        />

        <input
          placeholder="Preço até"
          value={filtros.precoMax || ""}
          onChange={(e) => {

            const value = e.target.value

            setFiltros((f) => ({
              ...f,
              precoMax:
                value === ""
                  ? undefined
                  : Number(value)
            }))
          }}
        />

        {Object.keys(filtros).length > 0 && (

          <button
            className="btn-clear"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>

        )}

      </div>

      {/* LOADING */}
      {loading && <p>Carregando...</p>}

      {/* SEM RESULTADOS */}
      {!loading &&
        !error &&
        veiculos.length === 0 && (
          <p>Nenhum veículo encontrado</p>
        )}

      {/* GRID */}
      <div
        className="veiculos-grid"
        style={{ flex: 1 }}
      >

        {veiculos.map((v) => (

          <VeiculoCard
            key={v.id}
            v={v}
            invalidate={invalidate}
            onCancelar={(id) =>
              setModalCancelar({
                open: true,
                veiculoId: id
              })
            }
          />

        ))}

      </div>

      <CancelarVendaModal
        open={modalCancelar.open}
        onClose={() =>
          setModalCancelar({
            open: false,
            veiculoId: null
          })
        }
        onConfirm={async (motivo) => {

          try {

            await api.put(

              `/vendas/cancelar/${modalCancelar.veiculoId}`,

              { motivo }

            )

            toast.success(
              "Venda cancelada"
            )

            setModalCancelar({
              open: false,
              veiculoId: null
            })

            await invalidate()

          } catch (e) {

            console.error(e)

            toast.error(
              "Erro ao cancelar venda"
            )
          }
        }}
      />

    {/* FOOTER */}
<div style={{

  marginTop: 5,

  background: "#ddd",

  borderRadius: 10,

  padding: "5px 20px",

  display: "grid",

  gridTemplateColumns: "1fr 1fr",

  rowGap: 14,

  gap: 1,

  alignItems: "center",

  boxShadow:
    "0 6px 20px rgba(0,0,0,.04)"

}}>

  {/* COLUNA 1 */}
  <div style={{

    display: "flex",

    alignItems: "center",

    gap: 10,

    flexWrap: "wrap"

  }}>

    <a
      href="https://veiculos.fipe.org.br"
      target="_blank"
      rel="noreferrer"
      style={{

        color: "#4b0082",

        fontSize: 12,

        fontWeight: 600,

        textDecoration: "underline"

      }}
    >
      💰 Tabela FIPE
    </a>

    <a
      href="https://www.google.com/search?q=consulta+placa"
      target="_blank"
      rel="noreferrer"
      style={{

        color: "#4b0082",

        fontSize: 12,

        fontWeight: 600,

        textDecoration: "underline"

      }}
    >
      🚘 Consulta de Placa
    </a>

  </div>

  {/* COLUNA 2 */}
  <div style={{

    display: "flex",

    justifyContent: "flex-start",

    alignItems: "center",

    gap: 10,

    flexWrap: "wrap",

    width: "100%",

    textAlign: "left"

  }}>

    <a
      href="https://www.mfscars.com.br"
      target="_blank"
      rel="noreferrer"
      style={{

        color: "#4b0082",

        fontSize: 12,

        fontWeight: 600,

        textDecoration: "underline"

      }}
    >
      🌐 Site - Marketplace
    </a>

        {/* WHATSAPP */}
    <a
      href="https://wa.me/5524999726811"
      target="_blank"
      rel="noreferrer"
      style={{

        fontSize: 12,

        fontWeight: 600,

        textDecoration: "none",

        color: "#000",

        marginLeft: "auto"

      }}
    >
      📱 (24) 99972-6811
    </a>

  </div>

  {/* LINHA INFERIOR */}
  <div style={{

    gridColumn: "1 / -1",

    display: "flex",

    flexWrap: "wrap",

    alignItems: "center",

    gap: 10,

    paddingTop: 5,

    borderTop: "1px solid #d9d9d9"

  }}>


    {/* COPYRIGHT */}
    <span style={{

      fontSize: 12,

      color: "#888",

      width: "100%",

      textAlign: "center"

    }}>
      © 2026 MFS Cars Marketplace
    </span>

  </div>

</div>




    </div>
  )
}