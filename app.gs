//Abre e ativa a conexao com a planilha googleFinance
var ss = SpreadsheetApp.openById("1dU93hlBBE7v2gXsi-GyVLD58SMpZlLn1VnNO_IG7tvM");
SpreadsheetApp.setActiveSpreadsheet(ss);
var sh = SpreadsheetApp.getActiveSheet();
val = sh.getRange('D2:E2').getValues()[0];

var tickers = [];
updateTickers();

var status = 'Success';
var linkGoogleFinance = 'http://www.google.com/googlefinance/disclaimer/';
var date = new Date();
var timeZone = Session.getScriptTimeZone();

function doGet(e) {
  var content = gFinance(e.parameter.ticker, e.parameter.xml);
  return ContentService.createTextOutput(JSON.stringify(content) ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {

  var content = newTicker(e.parameter.ticker);
  
  if(typeof e != 'undefined'){
    return ContentService.createTextOutput(JSON.stringify(content) ).setMimeType(ContentService.MimeType.JSON);
  }
}

function gFinance(ticker, xml) {
Logger.log ('gFinance to XML: ' + toXML(getAllTickers()));
  try{
  
    if(ticker == undefined){
      Logger.log (xml == 'true');
      
      //Return XML type
      if(xml == 'true'){
        Logger.log ('Erro all gFinance xml==true: ' + toXML(getAllTickers()));
        return toXML(getAllTickers());
      }
      //Return JSON type
      return getAllTickers();
  }
  
  //Return XML type
    if(xml == 'true'){
      Logger.log ('Erro specific gFinance xml==true: ' + toXML(specificTicker(ticker)));
      return toXML(specificTicker(ticker));
    }
    //Return JSON type
    return specificTicker(ticker);
  }
  catch(e){
    status = '500 - Internal error: ' + e;
    return jsonNotFound(status, '', '');
  }
}

function newTicker(ticker){
  
  // Get a script lock, because we're about to modify a shared resource.
  var lock = LockService.getScriptLock();
  // Wait for up to 30 seconds for other processes to finish.
  
  //Send an email if occurs some error
  if(!lock.tryLock(3000)){
      GmailApp.sendEmail('tracuns@gmail.com', 'Error on lock public - App - GoogleFinance', 'Error on lock public');
      
      status = '500 - Internal error: ' + e.getMessage();
      return jsonNotFound(status, '', '');
  }
  
  try{
  //Logger.log('newTicker: ' + ticker)
  
    if(tickers.indexOf(ticker.toUpperCase()) > 0){
      status = '400 - Ticker already existing'
      return jsonNotFound(status, ticker, '');
      
    //Verifica se o indice eh encontrado no googleFinance
    }else if(!isTicker(ticker)){
      status = '400 - Ticker not found'
      return jsonNotFound(status, ticker, '');
      
    }else{
      var next = sh.getLastRow() + 1;
      sh.getRange('P' + next).setValue(ticker.toUpperCase());
      return jsonNotFound(status, 'FOUND', '');
    }
    
  }catch(e){
    status = '500 - Internal error: ' + e;
    return jsonNotFound(status, '', '');
  }
}

function specificTicker(ticker){

  sh.getRange('b2').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"price");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b3').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"changepct");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b4').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"volume");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b5').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"currency");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b6').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"high");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b7').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"low");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('b8').setFormula('=' + 'IFERROR(googlefinance(' + '"' + ticker + '"' + ';"datadelay");' + '"' + 'Not found' + '"' + ')');
  
  //Pega os valores das celulas
  var price = sh.getRange('b2').getValues()[0] + '';
  var percentChange = sh.getRange('b3').getValues()[0] + '%';
  var volume = sh.getRange('b4').getValues()[0] + '';
  var currency = sh.getRange('b5').getValues()[0] + '';
  var high = sh.getRange('b6').getValues()[0] + '';
  var low = sh.getRange('b7').getValues()[0] + '';
  var dataDelay = sh.getRange('b8').getValues()[0] + '';
  
  var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM, yyyy - HH:mm:ss');
  
  if(price == 'Not found'){;
    status = '404 - Ticker not found';
    
    return jsonNotFound(status, ticker, linkGoogleFinance);
  }
  return toJSON(status, tickerObject(ticker, price, percentChange, volume, currency, formattedDate, high, low, dataDelay), linkGoogleFinance)
}

