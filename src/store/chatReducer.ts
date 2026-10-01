import type { ChatAction, ChatState } from './types'

// Состояние инстанса, у которого ещё нет сохранённой истории
export const initialChatState: ChatState = {
  chats: [],
  activeChatId: null,
  messages: [],
}

// Возвращает новое состояние для действия, старое не меняет
export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_CHAT': {
      const exists = state.chats.some(
        (chat) => chat.chatId === action.chat.chatId,
      )
      return {
        ...state,
        chats: exists ? state.chats : [action.chat, ...state.chats],
        activeChatId: action.chat.chatId,
      }
    }
    case 'SELECT_CHAT':
      return { ...state, activeChatId: action.chatId }
    case 'ADD_MESSAGE': {
      const exists = state.messages.some(
        (message) => message.id === action.message.id,
      )
      if (exists) {
        return state
      }
      return { ...state, messages: [...state.messages, action.message] }
    }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.id
            ? { ...message, ...action.changes }
            : message,
        ),
      }
    case 'RECEIVE_MESSAGE': {
      const hasChat = state.chats.some(
        (chat) => chat.chatId === action.chat.chatId,
      )
      const hasMessage = state.messages.some(
        (message) => message.id === action.message.id,
      )
      if (hasChat && hasMessage) {
        return state
      }
      return {
        ...state,
        chats: hasChat ? state.chats : [action.chat, ...state.chats],
        messages: hasMessage
          ? state.messages
          : [...state.messages, action.message],
      }
    }
  }
}
