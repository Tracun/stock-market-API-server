function toXML(myObject){
  try{
  
    var root = makeXmlFromOb (myObject, XmlService.createElement('root'));
  
    // make a documents
    var doc = XmlService.createDocument(root);
    
    // show it
    Logger.log (XmlService.getPrettyFormat().format(doc));
    
    return XmlService.getPrettyFormat().format(doc);
    
  }catch(e){
    Logger.log("Erro toXML: " + e)
  }
}

function jsonNotFound(status, ticker, linkGoogleFinance){
  
  var json = {
    'status':status,
    'Assets':{
      'ticker':ticker,
      },
    'about_stock_market_data':linkGoogleFinance
}; 
  return json; 
}

function toJSON(status, assets, linkGoogleFinance){
  
  var json = {
   'status':status,
   'Asset':
      assets,
    'about_stock_market_data':linkGoogleFinance
};
  return json;
}

/**
* convert json to xml
* @param {object] ob an object to convert
* @param {XmlElement} parent usually the root on first call
* @return {XmlElement} the parent for chaining
* @Ref: http://ramblings.mcpher.com/Home/excelquirks/gassnips/jsonxml
*/
function makeXmlFromOb (ob, parent) {
  // this is recursive to deal with multi level JSON objects
  Object.keys(ob).forEach (function (d) { 
    
    // if the key is numeric, xml will fail, so rename array indices to value
    var child = XmlService.createElement(isNaN(new Number(d)) ? d : 'element' );
    
    // add new created element to the parent
    parent.addContent (child);
    
    // need to recurse if this is an object/array
    if (typeof ob[d] === 'object' ) {
      
      // the new parent is the newly created node
      return makeXmlFromOb (ob[d] , child );
    }
    else { 
      
      // regular node, set the text to the value
      child.setText(ob[d]);
    }
    
  });
  
  return parent;
}