function getAllTickers(){

  //date = new Date();
  //var currentMinute = date.getMinutes();
  var assets = [];
  var line = 2
  
  //sh.getRange('B11').setValue(currentMinute);
  
  //Diferenca da hora atual - ultima atualizacao
  var dif = sh.getRange('B12').getValues()[0];
  
  //Logger.log(dif);
  //Think about this code
//  if(dif <= 6){
//  
//    for each (var ticker in tickers){
//    
//    //Pega os valores das celulas
//    var price = sh.getRange('e' + line).getValues()[0] + '';
//    var percentChange = sh.getRange('f' + line).getValues()[0] + '%';
//    var volume = sh.getRange('g' + line).getValues()[0] + '';
//    var currency = sh.getRange('h' + line).getValues()[0] + '';
//    var high = sh.getRange('i' + line).getValues()[0] + '';
//    var low = sh.getRange('j' + line).getValues()[0] + '';
//    var dataDelay = sh.getRange('k' + line).getValues()[0] + '';
//    
//    //Formata a data
//    var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM, yyyy - HH:mm:ss');
//    
//    //Adiciona os objetos json no array
//    assets.push(tickerObject(ticker, price, percentChange, volume, currency, formattedDate, high, low, dataDelay));
//    
//    //Manipula a linha na planilha
//    line += 1
//    
//    }
//    sh.getRange('B10').setValue(currentMinute);
//  }else{
    
    for each (var ticker in tickers){
    
      setFormOnSheet(ticker, line);
      
      //Pega os valores das celulas
      var price = sh.getRange('e' + line).getValues()[0] + '';
      var percentChange = sh.getRange('f' + line).getValues()[0] + '%';
      var volume = sh.getRange('g' + line).getValues()[0] + '';
      var currency = sh.getRange('h' + line).getValues()[0] + '';
      var high = sh.getRange('i' + line).getValues()[0] + '';
      var low = sh.getRange('j' + line).getValues()[0] + '';
      var dataDelay = sh.getRange('k' + line).getValues()[0] + '';
      
      //Formata a data
      var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMMM, yyyy - HH:mm:ss');
      
      //Adiciona os objetos json no array
      assets.push(tickerObject(ticker, price, percentChange, volume, currency, formattedDate, high, low, dataDelay));
      
      //Manipula a linha na planilha
      line += 1
      
    }
    //sh.getRange('B10').setValue(currentMinute);
  //}
  return toJSON(status, assets, linkGoogleFinance);
}

function setFormOnSheet(ticker, line){

  sh.getRange('d' + line).setValue(ticker);
  sh.getRange('e' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"price");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('f' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"changepct");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('g' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"volume");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('h' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"currency");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('i' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"high");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('j' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"low");' + '"' + 'Not found' + '"' + ')');
  sh.getRange('k' + line).setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"datadelay");' + '"' + 'Not found' + '"' + ')');

}

function updateTickers(){

  try{
    for(var i = 2; i<= sh.getLastRow();i++){
    
      if(sh.getRange('P' + i).getValue() == ""){
        break;
      }
    
      tickers.push(sh.getRange('P' + i).getValue())
    }
  }catch(e){
  
  }
}

//Verifica se o ticker e valido
function isTicker(ticker){
  sh.getRange('b2').setFormula('IFERROR(googlefinance(' + '"' + ticker + '"' + ';"price");' + '"' + 'Not found' + '"' + ')');
  var price = sh.getRange('b2').getValues()[0] + '';
  
  if (price == 'Not found'){
    return false;
  }
  return true;
}