import nock from 'nock';
import Stickers from '../../src/core/Stickers';

const domain = process.env.API_DOMAIN || process.env.BOT_DOMAIN || 'http://localhost:3000';

describe('Testing Sticker', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  describe('#find', () => {
    it('should return the file_id when find it', async () => {
      nock(domain).get(encodeURI('/sticker/test/😀')).reply(200, { file_id: '12345' });
      const result = await Stickers.find('test', '😀');
      expect(result).toBe('12345');
    });

    it('should throw an exception when not found it', async () => {
      nock(domain).get(encodeURI('/sticker/fail/😀')).reply(400);
      await expect(Stickers.find('fail', '😀')).rejects.toThrow('Request failed with status code 400');
    });
  });
});
