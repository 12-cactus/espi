import fs from 'fs';

import dayjs from 'dayjs';
import nock from 'nock';
import Holidays from '../../src/core/Holidays-v2';

describe('Testing Holidays', () => {
  describe('#fetchNextHolidaysAR', () => {
    let holidays2023: string;
    let holidays2024: string;

    beforeAll(async () => {
      holidays2023 = await fs.promises.readFile('./__tests__/__fixtures__/get.feriadosAR-2023.json', 'utf8');
      holidays2024 = await fs.promises.readFile('./__tests__/__fixtures__/get.feriadosAR-2024.json', 'utf8');
    });

    beforeEach(async () => {
      nock('https://nolaborables.com.ar/').get('/api/v2/feriados/2023?incluir=opcional').reply(200, holidays2023);
      nock('https://nolaborables.com.ar/').get('/api/v2/feriados/2024?incluir=opcional').reply(200, holidays2024);
    });

    it('fetch next holidays from 2023-04-03 (default = 7)', async () => {
      // arrange
      const amount = 7;
      const today = dayjs('2023-04-03');

      // act
      const holidays = await Holidays.fetchNextHolidaysAR(today);

      // assert
      expect(holidays).toBeDefined();
      expect(holidays).toBeInstanceOf(Array);
      expect(holidays.length).toBe(amount);
      expect(holidays[0].name).toBe('Viernes Santo Festividad Cristiana');
      expect(holidays[1].name).toBe('Día del Trabajador');
      expect(holidays[2].name).toBe('Día de la Revolución de Mayo');
      expect(holidays[3].name).toBe('Feriado Puente Turístico');
      expect(holidays[4].name).toBe('Paso a la Inmortalidad del Gral. Don Martín Güemes');
      expect(holidays[5].name).toBe('Feriado Puente Turístico');
      expect(holidays[6].name).toBe('Paso a la Inmortalidad del General Manuel Belgrano');
    });

    it('fetch next two holidays from 2023-04-03', async () => {
      // arrange
      const amount = 2;
      const today = dayjs('2023-04-03');

      // act
      const holidays = await Holidays.fetchNextHolidaysAR(today, amount);

      // assert
      expect(holidays).toBeDefined();
      expect(holidays).toBeInstanceOf(Array);
      expect(holidays.length).toBe(amount);
      expect(holidays[0].name).toBe('Viernes Santo Festividad Cristiana');
      expect(holidays[1].name).toBe('Día del Trabajador');
    });
  });
});
