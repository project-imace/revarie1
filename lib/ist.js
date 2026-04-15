import { utcToZonedTime } from 'date-fns-tz';

export const IST_TIMEZONE = 'Asia/Kolkata';

export function getCurrentIST() {
  return utcToZonedTime(new Date(), IST_TIMEZONE);
}

export function getResearchDay(now = new Date()) {
  const istNow = utcToZonedTime(now, IST_TIMEZONE);
  const hours = istNow.getHours();
  if (hours < 6) {
    istNow.setDate(istNow.getDate() - 1);
  }
  return istNow;
}

export function isNewDayAvailable(lastLoginDateStr, now = new Date()) {
  if (!lastLoginDateStr) return true;
  const lastLogin = new Date(lastLoginDateStr);
  const researchToday = getResearchDay(now);
  const researchLastLogin = getResearchDay(lastLogin);
  return researchToday > researchLastLogin;
}

export function isBeforeSixAMIST(now = new Date()) {
  const istNow = utcToZonedTime(now, IST_TIMEZONE);
  return istNow.getHours() < 6;
}
