import dayjs from 'dayjs';
import { DayType, InfoDay } from '../core/long-weekend';
import { HolidayAR } from '../core/types';

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

export const asInfoDay = (h: HolidayAR, year: number): InfoDay => {
  const month = h.mes.toString().padStart(2, '0');
  const day = h.dia.toString().padStart(2, '0');
  const type = dayType(h);
  return {
    name: h.motivo,
    date: dayjs(`${year}-${month}-${day}`),
    type,
    isRestingDay: type === 'national-holiday' || type === 'touristic-bridge',
  };
};
