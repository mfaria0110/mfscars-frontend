import { requestPublic } from './api-public.js';
import { renderFooter } from './footer.js';

const API_URL = "https://api.mfscars.com.br";

const app = document.getElementById("app-public");

/* ===============================
   🧱 HTML
============================== */
app.innerHTML = `
<div class="header">
  <span>🚗 MFS Cars Marketplace</span>
  <button id="btnVoltar">← Voltar</button>
</div>


<div class="container-cadastro">
 
  <h1>Cadastrar Empresa</h1>

  <!-- LINHA 1 -->
  <div class="form-row">
    <div class="form-group w-1">
      <label>CNPJ</label>
      <input id="cnpj" text-align: center>
    </div>

    <div class="form-group w-2">
      <label>Nome</label>
      <input id="nome">
    </div>
  </div>

  <!-- LINHA 2 -->
  <div class="form-row">
    <div class="form-group w-1">
      <label>Estado</label>
      <select id="estado"></select>
    </div>

    <div class="form-group w-1">
      <label>Cidade</label>
      <select id="cidade"></select>
    </div>

    <div class="form-group w-1">
      <label>Telefone</label>
      <input id="telefone">
    </div>
  </div>

  <!-- LINHA 3 -->
  <div class="form-row">
    <div class="form-group w-2">
      <label>Email</label>
      <input id="email">
    </div>

    <div class="form-group w-1">
      <label>Senha</label>
      <input id="senha" type="password">
    </div>
  </div>

<div
  style="
    margin-top:20px;
    margin-bottom:20px;
    padding:14px;
    border:1px solid #cbd5e1;
    border-radius:12px;
    background:#f8fafc;
  "
>

  <label
    style="
      display:flex;
      gap:10px;
      align-items:flex-start;
      font-size:14px;
      line-height:1.5;
      color:#334155;
      cursor:pointer;
    "
  >

    <input
      type="checkbox"
      id="aceite-termos"
      style="
        margin-top:4px;
      "
    />

    <span>

      Li e aceito os

      <a
        href="/termos.html?tipo=termos"
        target="_blank"
      >
        Termos de Uso
      </a>

      e a

      <a
        href="/termos.html?tipo=privacidade"
        target="_blank"
      >
        Política de Privacidade
      </a>

      do MFS Cars Marketplace.

    </span>

  </label>

</div>

  <button id="btnCadastrar" class="btn-primary">Criar conta</button>

<div class="msg" id="msg"></div>

<div
  id="founders-banner"
  style="
    margin-top:32px;
    margin-bottom:24px;
    background:linear-gradient(135deg,#065f46,#064e3b);
    border-radius:22px;
    padding:28px;
    color:#fff;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    flex-wrap:wrap;
    box-shadow:0 10px 30px rgba(0,0,0,.18);
  "
>

  <div>

    <div
      style="
        font-size:42px;
        margin-bottom:10px;
      "
    >
      🔥
    </div>

    <div
      style="
        font-size:36px;
        font-weight:800;
        margin-bottom:10px;
      "
    >
      Oferta Founders
    </div>

    <div
      style="
        font-size:20px;
        opacity:.92;
        line-height:1.6;
      "
    >
      Garanta
      <strong>
        30% OFF vitalício
      </strong>
      nos planos pagos.
    </div>

  </div>

  <div
    id="founders-restantes"
    style="
      font-size:58px;
      font-weight:900;
      white-space:nowrap;
    "
  >
    --
  </div>

</div>

<div style="margin-top:20px;text-align:center;">
Já tem conta?
<a
  href="https://app.mfscars.com.br"
  target="_blank"
>
  Entrar
</a>
</div>

</div>

<div id="footer"></div>
`;

/* ===============================
   🔘 EVENTOS
============================== */
document.getElementById("btnCadastrar").onclick = cadastrar;

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    cadastrar();
  }
});

document.getElementById("btnVoltar").onclick = () => {
  window.location = "/home.html";
};


/* ===============================
   🚀 CADASTRO
============================== */

let loading = false;

async function cadastrar() {

  if (loading) return;
  loading = true;

  const btn = document.getElementById("btnCadastrar");
  const msg = document.getElementById("msg");

  msg.innerText = "";
  msg.style.color = "red";

  btn.disabled = true;
  btn.innerText = "Cadastrando...";

  try {

    const nome = document.getElementById("nome").value.trim();
    const cnpj = document.getElementById("cnpj").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const cnpjLimpo = cnpj.replace(/\D/g, "");
    const telefoneLimpo = telefone.replace(/\D/g, "");

    if(!nome){
  msg.innerText = "Informe o nome da empresa";
  return resetUI();
}

if(!email){
  msg.innerText = "Informe o email";
  return resetUI();
}

if(!senha){
  msg.innerText = "Informe a senha";
  return resetUI();
}

const aceitou =
  document.getElementById(
    "aceite-termos"
  ).checked;

if (!aceitou) {

  msg.innerText =
    "Você precisa aceitar os Termos de Uso.";

  return resetUI();
}

if(cnpjLimpo.length !== 14){
  msg.innerText = "CNPJ inválido";
  return resetUI();
}

 const res = await requestPublic("/public/auth/cadastro", {
  method: "POST",
  body: JSON.stringify({
    nome,
    cnpj: cnpjLimpo,
    cidade,
    estado,
    telefone: telefoneLimpo,
    email,
    senha,
    aceitou_termos: true,
    versao_termos: "1.0"
  })
});

const data = res.data;

if (!res.ok) {
  throw new Error(data?.erro || "Erro ao cadastrar");
}

    msg.style.color = "green";
    msg.innerText = "Conta criada com sucesso!";

    const FRONT_URL = "https://app.mfscars.com.br";

    setTimeout(() => {
    window.location.href = `${FRONT_URL}`;
    }, 1500);

  } catch (err) {

    msg.innerText = err.message || "Erro ao cadastrar";

  } finally {

    loading = false;
    btn.disabled = false;
    btn.innerText = "Criar conta";

  }

}

