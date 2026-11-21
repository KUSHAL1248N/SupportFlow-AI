export function statusLabel(status: string): string {
  return status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
export function isUrgent(priority: string): boolean { return priority === 'urgent'; }
