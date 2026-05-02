export function getFoto(url) {
  if (!url) return "http://localhost:3001/assets/sem-foto.jpg"
  if (url.startsWith("http")) return url
  return `http://localhost:3001/uploads/${url}`
}