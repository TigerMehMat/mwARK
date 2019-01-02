const redirectImages = require('./functions/redirect-images.js'),
  wikiCopy = require('./functions/copy.js');

function runs(clientRU, clientEN, options){
  for(var index in options['functions']){
    switch(index){
      case('imageredirect'):
        redirectImages(clientEN, options['functions'][index]);
        break;
      case('copy'):
        wikiCopy(clientEN, clientRU, options['functions'][index]);
        break;
      default:
        console.log('Неизвестная команда ' + index);
    }
  }
}

module.exports = runs;
