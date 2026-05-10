import { requestPublic } from './api-public.js';

const app = document.getElementById("app-public");

/* ===============================
   🧱 LAYOUT (FORM + LISTA)
============================== */

app.innerHTML = `
<div class="header">
  <div class="logo">🚗 MFS Cars</div>
  <div class="menu">
    <a href="/home.html">Início</a>
  </div>
</div>

<div class="container" style="max-width:600px;margin:auto">

  <h2>Tenho interesse</h2>

  <input id="nome" placeholder="Seu nome" style="width:100%;margin-bottom:10px;padding:10px" />
  <input id="telefone" placeholder="Telefone" style="width:100%;margin-bottom:10px;padding:10px" />
  <textarea id="mensagem" placeholder="Mensagem" style="width:100%;margin-bottom:10px;padding:10px"></textarea>

  <button id="btnEnviar" style="width:100%;padding:12px;background:#007bff;color:white;border:none;border-radius:6px">
    Enviar
  </button>

  <p id="msg" style="margin-top:10px"></p>

  <hr style="margin:30px 0">

  <h2>Leads recebidos</h2>
  <div id="lista"></div>

</div>
`;

/* ===============================
   🔍 PARAMS
============================== */
const inputTel = document.getElementById("telefone");

inputTel.addEventListener("input", (e) => {

  let v = e.target.value.replace(/\D/g, '');

  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    v = v.replace(/^(\d*)/, "($1");
  }

  e.target.value = v;

});


const params = new URLSearchParams(window.location.search);

const empresa_id = params.get("empresa");
const loja_id = params.get("loja");
const veiculo_id = params.get("veiculo");

/* ===============================
   📱 FORMATAR TELEFONE
============================== */

function formatarTelefone(tel){
  if(!tel) return "-";

  let t = tel.replace(/\D/g,'');

  if(!t.startsWith("55")){
    t = "55" + t;
  }

  return t;
}

/* ===============================
   🚀 ENVIAR LEAD
============================== */

document.getElementById("btnEnviar").onclick = async () => {

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const mensagem = document.getElementById("mensagem").value;

  const msg = document.getElementById("msg");

  if(!nome || !telefone){
    msg.innerText = "Preencha nome e telefone";
    return;
  }

  if(!empresa_id){
    msg.innerText = "Empresa não informada";
    return;
  }

  msg.innerText = "Enviando...";

  try {

    const res = await requestPublic("/public/lead", {
      method: "POST",
      body: JSON.stringify({
        nome,
        telefone,
        mensagem,
        empresa_id,
        loja_id,
        veiculo_id
      })
    });

    if (!res.ok) {
      msg.innerText = "Erro ao enviar";
      return;
    }

    msg.innerText = "✅ Lead enviado com sucesso!";

    // limpa campos
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("mensagem").value = "";

    // recarrega lista
    carregar();

  } catch (e) {
    console.error(e);
    msg.innerText = "Erro na requisição";
  }
};

/* ===============================
   📦 CARREGAR LEADS
============================== */

async function carregar(){

  const lista = document.getElementById("lista");

  lista.innerHTML = "<p>Carregando...</p>";

  try{

    if(!empresa_id){
      lista.innerHTML = "<p>Empresa não informada</p>";
      return;
    }

    const res = await requestPublic(`/public/leads?empresa_id=${empresa_id}`);

    if(!res.ok){
      lista.innerHTML = "<p>Erro ao carregar leads</p>";
      return;
    }

    const leads = res.data || [];

    if(leads.length === 0){
      lista.innerHTML = `
        <p style="text-align:center;color:#777">
          Nenhum lead recebido ainda.
        </p>
      `;
      return;
    }

    leads.sort((a,b)=> new Date(b.data) - new Date(a.data));

    lista.innerHTML = "";

    leads.forEach(l=>{

      const telefone = formatarTelefone(l.telefone);

      lista.innerHTML += `
        <div class="card" style="margin-bottom:15px;padding:15px">

          <strong>${l.nome || "-"}</strong>

          <br><br>

          📞 Telefone:
          <a href="https://wa.me/${telefone}" target="_blank">
            ${l.telefone || "-"}
          </a>

          <br><br>

          🚗 Veículo:
          ${l.marca || "-"} ${l.modelo || ""}

          <br><br>

          💬 Mensagem:
          ${l.mensagem || "-"}

          <br><br>

          📅 Data:
          ${new Date(l.data).toLocaleString("pt-BR")}

        </div>
      `;

    });

  }catch(e){

    console.error(e);
    lista.innerHTML = "<p>Erro ao carregar leads</p>";

  }

}

/* ===============================
   🚀 INIT
============================== */

carregar();