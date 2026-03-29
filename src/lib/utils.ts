import { toast } from '@zerodevx/svelte-toast';
import type { Media } from '@prisma/client';
import { PUBLIC_ADMIN_USER_GITHUB_ID, PUBLIC_MAINTENANCE_ENABLED } from '$env/static/public';
export { sanitizeHtml } from '$lib/sanitize';

// source https://gist.github.com/jweyrich/f39c496b83f73d2c5b0587f4d841651b
interface TimeUnit {
  [key: string]: number;
}

const TIME_UNITS: TimeUnit = {
  year: 3.154e10,
  month: 2.628e9,
  week: 6.048e8,
  day: 8.64e7,
  hour: 3.6e6,
  minute: 60000,
  second: 1000
};

export function humanizeAbsolute(when: Date | number) {
  const diff = new Date().getTime() - (typeof when === 'number' ? when : when.getTime());
  for (const unit in TIME_UNITS) {
    const quotient = Math.floor(diff / TIME_UNITS[unit]);
    if (quotient > 0) {
      return `${quotient} ${unit}${quotient > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

export function humanizeRelative(pastMilliseconds: number) {
  return humanizeAbsolute(new Date().getTime() - pastMilliseconds);
}

export function hasBeenOneDay(dateString: string) {
  const date = new Date(dateString);
  const hourMS = 1000 * 60 * 60;
  const dayMS = hourMS * 24;
  const dayAgo = Date.now() - dayMS;
  return date.getTime() < dayAgo;
}

export function daysAgo(days: number) {
  const hourMS = 1000 * 60 * 60;
  const dayMS = hourMS * 24;
  const weekMS = dayMS * days;
  const daysAgo = Date.now() - weekMS;
  return new Date(daysAgo);
}

export const ADMIN_GITHUB_ID = Number(PUBLIC_ADMIN_USER_GITHUB_ID);

export function isAdmin(user: { githubId: number }): boolean {
  return user.githubId === ADMIN_GITHUB_ID;
}

export function getMediaType(media: Media): 'image' | 'video' {
  const { url, type } = media;
  if (type.includes('video')) return 'video';
  if (type.includes('image')) return 'image';
  if (url.endsWith('.mov') || url.endsWith('.mp4')) {
    return 'video';
  }
  return 'image';
}

export function copyToClipboard(data: string, message = 'Copied to clipboard') {
  navigator.clipboard.writeText(data);
  toast.push(message);
}

export function isMaintenanceMode() {
  return PUBLIC_MAINTENANCE_ENABLED === 'true';
}
