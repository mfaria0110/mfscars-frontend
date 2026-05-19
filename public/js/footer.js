import { requestPublic } from './api-public.js';

/* ===============================
   💰 CARREGAR PLANOS
================================ */
async function carregarPlanos(){

  const res =
    await requestPublic(
      "/public/planos"
    );

  if(!res.ok){

    console.error(
      "Erro ao buscar planos"
    );

    return [];
  }

  return res.data || [];
}

/* ===============================
   🧱 RENDER FOOTER
================================ */
export async function renderFooter(){

  const footer =
    document.getElementById(
      "footer"
    );

  if(!footer) return;

  const planos =
    await carregarPlanos();

  footer.innerHTML = `

<div
  class="footer"
  style="
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:20px;
    flex-wrap:wrap;

    padding:20px;
    margin-top:10px;
    background:#fff;
    color:#dbdce3;
  "
>
  <!-- PLANOS -->
  <div
    class="footer-planos"
    style="
      display:grid;
      grid-template-columns:
        repeat(
          auto-fit,
          minmax(240px,1fr)
        );

      gap:18px;
      flex:1;
    "
  >

${planos.map(p => {

  const founders =
    Number(
      p.desconto_founders || 0
    ) > 0;

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

      : Number(p.preco);

  return `

<div
  class="plano-card"
  style="
    position:relative;
    overflow:hidden;
    min-height:230px;
    width: 200px;
    border-radius:28px;
    padding:24px;
    font-size:15px;
    background:${
      p.destaque

        ? 'linear-gradient(135deg,#312e81 0%,#4338ca 100%)'
        : 'linear-gradient(135deg,#0f172a 0%,#111827 100%)'
    };

    border:
      2px solid rgba(255,255,255,.05);

    box-shadow:
      0 18px 50px rgba(0,0,0,.28);
  "
>

${p.nome === "BUSINESS" ? `

<div
  style="
    position:absolute;
    top:14px;
    right:-42px;
    background:#16a34a;
    color:#fff;
    padding:8px 48px;
    font-size:12px;
    font-weight:900;
    transform:rotate(35deg);
    letter-spacing:.4px;
  "
>
  
</div>

` : ""}

<h3
  style="
    font-size:32px;
    font-weight:900;
    margin-bottom:2px;
    letter-spacing:-2px;
    color:#e2e8f0;
    margin-top:-10px;
  "
>
  ${p.nome}
</h3>

${founders && p.nome !== "FREE" ? `

<div
  style="
    font-size:15px;
    opacity:.6;
    text-decoration:line-through;
    margin-bottom:8px;
  "
>
  R$ ${Number(p.preco).toLocaleString(
    "pt-BR"
  )}
</div>

<div
  style="
    font-size:22px;
    font-weight:900;
    color:#6ee7b7;
    line-height:1;
    margin-bottom:10px;
  "
>
R$ ${valorFinal.toLocaleString(
  "pt-BR",
  {
    minimumFractionDigits:2
  }
)}

<div
  style="
    font-size:14px;
    opacity:.7;
    margin-top:10px;
    margin-bottom:10px;
  "
>
  Valor mensal
</div>
</div>

<div
  style="
    color:#22c55e;
    font-size:14px;
    font-weight:800;
    margin-bottom:8px;
  "
>
  🔥 ${p.desconto_founders}% OFF VITALÍCIO
</div>

` : `

<div
  style="
    font-size:32px;
    font-weight:900;
    color:#6ee7b7;
    line-height:1;
    margin-bottom:18px;
  "
>
  R$ ${Number(p.preco).toLocaleString(
    "pt-BR"
  )}
</div>

`}

<div
  style="
    font-size:15px;
    line-height:2;
    opacity:.95;
  "
>
  🚗 ${p.limite_veiculos} veículos
</div>

<div
  style="
    font-size:15px;
    line-height:2;
    opacity:.95;
  "
>
  🏪 ${p.limite_lojas || "∞"} lojas
</div>

<div
  style="
    font-size:15px;
    line-height:2;
    opacity:.95;
  "
>
  👥 ${
    p.limite_vendedores

      ? `${p.limite_vendedores} vendedores`

      : "Vendedores ilimitados"
  }
</div>

</div>

`;

}).join("")}

  </div>

</div>

  `;
}