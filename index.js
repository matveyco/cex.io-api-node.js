var cexapi = require("./cexapi.js");
cexapi.create(username, api_key, api_secret);
cexapi.balance(function(param){console.log(param)});
