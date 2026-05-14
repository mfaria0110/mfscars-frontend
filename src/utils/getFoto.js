const API_URL =
  import.meta.env.VITE_API_URL

export function getFoto(url) {

  /* 🔥 NULL / UNDEFINED */
  if (
    !url ||
    url === "null" ||
    url === "undefined"
  ) {

    return `${API_URL}/assets/sem-foto.jpg`
  }

  /* 🔥 GARANTE STRING */
  url = String(url)

  /* 🔥 CLOUDINARY / URL COMPLETA */
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {

  return url.replace(
    /^http:\/\//,
    "https://"
  )
    
  }

  /* 🔥 REMOVE uploads/ DUPLICADO */
  const limpa =
    url.replace(
      /^uploads\//,
      ""
    )

  return `${API_URL}/uploads/${limpa}`
}