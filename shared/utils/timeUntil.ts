export function timeUntil(date: string): string {
  const diff = new Date(date).getTime() - Date.now();
  if (diff < 0) return 'Agora';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}min`;
  return `${Math.floor(hrs / 24)}d`;
}
