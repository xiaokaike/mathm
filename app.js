var serve = require('koa-static')
var koa = require('koa')
var render = require('koa-swig')
var app = koa()
var path = require('path')

var port = process.env.PORT || 3308

var md = require('./src/md.js')

// or use absolute paths
app.use(serve(__dirname + '/public/'))

app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: false, // disable, set to false
  ext: 'html',
  // locals: locals,
  filters: {
    md: function(str){
      console.log(str)
      return md.render(str)
    }
  },
  // tags: tags,
  // extensions: extensions
})


app.use(function *() {
  yield this.render('index',{
    title: '# xxx',
    content: 'sfaf $2^2$ '
  })
})

app.listen(port)
console.log('listening on port 3008')