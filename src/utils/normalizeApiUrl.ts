// Приводит apiUrl к виду https://host: без пробелов и слэша в конце, с протоколом
export function normalizeApiUrl(value: string): string {
  let url = value.trim()
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }
  return url.replace(/\/+$/, '')
}
