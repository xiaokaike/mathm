
var _ = require('lodash')
var fs = require('fs')
var os = require('os')
var path = require('path')
var koa = require('koa')
var request = require('koa-request')
var serve = require('koa-static')
var render = require('koa-swig')
var route = require('koa-route')
var koaJson = require('koa-json');
var coParse = require('co-busboy')

var md = require('./src/md.js')
var _testData = require('./data/title.js')

/**
 * start
 */

var app = koa()
var sAPI = ''
try{
  var _conf = fs.readFileSync('./_config.json', 'utf-8')
  _conf = JSON.parse(_conf)
  sAPI = _conf.sAPI
}catch(e){
  sAPI = process.env.sAPI
}

console.log(sAPI)


var port = process.env.PORT || 3008

app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 0, // disable, set to false
  ext: 'html',
  // locals: locals,
  filters: {
    md: function(str){
      return md.render(str)
    }
  },
  // tags: tags,
  // extensions: extensions
})


var pages = {
  index: function*(){
    var errorCount = 0
    var query = this.request.query;
    var page = query.page || 1
    var size = query.size || 20
    var url = sAPI.replace('{page}', page).replace('{size}', size);
        
    //Yay, HTTP requests with no callbacks! 
    var response = yield request({
      url: url,
    });

    var qsInfo = {}

    try {
      qsInfo = JSON.parse(response.body)
    } catch (e){
      console.log(e)
    }

    _.each(qsInfo.data, function(item, index){
      // console.log(index, '----------', item.title)
      item.tpl = md.render(item.title)
      if(/latex\-error/.test(item.tpl)){
        errorCount ++
      }
    })

    yield this.render('index',{
      qs: qsInfo.data,
      errorCount: errorCount
    }) 
  }
}




var upload = function *(next){
  // ignore non-POSTs
  if ('POST' != this.method) return yield next;
  console.log('xxx')
  // multipart upload
  var parts = coParse(this);
  var part;
  

  while (part = yield parts) {
    var url = '/upload/' + part.filename
    var stream = fs.createWriteStream(path.join(__dirname, '/public', url));
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }

  this.body = {
    status: 'success',
    url: url
  };
}




// or use absolute paths
app.use(koaJson())
app.use(serve(__dirname + '/public/'))
app.use(route.get('/', pages.index))
app.use(route.post('/upload', upload))


app.listen(port)
console.log('listening on port ', port)
