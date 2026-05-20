import { requestPublic } from './api-public.js';

const API_URL = "https://api.mfscars.com.br";

let paginaAtual = 1;
let totalPaginas = 1;

const app = document.getElementById("app-public");

/* ===============================
   🧱 RENDER HTML
============================== */

app.innerHTML = `

<!-- HEADER -->
<div
  style="
    position:fixed;
    top:0;
    left:0;
    width:100%;

    z-index:999;

    background:
      rgba(2,6,23,.88);

    backdrop-filter:blur(12px);

    border-bottom:
      1px solid rgba(255,255,255,.06);
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;

      display:flex;
      justify-content:space-between;
      align-items:center;

      padding:20px 30px;
    "
  >

    <div
      style="
        font-size:34px;
        font-weight:900;
        color:#fff;
      "
    >
      🚗 MFS Cars
    </div>

    <div
      style="
        display:flex;
        gap:16px;
        align-items:center;
      "
    >

      <a
        href="#planos"
        style="
          color:#cbd5e1;
          text-decoration:none;
          font-weight:600;
        "
      >
        Planos
      </a>

      <a
        href="/cadastro.html"
        style="
          background:#2563eb;
          color:#fff;

          padding:14px 24px;

          border-radius:12px;

          text-decoration:none;

          font-weight:700;
        "
      >
        Cadastrar loja
      </a>

    </div>

  </div>

</div>

<!-- HERO -->
<div
  style="
    background:
      linear-gradient(
        135deg,
        #020617 0%,
        #0f172a 45%,
        #172554 100%
      );

    min-height:760px;

    display:flex;
    align-items:center;

    padding:
      140px 40px 80px;

    color:#fff;
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;

      display:grid;

      grid-template-columns:
        1.1fr 1fr;

      gap:60px;

      align-items:center;
    "
  >

    <!-- TEXTO -->
    <div>

      <div
        style="
          display:inline-flex;
          align-items:center;
          gap:10px;

          background:
            rgba(59,130,246,.15);

          border:
            1px solid
            rgba(59,130,246,.25);

          padding:
            10px 18px;

          border-radius:999px;

          color:#93c5fd;

          font-size:14px;
          font-weight:700;

          margin-bottom:24px;
        "
      >
        🚀 CRM & Gestão Automotiva
      </div>

      <h1
        style="
          font-size:72px;
          line-height:1.02;
          font-weight:900;

          margin:0 0 26px;

          letter-spacing:-4px;
        "
      >
        O sistema completo
        para lojas de veículos.
      </h1>

      <p
        style="
          font-size:22px;
          line-height:1.6;

          color:#cbd5e1;

          max-width:720px;

          margin-bottom:36px;
        "
      >
        Controle estoque,
        leads, vendedores,
        contratos e múltiplas lojas
        com uma plataforma moderna
        e profissional.
      </p>

      <!-- BOTÕES -->
      <div
        style="
          display:flex;
          gap:18px;
          flex-wrap:wrap;

          margin-bottom:30px;
        "
      >

        <a
          href="/cadastro.html"
          style="
            background:#2563eb;
            color:#fff;

            padding:18px 30px;

            border-radius:14px;

            text-decoration:none;

            font-size:18px;
            font-weight:700;

            box-shadow:
              0 10px 30px
              rgba(37,99,235,.35);
          "
        >
          🚀 Testar grátis
        </a>

        <a
          href="https://wa.me/5524999726811"
          target="_blank"
          style="
            background:#16a34a;
            color:#fff;

            padding:18px 30px;

            border-radius:14px;

            text-decoration:none;

            font-size:18px;
            font-weight:700;
          "
        >
          💬 WhatsApp
        </a>

      </div>

      <!-- FOUNDERS -->
      <div
        style="
          background:
            rgba(34,197,94,.12);

          border:
            1px solid
            rgba(34,197,94,.25);

          padding:18px 22px;

          border-radius:18px;

          display:inline-block;
        "
      >

        <div
          style="
            color:#4ade80;
            font-size:15px;
            font-weight:800;

            margin-bottom:6px;
          "
        >
          🔥 Oferta Founders
        </div>

        <div
          style="
            font-size:18px;
            color:#fff;
            font-weight:700;
          "
        >
          30% OFF vitalício
          nos planos pagos.
        </div>

      </div>

    </div>

    <!-- MOCKUP -->
    <div>

      <img
        src="/assets/dashboard-preview.png"
        style="
          width:100%;
          border-radius:24px;

          box-shadow:
            0 40px 90px
            rgba(0,0,0,.45);
        "
      />

    </div>

  </div>

</div>

<!-- BUSCA -->
<div
  class="hero"
  style="
    margin-top:-60px;
    position:relative;
    z-index:5;
  "
>
  <div class="busca">

`;
 
