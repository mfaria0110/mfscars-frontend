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

  const [
    showModalErro,
    setShowModalErro
  ] = useState(false)

  const [modalCancelar, setModalCancelar] = useState({
  open: false,
  veiculoId: null
})

  /* ===============================
     🔥 ERRO
  ============================== */
  useEffect(() => {
    if (error) {
      setShowModalErro(true)
    }
  }, [error])

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
    <div className="veiculos-page">

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
      <div className="veiculos-grid">

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

      {/* MODAL ERRO */}
      {showModalErro && error && (
        <div
          className="modal"
          onClick={() => {
            setShowModalErro(false)
            limparErro()
          }}
        >
          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h3>⚠️ Atenção</h3>

              <button
                className="modal-close"
                onClick={() => {
                  setShowModalErro(false)
                  limparErro()
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "16px" }}>
              {error}
            </p>

            <div className="actions">
              <button
                onClick={() => {
                  setShowModalErro(false)
                  limparErro()
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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

            toast.success("Venda cancelada")

            setModalCancelar({
              open: false,
              veiculoId: null
            })

            await invalidate()
          } catch (e) {
            console.error(e)
            toast.error("Erro ao cancelar venda")
          }
        }}
      />

      {/* FOOTER */}
<div style={{

  marginTop: 60,

  background: "#fff",

  borderRadius: 24,

  padding: 30,

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",

  gap: 30,

  boxShadow:
    "0 8px 24px rgba(0,0,0,.05)"

}}>

  {/* COLUNA 1 */}
  <div>

    <h3 style={{

      marginBottom: 20,

      color: "#0f172a"

    }}>

      🚗 MFS Cars Marketplace

    </h3>

    <p>

      Plataforma completa para
      gestão automotiva,
      anúncios, leads e vendas.

    </p>

    <div style={{
      marginTop: 20
    }}>

      <p>
        📧
        {" "}
        mfaria2016@outlook.com
      </p>

      <p>
        📱
        {" "}
        (24) 99972-6811
      </p>

    </div>

    <p style={{

      marginTop: 20,

      color: "#64748b",

      fontSize: 14

    }}>

      © 2026 MFS Cars Marketplace

    </p>

  </div>

  {/* COLUNA 2 */}
  <div>

    <h3 style={{

      marginBottom: 20,

      color: "#0f172a"

    }}>

      🔗 Links úteis

    </h3>

    <div style={{

      display: "flex",

      flexDirection: "column",

      gap: 12

    }}>

      <a
        href="https://www.mfscars.com.br"
        target="_blank"
        rel="noreferrer"
      >
        🌐 Site Oficial
      </a>

      <a
        href="/termos.html?tipo=termos"
        target="_blank"
        rel="noreferrer"
      >
        📜 Termos de Uso
      </a>

      <a
        href="/termos.html?tipo=privacidade"
        target="_blank"
        rel="noreferrer"
      >
        🔒 Política de Privacidade
      </a>

      <a
        href="/termos.html?tipo=cookies"
        target="_blank"
        rel="noreferrer"
      >
        🍪 Política de Cookies
      </a>

    </div>

  </div>

  {/* COLUNA 3 */}
  <div>

    <h3 style={{

      marginBottom: 20,

      color: "#0f172a"

    }}>

      🛠 Ferramentas

    </h3>

    <div style={{

      display: "flex",

      flexDirection: "column",

      gap: 12

    }}>

      <a
        href="https://veiculos.fipe.org.br"
        target="_blank"
        rel="noreferrer"
      >
        💰 Tabela FIPE
      </a>

      <a
        href="https://www.mobills.com.br/calculadoras/calculadora-financiamento/"
        target="_blank"
        rel="noreferrer"
      >
        🧮 Calculadora Financiamento
      </a>

      <a
        href="https://www.google.com/search?q=simulador+parcelas+veiculo"
        target="_blank"
        rel="noreferrer"
      >
        📊 Simulador de Parcelas
      </a>

      <a
        href="https://www.google.com/search?q=consulta+placa"
        target="_blank"
        rel="noreferrer"
      >
        🚘 Consulta de Placa
      </a>

    </div>

  </div>

</div>
      

    </div>
  )
}