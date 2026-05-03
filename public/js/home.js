import { requestPublic } from './api-public.js';

const API_URL = "https://mfscars-backend.onrender.com";

let paginaAtual = 1;
let totalPaginas = 1;

const app = document.getElementById("app-public");

/* ===============================
   🧱 RENDER HTML
============================== */

app.innerHTML = `
<div class="header">
  <div class="logo">🚗 MFS Cars</div>
  <div class="menu">
    <a href="/cadastro.html">Cadastrar loja</a>
  </div>
</div>

<div class="hero">
  <div class="busca">
    <select id="marca"></select>
    <input id="preco" placeholder="Preço máximo">
    <input id="modelo" placeholder="Modelo">
    <input id="cidade" placeholder="Cidade">
    <button id="btnBuscar">Buscar</button>
  </div>
</div>

<div class="marcas">
  <img src="https://cdn-icons-png.flaticon.com/512/741/741407.png">
  <img src="https://cdn-icons-png.flaticon.com/512/741/741417.png">
  <img src="https://cdn-icons-png.flaticon.com/512/741/741420.png">
</div>

<div class="container">
  <h2>Veículos disponíveis</h2>
  <div class="grid" id="veiculos"></div>
  <div id="paginacao" style="text-align:center;margin-top:20px;"></div>
</div>

<div class="footer">
  MFS Cars Marketplace © 2026<br>
  📧 <a href="mailto:mfaria2016@outlook.com">mfaria2016@outlook.com</a> |
  📱 <a href="https://wa.me/5524999726811" target="_blank">(24) 99972-6811</a>
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
        ? `${API_URL}/uploads/${v.foto}`
        : `${API_URL}/uploads/sem-foto.jpg`;

      grid.innerHTML += `
        <div class="card" onclick="window.abrirVeiculo(${v.id})">

          <img src="${foto}">

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