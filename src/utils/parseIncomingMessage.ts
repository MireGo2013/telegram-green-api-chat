import type { NotificationBody } from '../api/types'
import type { Message } from '../store/types'

// Входящее текстовое сообщение из уведомления или null, если это не оно
export function parseIncomingMessage(body: NotificationBody): Message | null {
  if (body.typeWebhook !== 'incomingMessageReceived') {
    return null
  }
  const { idMessage, timestamp, senderData, messageData } = body
  const text =
    messageData?.textMessageData?.textMessage ??
    messageData?.extendedTextMessageData?.text
  if (!idMessage || !timestamp || !senderData || !text) {
    return null
  }
  return {
    id: idMessage,
    chatId: senderData.chatId,
    text,
    timestamp: timestamp * 1000,
    direction: 'in',
  }
}
