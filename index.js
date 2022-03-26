const rp = require("request-promise");
const $ = require("cheerio");
const { Telegraf } = require("telegraf");

const url = "https://tamilblasters.buzz/";
const bot = new Telegraf(process.env.BOT_ID);

//start handler
bot.start((ctx) => {
  ctx.reply(`
Send the below commands to get latest movie releases on tamilblasters torrent site:

1. /list10 To get latest 10 releases
2. /list15 To get latest 15 releases 
  `);
});

bot.command(["list10", "List10"], (ctx) => {
  dataFetch(ctx, 10);
});

bot.command(["list15", "List15"], (ctx) => {
  dataFetch(ctx, 15);
});

function dataFetch(ctx, listLength) {
  rp(url)
    .then(function (html) {
      const cheerioData = $.load(html);
      const data = cheerioData("p:nth-of-type(n+3)").text().split(/\r?\n/);
      const cleanedData = [];
      data.map((data) => {
        if (data.trim().length < 2) {
          return;
        } else {
          const trimmedData = data.trim().substring(0, data.indexOf("-") - 1);
          if (trimmedData.length > 5) {
            cleanedData.push(trimmedData);
          }
        }
      });
      let message = `Here is the list of latest ${listLength} releases in tamilblasters website:\n\n`;
      for (i = 0; i < listLength; i++) {
        const singleData = `${i + 1}. ${cleanedData[i]}\n\n`;
        message += singleData;
      }
      message += "Data fetched by @tamilmvtrackerbot";
      ctx.reply(message);
    })
    .catch(function (err) {
      console.log(err);
    });
}

bot.launch();
