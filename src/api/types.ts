// Учётные данные инстанса GREEN-API из личного кабинета
export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

// Состояние инстанса, документация: GetStateInstance
export type InstanceState =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'suspended'
  | 'starting'
  | 'pendingPassword'

// Ответ getStateInstance
export interface StateInstanceResponse {
  stateInstance: InstanceState
}

// Дополнительные части запроса, которые нужны не всем методам API
export interface RequestOptions {
  httpMethod?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  pathSuffix?: string
  query?: Record<string, string>
  // Отмена запроса через AbortController
  signal?: AbortSignal
}

// Тело запроса checkAccount: номер в международном формате, только цифры
export interface CheckAccountRequest {
  phoneNumber: number
}

// Ответ checkAccount. Если аккаунта нет, приходит только { exist: false, chatId: '' }
export interface CheckAccountResponse {
  exist: boolean
  chatId: string
  username?: string
  phoneNumber?: number
  fromCache?: boolean
}

// Тело запроса sendMessage
export interface SendMessageRequest {
  chatId: string
  message: string
}

// Ответ sendMessage: идентификатор отправленного сообщения
export interface SendMessageResponse {
  idMessage: string
}

// Данные сообщения. Текст лежит в разных полях в зависимости от typeMessage
export interface MessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

// Тело уведомления. Описаны только поля, которые читает приложение
export interface NotificationBody {
  typeWebhook: string
  timestamp?: number
  idMessage?: string
  senderData?: {
    chatId: string
    senderName?: string
    senderPhoneNumber?: number
  }
  messageData?: MessageData
}

// Ответ receiveNotification: null, если за время ожидания уведомлений не было
export type ReceiveNotificationResponse = {
  receiptId: number
  body: NotificationBody
} | null

// Ответ deleteNotification: result false — не удалось, причина в reason
export interface DeleteNotificationResponse {
  result: boolean
  reason: string
}
