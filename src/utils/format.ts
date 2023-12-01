export function formatBirthDate(dateString: string): string {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Taipei'
  }

  const formatter = new Intl.DateTimeFormat('zh-TW', options)

  return formatter.format(date)
}

export const formattedDateTime = (originalDateTime: Date) => {
  return new Date(originalDateTime).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
