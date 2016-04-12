var serve = require('koa-static');
var koa = require('koa');
var app = koa();


// or use absolute paths
app.use(serve(__dirname + '/public/'));


app.listen(3008);

console.log('listening on port 3008');