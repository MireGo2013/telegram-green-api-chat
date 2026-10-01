// Инициалы для аватара: первые буквы двух первых слов имени.
// Если букв нет (имя — это номер), последние две цифры.
export function getInitials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter((letter) => letter !== undefined)
  if (letters.length > 0) {
    return letters.slice(0, 2).join('').toUpperCase()
  }
  return name.replace(/\D/g, '').slice(-2) || '?'
}
