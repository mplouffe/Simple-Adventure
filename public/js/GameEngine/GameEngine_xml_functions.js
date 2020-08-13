// A cross-browser "To String" helper for xml node objects.
// Using console.dirxml() is an alternative way to inspect XML.
// Uses strict mode: https://goo.gl/xmOUmj
function xmlToString(node) {
  'use strict';

  if (node.xml) { // Only IE supports this property.
    return node.xml;
  } else if (XMLSerializer) { // Firefox supports this.
    var my_serializer = new XMLSerializer();
    return my_serializer.serializeToString(node);
  } else {
    alert('Your browser does not support XML serialization.');
    return '';
  }
}

// Synchronously loads the received XML document as a DOM Document object 
// and returns it.
// Uses strict mode: https://goo.gl/xmOUmj
function loadXML(filename) {
  'use strict';

  var xhttp;

  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else { // Only really old browsers like IE6 need this:
    xhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }

  // Note: Setting the third argument to false turns on synchronous
  // fetch mode, which is being phased out (deprecated).
  xhttp.open('GET', filename, false);
  xhttp.send();
  return xhttp.responseXML;
}

