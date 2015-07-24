var koa = require('koa');
var router = require('koa-router')();
var request = require("co-request");
var koaBodyParser = require('koa-bodyparser');
var mount = require('koa-mount');
var path = require('path');
var staticCache = require('koa-static-cache');

var app = module.exports = koa();


app.use(koaBodyParser());

router.get('/product/:id', function *(next) {
  var id = this.params.id;
  var result = yield request('http://localhost:1337/product/' + id);
  var product = JSON.parse(result.body);

  this.body = product
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(mount('/', staticCache(path.join(__dirname, './asserts'))));

if (!module.parent) app.listen(3000);
