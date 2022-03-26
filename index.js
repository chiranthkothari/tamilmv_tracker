const rp = require('request-promise');
const $ = require('cheerio');
var CronJob = require('cron').CronJob;
const { Telegraf } = require('telegraf');

const url = 'https://tamilblasters.buzz/';
const bot = new Telegraf(process.env.BOT_ID);

bot.start((ctx) => ctx.reply('Welcome'));

bot.telegram.sendMessage('-1001702762453', "Bot restarted");

var job = new CronJob('* */3 * * *', function () {
  rp(url)
    .then(function (html) {
      const cheerioData = $.load(html);
      const data = cheerioData('p:nth-of-type(n+3)').text().split(/\r?\n/);
      const cleanedData = [];
      data.map((data) => {
        if (data.trim().length < 5) {
          return;
        } else {
          cleanedData.push(data.trim().substring(0, data.indexOf('-') - 1));
        }
      });
      let message = `Latest 10 releases:\n\n`;
      for (i = 0; i < 10; i++) {
        const singleData = `${i + 1}. ${cleanedData[i]}\n\n`;
        message += singleData;
      }
      message += 'This data will be fetched once in every 3 hours';
      bot.telegram.sendMessage('-1001702762453', message);
    })
    .catch(function (err) {
      console.log(err);
    });
});

job.start()

bot.launch();
