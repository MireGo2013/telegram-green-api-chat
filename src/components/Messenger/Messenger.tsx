import { useState } from 'react'
import type { Credentials } from '../../api/types'
import { useNotifications } from '../../hooks/useNotifications'
import { useChat } from '../../store/ChatContext'
import { ChatWindow } from '../ChatWindow/ChatWindow'
import { NewChatDialog } from '../NewChatDialog/NewChatDialog'
import { Sidebar } from '../Sidebar/Sidebar'
import styles from './Messenger.module.css'

interface MessengerProps {
  credentials: Credentials
  // Выйти из аккаунта GREEN-API (история чатов сохраняется)
  onLogout: () => void
}

// Экран после входа: список чатов, окно чата, получение сообщений
export function Messenger({ credentials, onLogout }: MessengerProps) {
  const { state } = useChat()
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  useNotifications(credentials, onLogout)

  return (
    <div
      className={
        state.activeChatId
          ? `${styles.layout} ${styles.chatOpen}`
          : styles.layout
      }
    >
      <Sidebar onNewChat={() => setIsNewChatOpen(true)} onLogout={onLogout} />
      <main className={styles.main}>
        <ChatWindow credentials={credentials} />
      </main>
      {isNewChatOpen && (
        <NewChatDialog
          credentials={credentials}
          onClose={() => setIsNewChatOpen(false)}
        />
      )}
    </div>
  )
}
