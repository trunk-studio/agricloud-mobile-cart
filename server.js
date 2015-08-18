var koa = require('koa');
var router = require('koa-router')();
var request = require("co-request");
var koaBodyParser = require('koa-bodyparser');
var mount = require('koa-mount');
var path = require('path');
var staticCache = require('koa-static-cache');
var serve = require('koa-static');

var app = module.exports = koa();

app.use(koaBodyParser());

var env = process.env.NODE_ENV || 'development';

var addr = process.env.WEB_PORT_1337_TCP_ADDR || 'localhost';
var port = process.env.WEB_PORT_1337_TCP_PORT || '1337';

//todo: use PICKLETE_ENDPOINT_URL=http://localhost:1337/

var restServerUrl = 'http://' + addr + ':' + port;

router.get('/products', function *(next) {
  var result = yield request(restServerUrl + '/api/product');
  this.body = JSON.parse(result.body);
});

router.get('/product/:id', function *(next) {
  var id = this.params.id;
  var result = yield request(restServerUrl+'/api/product/' + id);
  var product = JSON.parse(result.body);

  this.body = product
});

router.get('/', function *(next) {
  this.redirect('/index.html');
});

router.post('/order/status', function *(next) {
  var orderQuery = this.request.body;
  var result = yield request.post(restServerUrl+'/api/order/status', {form: orderQuery});
  var orderStatus = result.body;
  this.body = orderStatus;
});

router.post('/order', function *(next) {
  var purchaseForm = this.request.body;
  console.log('=== purchaseForm ===', purchaseForm);
  var result = yield request.post(restServerUrl+'/api/order', {form: purchaseForm});
  var purchaseResult = result.body;
  this.body = purchaseResult;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('=== env ===', env);
if(env === 'development')
  app.use(mount('/', serve(path.join(__dirname, 'app'))));
else if(env === 'production')
  app.use(mount('/', staticCache(path.join(__dirname, 'dist'))));

app.use(mount('/bower_components', staticCache(path.join(__dirname, 'bower_components'))));

var port = 3000;

console.log('ec-platform Server Url', restServerUrl);
console.log('mobile site Url', 'http://localhost:' + port);

if (!module.parent) app.listen(port);
