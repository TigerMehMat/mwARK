var translateText = require("./translate-text.js");

function wikiCopy(clientEN, clientRU, options){
  var baseOptions = {
    "in": false,
    "out": false,
    "func": false,
    "translate": true,
  }
  options = extend(baseOptions, options);
  pageIn = options['in'].trim();
  pageOut = options['out'].trim();

  console.hideText('Начинаем считывать с EN wiki '+pageIn);
  clientEN.getArticle(pageIn, false, (err, data)=>{

    /* Проверяем на наличие ошибок */
    if(err){
      console.log('Ошибка\n'+err);
      return;
    }
    if(!data) {
      console.error('Не получилось взять данные со страницы '+pageIn+' (EN)');
      return;
    } else {
      console.ok('Чтение EN wiki '+pageIn+' прошло без ошибок');
    }
    /* конец проверки на ошибки */

    /* Обрабатываем текст, если есть функция */
    if(typeof options.func == 'function'){
      data = options.func(data);
      console.log('Найдена и обработана функция для текста');
    } else if(typeof options.func == 'string'  && options.func.trim() != ""){
      switch (options.func) {
        case "translateCreaturesText":
          data = translateText(data, ['moreAliasesText.txt', 'creatureAliases.txt']);
          break;
        case "translateCreaturesIcons":
          data = translateText(data, ['moreAliasesIcons.txt', 'creatureAliases.txt']);
          break;
        case "translateSaddle":
          data = translateText(data, ['SaddleAliases.txt']);
          break;
      }
      console.log('Найдена и обработана встроенная функция для текста');
    }
    /* конец обработки текста при наличии функции */
    /* обработка части [[ru:]] → [[en:]] */
    if(options.translate){
      if(data.indexOf('[[ru:')!=-1){
        data = data.replace(/\[\[ru:[а-яА-Яa-zA-Z: _-]+\]\]/, '[[en:'+pageIn+']]');
      } else if(data.indexOf('{{MissingTranslations')!=-1) {
        data = data.replace(/{{MissingTranslations/, '[[Категория:Добавить RU на англ вики]]\r\n[[en:'+pageIn+']]\r\n{{MissingTranslations');
      } else {
        data += '[[Категория:Добавить RU на англ вики]]\r\n[[en:'+pageIn+']]';
      }
    }
    console.log(data);
    /* конец обработки части [[ru:]] → [[en:]] */
    /* Запись обработанного текста в статью */
    console.hideText('Начинаем запись в RU wiki '+pageOut);
    clientRU.edit(pageOut,data,'Bot copy', (err)=>{
      if(err) {
        console.error('Копирование '+pageIn+' (EN) → '+pageOut+' (RU) прошло с ошибкой');
        return;
      }
      console.ok('Копирование '+pageIn+' (EN) → '+pageOut+' (RU) успешно завершено');
    });
    /* Конец записи обработанного текста */
  });
}

function extend(ob1, ob2){// Функция для слияния массивов
  for(ind in ob2){
    ob1[ind] = ob2[ind];
  }
  return ob1;
}

module.exports = wikiCopy;
