import { requestPublic } from './api-public.js';

/* ===============================
   💰 CARREGAR PLANOS (PUBLICO)
================================ */
async function carregarPlanos(){

  const res = await requestPublic("/public/planos");

  if(!res.ok){
    console.error("Erro ao buscar planos");
    return [];
  }

  return res.data || [];
}

/* ===============================
   🧱 RENDER FOOTER
================================ */
export async function renderFooter(){

  const footer = document.getElementById("footer");
  if(!footer) return;

  const planos = await carregarPlanos();

  footer.innerHTML = `
    <div class="footer">

<div class="footer-info">

  <strong>
    MFS Cars Marketplace
  </strong>

  <br>

  📧 mfaria2016@outlook.com

  <br>

  📱 (24) 99972-6811

  <div
    style="
      margin-top:14px;
      display:flex;
      gap:14px;
      flex-wrap:wrap;
      font-size:13px;
    "
  >

    <a
      href="/termos.html?tipo=termos"
      target="_blank"
    >
      Termos
    </a>

    <a
      href="/termos.html?tipo=privacidade"
      target="_blank"
    >
      Privacidade
    </a>

    <a
      href="/cookies.html"
      target="_blank"
    >
      Cookies
    </a>

  </div>

</div>

      <div class="footer-planos">

        ${planos.map(p => `
          <div class="plano-card ${p.destaque ? 'destaque' : ''}">
            
            <h3>${p.nome}</h3>

            <div class="preco">
              R$ ${Number(p.preco).toLocaleString("pt-BR")}
            </div>

            <div class="limite">
              ${p.limite_veiculos} veículos
            </div>

          </div>
        `).join("")}

      </div>

    </div>
  `;
}