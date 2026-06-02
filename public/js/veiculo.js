import { requestPublic } from './api-public.js';

const API_URL = "https://api.mfscars.com.br";

const app = document.getElementById("app-public");

app.classList.add("veiculo-page");

/* ===============================
   🧱 HTML BASE
============================== */

app.innerHTML = `

<!-- HEADER -->
<div
  style="
    position:sticky;
    top:0;

    z-index:999;

    background:
      rgba(255,255,255,.82);

    backdrop-filter:
      blur(18px);

    border-bottom:
      1px solid #e2e8f0;
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;

      display:flex;
      justify-content:space-between;
      align-items:center;

      padding:22px 30px;
    "
  >

<div
  style="
    display:flex;
    align-items:center;
    gap:60px;
  "
>

<div id="headerLogo">
  <img
    id="logoLoja"
    src="/assets/sem-logo.png"
    alt="Logo"

    style="
      height:60px;
      max-width:220px;

      object-fit:contain;

      display:block;
    "
  >
</div>

  <div
    id="headerLoja"

    style="
      display:none;

      align-items:center;
      gap:18px;

      font-size:20px;
      font-weight:700;
      color:#0f172a;
    "
  ></div>

</div>

    <button
      id="btnVoltar"

      style="
        height:35px;

        padding:0 22px;

        border:none;

        border-radius:14px;

        background:#0f172a;

        color:#fff;

        font-size:16px;
        font-weight:700;

        cursor:pointer;
      "
    >
      ← Voltar
    </button>

  </div>

</div>

<!-- PAGE -->
<div
  style="
    background:
      linear-gradient(
        180deg,
        #f8fafc 0%,
        #ffffff 100%
      );

    min-height:100vh;

    padding:10px 10px 50px;
  "
>

  <div
    style="
      max-width:1400px;
      margin:auto;
    "
  >

    <!-- CARD -->
    <div
      style="
        background:#fff;

        border-radius:36px;

        overflow:hidden;

        box-shadow:
          0 30px 100px
          rgba(15,23,42,.10);

display:grid;
grid-template-columns:
  540px 1fr;
align-items:start;

      "
    >

      <!-- GALERIA -->
<div
  style="
    background:#0f172a;
    padding:14px;

    display:flex;
    flex-direction:column;

    justify-content:flex-start;
  "
>

        <img
          id="fotoPrincipal"

          style="
            width:100%;
            height:300px;

            object-fit:cover;

            border-radius:26px;

            display:block;
          "
        >

      <div
        id="thumbs"
        style="
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:10px;
          max-height:160px;
          overflow-y:auto;
        "
      ></div>



      </div>

        <!-- INFO -->
        <div
          style="
            padding:26px;

            display:flex;
            flex-direction:column;

            justify-content:flex-start;
          "
        >

        <div>

          <div
            style="
              color:#2563eb;

              font-size:14px;
              font-weight:800;

              text-transform:uppercase;

              margin-bottom:16px;
            "
          >
            Veículo disponível
          </div>

          <h3
            id="titulo"

            style="
              font-size:22px;
              line-height:1.15;

              color:#0f172a;

              margin:0 0 24px;

              font-weight:900;
            "
          >
            Carregando...
          </h3>

          <div
            id="valor"

            style="
              font-size:25px;
              font-weight:900;

              color:#16a34a;

              margin-bottom:14px;
            "
          ></div>

          <!-- GRID -->
          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(3,1fr);
              gap:10px;
              margin-bottom:20px;
            "
          >

            <div
              id="ano"

              style="
                background:#f8fafc;
                height:32px;
                padding:0 12px;

                display:flex;
                align-items:center;

                border-radius:12px;
                font-size:14px;
                  color:#0f172a;
              "
            ></div>

            <div
              id="km"

              style="
                background:#f8fafc;
                height:32px;
                padding:0 12px;

                display:flex;
                align-items:center;

                border-radius:12px;
                font-size:14px;
                  color:#0f172a;
              "
            ></div>

            <div
              id="comb"

              style="
                background:#f8fafc;
                height:32px;
                padding:0 12px;

                display:flex;
                align-items:center;

                border-radius:12px;
                font-size:14px;
                  color:#0f172a;
              "
            ></div>

            <div
              id="cambio"

              style="
                background:#f8fafc;
                height:32px;
                padding:0 12px;

                display:flex;
                align-items:center;

                border-radius:12px;
                font-size:14px;
                  color:#0f172a;
              "
            ></div>

            <div
              id="cor"

              style="
                background:#f8fafc;
                height:32px;
                padding:0 12px;

                display:flex;
                align-items:center;

                border-radius:12px;
                font-size:14px;
                  color:#0f172a;
              "
            ></div>


          </div>

          <div
          style="
            display:flex;
            gap:12px;
            margin-top:40px;
          "
        >

          <button
            id="whatsapp"
            style="
              flex:1;
              height:48px;
              border:none;
              border-radius:14px;
              background:
                linear-gradient(
                  135deg,
                  #16a34a,
                  #15803d
                );
              color:#fff;
              font-size:15px;
              font-weight:700;
              cursor:pointer;
            "
          >
            💬 WhatsApp
          </button>

          <button
            id="interesse"
            style="
              flex:1;
              height:48px;
              border:none;
              border-radius:14px;
              background:
                linear-gradient(
                  135deg,
                  #2563eb,
                  #1d4ed8
                );
              color:#fff;
              font-size:15px;
              font-weight:700;
              cursor:pointer;
            "
          >
            🚀 Tenho interesse
          </button>

        </div>


          </div>

        </div>



      </div>

    </div>

    <!-- DESCRIÇÃO -->
    <div
      style="
        background:#fff;

        border-radius:32px;

        padding:42px;

        margin-top:34px;

        box-shadow:
          0 20px 60px
          rgba(15,23,42,.06);
      "
    >

      <h2
        style="
          font-size:36px;
          color:#0f172a;

          margin-bottom:24px;
        "
      >
        Descrição
      </h2>

      <p
        id="descricao"

        style="
          color:#475569;

          line-height:1.9;

          font-size:18px;
        "
      ></p>

    </div>

    <!-- OPCIONAIS -->
    <div
      style="
        background:#fff;

        border-radius:32px;

        padding:42px;

        margin-top:34px;

        box-shadow:
          0 20px 60px
          rgba(15,23,42,.06);
      "
    >

      <h2
        style="
          font-size:36px;
          color:#0f172a;

          margin-bottom:24px;
        "
      >
        Opcionais
      </h2>

      <ul
        id="listaOpcionais"

        style="
          display:grid;

          grid-template-columns:
            repeat(auto-fit,minmax(260px,1fr));

          gap:18px;

          padding:0;

          list-style:none;
        "
      ></ul>

    </div>

    <!-- SIMILARES -->
    <div
      class="similares section"

      style="
        margin-top:40px;
      "
    >

      <h2
        style="
          font-size:38px;
          margin-bottom:28px;
          color:#0f172a;
        "
      >
        Veículos semelhantes
      </h2>

      <div
        id="similares"
        class="veiculo-grid"
      ></div>

    </div>

  </div>

</div>

`;


