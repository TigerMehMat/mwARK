//const rewriteDvData = require("./wikimodules/data-update.js");// - библиотека для обносления Dv/data
const renameImages = require("./wikimodules/images-rename.js");

console.log("Запущен скрипт с функциями\n");

var res = function(client,clientRu){
  //rewriteDvData(client,clientRu);// - Обновление Dv/data с официального сервера
  renameImages(client);
}
module.exports = res;
