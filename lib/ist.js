import { toZonedTime } from 'date-fns-tz';

export const IST_TIMEZONE = 'Asia/Kolkata';

export function getCurrentIST() {
  return toZonedTime(new Date(), IST_TIMEZONE);
}

export function getResearchDay(now = new Date()) {
  const istNow = toZonedTime(now, IST_TIMEZONE);
  const hours = istNow.getHours();
  if (hours < 6) {
    istNow.setDate(istNow.getDate() - 1);
  }
  istNow.setHours(0, 0, 0, 0);
  return istNow;
}

export function isNewDayAvailable(lastLoginDateStr, now = new Date()) {
  if (!lastLoginDateStr) return true;
  const lastLogin = new Date(lastLoginDateStr);
  const researchToday = getResearchDay(now);
  const researchLastLogin = getResearchDay(lastLogin);
  return researchToday.getTime() > researchLastLogin.getTime();
}

export function isDormantPeriod(now = new Date()) {
  const istNow = toZonedTime(now, IST_TIMEZONE);
  const hour = istNow.getHours();
  return hour >= 1 && hour < 6;
}

export function getCurrentStudyDay(startDateStr, now = new Date()) {
  const start = new Date(startDateStr);
  const researchNow = getResearchDay(now);
  const researchStart = getResearchDay(start);
  const diffTime = researchNow.getTime() - researchStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}
