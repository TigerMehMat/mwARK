const mapRedirect = require('./get-redirect-map.js');

var redirectSearch = /^#(перенаправление|redirect)(\s*)\[\[([ a-zA-Zа-яА-Я0-9().:_-]*)\]\]/i;
var client;

function res(client1, redirects){
  client = client1;
  var reds = getPages(redirects);
  addMaps(reds);
}

function addMaps(resObj, index = 0, n = 0, q = 0) {
  if(index == 0) console.log('\nПоиск шаблонов-карт...\n');
	if(index >= resObj['len']){
    if(n==0) console.log('\u001b[32;1m\u001bхШаблоны-карты не найдены\u001b[0m\n');
		else console.log('\n\u001b[32;1m\u001bхДобавление карт ('+q+') из всех шаблонов-команд ('+n+') завершено\u001b[0m\n\n');
		delDoubleRadirects(resObj);
		return;
	}

  if(mapRedirect.isMapRedirect(resObj['in'][index])){
    redirectName = resObj['in'][index].substr(11,resObj['in'][index].length).trim();
    redirectName = redirectName.substr(0,redirectName.length-4);
    redirectNameOut = resObj['out'][index].substr(5,resObj['out'][index].length);
    redirectNameOut = redirectNameOut.substr(0,redirectNameOut.length-4);
    console.log('Найдено перенаправление-карта ('+redirectName+')');
    resObj['in'].splice(index,1);
    resObj['out'].splice(index,1);
    resObj['len']--;
    n++;
    addMapsRedirects(resObj, index, n, q, redirectName, redirectNameOut);
  } else {
    index++;
    addMaps(resObj, index, n, q);
  }
}

function addMapsRedirects(resObj, index, n, q, rNameIn, rNameOut, mapIndex = 0){
  if(mapIndex >= mapRedirect.maps.length){
    console.log('\n');
    addMaps(resObj, index, n, q);
    return;
  }
  filename = 'File:Spawning_'+rNameOut+'_'+mapRedirect.maps[mapIndex]+'.svg';
  fileRUname = 'File:Spawning_'+rNameIn+'_'+mapRedirect.maps[mapIndex]+'.svg';
  client.getImageInfo(filename,function(err, data){
    if(err) {
      console.log(err);
      return;
    }
    symb = (mapIndex == mapRedirect.maps.length-1)?'└':'├';
    if(typeof(data)=='undefined'){
      console.log(' '+symb+' Карта '+mapRedirect.maps[mapIndex]+' не используется');
      mapIndex++;
      addMapsRedirects(resObj, index, n, q, rNameIn, rNameOut, mapIndex);
    } else {
      console.log(' '+symb+' Карта '+mapRedirect.maps[mapIndex]+' используется и была добавлена в список редиректов');
      q++;
      mapIndex++;
      resObj['in'].splice(index,0,fileRUname);
      resObj['out'].splice(index,0,filename);
      index++;
      resObj['len']++;
      addMapsRedirects(resObj, index, n, q, rNameIn, rNameOut, mapIndex);
    }
  });
}


function delDoubleRadirects(resObj, index = 0, q = 0, d = 0) {
  if(index == 0) console.log('\nПоиск двойных перенаправлений и перенаправлений на несуществующие страницы...\n');
	if(index >= resObj['len']){
    if(q==0) console.log('\u001b[32;1m\u001bхУдаление двойных перенаправлений не требуется\u001b[0m\n');
		else console.log('\u001b[32;1m\u001bхУдаление двойных перенаправлений ('+q+') завершено\u001b[0m\n');
    if(d==0) console.log('\u001b[32;1m\u001bхПустых страниц-целей не найдено\u001b[0m\n');
		else console.log('\u001b[32;1m\u001bхНайдены пустые страницы-цели ('+d+') и были удалены из списка перенаправлений\u001b[0m\n');
		recRedirects(resObj);
		return;
	}

	client.getArticle(resObj['out'][index],0, function(err, data){
		if(err) console.error('err'+err);
		else if(!data){
			console.log('\u001b[33;1m\u001bхПеренаправление на пустую страницу ('+resObj['in'][index]+' → '+resObj['out'][index]+')\u001b[0m');
      resObj['in'].splice(index,1);
      resObj['out'].splice(index,1);
      resObj['len']--;
      d++;
		} else if(isRedirect(data)){
			console.log('Найдено перенаправление на странице '+resObj['out'][index]+' → '+redirectTo(data));
			resObj['out'][index] = redirectTo(data);
			q++;
		}
		index++;
		delDoubleRadirects(resObj,index,q,d);
	});
}

