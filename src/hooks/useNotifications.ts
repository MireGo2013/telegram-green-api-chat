import { useEffect, useEffectEvent } from 'react'
import { deleteNotification, receiveNotification } from '../api/greenApi'
import { GreenApiError } from '../api/greenApiError'
import type { Credentials } from '../api/types'
import { useChat } from '../store/ChatContext'
import { parseIncomingMessage } from '../utils/parseIncomingMessage'

// Пауза после ошибки, чтобы не засыпать API запросами
const RETRY_DELAY_MS = 4000

// Пауза, которая заканчивается раньше, если цикл остановили
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

// Цикл получения входящих сообщений, пока пользователь вошёл.
// onUnauthorized вызывается, если токен перестал подходить (401)
export function useNotifications(
  credentials: Credentials | null,
  onUnauthorized: () => void,
) {
  const { dispatch } = useChat()
  const handleUnauthorized = useEffectEvent(onUnauthorized)

  useEffect(() => {
    if (!credentials) {
      return
    }
    const controller = new AbortController()
    const { signal } = controller

    async function poll(credentials: Credentials) {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, 5, signal)
          if (!notification) {
            continue
          }
          const message = parseIncomingMessage(notification.body)
          if (message) {
            const sender = notification.body.senderData
            const phone = sender?.senderPhoneNumber
              ? String(sender.senderPhoneNumber)
              : ''
            dispatch({
              type: 'RECEIVE_MESSAGE',
              message,
              chat: {
                chatId: message.chatId,
                phone,
                name:
                  sender?.senderName || (phone ? `+${phone}` : message.chatId),
              },
            })
          }
          await deleteNotification(credentials, notification.receiptId, signal)
        } catch (error) {
          if (error instanceof GreenApiError && error.status === 401) {
            handleUnauthorized()
            return
          }
          await wait(RETRY_DELAY_MS, signal)
        }
      }
    }

    poll(credentials)
    return () => controller.abort()
  }, [credentials, dispatch])
}
