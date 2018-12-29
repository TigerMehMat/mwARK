function isMapRedirect(t){// Проверяет, является ли строка редиректом на карту
  if(!t||typeof(t)!="string") return false;
  if(t.toLowerCase().substr(0,11)=="file:карта:") return true;
  return false;
}

module.exports.isMapRedirect = isMapRedirect;
module.exports.maps = ['The_Island','Aberration','Extinction', 'Scorched_Earth', 'The_Center', 'Ragnarok'];