/* ===============================
   🔍 PARAMS
============================== */

const params =
  new URLSearchParams(
    window.location.search
  );

const id =
  params.get("id");

if (!id) {

  alert("Veículo inválido");

  window.location.href =
    "/home.html";
}

/* ===============================
   🔘 EVENTOS
============================== */

document.getElementById(
  "btnVoltar"
).onclick = () => {

  window.location.href =
    "/home.html";
};

/* ===============================
   🚗 CARREGAR VEÍCULO
============================== */

async function carregar() {

  try {

    const res =
      await requestPublic(
        `/public/veiculos/${id}`
      );

    if (!res.ok) {
      throw new Error(
        "Erro ao buscar veículo"
      );
    }

    const dados =
      res.data;

    const v =
      dados.veiculo;

    const logo =
      document.getElementById(
        "logoLoja"
      );

    if (v.logo) {

      logo.src =
        v.logo.replace(
          "http://",
          "https://"
        );

    } else {

      logo.src =
        "/assets/sem-logo.png";
    }

    /* SEO */

    document.title =
      `${v.marca} ${v.modelo} - MFS Cars`;

    const meta =
      document.querySelector(
        "meta[name='description']"
      );

    if (meta) {

      meta.setAttribute(
        "content",
        `${v.marca} ${v.modelo} à venda por R$ ${v.valor}`
      );
    }

    /* DADOS */

    document.getElementById(
      "titulo"
    ).innerText =
      `${v.marca} ${v.modelo}`;

    document.getElementById(
      "valor"
    ).innerText =
      "R$ " +
      Number(v.valor)
        .toLocaleString("pt-BR");

    document.getElementById(
      "ano"
    ).innerText =
      "Ano: " + v.ano;

    document.getElementById(
      "km"
    ).innerText =
      "KM: " +
      Number(v.quilometragem)
        .toLocaleString("pt-BR");

    document.getElementById(
      "comb"
    ).innerText =
      "Combustível: " + (v.combustivel || "-");

    document.getElementById(
      "cambio"
    ).innerText =
      "Câmbio: " + (v.cambio || "-");

    document.getElementById(
      "cor"
    ).innerText =
      "Cor: " + (v.cor || "-");

    document.getElementById(
      "descricao"
    ).innerText =
      v.descricao || "Sem descrição";



document.getElementById(
  "headerLoja"
).style.display = "flex";

document.getElementById(
  "headerLoja"
).innerHTML = `
  🏪 ${v.loja}

  <a
    href="tel:${v.telefone}"
    style="
      color:#2563eb;
      text-decoration:none;
    "
  >
    📞 ${v.telefone}
  </a>
`;



    /* WHATSAPP */

    document.getElementById(
      "whatsapp"
    ).onclick = () => {

      let telefone =
        (
          v.telefone || ""
        ).replace(/\D/g, '');

      if (
        telefone.length < 10
      ) {

        telefone =
          "5599999999999";
      }

      if (
        !telefone.startsWith("55")
      ) {

        telefone =
          "55" + telefone;
      }

      const msg =
        encodeURIComponent(
          `Olá! Tenho interesse no veículo ${v.marca} ${v.modelo}`
        );

      window.open(
        `https://wa.me/${telefone}?text=${msg}`,
        "_blank"
      );
    };

    /* INTERESSE */

    document.getElementById(
      "interesse"
    ).onclick = () => {

      window.location.href =
        `/lead.html?empresa=${v.empresa_id}&loja=${v.loja_id}&veiculo=${v.id}`;
    };

    /* FOTOS */

    const principal =
      document.getElementById(
        "fotoPrincipal"
      );

    const thumbs =
      document.getElementById(
        "thumbs"
      );

    principal.onerror = () => {

      principal.src =
        `${API_URL}/uploads/sem-foto.jpg`;
    };

    if (
      dados.fotos?.length
    ) {

principal.src =
  dados.fotos[0].url
    ? dados.fotos[0].url.replace(
        "http://",
        "https://"
      )
    : `${API_URL}/uploads/sem-foto.jpg`;

      dados.fotos.forEach(f => {

        const img =
          document.createElement("img");

img.src =
  f.url
    ? f.url.replace(
        "http://",
        "https://"
      )
    : `${API_URL}/uploads/sem-foto.jpg`;

        img.onclick = () => {

          principal.src =
            img.src;
        };

      img.style.width = "82px";

      img.style.height = "62px";

      img.style.objectFit = "cover";

      img.style.borderRadius = "14px";

      img.style.cursor = "pointer";

      img.style.border =
        "2px solid transparent";

        thumbs.appendChild(img);
      });

    } else {

      principal.src =
        `${API_URL}/uploads/sem-foto.jpg`;
    }

    /* OPCIONAIS */

    const lista =
      document.getElementById(
        "listaOpcionais"
      );

    dados.opcionais?.forEach(o => {

      const li =
        document.createElement("li");

      li.innerText =
        o.nome;

      lista.appendChild(li);
    });

    /* SIMILARES */

    carregarSimilares();

  } catch (err) {

    console.error(err);

    alert(
      "Erro ao carregar veículo"
    );
  }
}

