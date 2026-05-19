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

    ${planos.map(p => {

      const founders =
        Number(
          p.desconto_founders || 0
        ) > 0

      const valorFinal =
        founders

          ? Number(p.preco) *
            (
              1 -
              (
                Number(
                  p.desconto_founders
                ) / 100
              )
            )

          : Number(p.preco)

      return `

        <div
          class="plano-card ${p.destaque ? 'destaque' : ''}"
          style="
            position:relative;
            overflow:hidden;
          "
        >

          ${p.nome === "BUSINESS" ? `

            <div
              style="
                position:absolute;
                top:10px;
                right:-35px;
                background:#16a34a;
                color:#fff;
                padding:6px 40px;
                transform:rotate(35deg);
                font-size:11px;
                font-weight:700;
              "
            >
              MAIS VENDIDO
            </div>

          ` : ""}

          <h3>${p.nome}</h3>

          ${founders && p.nome !== "FREE" ? `

            <div
              style="
                text-decoration:line-through;
                opacity:.6;
                font-size:15px;
                margin-bottom:4px;
              "
            >
              R$ ${Number(p.preco).toLocaleString("pt-BR")}
            </div>

            <div class="preco">
              R$ ${valorFinal.toLocaleString(
                "pt-BR",
                {
                  minimumFractionDigits:2
                }
              )}
            </div>

            <div
              style="
                color:#22c55e;
                font-size:12px;
                font-weight:700;
                margin-top:6px;
              "
            >
              🔥 ${p.desconto_founders}% OFF VITALÍCIO
            </div>

          ` : `

            <div class="preco">
              R$ ${Number(p.preco).toLocaleString("pt-BR")}
            </div>

          `}

          <div class="limite">
            🚗 ${p.limite_veiculos} veículos
          </div>

          <div class="limite">
            🏪 ${p.limite_lojas || "∞"} lojas
          </div>

          <div class="limite">
            👥 ${
              p.limite_vendedores
                ? `${p.limite_vendedores} vendedores`
                : "Vendedores ilimitados"
            }
          </div>

        </div>

      `

    }).join("")}

    </div>

</div>
  `;
}