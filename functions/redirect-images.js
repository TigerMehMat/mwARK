var redirectSearch = /^#(перенаправление|redirect)(\s*)\[\[([ a-zA-Zа-яА-Я0-9().:_-]*)\]\]/i;
var client;

function res(client1, redirects){
  client = client1;
  var reds = getPages(redirects);
  delDoubleRadirects(reds);
}

function delDoubleRadirects(resObj, index = 0, q = 0) {
  if(index == 0) console.log('\n\n');
	if(index >= resObj['len']){
		console.log('\n\u001b[32;1m\u001bхУдаление двойных редиректов ('+q+') завершено\u001b[0m\n\n');
		recRedirects(resObj);
		return;
	}

	client.getArticle(resObj['out'][index],0, function(err, data){
		if(err) console.error('err'+err);
		else if(!data){
			console.log('\u001b[33;1m\u001bхПеренаправление на пустую страницу ('+resObj['out'][index]+')\u001b[0m');
		} else if(isRedirect(data)){
			console.log('Найдено перенаправление на странице '+resObj['out'][index]+' → '+redirectTo(data));
			resObj['out'][index] = redirectTo(data);
			q++;
		}
		index++;
		delDoubleRadirects(resObj,index,q);
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
						console.log('\u001b[30;1m\u001bх    Перенаправление '+resObj['in'][index]+' → '+resObj['out'][index]+' уже существует \u001b[0m');
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
		pagesIn[g] = addPrefixes(data[0]);
		pagesOut[g] = addPrefixes(data[1]);
    console.log('\u001b[30;1m\u001bх'+pagesIn[g]+'\u001b[0m → \u001b[30;1m\u001bх'+pagesOut[g]+'\u001b[0m');
    g++;
	}
	return {
		'in': pagesIn,
		'out': pagesOut,
		'len': g
	};
}

function addPrefixes(t){
  t = t.trim();
  if(t.substr(0,5)!="File:") t = "File:" + t;
  if(t.search(/\./i)==-1) t = t + ".png";
  return t;
}


module.exports = res;
