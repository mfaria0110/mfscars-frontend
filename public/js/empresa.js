import { requestPublic } from './api-public.js';

const API_URL =
  "https://api.mfscars.com.br";

const app =
  document.getElementById("app-public");

app.classList.add("empresa-page");

let veiculos = [];

/* ===============================
   🧱 HTML BASE
============================== */

app.innerHTML = `
<div class="header">

  <span>
    🚗 MFS Cars Marketplace
  </span>

<button class="btn-voltar" onclick="history.back()">
  ← Voltar
</button>

</div>

<div class="topo-loja">

  <div class="loja-box">

    <img
      id="logo"
      class="logo"
    >

    <div class="loja-info">

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      ">

<div class="loja-dados">

  <h1 id="nome"></h1>

  <div
    id="premium"
    class="badge-premium"
  >
    ⭐ Loja Premium
  </div>

  <div class="loja-meta">

    <div id="cidade"></div>

    <div id="telefone"></div>

    <div id="qtdTopo"></div>

  </div>

  <div class="loja-acoes">

    <a
      id="whats"
      class="whats"
      target="_blank"
    >
      💬 Chamar no WhatsApp
    </a>

  <a
    id="btnMapa"
    target="_blank"
    class="btn-mapa"
  >
    📍 Como chegar
  </a>

  </div>

</div>

    </div>

  </div>

</div>

<div class="container">

  <div class="sidebar">

    <h3>Filtrar</h3>

    <input
      id="buscaGeral"
      placeholder="Buscar"
    >

    <input
      id="fMarca"
      placeholder="Marca"
    >

    <input
      id="fModelo"
      placeholder="Modelo"
    >

    <input
      id="fPrecoMin"
      placeholder="Min"
      type="number"
    >

    <input
      id="fPrecoMax"
      placeholder="Max"
      type="number"
    >

    <select id="fOrdenar">

      <option value="">
        Ordenar
      </option>

      <option value="preco_asc">
        Menor preço
      </option>

      <option value="preco_desc">
        Maior preço
      </option>

      <option value="ano_desc">
        Mais novos
      </option>

    </select>

    <button id="btnFiltrar">
      Filtrar
    </button>

  </div>

  <div style="flex:1;">

    <h2 id="titulo"></h2>

    <div
      id="grid"
      class="grid"
    ></div>

  </div>

</div>

<div class="mapa">

  <iframe
    id="mapa"
    width="100%"
    height="300"
  ></iframe>

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

  alert("Loja inválida");

  window.location =
    "/home.html";
}

/* ===============================
   🔘 EVENTOS
============================== */

document.getElementById(
  "btnFiltrar"
).onclick = filtrar;

/* ===============================
   🚀 CARREGAR LOJA
============================== */

async function carregar() {

  try {

    const res =
      await requestPublic(
        `/public/loja/${id}`
      );

    if (!res.ok) {

      throw new Error(
        "Erro ao carregar loja"
      );
    }

    const dados =
      res.data;

    const loja =
      dados.loja || {};

    document.title =
      `${loja.nome} - MFS Cars`;

    /* 🔥 LOJA */

    document.getElementById(
      "nome"
    ).innerText =
      loja.nome || "-";

    if (loja.premium) {

      document.getElementById(
        "premium"
      ).style.display =
        "block";
    }

document.getElementById(
  "cidade"
).innerHTML =
  `📍 ${loja.cidade || ""} - ${loja.estado || ""}`;

document.getElementById(
  "telefone"
).innerHTML =
  `📞 ${loja.telefone || "-"}`;

    /* WHATS */

    let tel =
      (
        loja.telefone || ""
      ).replace(/\D/g, '');

    if (
      !tel.startsWith("55")
    ) {

      tel =
        "55" + tel;
    }

    document.getElementById(
      "whats"
    ).href =
      `https://wa.me/${tel}`;

    /* LOGO */
    document.getElementById(
      "logo"
    ).src =
      loja.logo
        ? (
            loja.logo.startsWith("http")
              ? loja.logo.replace("http://", "https://")
              : `${API_URL}/assets/${loja.logo}`
          )
        : `${API_URL}/assets/sem-logo.png`;


    /* MAPA */

    document.getElementById(
      "btnMapa"
    ).href =
      loja.latitude &&
      loja.longitude
        ? `https://www.google.com/maps?q=${loja.latitude},${loja.longitude}`
        : `https://www.google.com/maps?q=${loja.cidade}`;

    /* VEÍCULOS */

    veiculos =
      dados.veiculos || [];

document.getElementById(
  "qtdTopo"
).innerHTML =
  `🚗 ${veiculos.length} veículo${veiculos.length > 1 ? "s" : ""} disponível${veiculos.length > 1 ? "is" : ""}`;

    filtrar();

  } catch (err) {

    console.error(err);

    alert(
      "Erro ao carregar loja"
    );
  }
}

/* ===============================
   🔍 FILTRO
============================== */

