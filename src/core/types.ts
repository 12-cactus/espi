// holidays.ts types

/**
 * Type for holidays from nolaborables.com.ar
 */
export type HolidayAR = {
  id: string;
  dia: number;
  mes: number;
  motivo: string;
  tipo: string;
  info: string;
  opcional?: string | null;
  religion?: string | null;
  origen?: string | null;
  original?: string | null;
};

/**
 * Type used in axios for holidays response when GET nolaborables.com.ar
 */
export type HolidayResponse = {
  data: HolidayAR[];
};
