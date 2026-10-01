// Ошибка запроса к GREEN-API, хранит HTTP-статус ответа
export class GreenApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}
