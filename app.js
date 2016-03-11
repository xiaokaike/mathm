var serve = require('koa-static');
var koa = require('koa');
var app = koa();

// $ GET /package.json
app.use(serve('.'));

// $ GET /hello.txt
app.use(serve('test/fixtures'));

// or use absolute paths
app.use(serve(__dirname + '/'));

app.listen(3008);

console.log('listening on port 3008');