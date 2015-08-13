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

//todo: use PICKLETE_ENDPOINT_URL=http://localhost:1337/

var restServerUrl = 'http://' + addr + ':' + port;

router.get('/products', function *(next) {
  var result = yield request(restServerUrl + '/product/find');
  this.body = JSON.parse(result.body);
});

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
  var result = yield request.post(restServerUrl+'/order/status', {form: orderQuery});
  var orderStatus = result.body;
  this.body = orderStatus;
});

router.post('/order', function *(next) {
  var purchaseForm = this.request.body;
  var result = yield request.post(restServerUrl+'/order', {form: purchaseForm});
  var purchaseResult = result.body;
  this.body = purchaseResult;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(mount('/', staticCache(path.join(__dirname, 'assets'))));

var port = 3000;

console.log('ec-platform Server Url', restServerUrl);
console.log('mobile site Url', 'http://localhost:' + port);

if (!module.parent) app.listen(port);
