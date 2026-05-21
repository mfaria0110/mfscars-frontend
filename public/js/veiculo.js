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
        font-size:34px;
        font-weight:900;

        color:#0f172a;
      "
    >
      🚗 MFS Cars
    </div>

    <button
      id="btnVoltar"

      style="
        height:52px;

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

    padding:50px 30px 90px;
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
          1.15fr 1fr;
      "
    >

      <!-- GALERIA -->
      <div
        style="
          background:#0f172a;
          padding:24px;
        "
      >

        <img
          id="fotoPrincipal"

          style="
            width:100%;
            height:620px;

            object-fit:cover;

            border-radius:26px;

            display:block;
          "
        >

        <div
          id="thumbs"

          style="
            display:flex;
            gap:14px;

            margin-top:18px;

            overflow:auto;
          "
        ></div>

      </div>

      <!-- INFO -->
      <div
        style="
          padding:46px;

          display:flex;
          flex-direction:column;
          justify-content:space-between;
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

          <h1
            id="titulo"

            style="
              font-size:56px;
              line-height:1.05;

              color:#0f172a;

              margin:0 0 24px;

              font-weight:900;
            "
          >
            Carregando...
          </h1>

          <div
            id="valor"

            style="
              font-size:52px;
              font-weight:900;

              color:#16a34a;

              margin-bottom:34px;
            "
          ></div>

          <!-- GRID -->
          <div
            style="
              display:grid;

              grid-template-columns:
                repeat(2,1fr);

              gap:18px;

              margin-bottom:40px;
            "
          >

            <div
              id="ano"

              style="
                background:#f8fafc;

                border-radius:20px;

                padding:20px;

                font-size:17px;

                color:#0f172a;
              "
            ></div>

            <div
              id="km"

              style="
                background:#f8fafc;

                border-radius:20px;

                padding:20px;

                font-size:17px;

                color:#0f172a;
              "
            ></div>

            <div
              id="comb"

              style="
                background:#f8fafc;

                border-radius:20px;

                padding:20px;

                font-size:17px;

                color:#0f172a;
              "
            ></div>

            <div
              id="cambio"

              style="
                background:#f8fafc;

                border-radius:20px;

                padding:20px;

                font-size:17px;

                color:#0f172a;
              "
            ></div>

            <div
              id="cor"

              style="
                background:#f8fafc;

                border-radius:20px;

                padding:20px;

                font-size:17px;

                color:#0f172a;
              "
            ></div>


          </div>

          <!-- LOJA -->
          <div
            style="
              background:#f8fafc;

              border-radius:24px;

              padding:24px;

              margin-bottom:34px;
            "
          >

            <div
              style="
                font-size:14px;
                color:#64748b;

                margin-bottom:10px;
              "
            >
              Loja
            </div>

            <div
              id="loja"

              style="
                font-size:26px;
                font-weight:800;

                color:#0f172a;

                margin-bottom:12px;
              "
            ></div>

            <div
              id="telefone"

              style="
                font-size:18px;
                color:#2563eb;
              "
            ></div>

          </div>

        </div>

        <!-- CTA -->
        <div
          style="
            display:flex;
            gap:18px;
          "
        >

          <button
            id="whatsapp"

            style="
              flex:1;

              height:68px;

              border:none;

              border-radius:18px;

              background:
                linear-gradient(
                  135deg,
                  #16a34a,
                  #15803d
                );

              color:#fff;

              font-size:18px;
              font-weight:800;

              cursor:pointer;

              box-shadow:
                0 20px 40px
                rgba(22,163,74,.25);
            "
          >
            💬 WhatsApp
          </button>

          <button
            id="interesse"

            style="
              flex:1;

              height:68px;

              border:none;

              border-radius:18px;

              background:
                linear-gradient(
                  135deg,
                  #2563eb,
                  #1d4ed8
                );

              color:#fff;

              font-size:18px;
              font-weight:800;

              cursor:pointer;

              box-shadow:
                0 20px 40px
                rgba(37,99,235,.25);
            "
          >
            🚀 Tenho interesse
          </button>

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
      "loja"
    ).innerText =
      v.loja;

    document.getElementById(
      "telefone"
    ).innerHTML =
      `<a href="tel:${v.telefone}">
        ${v.telefone}
      </a>`;

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

      img.style.width = "120px";

      img.style.height = "90px";

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
          <img src="${foto}">

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