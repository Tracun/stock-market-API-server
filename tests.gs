function testPOST() {
  
  var url = ScriptApp.getService().getUrl();
  
  var payload =
      {
        "ticker" : "petr4"
      };
  
  var options =
      {
        "method"  : "POST",
        "payload" : payload,   
        "followRedirects" : true,
        "muteHttpExceptions": true
      };
  
  var result = UrlFetchApp.fetch(url, options);
  
  if (result.getResponseCode() == 200) {
    
    var params = JSON.parse(result.getContentText());
    
    Logger.log(newTicker(params));
    
  }
}

function testSpecificTicker() {
  
  var ticker = "?ticker=PETR4"
  
  var url = ScriptApp.getService().getUrl();
  var result = UrlFetchApp.fetch(url + ticker);
  
  if (result.getResponseCode() == 200) {
    
    var params = JSON.parse(result.getContentText());
    
    Logger.log(params);
    
  }
}

function testAllTickers() {
  
  var url = ScriptApp.getService().getUrl();
  var result = UrlFetchApp.fetch(url);
  
  if (result.getResponseCode() == 200) {
    
    var params = JSON.parse(result.getContentText());
    
    Logger.log(params);
    
  }
}