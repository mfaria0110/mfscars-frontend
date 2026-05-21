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
   
<img
  src="/assets/logo.png"

  style="
    height:48px;
    display:block;
  "
>

    </div>

    <div
      style="
        display:flex;
        gap:16px;
        align-items:center;
      "
    >

<div
  style="
    display:flex;
    align-items:center;
    gap:34px;
  "
>

  <a
    href="#funcionalidades"

    style="
      color:#fff;
      text-decoration:none;
      font-weight:600;
      opacity:.9;
    "
  >
    Funcionalidades
  </a>

  <a
    href="#planos"

    style="
      color:#fff;
      text-decoration:none;
      font-weight:600;
      opacity:.9;
    "
  >
    Planos
  </a>

  <a
    href="#marketplace"

    style="
      color:#fff;
      text-decoration:none;
      font-weight:600;
      opacity:.9;
    "
  >
    Marketplace
  </a>

  <a
    href="#contato"

    style="
      color:#fff;
      text-decoration:none;
      font-weight:600;
      opacity:.9;
    "
  >
    Contato
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
    🏪 Cadastrar loja
  </a>

</div>


    </div>

  </div>

</div>

<!-- HERO -->
<section
  style="
    background:
      linear-gradient(
        135deg,
        #020617 0%,
        #081028 50%,
        #172554 100%
      );

padding:
      40px 40px 30px;
  "
>

<div
  style="
    max-width:1400px;
    margin:auto;

    display:grid;

    grid-template-columns:
      1fr 1.1fr;

    align-items:center;

    gap:50px;
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
          rgba(37,99,235,.14);

        border:
          1px solid
          rgba(59,130,246,.28);

        color:#93c5fd;

        padding:
          12px 20px;

        border-radius:999px;

        font-size:15px;
        font-weight:700;

        margin-bottom:30px;
      "
    >
      🚀 CRM & Gestão Automotiva
    </div>

<h1
  style="
    font-size:42px;

    line-height:1.05;

    color:#fff;

    font-weight:900;

    margin:0 0 28px;

    max-width:720px;
  "
>
      CRM e gestão completa
      para
      <span
        style="
          color:#3b82f6;
        "
      >
        lojas de veículos.
      </span>
    </h1>

    <p
      style="
        font-size:24px;

        line-height:1.6;

        color:#cbd5e1;

        max-width:720px;

        margin-bottom:38px;
      "
    >
      Controle estoque, leads,
      vendedores, vendas e múltiplas
      lojas em um único sistema.
    </p>

    <!-- BOTÕES -->
    <div
      style="
        display:flex;
        gap:18px;

        flex-wrap:wrap;

        margin-bottom:38px;
      "
    >

      <a
        href="/cadastro.html"

        style="
          height:62px;

          padding:0 34px;

          border-radius:16px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color:#fff;

          display:flex;
          align-items:center;
          justify-content:center;

          text-decoration:none;

          font-size:18px;
          font-weight:800;

          box-shadow:
            0 20px 40px
            rgba(37,99,235,.28);
        "
      >
        🚀 Testar grátis
      </a>

      <a
        href="https://wa.me/5524999726811"
        target="_blank"

        style="
          height:62px;

          padding:0 34px;

          border-radius:16px;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #15803d
            );

          color:#fff;

          display:flex;
          align-items:center;
          justify-content:center;

          text-decoration:none;

          font-size:18px;
          font-weight:800;
        "
      >
        💬 Falar no WhatsApp
      </a>

    </div>

    <!-- MINI FEATURES -->
    <div
      style="
        display:flex;
        gap:18px;

        flex-wrap:wrap;
      "
    >

      <div
        style="
          background:
            rgba(255,255,255,.06);

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:18px;

          padding:18px 22px;

          color:#fff;

          min-width:180px;
        "
      >
        <div
          style="
            font-size:14px;
            opacity:.7;

            margin-bottom:8px;
          "
        >
          📦 Estoque
        </div>

        <div
          style="
            font-size:18px;
            font-weight:800;
          "
        >
          Gestão completa
        </div>
      </div>

      <div
        style="
          background:
            rgba(255,255,255,.06);

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:18px;

          padding:18px 22px;

          color:#fff;

          min-width:180px;
        "
      >
        <div
          style="
            font-size:14px;
            opacity:.7;

            margin-bottom:8px;
          "
        >
          👥 Leads
        </div>

        <div
          style="
            font-size:18px;
            font-weight:800;
          "
        >
          Centralização total
        </div>
      </div>

      <div
        style="
          background:
            rgba(255,255,255,.06);

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:18px;

          padding:18px 22px;

          color:#fff;

          min-width:180px;
        "
      >
        <div
          style="
            font-size:14px;
            opacity:.7;

            margin-bottom:8px;
          "
        >
          🏪 Multi-lojas
        </div>

        <div
          style="
            font-size:18px;
            font-weight:800;
          "
        >
          Tudo em um lugar
        </div>
      </div>

    </div>

  </div>

  <!-- DASHBOARD -->
  <div
    style="
      overflow:hidden;
    "
  >

    <img
      src="/assets/dashboard-preview.png"

      style="
        width:100%;
        border-radius:22px;
        display:block;
