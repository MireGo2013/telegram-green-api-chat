import { GreenApiError } from './greenApiError'
import type {
  CheckAccountRequest,
  CheckAccountResponse,
  Credentials,
  DeleteNotificationResponse,
  ReceiveNotificationResponse,
  RequestOptions,
  SendMessageRequest,
  SendMessageResponse,
  StateInstanceResponse,
} from './types'

// Общий запрос к GREEN-API: собирает URL, отправляет, разбирает ответ
async function request<T>(
  credentials: Credentials,
  apiMethod: string,
  options: RequestOptions = {},
): Promise<T> {
  const { apiUrl, idInstance, apiTokenInstance } = credentials
  const url = new URL(
    `${apiUrl}/waInstance${idInstance}/${apiMethod}/${apiTokenInstance}`,
  )

  const { httpMethod = 'GET', body, pathSuffix, query, signal } = options
  if (pathSuffix) {
    url.pathname += `/${pathSuffix}`
  }
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value)
    }
  }

  const response = await fetch(url, {
    method: httpMethod,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    let message = `Ошибка GREEN-API: ${response.status}`
    if (response.status === 401) {
      message = 'Неверный idInstance или apiTokenInstance'
    } else if (response.status === 429) {
      message = 'Слишком частые запросы, подождите'
    } else if (response.status === 469) {
      message =
        'Telegram временно ограничил запросы, попробуйте через несколько часов'
    }
    throw new GreenApiError(response.status, message)
  }

  // Пустое тело (например, у receiveNotification без уведомлений) — это null
  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

// Состояние инстанса: authorized, notAuthorized и т. д.
export function getStateInstance(credentials: Credentials) {
  return request<StateInstanceResponse>(credentials, 'getStateInstance')
}

// Есть ли Telegram у номера; если есть — его chatId
export function checkAccount(credentials: Credentials, phoneNumber: number) {
  return request<CheckAccountResponse>(credentials, 'checkAccount', {
    httpMethod: 'POST',
    body: { phoneNumber } satisfies CheckAccountRequest,
  })
}

// Отправка текстового сообщения в чат
export function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
) {
  return request<SendMessageResponse>(credentials, 'sendMessage', {
    httpMethod: 'POST',
    body: { chatId, message } satisfies SendMessageRequest,
  })
}

// Следующее уведомление из очереди; ждёт его до receiveTimeout секунд
export function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 5,
  signal?: AbortSignal,
) {
  return request<ReceiveNotificationResponse>(
    credentials,
    'receiveNotification',
    { query: { receiveTimeout: String(receiveTimeout) }, signal },
  )
}

// Удаление уведомления из очереди, иначе receiveNotification вернёт его снова
export function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal?: AbortSignal,
) {
  return request<DeleteNotificationResponse>(
    credentials,
    'deleteNotification',
    {
      httpMethod: 'DELETE',
      pathSuffix: String(receiptId),
      signal,
    },
  )
}