function redirectTo(t){
	if(!isRedirect(t)) return false;
	return t.trim().match(redirectSearch)[3];
}

function isRedirect(t){
	if(t.trim().toLowerCase().search(redirectSearch)===0)
		return true;
	return false;
}

function recRedirects(resObj, index = 0, pro = 0, cre  = 0, recre = 0){ // Записывает редиректы recRedirects(redirectList)
  if(index == 0) {
    console.log('Итоговый список перенаправлений\n');
    printRedirects(resObj);
    console.log('\n\nНачинается перезапись...\n');
  }
	if(index >= resObj['len']){
		console.log('\n\u001b[32;1m\u001bхВсе ссылки ('+resObj['len']+') обработаны. '+pro+' пропущено, '+cre+' записано (из них '+recre+' перезаписано)\u001b[0m\n\n');
		return;
	}
	client.getArticle(resObj['in'][index], function(err,data){
		if(err){
			console.log(err);
		} else {
			var isrewrite = false;
			if(data){
				if(isRedirect(data)) {
					if(redirectTo(data) == resObj['out'][index]){
						console.log('\u001b[30;1m\u001bхx    Перенаправление '+resObj['in'][index]+' → '+resObj['out'][index]+' уже существует \u001b[0m');
					} else {
						isrewrite = true;
					}
				} else {
					console.log('\u001b[31;1m\u001bхх ! Страница '+resObj['in'][index]+' уже существует, пропуск ('+data.substr(0,20)+')\u001b[0m');
				}
			}
			if(!data||isrewrite){
				client.edit(resObj['in'][index], "#REDIRECT [["+resObj['out'][index]+"]]\r\n[[Category:Russian Image Redirects]]", 'File redirect RU to EN images', true, function(err){
					if(err){
						console.error(err);
					}
					else{
						if(isrewrite){
              console.log('\u001b[33;1m\u001bхv!! Страница '+resObj['in'][index]+' уже существует, но является перенаправлением.\u001b[0m');
              recre++;
            }
						console.log('v   Перенаправление '+resObj['in'][index]+' → '+resObj['out'][index]+' добавлено');
					}
					index++;
          cre++;
					recRedirects(resObj, index, pro, cre, recre);
				});
			} else {
				index++;
        pro++;
				recRedirects(resObj, index, pro, cre, recre);
			}
		}
	});
}

function getPages(pageObj){
	var pagesIn = [], pagesOut = [], i=0, g=0;
  pageObj = pageObj.replace('\r', '').split('\n');
	for(var i=0;i<pageObj.length;i++){
		if (pageObj[i].trim() == "") continue;
    data = pageObj[i].split('|');
    for(var j = 0;j<data.length-1;j++){
		    pagesIn[g] = addPrefixes(data[j]);
        pagesOut[g] = addPrefixes(data[data.length-1]);
        console.log('\u001b[30;1m\u001bх'+pagesIn[g]+'\u001b[0m → \u001b[30;1m\u001bх'+pagesOut[g]+'\u001b[0m');
        g++;
    }
	}
	return {
		'in': pagesIn,
		'out': pagesOut,
		'len': g
	};
}

function printRedirects(pageObj){
  for(var i=0;i<pageObj['in'].length;i++){
    console.log('\u001b[30;1m\u001bх'+pageObj['in'][i]+'\u001b[0m → \u001b[30;1m\u001bх'+pageObj['out'][i]+'\u001b[0m');
  }
  return;
}

function addPrefixes(t){
  t = t.trim();
  if(t.substr(0,5)!="File:") t = "File:" + t;
  if(t.search(/\./i)==-1) t = t + ".png";
  return t;
}


module.exports = res;
