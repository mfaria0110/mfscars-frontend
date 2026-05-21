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
  120px 40px 60px;

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

<h2
  style="
    font-size:28px;

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
    </h2>

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

        gap:10px;

        flex-wrap:wrap;

        margin-bottom:38px;
      "
    >

      <a
        href="/cadastro.html"

        style="
          height:62px;

          padding:0 34px;

          border-radius:10px;

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

          font-size:16px;
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

          border-radius:10px;

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

          font-size:16px;
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
        gap:10px;

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

          min-width:160px;
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
            font-size:16px;
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
            font-size:16px;
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
            font-size:16px;
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

      <h4
        style="
          font-size:32px;
          line-height:1.1;
          font-weight:900;
          color:#0f172a;

          margin:0 0 20px;
        "
      >
        Tudo que sua loja precisa
        em um único sistema.
      </h4>

      <h5
        style="
          font-size:15px;
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
      </h5>

    </div>

    <!-- GRID -->

    <div
      style="

        display:grid;

        align-items:center;

        grid-template-columns:
          1fr
          1fr
          1fr
          1fr
          220px;

        gap:12px;

        width:100%;
      "
    >

      <!-- CARD -->
      <div
        style="
          background:#fff;

          border:
            1px solid #e2e8f0;

          border-radius:26px;

         padding:15px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);

          transition:.3s;
        "
      >

        <div
          style="
            width:58px;
            height:58px;

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

            margin-bottom:15px;
          "
        >
          🚗
        </div>

        <h3
          style="
            font-size:20px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Gestão de Estoque
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.7;
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

          padding:10px 24px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:58px;
            height:58px;

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

            margin-bottom:14px;
          "
        >
          👥
        </div>

        <h3
          style="
            font-size:20px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Leads Centralizados
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.6;
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

          padding:10px 24px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:58px;
            height:58px;

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

            margin-bottom:14px;
          "
        >
          🏪
        </div>

        <h3
          style="
            font-size:22px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Multi-lojas
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.3;
            font-size:17px;
            padding: 10px 10px;
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

          padding:10px 24px;

          box-shadow:
            0 10px 35px
            rgba(15,23,42,.05);
        "
      >

        <div
          style="
            width:58px;
            height:58px;

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

            margin-bottom:14px;
          "
        >
          📈
        </div>

        <h3
          style="
            font-size:20px;
            color:#0f172a;
            margin-bottom:14px;
          "
        >
          Controle Comercial
        </h3>

        <p
          style="
            color:#64748b;
            line-height:1.7;
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

    padding:0 30px 6px;
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
      margin-bottom:10px;
    "
  >

    <h3
      style="
        font-size:20px;
        color:#0f172a;
        font-weight:900;
        margin-bottom:8px;
      "
    >
      Encontre o veículo ideal
    </h3>

    <p
      style="
        font-size:16px;
        color:#64748b;
      "
    >
      Todos os veículos das melhores lojas parceiras reunidos em um só lugar.
    </p>

  </div>

</div>

</section>

<div
  style="
    position:relative;

    margin-top:8px;

    margin-bottom:8px;

    z-index:20;

    padding:0 30px;

  "
>

<div
  class="busca"
  style="
    max-width:1400px;

margin:0 auto;

    background:
      rgba(255,255,255,.92);

    backdrop-filter:
      blur(24px);

    border:
      1px solid
      rgba(255,255,255,.6);

    border-radius:18px;

    padding:24px;

box-shadow:
  0 2px 10px
  rgba(15,23,42,.05);

  "
>
 
<div
  style="

      display:grid;

      align-items:center;

      grid-template-columns:
        1fr
        1fr
        1fr
        1fr
        220px;

      gap:12px;

      width:100%;

      "
