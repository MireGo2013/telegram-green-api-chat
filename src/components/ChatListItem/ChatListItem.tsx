import type { Chat, Message } from '../../store/types'
import { formatTime } from '../../utils/formatTime'
import { getAvatarColor } from '../../utils/getAvatarColor'
import { getInitials } from '../../utils/getInitials'
import styles from './ChatListItem.module.css'

interface ChatListItemProps {
  chat: Chat
  // Последнее сообщение чата, если есть
  lastMessage: Message | undefined
  isActive: boolean
  onSelect: () => void
}

// Строка списка чатов: аватар, имя, последнее сообщение и время
export function ChatListItem({
  chat,
  lastMessage,
  isActive,
  onSelect,
}: ChatListItemProps) {
  return (
    <li>
      <button
        className={isActive ? `${styles.item} ${styles.active}` : styles.item}
        type="button"
        onClick={onSelect}
      >
        <span
          className={styles.avatar}
          style={{ background: getAvatarColor(chat.chatId) }}
        >
          {getInitials(chat.name)}
        </span>
        <span className={styles.body}>
          <span className={styles.top}>
            <span className={styles.name}>{chat.name}</span>
            {lastMessage && (
              <span className={styles.time}>
                {formatTime(lastMessage.timestamp)}
              </span>
            )}
          </span>
          <span className={styles.preview}>
            {lastMessage?.text ?? 'Нет сообщений'}
          </span>
        </span>
      </button>
    </li>
  )
}
