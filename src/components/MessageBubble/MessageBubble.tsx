import type { Message } from '../../store/types'
import { formatTime } from '../../utils/formatTime'
import styles from './MessageBubble.module.css'

// Значки статуса исходящего сообщения
const STATUS_ICONS = {
  sending: '🕓',
  sent: '✓',
  failed: '⚠',
} satisfies Record<NonNullable<Message['status']>, string>

interface MessageBubbleProps {
  message: Message
}

// «Пузырь» сообщения: текст, время, у исходящих — статус
export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <li
      className={
        message.direction === 'out'
          ? `${styles.bubble} ${styles.out}`
          : `${styles.bubble} ${styles.in}`
      }
    >
      <span className={styles.text}>{message.text}</span>
      <span className={styles.meta}>
        {formatTime(message.timestamp)}
        {message.status && ` ${STATUS_ICONS[message.status]}`}
      </span>
    </li>
  )
}
