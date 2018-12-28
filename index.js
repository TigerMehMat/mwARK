const Bot = require('nodemw'),
  redirectImages = require('./functions/redirect-images.js'),
  runs = require('./functions.js');

function startBot(options){
  console.log('Запуск оболочки, начало подключения конфигурации\n');
  var clientRU = new Bot(options["config-ru"]);
  var clientEN = new Bot(options["config-en"]);
  clientRU.logIn(options["config-ru"].username, options["config-ru"].password, function(err){
    if(err){
      console.error('\n\u001b[31;1m\u001bхОшибка подключения с логином ('+options["config-ru"].username+') для RU Wiki\u001b[0m\n'+err+'\n');
      return;
    }
    console.log('\u001b[32;1m\u001bхПодключение к RU-wiki для бота '+options["config-ru"].username+' выполнено\u001b[0m\n');
    clientEN.logIn(options["config-en"].username, options["config-en"].password, function(err){
      if(err){
        console.error('\n\u001b[31;1m\u001bхОшибка подключения с логином ('+options["config-en"].username+') для EN Wiki\u001b[0m\n'+err+'\n');
        return;
      }
      console.log('\u001b[32;1m\u001bхПодключение к EN-wiki для бота '+options["config-en"].username+' выполнено\u001b[0m\n\n');

      runs(clientRU,clientEN,options);
    });
  });
}

module.exports = startBot;
