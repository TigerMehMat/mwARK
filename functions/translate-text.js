const fs = require('fs'),
  path = require("path");

function getMyAliases(t){
	var creEN = [], creRU = [], i=0, g=0;
  t = t.split('\r').join('').split('\n');
	for(var i=t.length-1;i>-1;i--){
		if (t[i].trim() == "") continue;
    data = t[i].split('|');
    for(var j = 0;j<data.length-1;j++){
	    creEN[g] = data[j].trim();
      creRU[g] = data[data.length-1].trim();
      console.log('\u001b[30;1m\u001bх'+creEN[g]+'\u001b[0m → \u001b[30;1m\u001bх'+creRU[g]+'\u001b[0m');
      g++;
    }
	}
	return {
		'en': creEN,
		'ru': creRU,
		'len': g
	};
}

function replaceAllWiki(t, translateFiles){
  var reg, translates = '';
  if(typeof translateFiles == 'string'){
    translates = fs.readFileSync(path.resolve(__dirname, translateFiles), 'utf8');
  } else if(typeof translateFiles == 'object'){
    for(var i=0;i<translateFiles.length;i++){
      translates += fs.readFileSync(path.resolve(__dirname, translateFiles[i]), 'utf8');
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
