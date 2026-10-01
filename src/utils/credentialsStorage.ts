import type { Credentials } from '../api/types'

// Ключ, под которым учётные данные лежат в localStorage
const STORAGE_KEY = 'greenApiCredentials'

// Сохранённые учётные данные или null, если их нет или они испорчены
export function loadCredentials(): Credentials | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return null
  }
  try {
    return JSON.parse(saved) as Credentials
  } catch {
    return null
  }
}

// Сохраняет учётные данные после успешного входа
export function saveCredentials(credentials: Credentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
}

// Удаляет учётные данные при выходе
export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY)
}
