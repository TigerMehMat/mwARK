const fs = require('fs'),// Для работы с файловой системой
  path = require("path");// Для кроссплатформенной адресации

function getMyAliases(t){
	var creEN = [], creRU = [], g=0;

  // Чистим текст от  \r, разделяем в массив по \n
  t = t.replace(/\r/g, '').split('\n');

  // Проходимся по массиву в обратном порядке
	for(var i=t.length-1;i>-1;i--){
    // Если строка не имеет разделителя, пропускаем (пустые строки при этом тоже отсеиваются)
		if(t[i].indexOf('|') == -1) continue;

    // Разделяем строку по разделителю |
    data = t[i].split('|');

    // Проходимся по n-1 частям, где n кол-во частей и все направляем на n
    for(var j = 0;j<data.length-1;j++){
	    creEN[g] = data[j].trim();
      creRU[g] = data[data.length-1].trim();
      console.log(creEN[g]+' → '+creRU[g]);
      g++;
    }
	}

  // Возвращаем объект из трех элементов en, ru и len, где len - длинна массивов
  // en и ru
	return {
		'en': creEN,
		'ru': creRU,
		'len': g
	};
}

function replaceAllWiki(t, translateFiles){
  var reg, translates = '';
  if(typeof translateFiles == 'string'){
    translates = fs.readFileSync(path.resolve(__dirname+'translateLists/', translateFiles), 'utf8');
  } else if(typeof translateFiles == 'object'){
    for(var i=0;i<translateFiles.length;i++){
      translates += fs.readFileSync(path.resolve(__dirname+'translateLists/', translateFiles[i]), 'utf8');
    }
  }
  translateObj = getMyAliases(translates);
  for(var i = 0; i<translateObj['len'];i++){
    reg = new RegExp(translateObj['en'][i].replace(/\(/g, '\\\(').replace(/\)/g, '\\\)'), 'g');
    t = t.replace(reg, translateObj['ru'][i]);
  }
  return t;
}

module.exports = replaceAllWiki;
