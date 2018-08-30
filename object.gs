function tickerObject(ticker, price, percentChange, volume, currency, date, high, low, dataDelay){
  
  var json = 
      {
         "ticker":ticker,
         "Price":price,
         "percentChange":percentChange,
         "high":high,
         "low":low,
         "volume":volume,
         "currency":currency,
         "updated":date,
         "dataDelay":dataDelay
      }
  return json;
}