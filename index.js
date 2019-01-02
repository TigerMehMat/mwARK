const Bot = require('nodemw'),
  runs = require('./functions.js');

function startBot(options){
  console.hideText('Запуск оболочки, начало подключения конфигурации\n');
  var baseOptions = {
    "protocol": "https",
    "path": "",
    "debug": false,
  }
  console.log(sli(baseOptions,options["config-ru"]));
  var clientRU = new Bot(sli(baseOptions,options["config-ru"]));
  var clientEN = new Bot(sli(baseOptions,options["config-en"]));
  clientRU.logIn(options["config-ru"].username, options["config-ru"].password, function(err){
    if(err){
      console.error('Ошибка подключения с логином ('+options["config-ru"].username+') для RU Wiki');
      console.hideText(err + '\n');
      return;
    }
    console.ok('Подключение к RU-wiki для бота '+options["config-ru"].username+' выполнено\n');
    clientEN.logIn(options["config-en"].username, options["config-en"].password, function(err){
      if(err){
        console.error('\nОшибка подключения с логином ('+options["config-en"].username+') для EN Wiki');
        console.hideText(err+'\n');
        return;
      }
      console.ok('Подключение к EN-wiki для бота '+options["config-en"].username+' выполнено\n\n');

      runs(clientRU,clientEN,options);
    });
  });
}


function colorCode(text, colorCode){
  return "\u001b["+colorCode+";1m"+text+"\u001b[0m";
}

console.error = (text) => {
  console.log(colorCode(text, 31));
}

console.hideText = (text) => {
  console.log(colorCode(text, 30));
}

console.warning = (text) => {
  console.log(colorCode(txet, 33));
}

console.ok = (text) => {
  console.log(colorCode(text, 32));
}

function sli(ob1,ob2){
  for(var ind in ob2){
    ob1[ind] = ob2[ind];
  }
  return ob1;
}

module.exports = startBot;
