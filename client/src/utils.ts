export function formatDate(value?: string) { if(!value) return 'No due date'; const date=new Date(value); return Number.isNaN(date.getTime())?'No due date':new Intl.DateTimeFormat('en',{month:'short',day:'numeric'}).format(date); }
export function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()).join(''); }
