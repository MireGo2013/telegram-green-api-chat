// Цвета аватаров, как в Telegram
const AVATAR_COLORS = [
  '#e17076',
  '#faa774',
  '#a695e7',
  '#7bc862',
  '#6ec9cb',
  '#65aadd',
  '#ee7aae',
]

// Один и тот же чат всегда получает один и тот же цвет
export function getAvatarColor(chatId: string): string {
  let hash = 0
  for (const char of chatId) {
    hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash]
}
