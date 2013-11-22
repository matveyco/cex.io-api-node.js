var _username;
var _api_key;
var _api_secret;
var _nonce = '';
var _https = require('https');
var _crypto = require('crypto');

 function create(username, api_key, api_secret) //Set variable
 {
  _username = username;
  _api_key = api_key;
  _api_secret = api_secret;
 }

 function __signature() //Generate signature
 {
  string = _nonce + _username + _api_key
  hmac = _crypto.createHmac('sha256', _api_secret);
  hmac.setEncoding('hex');
  hmac.write(string);
  hmac.end();
  var temp = hmac.read();
  return temp.toUpperCase()
 }

 function __nonce() //Get timestamp as nonce
 {
  _nonce = Math.round(new Date().getTime() / 1000);
 }

 function __post(url, param, callback) //Send post request via requstify
 {
  var post_data = '';
  var body = '';
  for (var key in param) 
  {
   post_data += key + '=' + param[key] + '&'
  }
  if (post_data.length > 2)
  {
   post_data = post_data.substring(0, post_data.length-1 );
  }
  else
  {
   post_data ='';
  }
  var request = _https.request({
     hostname:'cex.io',
     path : url,
     port : 443, 
     method : 'POST',
     headers: {'User-Agent': 'cex.io_node.js_api',
     	       'Content-Length': post_data.length,
	       'Content-Type' : 'application/x-www-form-urlencoded'}
  }, function(res){
      res.setEncoding('utf8');
      res.on('data', function(chunk){
       body +=chunk;
      });
      res.on('end', function() {
       callback(JSON.parse(body));
      });
      });//Return answer as object in callback
  request.write(post_data);
  request.end();
  return body;
 }

 function api_call(method, param, is_private, couple, callback) //Api call
 {
  var url = '/api/' + method +'/' //generate uri
  if (couple == undefined) {var couple = ''} else {
   if (couple.length > 5)
   {
    url = url + couple +'/' }
  }
  if (param  == undefined) {var param = new Object()} //generate param in needed
  if (is_private  == undefined) {var is_private = 0} 
  else
  {
   if (is_private == 1)
    {
     __nonce();
     param.key = _api_key; 
     param.signature = __signature();
     param.nonce = _nonce;
    }
  }
  __post(url,param, callback)
 }

 function ticker(couple,callback)
 {
  api_call('ticker', new Object(), 0, couple, callback) 
 }

 function order_book(couple,callback)
 {
  api_call('order_book', new Object(), 0, couple, callback) 
 }
 
 function trade_history(since,couple,callback)
 {
  param = new Object();
  param.since = since;
  api_call('trade_history', param, 0, couple, callback) 
 }

 function balance(callback)
 {
  param = new Object();
  api_call('balance', param, 1, '', callback)
 }

 function open_orders(couple, callback)
 {
  api_call('open_orders', new Object(), 1, couple, callback);
 }

 function cancel_order(id, callback)
 {
  param = new Object();
  param.id = id;
  api_call('cancel_order', param, 1, '', callback);
 }

 function place_order(type, amount, price, couple, callback)
 {
  param = new Object();
  param.type = type;
  param.amount = amount;
  param.price = price;
  api_call('place_order', param, 1, couple, callback)
 }


 exports.create = create;
 exports.api_call = api_call;
 exports.ticker = ticker;
 exports.order_book = order_book;
 exports.trade_history = trade_history;
 exports.balance = balance;
 exports.open_orders = open_orders;
 exports.cancel_order = cancel_order;
 exports.place_order = place_order;
