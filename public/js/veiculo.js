import { requestPublic } from './api-public.js';

const API_URL = "https://mfscars-backend.onrender.com";

const app = document.getElementById("app-public");

app.classList.add("veiculo-page");

/* ===============================
   🧱 HTML BASE
============================== */

app.innerHTML = `
<div class="header">
  <div>🚗 MFS Cars Marketplace</div>

  <button
    id="btnVoltar"
    class="btn-voltar"
  >
    ← Voltar
  </button>
</div>

<div class="veiculo-container">

  <div>

    <img
      id="fotoPrincipal"
      class="foto-principal"
    >

    <div
      id="thumbs"
      class="thumbs"
    ></div>

  </div>

  <div class="veiculo-info">

    <h2 id="titulo">
      Carregando...
    </h2>

    <div
      id="valor"
      class="valor"
    ></div>

    <div class="ficha">

      <p id="ano"></p>

      <p id="km"></p>

      <p id="comb"></p>

      <p id="cambio"></p>

      <p id="cor"></p>

    </div>

    <h3>Loja</h3>

    <p id="loja"></p>

    <p id="telefone"></p>

    <button
      id="whatsapp"
      class="botao"
    >
      Falar no WhatsApp
    </button>

    <button
      id="interesse"
      class="botao2"
    >
      Tenho interesse
    </button>

  </div>

</div>

<div class="descricao section">

  <h2>Descrição</h2>

  <p id="descricao"></p>

</div>

<div class="opcionais section">

  <h2>Opcionais</h2>

  <ul id="listaOpcionais"></ul>

</div>

<div class="similares section">

  <h2>Veículos semelhantes</h2>

  <div
    id="similares"
    class="veiculo-grid"
  ></div>

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

  window.location =
    "/home.html";
}

/* ===============================
   🔘 EVENTOS
============================== */

document.getElementById(
  "btnVoltar"
).onclick = () => {

  window.location =
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
      "Combustível: " +
      v.combustivel;

    document.getElementById(
      "cambio"
    ).innerText =
      "Câmbio: " +
      v.cambio;

    document.getElementById(
      "cor"
    ).innerText =
      "Cor: " +
      v.cor;

    document.getElementById(
      "descricao"
    ).innerText =
      v.descricao;

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

      window.location =
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
        dados.fotos[0].url;

      dados.fotos.forEach(f => {

        const img =
          document.createElement("img");

        img.src =
          f.url;

        img.onclick = () => {

          principal.src =
            img.src;
        };

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
                  ? v.foto
                  : `${API_URL}/uploads/${v.foto}`
              )
            : `${API_URL}/uploads/sem-foto.jpg`;

        const div =
          document.createElement("div");

        div.className =
          "card";

        div.onclick = () => {

          window.location =
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