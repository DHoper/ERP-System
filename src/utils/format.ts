export function formatBirthDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Taipei', 
  };

  const formatter = new Intl.DateTimeFormat('zh-TW', options);

  return formatter.format(date);
}
