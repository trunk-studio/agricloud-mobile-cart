var koa = require('koa');
var router = require('koa-router')();
var request = require("co-request");
var koaBodyParser = require('koa-bodyparser');
var mount = require('koa-mount');
var path = require('path');
var staticCache = require('koa-static-cache');

var app = module.exports = koa();


app.use(koaBodyParser());


var addr = process.env.WEB_PORT_1337_TCP_ADDR || 'localhost';
var port = process.env.WEB_PORT_1337_TCP_PORT || '1337';

var restServerUrl = 'http://' + addr + ':' + port;


router.get('/product/:id', function *(next) {
  var id = this.params.id;
  var result = yield request(restServerUrl+'/product/' + id);
  var product = JSON.parse(result.body);

  this.body = product
});

router.get('/', function *(next) {
  this.redirect('/index.html');
});

router.post('/order/status', function *(next) {
  var orderQuery = this.request.body;
  console.log('orderQuery', orderQuery);
  console.log('api rest url', restServerUrl+'/order/status');
  var result = yield request.post(restServerUrl+'/order/status', {form: orderQuery});
  var orderStatus = result.body;
  console.log('orderStatus', orderStatus);
  this.body = orderStatus;

});


app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(mount('/', staticCache(path.join(__dirname, './asserts'))));

var port = 3000;

console.log('ec-platform Server Url', restServerUrl);
console.log('mobile site Url', 'http://localhost:' + port);

if (!module.parent) app.listen(port);
