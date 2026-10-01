import {
  createContext,
  use,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import { loadChatState, saveChatState } from '../utils/chatStorage'
import { chatReducer, initialChatState } from './chatReducer'
import type { ChatContextValue } from './types'

const ChatContext = createContext<ChatContextValue | null>(null)

interface ChatProviderProps {
  // Инстанс, чью историю загружать и сохранять
  idInstance: string
  children: ReactNode
}

// Хранит состояние чатов инстанса и раздаёт его вложенным компонентам.
// При смене инстанса провайдер пересоздаётся через key={idInstance}
export function ChatProvider({ idInstance, children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(
    chatReducer,
    initialChatState,
    (fallback) => loadChatState(idInstance, fallback),
  )

  useEffect(() => {
    saveChatState(idInstance, state)
  }, [idInstance, state])

  return <ChatContext value={{ state, dispatch }}>{children}</ChatContext>
}

// Доступ к состоянию чатов из любого компонента внутри ChatProvider
export function useChat(): ChatContextValue {
  const context = use(ChatContext)
  if (!context) {
    throw new Error('useChat вызван вне ChatProvider')
  }
  return context
}