/* ===============================
   🔁 SIMILARES
============================== */

async function carregarSimilares() {

  const grid =
    document.getElementById(
      "similares"
    );

  try {

    const res =
      await requestPublic(
        `/public/veiculos/similares/${id}`
      );

    if (!res.ok) {

      throw new Error(
        "Erro ao buscar similares"
      );
    }

    const similares =
      res.data;

    if (
      similares?.length
    ) {

      grid.innerHTML = "";

      similares.forEach(v => {

        const foto =
        v.foto
          ? (
              v.foto.startsWith("http")
                ? v.foto.replace(
                    "http://",
                    "https://"
                  )
                : `${API_URL}/uploads/${v.foto}`
            )
          : `${API_URL}/uploads/sem-foto.jpg`;

        const div =
          document.createElement("div");

        div.className =
          "card";

        div.onclick = () => {

          window.location.href =
            `/veiculo.html?id=${v.id}`;
        };

        div.innerHTML = `
          <img
            src="${foto}"
            onerror="
              this.onerror=null;
              this.src='/assets/sem-foto.png';
            "
          >

          <div class="card-info">

            ${v.marca} ${v.modelo}

            <br>

            <strong>
              R$ ${Number(v.valor)
                .toLocaleString("pt-BR")}
            </strong>

          </div>
        `;

        grid.appendChild(div);

      });

    } else {

      grid.innerHTML =
        "<p>Nenhum semelhante encontrado</p>";
    }

  } catch {

    grid.innerHTML =
      "<p>Erro ao carregar similares</p>";
  }
}

/* ===============================
   🚀 INIT
============================== */

carregar();