>

      <!-- MARCA -->
      <select
        id="marca"

        style="

    width:100%;

  min-width:0;

  box-sizing:border-box;

          height:35px;

          border-radius:10px;

          border:
            1px solid #e2e8f0;

          padding:0 12px;

          font-size:12px;

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

          width:100%;

          min-width:0;

          box-sizing:border-box;

          height:35px;

          border-radius:10px;

          border:
            1px solid #e2e8f0;

          padding:0 12px;

          font-size:12px;

          background:#fff;
        "
      />

      <!-- CIDADE -->
      <input
        id="cidade"
        placeholder="Cidade"

        style="

    width:100%;

  min-width:0;

  box-sizing:border-box;

          height:35px;

          border-radius:10px;

          border:
            1px solid #e2e8f0;

          padding:0 12px;

          font-size:12px;

          background:#fff;
        "
      />

      <!-- PREÇO -->
      <select
        id="preco"

        style="

    width:100%;

  min-width:0;

  box-sizing:border-box;

          height:35px;

          border-radius:10px;

          border:
            1px solid #e2e8f0;

          padding:0 12px;

          font-size:12px;

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
    width:100%;

  min-width:0;

  box-sizing:border-box;

          height:35px;

          padding:0 18px;

          border:none;

          border-radius:10px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color:#fff;
          font-size:13px;
          font-weight:700;

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

<!-- VEÍCULOS 123 -->
<div
  style="
    max-width:1400px;
    margin:auto;
    padding:10px 30px 10px;
  "
>

<div
  id="veiculos"

  style="

display:grid;

grid-template-columns:
  repeat(
    auto-fit,
    minmax(220px,260px)
  );

justify-content:center;

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


<style>

@media(max-width:1100px){

  .busca > div{
    grid-template-columns:
      1fr 1fr !important;
  }

}

@media(max-width:640px){

  .busca > div{
    grid-template-columns:
      1fr !important;
  }

}

</style>

<footer
  style="
    background:
      linear-gradient(
        90deg,
        #020617,
        #071a3d,
        #020617
      );

    border-top:
      1px solid rgba(255,255,255,.08);

    margin-top:40px;
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;

      padding:3px 15px;

    border-radius:10px;

      display:grid;

      grid-template-columns:
        1.2fr
        1fr
        1fr
        1fr
        1.3fr;

      gap:18px;

      align-items:center;
    "
  >

    <!-- LOGO -->
    <div>

      <img
        src="/assets/logo.png"
        style="
          height:34px;
          margin-bottom:2px;
        "
      >

      <div
        style="
          color:#cbd5e1;
          font-size:12px;
          line-height:1.7;
          max-width:240px;
        "
      >
        O sistema completo para sua loja
        de veículos vender mais e melhor.
      </div>

    </div>

    <!-- CONTATO -->
    <div>

      <div
        style="
          color:#fff;
          font-size:14px;
          font-weight:700;
          margin-bottom:4px;
        "
      >
        Fale conosco
      </div>

      <div
        style="
          color:#cbd5e1;
          line-height:1.5;
          font-size:12px;
        "
      >
        📞 (24) 99972-6811<br>
        ✉️ mfaria2016@outlook.com
      </div>

    </div>

    <!-- ATENDIMENTO -->
    <div>

      <div
        style="
          color:#fff;
          font-size:14px;
          font-weight:700;
          margin-bottom:5px;
        "
      >
        Atendimento
      </div>

      <div
        style="
          color:#cbd5e1;
          line-height:1.5;
          font-size:13px;
        "
      >
        Segunda à Sexta<br>
        08h às 18h
      </div>

    </div>

    <!-- SOCIAL -->
    <div>

      <div
        style="
          color:#fff;
          font-size:14px;
          font-weight:700;
          margin-bottom:14px;
        "
      >
        Siga-nos
      </div>

      <div
        style="
          display:flex;
          gap:14px;
        "
      >

        <a
          href="#"
          style="
            width:34px;
            height:34px;

            border-radius:50%;

            display:flex;
            align-items:center;
            justify-content:center;

            background:
              rgba(255,255,255,.08);

            font-size:20px;
            text-decoration:none;
          "
        >
          📸
        </a>

        <a
          href="#"
          style="
            width:34px;
            height:34px;

            border-radius:50%;

            display:flex;
            align-items:center;
            justify-content:center;

            background:
              rgba(255,255,255,.08);

            font-size:20px;
            text-decoration:none;
          "
        >
          💬
        </a>

      </div>

    </div>

    <!-- WHATS -->
    <div
      style="
        display:flex;
        justify-content:flex-end;
      "
    >

      <a
        href="https://wa.me/5524999726811"
        target="_blank"

        style="
          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          color:#fff;
          text-decoration:none;

          padding:5px 18px;

          border-radius:18px;

          display:flex;
          align-items:center;

          gap:14px;

          font-weight:700;

          box-shadow:
            0 10px 30px rgba(34,197,94,.25);
        "
      >

        <span style="font-size:22px;">
          💬
        </span>

        <div>

          <div
            style="
              font-size:15px;
            "
          >
            Falar no WhatsApp
          </div>

          <div
            style="
              font-size:11px;
              opacity:.9;
              font-weight:500;
            "
          >
            Estamos online!
          </div>

        </div>

      </a>

    </div>

  </div>

