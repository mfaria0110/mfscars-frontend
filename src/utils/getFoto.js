const API_URL =
  "https://mfscars-backend.onrender.com"

export function getFoto(url) {

  if (!url) {
    return `${API_URL}/assets/sem-foto.jpg`
  }

  if (url.startsWith("http")) {
    return url
  }

  const limpa = url.replace(/^uploads\//, "")

  return `${API_URL}/uploads/${limpa}`
}