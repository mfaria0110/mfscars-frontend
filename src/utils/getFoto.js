const API_URL =
  import.meta.env.VITE_API_URL

export function getFoto(url) {

  if (!url) {
    return `${API_URL}/assets/sem-foto.jpg`
  }

  if (url.startsWith("http")) {
    return url
  }

  return `${API_URL}/uploads/${url}`
}