</footer>

`;


/* ===============================
   🔘 EVENTOS
============================== */

document.getElementById("btnBuscar").onclick = buscar;

document.addEventListener("keydown", (e)=>{
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

const marca =
  document.getElementById("marca")?.value || "";

const preco =
  document.getElementById("preco")?.value || "";

const modelo =
  document.getElementById("modelo")?.value || "";

const cidade =
  document.getElementById("cidade")?.value || "";

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

    border-radius:10px;

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

onclick="
  event.stopPropagation();

  window.location.href=
    '/empresa.html?id=${v.loja_id}';
"
  
  style="
    width:100%;

    height:170px;

    object-fit:cover;

    display:block;

    transition:.2s;
    cursor:pointer;
  "
>

<div
  class="info"

  style="
    padding: 5px 10px 7px;

    display:flex;
    flex-direction:column;

    min-height:180px;
  "
>

  <div
  style="
    font-size:14px;
    font-weight:700;
    color:#0f172a;

    margin-bottom:6px;
  "
>
  ${v.marca} ${v.modelo}</div>

   <div style="
    font-size:13px;
    font-weight:700;
    color:#0f172a;

    margin-bottom:5px;
  "
>

  Ano: ${v.ano || "-"}

  </div>

  <div
  style="
    font-size:20px;
    font-weight:900;

    color:#16a34a;
;
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
  margin-top:auto;

  margin-left:auto;
  margin-right:auto;

  margin-bottom:5px;

  width:140px;

  height:32px;

  border:none;

  border-radius:12px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );

  color:#fff;

  font-size:13px;
  font-weight:700;

  cursor:pointer;

  display:flex;
  align-items:center;
  justify-content:center;
"


onclick="
  event.stopPropagation();

  window.abrirLoja(${v.loja_id});
"

              >
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

  const marca =
    document.getElementById("marca")?.value || "";

  const modelo =
    document.getElementById("modelo")?.value || "";

  const cidade =
    document.getElementById("cidade")?.value || "";

  const preco =
    document.getElementById("preco")?.value || "";

  console.log({
    marca,
    modelo,
    cidade,
    preco
  });

  paginaAtual = 1;

  carregarVeiculos();
}

/* ===============================
   🔗 NAVEGAÇÃO
============================== */

window.abrirVeiculo = function(id){

  window.location.href =
    `/veiculo.html?id=${id}`;

}


window.abrirLoja = function(lojaId){

  window.location.href =
    `/empresa.html?id=${lojaId}`;

}

/* ===============================
   🚀 INIT
============================== */

carregarMarcas();
carregarVeiculos();