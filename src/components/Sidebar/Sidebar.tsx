import { useChat } from '../../store/ChatContext'
import { ChatListItem } from '../ChatListItem/ChatListItem'
import styles from './Sidebar.module.css'

interface SidebarProps {
  // Открыть диалог «Новый чат»
  onNewChat: () => void
  // Выйти из аккаунта GREEN-API
  onLogout: () => void
}

// Левая панель: кнопка «Новый чат» и список чатов
export function Sidebar({ onNewChat, onLogout }: SidebarProps) {
  const { state, dispatch } = useChat()

  return (
    <aside className={styles.sidebar}>
      <button className={styles.newChat} type="button" onClick={onNewChat}>
        Новый чат
      </button>
      <ul className={styles.list}>
        {state.chats.map((chat) => (
          <ChatListItem
            key={chat.chatId}
            chat={chat}
            lastMessage={state.messages
              .filter((message) => message.chatId === chat.chatId)
              .at(-1)}
            isActive={chat.chatId === state.activeChatId}
            onSelect={() =>
              dispatch({ type: 'SELECT_CHAT', chatId: chat.chatId })
            }
          />
        ))}
      </ul>
      <button className={styles.logout} type="button" onClick={onLogout}>
        Выйти
      </button>
    </aside>
  )
}
