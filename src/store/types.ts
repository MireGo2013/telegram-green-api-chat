import type { Dispatch } from 'react'

// Чат с собеседником
export interface Chat {
  chatId: string
  phone: string
  name: string
}

// Сообщение в чате
export interface Message {
  id: string
  chatId: string
  text: string
  timestamp: number
  direction: 'in' | 'out'
  // Только у исходящих: отправляется, доставлено на сервер, ошибка отправки
  status?: 'sending' | 'sent' | 'failed'
}

// Состояние приложения: чаты, выбранный чат и все сообщения
export interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  messages: Message[]
}

// Действия, которыми меняется состояние
export type ChatAction =
  | { type: 'ADD_CHAT'; chat: Chat }
  | { type: 'SELECT_CHAT'; chatId: string | null }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_MESSAGE'; id: string; changes: Partial<Message> }
  | { type: 'RECEIVE_MESSAGE'; message: Message; chat: Chat }

// Что раздаёт ChatContext: текущее состояние и функция отправки действий
export interface ChatContextValue {
  state: ChatState
  dispatch: Dispatch<ChatAction>
}
