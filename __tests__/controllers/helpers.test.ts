import dayjs from 'dayjs';
import { markdownEscape, toMarkdownDay } from '../../src/controllers/helpers';
import { InfoDay } from '../../src/core/long-weekend';

describe('Testing controllers helpers', () => {
  describe('#markdownEscape', () => {
    it('should escape special characters in the text', () => {
      // arrange
      const text1 = 'abc123';
      const text2 = '-|.(+';
      const text3 = '---';

      // act & assert
      expect(markdownEscape(text1)).toBe('abc123');
      expect(markdownEscape(text2)).toBe('\\-\\|\\.\\(\\+');
      expect(markdownEscape(text3)).toBe('\\-\\-\\-');
    });
  });

  describe('toMarkdownDay', () => {
    it('should convert InfoDay to a markdown string', () => {
      // arrange
      const fromDay = dayjs('2022-12-31');
      const infoDay = (name: string, date: string): InfoDay => ({
        name,
        date: dayjs(date),
        type: 'national-holiday',
        isRestingDay: true,
      });

      // act
      const day0 = infoDay('Christmas', '2022-12-25');
      const day1 = infoDay('New Year', '2023-01-01');
      const day2 = infoDay('Epiphany', '2023-01-06');

      // assert
      expect(toMarkdownDay(day0, fromDay)).toBe('- *25 Dec* Christmas (-6d)');
      expect(toMarkdownDay(day1, fromDay)).toBe('- *01 Jan* New Year (1d)');
      expect(toMarkdownDay(day2, fromDay)).toBe('- *06 Jan* Epiphany (6d)');
    });
  });
});
