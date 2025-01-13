import dayjs from 'dayjs';
import { DayType, InfoDay } from '../core/long-weekend';
import { HolidayAR, HolidayCA } from '../core/types';

const isNationalHoliday = (h: HolidayAR) => {
  const isHoliday = ['inamovible', 'trasladable'].includes(h.tipo);
  const isCristian = h.tipo === 'nolaborable' && h.opcional === 'religion' && h.religion === 'cristianismo';
  return isHoliday || isCristian;
};

const dayType = (h: HolidayAR): DayType => {
  if (h.tipo === 'puente') return 'touristic-bridge';
  if (isNationalHoliday(h)) return 'national-holiday';
  return 'unknown';
};

// TODO: test this function
export const asInfoDayAR = (holiday: HolidayAR, year: number): InfoDay => {
  const month = holiday.mes.toString().padStart(2, '0');
  const day = holiday.dia.toString().padStart(2, '0');

  const name = holiday.motivo;
  const isoDate = `${year}-${month}-${day}`;
  const date = dayjs(isoDate);
  const type = dayType(holiday);
  const isRestingDay = type === 'national-holiday' || type === 'touristic-bridge';

  return { name, isoDate, date, type, isRestingDay };
};

// TODO: test this function
export const asInfoDayCA = (holiday: HolidayCA): InfoDay => {
  const name = holiday.nameFr;
  const isoDate = holiday.date;
  const date = dayjs(holiday.date);
  const type = 'national-holiday';
  const isRestingDay = true;

  return { name, isoDate, date, type, isRestingDay };
};
