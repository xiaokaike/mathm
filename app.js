var serve = require('koa-static')
var koa = require('koa')
var _ = require('lodash')
var render = require('koa-swig')
var app = koa()
var path = require('path')
var _testData = require('./data/title.js')
// var request = require('request');

var request = require('koa-request');



var port = process.env.PORT || 3008

var md = require('./src/md.js')

// or use absolute paths
app.use(serve(__dirname + '/public/'))

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


var sszAPI = '';


app.use(function *() {
  var errorCount = 0
  var query = this.request.query;
  var page = query.page || 1
  var size = query.size || 20
  var url = sszAPI.replace('{page}', page).replace('{size}', size);
      
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

})



app.listen(port)
console.log('listening on port ', port)
