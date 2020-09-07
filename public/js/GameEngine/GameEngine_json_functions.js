function loadJSON(filename) {
    'use strict';

    console.log("Loading JSON file: " + filename);

    let xhttp;
  
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    }
    
    xhttp.overrideMimeType("application/json");
    // Note: Setting the third argument to false turns on synchronous
    // fetch mode, which is being phased out (deprecated).
    xhttp.open('GET', filename, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
  }