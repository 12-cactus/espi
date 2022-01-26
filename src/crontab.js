require('dotenv').config();
const { CronJob } = require('cron');
const bot = require('./bot');
const sendRegards = require('./features/schedule');

module.exports = {
  schedule: new CronJob('0 11 * * *', () => {
    sendRegards(bot);
  }, null, true, 'America/Argentina/Buenos_Aires'),
};
