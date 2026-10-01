import { useActionState, useState } from 'react'
import { checkAccount } from '../../api/greenApi'
import { GreenApiError } from '../../api/greenApiError'
import type { Credentials } from '../../api/types'
import { useChat } from '../../store/ChatContext'
import { normalizePhone } from '../../utils/normalizePhone'
import styles from './NewChatDialog.module.css'

interface NewChatDialogProps {
  // Учётные данные для запроса checkAccount
  credentials: Credentials
  // Закрыть диалог без создания чата
  onClose: () => void
}

// Диалог «Новый чат»: номер телефона собеседника
export function NewChatDialog({ credentials, onClose }: NewChatDialogProps) {
  const [phone, setPhone] = useState('')
  const { dispatch } = useChat()

  // Проверка номера: возвращает текст ошибки или null, если чат создан
  async function findChat(): Promise<string | null> {
    const phoneNumber = normalizePhone(phone)
    try {
      const { exist, chatId } = await checkAccount(
        credentials,
        Number(phoneNumber),
      )
      if (!exist) {
        return 'У этого номера нет Telegram'
      }
      dispatch({
        type: 'ADD_CHAT',
        chat: { chatId, phone: phoneNumber, name: `+${phoneNumber}` },
      })
      onClose()
      return null
    } catch (error) {
      if (error instanceof GreenApiError) {
        return error.message
      }
      return 'Не удалось подключиться к GREEN-API. Проверьте интернет'
    }
  }

  const [errorMessage, findAction, isPending] = useActionState(findChat, null)

  return (
    <div className={styles.overlay}>
      <form className={styles.dialog} action={findAction}>
        <h2 className={styles.title}>Новый чат</h2>
        <label className={styles.field}>
          Номер телефона
          <input
            className={styles.input}
            type="tel"
            placeholder="+7 900 123-45-67"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <p className={styles.hint}>
          Российский номер можно ввести через 8. Номер другой страны — с «+» и
          кодом страны
        </p>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <div className={styles.actions}>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className={styles.button}
            type="submit"
            disabled={isPending || !normalizePhone(phone)}
          >
            {isPending ? 'Ищем…' : 'Найти'}
          </button>
        </div>
      </form>
    </div>
  )
}
