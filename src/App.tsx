import { useState } from 'react'
import type { Credentials } from './api/types'
import { LoginForm } from './components/LoginForm/LoginForm'
import { Messenger } from './components/Messenger/Messenger'
import { ChatProvider } from './store/ChatContext'
import {
  clearCredentials,
  loadCredentials,
  saveCredentials,
} from './utils/credentialsStorage'

// Корень приложения: форма входа или мессенджер выбранного инстанса
export function App() {
  const [credentials, setCredentials] = useState(loadCredentials)

  function handleLogin(newCredentials: Credentials) {
    saveCredentials(newCredentials)
    setCredentials(newCredentials)
  }

  // История чатов остаётся в localStorage, стираются только учётные данные
  function handleLogout() {
    clearCredentials()
    setCredentials(null)
  }

  if (!credentials) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <ChatProvider
      key={credentials.idInstance}
      idInstance={credentials.idInstance}
    >
      <Messenger credentials={credentials} onLogout={handleLogout} />
    </ChatProvider>
  )
}