box-shadow:
  0 40px 120px
  rgba(37,99,235,.22);
      "
    >

  </div>

</div>

</section>


<!-- BENEFÍCIOS -->
<div
  id="planos"
  style="
    background:#fff;
    padding:40px 40px;
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;
    "
  >

    <!-- TÍTULO -->
    <div
      style="
        text-align:center;
        margin-bottom:30px;
      "
    >

      <div
        style="
          color:#2563eb;
          font-size:14px;
          font-weight:800;
          margin-bottom:14px;
          letter-spacing:1px;
          text-transform:uppercase;
        "
      >
        Plataforma Completa
      </div>

      <h3
        style="
          font-size:42px;
          line-height:1.1;
          font-weight:900;
          color:#0f172a;

          margin:0 0 20px;
        "
      >
        Tudo que sua loja precisa
        em um único sistema.
      </h3>

      <p
        style="
          font-size:20px;
          color:#64748b;
          max-width:850px;
          margin:auto;
          line-height:1.7;
        "
      >
        Centralize estoque, leads,
        vendedores e operações
        com uma plataforma moderna
        para revendas e multi-lojas.
      </p>

    </div>

    <!-- GRID -->
    <div
      style="
        display:grid;

        grid-template-columns:
          repeat(
            auto-fit,
            minmax(240px,1fr)
          );

        gap:28px;
      "
    >

      <!-- CARD -->
      <div
        style="
          background:#fff;

          border:
            1px solid #e2e8f0;

          border-radius:26px;

          padding:34px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);

          transition:.3s;
        "
      >

        <div
          style="
            width:72px;
            height:72px;

            border-radius:22px;

            background:
              linear-gradient(
                135deg,
                #2563eb,
                #1d4ed8
              );

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:34px;

            margin-bottom:24px;
          "
        >
          🚗
        </div>

        <h3
          style="
            font-size:28px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Gestão de Estoque
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.8;
            font-size:17px;
          "
        >
          Cadastre veículos,
          fotos, opcionais
          e acompanhe todo
          estoque em tempo real.
        </p>

      </div>

      <!-- CARD -->
      <div
        style="
          background:#fff;

          border:
            1px solid #e2e8f0;

          border-radius:26px;

          padding:34px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:72px;
            height:72px;

            border-radius:22px;

            background:
              linear-gradient(
                135deg,
                #16a34a,
                #15803d
              );

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:34px;

            margin-bottom:24px;
          "
        >
          👥
        </div>

        <h3
          style="
            font-size:28px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Leads Centralizados
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.8;
            font-size:17px;
          "
        >
          Receba interessados
          diretamente pelo sistema
          e acompanhe cada oportunidade.
        </p>

      </div>

      <!-- CARD -->
      <div
        style="
          background:#fff;

          border:
            1px solid #e2e8f0;

          border-radius:26px;

          padding:34px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:72px;
            height:72px;

            border-radius:22px;

            background:
              linear-gradient(
                135deg,
                #7c3aed,
                #6d28d9
              );

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:34px;

            margin-bottom:24px;
          "
        >
          🏪
        </div>

        <h3
          style="
            font-size:28px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Multi-lojas
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.8;
            font-size:17px;
          "
        >
          Gerencie múltiplas lojas
          e operações em um único painel.
        </p>

      </div>

      <!-- CARD -->
      <div
        style="
          background:#fff;

          border:
            1px solid #e2e8f0;

          border-radius:26px;

          padding:34px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:72px;
            height:72px;

            border-radius:22px;

            background:
              linear-gradient(
                135deg,
                #ea580c,
                #c2410c
              );

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:34px;

            margin-bottom:24px;
          "
        >
          📈
        </div>

        <h3
          style="
            font-size:28px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Controle Comercial
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.8;
            font-size:17px;
          "
        >
          Acompanhe vendedores,
          permissões e performance
          comercial da equipe.
        </p>

      </div>

    </div>

  </div>

</div>

<!-- MARKETPLACE -->
<section
  id="marketplace"

  style="
    background:#fff;
    padding:5px 30px;
  "
>

<div
  style="
    max-width:1400px;
    margin:auto;
  "
>

  <div
    style="
      text-align:center;
      margin-bottom:50px;
    "
  >

    <h2
      style="
        font-size:54px;
        color:#0f172a;
        font-weight:900;
        margin-bottom:14px;
      "
    >
      Encontre o veículo ideal
    </h2>

    <p
      style="
        font-size:20px;
        color:#64748b;
      "
    >
      Milhares de veículos das melhores lojas parceiras reunidos em um só lugar.
    </p>

  </div>