/* ===============================
   🔘 EVENTOS
============================== */

document.getElementById("btnBuscar").onclick = buscar;

document.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    buscar();
  }
});

/* ===============================
   📦 CARREGAR MARCAS
============================== */

async function carregarMarcas(){

  try{

     const res = await requestPublic("/public/catalogo/marcas");

    if(!res.ok){
      console.error("Erro ao buscar marcas");
      return;
    }

    const marcas = res.data;

    const select = document.getElementById("marca");

    select.innerHTML = `<option value="">Todas marcas</option>`;

    marcas.forEach(m=>{
      select.innerHTML += `<option value="${m.nome}">${m.nome}</option>`;
    });

  }catch(e){
    console.error("Erro marcas:", e);
  }

}

/* ===============================
   🚗 CARREGAR VEÍCULOS
============================== */

async function carregarVeiculos(){

  const grid = document.getElementById("veiculos");

  grid.innerHTML = `<p style="text-align:center">Carregando...</p>`;

  try{

    const params = new URLSearchParams();

    const marca = document.getElementById("marca").value;
    const preco = document.getElementById("preco").value;
    const modelo = document.getElementById("modelo").value;
    const cidade = document.getElementById("cidade").value;

    if(marca) params.append("marca", marca);
    if(preco) params.append("preco", preco);
    if(modelo) params.append("modelo", modelo);
    if(cidade) params.append("cidade", cidade);

    params.append("page", paginaAtual);


const res = await requestPublic(`/public/veiculos?${params.toString()}`);


    if(!res.ok){
      grid.innerHTML = `<p style="text-align:center">Erro ao carregar veículos</p>`;
      return;
    }

    const result = res.data;

    const veiculos = result.data || [];

    paginaAtual = result.page || 1;
    totalPaginas = result.totalPages || 1;

    if(veiculos.length === 0){
      grid.innerHTML = `
        <p style="text-align:center;color:#777">
          Nenhum veículo encontrado
        </p>
      `;
      return;
    }

    grid.innerHTML = "";

    veiculos.forEach(v=>{

    const foto = v.foto
      ? (
          v.foto.startsWith("http")
            ? v.foto.replace("http://", "https://")
            : `${API_URL}/uploads/${v.foto}`
        )
      : `${API_URL}/uploads/sem-foto.jpg`;

      grid.innerHTML += `
        <div class="card" onclick="window.abrirVeiculo(${v.id})">

          <img src="${foto}">

<div class="overlay">
  Ver detalhes do veículo - Clique na foto
</div>

          <div class="info">

            <div><strong>${v.marca} ${v.modelo}</strong></div>

            <div class="ano">Ano ${v.ano}</div>

            <div class="valor">
              R$ ${Number(v.valor).toLocaleString("pt-BR")}
            </div>

            <div class="loja">
              🏢 ${v.loja || ''}
            </div>

            <div class="local">
              📍 ${v.cidade || ''} / ${v.estado || ''}
            </div>

            <button class="btn-loja"
              onclick="event.stopPropagation(); window.abrirLoja(${v.loja_id})">
              Ver loja
            </button>

          </div>

        </div>
      `;
    });

    renderPaginacao();

  }catch(e){

    console.error(e);

    grid.innerHTML = `
      <p style="text-align:center">Erro ao carregar veículos</p>
    `;
  }

}

/* ===============================
   📄 PAGINAÇÃO
============================== */

function renderPaginacao(){

  const div = document.getElementById("paginacao");

  div.innerHTML = `
    <button onclick="mudarPagina(${paginaAtual - 1})"
      ${paginaAtual <= 1 ? "disabled" : ""}>
      ← Anterior
    </button>

    <span style="margin:0 10px;">
      Página ${paginaAtual} de ${totalPaginas}
    </span>

    <button onclick="mudarPagina(${paginaAtual + 1})"
      ${paginaAtual >= totalPaginas ? "disabled" : ""}>
      Próxima →
    </button>
  `;
}

window.mudarPagina = function(p){

  if(p < 1 || p > totalPaginas) return;

  paginaAtual = p;
  carregarVeiculos();
}

/* ===============================
   🔍 BUSCAR
============================== */

function buscar(){
  paginaAtual = 1;
  carregarVeiculos();
}

/* ===============================
   🔗 NAVEGAÇÃO
============================== */

window.abrirVeiculo = function(id){
  window.location = `/veiculo.html?id=${id}`;
}

window.abrirLoja = function(lojaId){
  window.location = `/empresa.html?id=${lojaId}`;
}

/* ===============================
   🚀 INIT
============================== */

carregarMarcas();
carregarVeiculos();