import { useState, type KeyboardEvent } from 'react'
import { sendMessage } from '../../api/greenApi'
import type { Credentials } from '../../api/types'
import { useChat } from '../../store/ChatContext'
import styles from './MessageInput.module.css'

// Ограничение GREEN-API на длину текста sendMessage
const MAX_MESSAGE_LENGTH = 4096

interface MessageInputProps {
  credentials: Credentials
  // Чат, в который отправляем
  chatId: string
}

// Поле ввода: Enter — отправить, Shift+Enter — новая строка
export function MessageInput({ credentials, chatId }: MessageInputProps) {
  const [text, setText] = useState('')
  const { dispatch } = useChat()

  // Показывает сообщение сразу, затем отправляет и обновляет статус
  async function send() {
    const message = text.trim()
    if (!message) {
      return
    }
    const tempId = crypto.randomUUID()
    dispatch({
      type: 'ADD_MESSAGE',
      message: {
        id: tempId,
        chatId,
        text: message,
        timestamp: Date.now(),
        direction: 'out',
        status: 'sending',
      },
    })
    setText('')
    try {
      const { idMessage } = await sendMessage(credentials, chatId, message)
      dispatch({
        type: 'UPDATE_MESSAGE',
        id: tempId,
        changes: { id: idMessage, status: 'sent' },
      })
    } catch {
      dispatch({
        type: 'UPDATE_MESSAGE',
        id: tempId,
        changes: { status: 'failed' },
      })
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <textarea
        className={styles.input}
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.button} type="submit" disabled={!text.trim()}>
        Отправить
      </button>
    </form>
  )
}
