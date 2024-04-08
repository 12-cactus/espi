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
      expect(holidays[0]).toMatchObject({ name: 'Viernes Santo Festividad Cristiana', isoDate: '2023-04-07' });
      expect(holidays[1]).toMatchObject({ name: 'Día del Trabajador', isoDate: '2023-05-01' });
      expect(holidays[2]).toMatchObject({ name: 'Día de la Revolución de Mayo', isoDate: '2023-05-25' });
      expect(holidays[3]).toMatchObject({ name: 'Feriado Puente Turístico', isoDate: '2023-05-26' });
      expect(holidays[4]).toMatchObject({
        name: 'Paso a la Inmortalidad del Gral. Don Martín Güemes',
        isoDate: '2023-06-17',
      });
      expect(holidays[5]).toMatchObject({ name: 'Feriado Puente Turístico', isoDate: '2023-06-19' });
      expect(holidays[6]).toMatchObject({
        name: 'Paso a la Inmortalidad del General Manuel Belgrano',
        isoDate: '2023-06-20',
      });
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
      expect(holidays[0]).toMatchObject({ name: 'Viernes Santo Festividad Cristiana', isoDate: '2023-04-07' });
      expect(holidays[1]).toMatchObject({ name: 'Día del Trabajador', isoDate: '2023-05-01' });
    });
  });

  describe('#fetchNextHolidaysCA', () => {
    let holidays2023: string;
    let holidays2024: string;

    beforeAll(async () => {
      holidays2023 = await fs.promises.readFile('./__tests__/__fixtures__/get.feriadosCA-2023.json', 'utf8');
      holidays2024 = await fs.promises.readFile('./__tests__/__fixtures__/get.feriadosCA-2024.json', 'utf8');
    });

    beforeEach(async () => {
      nock('https://canada-holidays.ca/').get('/api/v1/provinces/QC?year=2023').reply(200, holidays2023);
      nock('https://canada-holidays.ca/').get('/api/v1/provinces/QC?year=2024').reply(200, holidays2024);
    });

    it('fetch next holidays from 2023-04-03 (default = 7)', async () => {
      // arrange
      const amount = 7;
      const today = dayjs('2023-04-03');

      // act
      const holidays = await Holidays.fetchNextHolidaysCA(today);

      // assert
      expect(holidays).toBeDefined();
      expect(holidays).toBeInstanceOf(Array);
      expect(holidays.length).toBe(amount);
      expect(holidays[0]).toMatchObject({ name: 'Vendredi saint', isoDate: '2023-04-07' });
      expect(holidays[1]).toMatchObject({ name: 'Journée nationale des patriotes', isoDate: '2023-05-22' });
      expect(holidays[2]).toMatchObject({
        name: 'Saint-Jean-Baptiste / Fête nationale du Québec',
        isoDate: '2023-06-24',
      });
      expect(holidays[3]).toMatchObject({ name: 'Fête du Canada', isoDate: '2023-07-01' });
      expect(holidays[4]).toMatchObject({ name: 'Fête du travail', isoDate: '2023-09-04' });
      expect(holidays[5]).toMatchObject({ name: 'Action de grâce', isoDate: '2023-10-09' });
      expect(holidays[6]).toMatchObject({ name: 'Noël', isoDate: '2023-12-25' });
    });

    it('fetch next two holidays from 2023-04-03', async () => {
      // arrange
      const amount = 2;
      const today = dayjs('2023-04-03');

      // act
      const holidays = await Holidays.fetchNextHolidaysCA(today, amount);

      // assert
      expect(holidays).toBeDefined();
      expect(holidays).toBeInstanceOf(Array);
      expect(holidays.length).toBe(amount);
      expect(holidays[0]).toMatchObject({ name: 'Vendredi saint', isoDate: '2023-04-07' });
      expect(holidays[1]).toMatchObject({ name: 'Journée nationale des patriotes', isoDate: '2023-05-22' });
    });
  });
});
