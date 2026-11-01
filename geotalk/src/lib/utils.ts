import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatTime(iso: string, locale: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString(locale === 'ka' ? 'ka-GE' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDay(iso: string, locale: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-GB', {
    month: 'short',
    day: 'numeric',
  })
}

export function avatarGradient(hue: number) {
  return `linear-gradient(145deg, hsl(${hue} 48% 42%), hsl(${(hue + 36) % 360} 40% 22%))`
}
