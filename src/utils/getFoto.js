const API_URL =
  import.meta.env.VITE_API_URL

export function getFoto(url) {

  if (!url) {
    return `${API_URL}/assets/sem-foto.jpg`
  }

  // já é URL completa
  if (url.startsWith("http")) {

    // corrige localhost salvo no banco
    return url.replace(
      "http://localhost:3001",
      API_URL
    )
  }

  // remove uploads duplicado
  const limpa =
    url.replace(/^uploads\//, "")

  return `${API_URL}/uploads/${limpa}`
}