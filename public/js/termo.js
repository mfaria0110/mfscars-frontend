const params =
  new URLSearchParams(
    window.location.search
  )

const tipo =
  params.get("tipo")

async function carregarTermo(){

  try {

    const res =
      await fetch(

        `https://api.mfscars.com.br/public/termos?tipo=${tipo}`

      )

    const data =
      await res.json()

    document.title =
      data.titulo

    document.getElementById(
      "titulo"
    ).innerText =
      data.titulo

    document.getElementById(
      "conteudo"
    ).innerHTML =
      data.conteudo

    document.getElementById(
      "versao"
    ).innerText =
      `Versão ${data.versao}`

  } catch(e){

    console.error(e)

    document.getElementById(
      "conteudo"
    ).innerHTML = `

      <p>
        Erro ao carregar termo.
      </p>

    `
  }
}

carregarTermo()