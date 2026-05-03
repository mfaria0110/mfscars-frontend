import { requestPublic } from './api-public.js';
import { renderFooter } from './footer.js';

const API_URL = "https://mfscars-backend.onrender.com";

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

  <button id="btnCadastrar" class="btn-primary">Criar conta</button>

<div class="msg" id="msg"></div>

<div style="margin-top:20px;text-align:center;">
Já tem conta?
<a href="../index.html">Entrar</a>
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
    senha
  })
});

const data = res.data;

if (!res.ok) {
  throw new Error(data?.erro || "Erro ao cadastrar");
}

    msg.style.color = "green";
    msg.innerText = "Conta criada com sucesso!";

    const FRONT_URL = "https://mfscars-frontend.onrender.com";

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

init();
renderFooter();
