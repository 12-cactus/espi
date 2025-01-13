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
 * Type for holidays from canada-holidays.ca
 */
export interface HolidayCA {
  id: number;
  date: string;
  nameEn: string;
  nameFr: string;
  federal: number;
  observedDate: string;
}

/**
 * Type used in axios for holidays response when GET nolaborables.com.ar
 */
export type HolidayResponseAR = {
  data: HolidayAR[];
};

/**
 * Type used in axios for holidays response when GET canada-holidays.ca
 */
export type HolidayResponseCA = {
  data: {
    province: {
      id: string;
      nameEn: string;
      nameFr: string;
      sourceLink: string;
      sourceEn: string;
      holidays: HolidayCA[];
    };
  };
};