function filtrar() {

  let lista =
    [...veiculos];

  const busca =
    document
      .getElementById(
        "buscaGeral"
      )
      .value
      .toLowerCase();

  if (busca) {

    lista =
      lista.filter(v =>
        `${v.marca} ${v.modelo}`
          .toLowerCase()
          .includes(busca)
      );
  }

  const marca =
    document
      .getElementById(
        "fMarca"
      )
      .value
      .toLowerCase();

  const modelo =
    document
      .getElementById(
        "fModelo"
      )
      .value
      .toLowerCase();

  if (marca) {

    lista =
      lista.filter(v =>
        v.marca
          .toLowerCase()
          .includes(marca)
      );
  }

  if (modelo) {

    lista =
      lista.filter(v =>
        v.modelo
          .toLowerCase()
          .includes(modelo)
      );
  }

  const min =
    parseFloat(
      document.getElementById(
        "fPrecoMin"
      ).value
    );

  const max =
    parseFloat(
      document.getElementById(
        "fPrecoMax"
      ).value
    );

  if (min) {

    lista =
      lista.filter(
        v => v.valor >= min
      );
  }

  if (max) {

    lista =
      lista.filter(
        v => v.valor <= max
      );
  }

  const ordenar =
    document.getElementById(
      "fOrdenar"
    ).value;

  if (
    ordenar === "preco_asc"
  ) {

    lista.sort(
      (a, b) =>
        Number(a.valor) -
        Number(b.valor)
    );
  }

  if (
    ordenar === "preco_desc"
  ) {

    lista.sort(
      (a, b) =>
        b.valor - a.valor
    );
  }

if (
  ordenar === "ano_desc"
) {

  lista.sort(
    (a, b) =>
      Number(b.ano_modelo || 0) -
      Number(a.ano_modelo || 0)
  );
}

  render(lista);
}

/* ===============================
   ❤️ FAVORITOS
============================== */

function isFavorito(id) {

  const favs =
    JSON.parse(
      localStorage.getItem(
        "favs"
      ) || "[]"
    );

  return favs.includes(id);
}

function toggleFavorito(id) {

  let favs =
    JSON.parse(
      localStorage.getItem(
        "favs"
      ) || "[]"
    );

  if (favs.includes(id)) {

    favs =
      favs.filter(
        f => f !== id
      );

  } else {

    favs.push(id);
  }

  localStorage.setItem(
    "favs",
    JSON.stringify(favs)
  );

  filtrar();
}

/* ===============================
   🎨 RENDER
============================== */

function render(lista) {

  const grid =
    document.getElementById(
      "grid"
    );

  if (
    lista.length === 0
  ) {

    grid.innerHTML =
      "Nenhum veículo encontrado";

    return;
  }

  document.getElementById(
    "titulo"
  ).innerText =
    `${lista.length} veículos disponíveis`;

  grid.innerHTML = "";

  lista.forEach(v => {
    

    const primeiraFoto =
      Array.isArray(v.fotos)
        ? v.fotos[0]
        : null;

    const foto =
      primeiraFoto?.url
        ? primeiraFoto.url
        : (
            v.foto &&
            v.foto !== "undefined" &&
            v.foto !== "null"
          )
            ? (
               v.foto.startsWith("http")
                ? v.foto.replace("http://", "https://")
                  : `${API_URL}/uploads/${v.foto}`
              )
            : `${API_URL}/uploads/sem-foto.jpg`;



    grid.innerHTML += `

      <div
        class="card"
        onclick="window.abrirVeiculo(${v.id})"
      >

        <div
          onclick="
            event.stopPropagation();
            window.toggleFav(${v.id})
          "
          style="
            position:absolute;
            top:8px;
            right:8px;
            cursor:pointer;
          "
        >
          ${isFavorito(v.id)
            ? "❤️"
            : "🤍"}
        </div>

        <img
  src="${foto}"
  onerror="this.src='${API_URL}/uploads/sem-foto.jpg'"
>

    <div class="info">

    <div class="modelo">
      ${v.marca} ${v.modelo}
    </div>

    <div class="detalhes">
      📅 ${v.ano_modelo || "-"}
    </div>

    <div class="detalhes">
      ⛽ ${v.combustivel || "-"}
    </div>

    <div class="detalhes">
      ⚙️ ${v.cambio || "-"}
    </div>

    <div class="valor">
      R$ ${Number(v.valor)
        .toLocaleString("pt-BR")}
    </div>

  </div>

    `;
  });
}

/* ===============================
   🌐 GLOBALS
============================== */

window.abrirVeiculo = (id) => {

  window.location =
    `/veiculo.html?id=${id}`;
};

window.toggleFav =
  toggleFavorito;

/* ===============================
   🚀 INIT
============================== */

carregar();

function formatarTelefone(numero) {
  const n = numero.replace(/\D/g,'');

  if (n.length === 11) {
    return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  }

  return numero;
}