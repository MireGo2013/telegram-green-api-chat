// Номер в международном формате, только цифры.
// Российский мобильный, набранный через 8 (8 9xx ...), переводится на 7.
// Номер с «+» уже международный и не меняется.
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  const isInternational = value.trim().startsWith('+')
  if (!isInternational && digits.length === 11 && digits.startsWith('89')) {
    return `7${digits.slice(1)}`
  }
  return digits
}
