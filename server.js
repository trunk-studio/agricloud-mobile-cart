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

console.log('restServerUrl', restServerUrl);

router.get('/product/:id', function *(next) {
  var id = this.params.id;
  var result = yield request(restServerUrl+'/product/' + id);
  var result = JSON.parse(result.body);

  this.body = result
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(mount('/', staticCache(path.join(__dirname, './asserts'))));

if (!module.parent) app.listen(3000);
