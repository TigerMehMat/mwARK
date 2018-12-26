const Bot = require('nodemw'),
  fs = require("fs"),

  runs = require('./runFunctions.js'),

	client = new Bot('config.js'),
  clientRu = new Bot('ru-config.js');



clientRu.logIn("Tigermehmat@redirects", "b5vtjrn06itg7gnvs72mbjsjc4s1ktna", function(err){
  if(err){
    console.error('\n\u001b[31;1m\u001bхОшибка подключения с логином для RU Wiki\u001b[0m\n'+err+'\n');
    return;
  }
  console.log('\u001b[32;1m\u001bхПодключение к RU-wiki выполнено\u001b[0m\n');
  client.logIn("Tigermehmat@redirects", "b5vtjrn06itg7gnvs72mbjsjc4s1ktna", function(err){
    if(err){
      console.error('\n\u001b[31;1m\u001bхОшибка подключения с логином для EN Wiki\u001b[0m\n'+err+'\n');
    }
    console.log('\u001b[32;1m\u001bхПодключение к EN-wiki выполнено\u001b[0m\n\n');

    runs(client,clientRu);
  });
});
