import { useLayoutEffect, useRef } from 'react'
import type { Credentials } from '../../api/types'
import { useChat } from '../../store/ChatContext'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import { MessageInput } from '../MessageInput/MessageInput'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  // Учётные данные для отправки сообщений
  credentials: Credentials
}

// Окно выбранного чата: шапка, лента сообщений и поле ввода
export function ChatWindow({ credentials }: ChatWindowProps) {
  const { state, dispatch } = useChat()
  const listRef = useRef<HTMLUListElement>(null)
  const chat = state.chats.find((item) => item.chatId === state.activeChatId)
  const messages = state.messages.filter(
    (message) => message.chatId === state.activeChatId,
  )

  // Прокрутка ленты вниз при смене чата и новом сообщении
  useLayoutEffect(() => {
    const list = listRef.current
    if (list) {
      list.scrollTop = list.scrollHeight
    }
  }, [state.activeChatId, messages.length])

  if (!chat) {
    return <div className={styles.empty}>Выберите чат или создайте новый</div>
  }

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button
          className={styles.back}
          type="button"
          aria-label="Назад к списку чатов"
          onClick={() => dispatch({ type: 'SELECT_CHAT', chatId: null })}
        >
          ←
        </button>
        {chat.name}
      </header>
      <ul className={styles.messages} ref={listRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ul>
      <MessageInput credentials={credentials} chatId={chat.chatId} />
    </section>
  )
}
