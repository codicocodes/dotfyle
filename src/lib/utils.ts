import { redirect } from "@sveltejs/kit";

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
  second: 1000,
};

export function humanizeAbsolute(when: Date | number) {
  const diff = new Date().getTime() - (typeof when === "number" ? when : when.getTime());
  for (const unit in TIME_UNITS) {
    const quotient = Math.floor(diff / TIME_UNITS[unit]);
    if (quotient > 0) {
      return `${quotient} ${unit}${quotient > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export function humanizeRelative(pastMilliseconds: number) {
  return humanizeAbsolute(new Date().getTime() - pastMilliseconds);
}

export function githubLogin() {
  throw redirect(303, '/api/auth/github');
}
