var redirectImages = require('./functions/redirect-images.js');

function runs(clientRU, clientEN, options){
  for(var index in options['functions']){
    switch(index){
      case('imageredirect'):
        redirectImages(clientEN, options['functions'][index]);
        break;
      default:
        console.log('Неизвестная команда ' + index);
    }
  }
}

module.exports = runs;