/* ===============================
   📞 TELEFONE
============================== */

function aplicarMascaraTelefone(){

  const input = document.getElementById("telefone");

  input.addEventListener("input", e=>{

    let v = e.target.value.replace(/\D/g,"");

    if(v.length > 11) v = v.slice(0,11);

    if(v.length > 10){
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    }else if(v.length > 6){
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    }else if(v.length > 2){
      v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    }else{
      v = `(${v}`;
    }

    e.target.value = v;

  });

}

/* ===============================
   🏢 CNPJ
============================== */
function validarCNPJ(cnpj){

  cnpj = cnpj.replace(/[^\d]+/g,'');

  if(cnpj.length !== 14) return false;

  if(/^(.)\1+$/.test(cnpj)) return false;

  return true; // simplificado (posso te mandar completo)
}

function resetUI(){
  loading = false;
  document.getElementById("btnCadastrar").disabled = false;
  document.getElementById("btnCadastrar").innerText = "Criar conta";
}

function mascaraCNPJ(){

  const input = document.getElementById("cnpj");

  input.addEventListener("input", e=>{

    let v = e.target.value.replace(/\D/g,'');

    if(v.length > 14) v = v.slice(0,14);

    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");

    e.target.value = v;

  });

}

async function buscarCNPJ(){

  const cnpj = document.getElementById("cnpj").value.replace(/\D/g,'');

  if(cnpj.length !== 14) return;

  try{

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const data = await res.json();

    document.getElementById("nome").value = data.razao_social || "";
    document.getElementById("telefone").value = data.ddd_telefone_1 || "";
    document.getElementById("estado").value = data.uf;

    // 🔥 AGORA ESPERA CARREGAR
    await carregarCidades(data.uf);

    // 🔥 AGORA FUNCIONA
    const selectCidade = document.getElementById("cidade");

const cidadeAPI = (data.municipio || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

// 🔍 procura equivalente
const option = Array.from(selectCidade.options).find(opt => {

  const nome = opt.value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return nome === cidadeAPI;
});

if(option){
  selectCidade.value = option.value;
}else{
  console.warn("Cidade não encontrada:", data.municipio);
}

  }catch{
    console.log("CNPJ não encontrado");
  }

}

/* ===============================
   🌎 ESTADOS / CIDADES
============================== */

async function carregarEstados(){

  const res = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
  const estados = await res.json();

  const select = document.getElementById("estado");

  select.innerHTML = `<option value="">Selecione</option>`;

  estados.forEach(e=>{
    select.innerHTML += `<option value="${e.sigla}">${e.nome}</option>`;
  });

}

async function carregarCidades(uf){

  const res = await fetch(
    `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`
  );

  const cidades = await res.json();

  const select = document.getElementById("cidade");

  select.innerHTML = `<option value="">Selecione</option>`;

  cidades.forEach(c=>{
    select.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
  });

}

/* ===============================
   🚀 INIT
============================== */
async function init(){

  aplicarMascaraTelefone();
  mascaraCNPJ();

  await carregarEstados();

  // 🔥 EVENTO DO ESTADO (AQUI!)
  const estado = document.getElementById("estado");

  if(estado){
    estado.addEventListener("change", function(){
      carregarCidades(this.value);
    });
  }

  // 🔥 EVENTO CNPJ
  const cnpj = document.getElementById("cnpj");

  if(cnpj){
    cnpj.addEventListener("blur", buscarCNPJ);
  }

}

/* ===============================
   🔥 FOUNDERS
============================== */

async function carregarFounders(){

  try {

    const res =
      await requestPublic(
        "/public/founders"
      )

    if(!res.ok) return

    const data =
      res.data

    const el =
      document.getElementById(
        "founders-restantes"
      )

    if(!el) return

    el.innerHTML = `
      ${data.restantes}
      <div
        style="
          font-size:16px;
          font-weight:600;
          margin-top:8px;
        "
      >
        vagas restantes
      </div>
    `

  } catch(e){

    console.error(e)

  }

}

init();

carregarFounders();

renderFooter();