</div>

</section>


<div
  style="
    position:relative;

    margin-top:0px;

    z-index:20;

    padding:
      0 30px 5px;
  "
>

<div
  class="busca"
  style="
    max-width:1400px;

margin:
      0 auto 10px;

    background:
      rgba(255,255,255,.92);

    backdrop-filter:
      blur(24px);

    border:
      1px solid
      rgba(255,255,255,.6);

    border-radius:18px;

    padding:34px;

box-shadow:
  0 4px 14px
  rgba(15,23,42,.06);
  "
>
 
    <div
      style="
        display:grid;

grid-template-columns:
  1.2fr
  1fr
  1fr
  .9fr
  auto;

        gap:18px;
      "
    >

      <!-- MARCA -->
      <select
        id="marca"

        style="
          height:58px;

          border-radius:16px;

          border:
            1px solid #e2e8f0;

          padding:0 18px;

          font-size:16px;

          background:#fff;
        "
      >
        <option value="">
          Todas marcas
        </option>
      </select>

      <!-- MODELO -->
      <input
        id="modelo"
        placeholder="Modelo"

        style="
          height:58px;

          border-radius:16px;

          border:
            1px solid #e2e8f0;

          padding:0 18px;

          font-size:16px;

          background:#fff;
        "
      />

      <!-- CIDADE -->
      <input
        id="cidade"
        placeholder="Cidade"

        style="
          height:58px;

          border-radius:16px;

          border:
            1px solid #e2e8f0;

          padding:0 18px;

          font-size:16px;

          background:#fff;
        "
      />

      <!-- PREÇO -->
      <select
        id="preco"

        style="
          height:58px;

          border-radius:16px;

          border:
            1px solid #e2e8f0;

          padding:0 18px;

          font-size:16px;

          background:#fff;
        "
      >

        <option value="">
          Qualquer preço
        </option>

        <option value="30000">
          Até R$ 30 mil
        </option>

        <option value="50000">
          Até R$ 50 mil
        </option>

        <option value="100000">
          Até R$ 100 mil
        </option>

      </select>

      <!-- BOTÃO -->
      <button
        id="btnBuscar"

        style="
          height:58px;

          padding:0 32px;

          border:none;

          border-radius:16px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color:#fff;

          font-size:16px;
          font-weight:700;

          cursor:pointer;

          box-shadow:
            0 14px 35px
            rgba(37,99,235,.35);
        "
      >
        🔍 Buscar veículos
      </button>

    </div>

  </div>

</div>

<!-- VEÍCULOS -->
<div
  style="
    max-width:1400px;
    margin:auto;
    padding:0 30px 80px;
  "
>

<div
  id="veiculos"

  style="
    display:grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(260px,1fr)
      );

    gap:28px;
  "
></div>

  <div
    id="paginacao"
    style="
      margin-top:40px;
      text-align:center;
    "
  ></div>

</div>

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

<div
  class="card"

  onclick="window.abrirVeiculo(${v.id})"

onmouseover="
  this.style.transform='translateY(-8px)';
  this.style.boxShadow='0 30px 70px rgba(15,23,42,.14)';
  this.querySelector('img').style.transform='scale(1.05)';
"

onmouseout="
  this.style.transform='translateY(0)';
  this.style.boxShadow='0 15px 40px rgba(15,23,42,.06)';
  this.querySelector('img').style.transform='scale(1)';
"

  style="

    background:#fff;

    border-radius:20px;

    overflow:hidden;

    border:
      1px solid #e2e8f0;

    box-shadow:
      0 15px 40px
      rgba(15,23,42,.06);

    transition:.3s;

    cursor:pointer;
  "
>

<img
  src="${foto}"

  style="
    width:100%;

    height:220px;

    object-fit:cover;

    display:block;

    transition:.2s;
  "
>

<div
  class="info"

  style="
    padding:24px;
  "
>

            <div
  style="
    font-size:24px;
    font-weight:700;
    color:#0f172a;

    margin-bottom:10px;
  "
>
  ${v.marca} ${v.modelo}</div>

            <div class="ano">Ano ${v.ano}</div>

            <div
  style="
    font-size:20px;
    font-weight:900;

    color:#16a34a;

    margin:
      16px 0;
  "
>
              R$ ${Number(v.valor).toLocaleString("pt-BR")}
            </div>

            <div class="loja">
              🏢 ${v.loja || ''}
            </div>

            <div class="local">
              📍 ${v.cidade || ''} / ${v.estado || ''}
            </div>

<button
  class="btn-loja"

  style="
    margin-top:18px;

    width:100%;

    height:52px;

    border:none;

    border-radius:14px;

    background:
      linear-gradient(
        135deg,
        #2563eb,
        #1d4ed8
      );

    color:#fff;

    font-size:16px;
    font-weight:700;

    cursor:pointer;
  "
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