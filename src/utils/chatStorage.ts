import type { ChatState } from '../store/types'

// Ключ истории конкретного инстанса: у каждого аккаунта своя история
function storageKey(idInstance: string): string {
  return `greenApiChatState:${idInstance}`
}

// Сохранённое состояние или fallback, если его нет или оно испорчено
export function loadChatState(
  idInstance: string,
  fallback: ChatState,
): ChatState {
  const saved = localStorage.getItem(storageKey(idInstance))
  if (!saved) {
    return fallback
  }
  try {
    return JSON.parse(saved) as ChatState
  } catch {
    return fallback
  }
}

// Сохраняет состояние после каждого изменения
export function saveChatState(idInstance: string, state: ChatState): void {
  localStorage.setItem(storageKey(idInstance), JSON.stringify(state))
}
