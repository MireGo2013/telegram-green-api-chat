import { useActionState, useState } from 'react'
import { getStateInstance } from '../../api/greenApi'
import { GreenApiError } from '../../api/greenApiError'
import type { Credentials } from '../../api/types'
import { normalizeApiUrl } from '../../utils/normalizeApiUrl'
import styles from './LoginForm.module.css'

interface LoginFormProps {
  // Вызывается после успешной проверки входа
  onLogin: (credentials: Credentials) => void
}

// Экран входа: учётные данные инстанса GREEN-API
export function LoginForm({ onLogin }: LoginFormProps) {
  const [apiUrl, setApiUrl] = useState('https://api.green-api.com')
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')

  // Проверка входа: возвращает текст ошибки или null, если всё в порядке
  async function login(): Promise<string | null> {
    const credentials: Credentials = {
      apiUrl: normalizeApiUrl(apiUrl),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }
    try {
      const { stateInstance } = await getStateInstance(credentials)
      if (stateInstance !== 'authorized') {
        return `Инстанс не авторизован (статус: ${stateInstance})`
      }
      onLogin(credentials)
      return null
    } catch (error) {
      if (error instanceof GreenApiError) {
        return error.message
      }
      return 'Не удалось подключиться к GREEN-API. Проверьте apiUrl и интернет'
    }
  }

  const [errorMessage, loginAction, isPending] = useActionState(login, null)

  return (
    <form className={styles.form} action={loginAction}>
      <h1 className={styles.title}>Вход</h1>
      <label className={styles.field}>
        apiUrl
        <input
          className={styles.input}
          name="apiUrl"
          value={apiUrl}
          onChange={(event) => setApiUrl(event.target.value)}
        />
      </label>
      <label className={styles.field}>
        idInstance
        <input
          className={styles.input}
          name="idInstance"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value)}
        />
      </label>
      <label className={styles.field}>
        apiTokenInstance
        <input
          className={styles.input}
          name="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(event) => setApiTokenInstance(event.target.value)}
        />
      </label>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <button className={styles.button} type="submit" disabled={isPending}>
        {isPending ? 'Проверяем…' : 'Войти'}
      </button>
    </form>
  )
}
