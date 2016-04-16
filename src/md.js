'use strict';

var katex = require('katex')
var mk = require('./md-it-katex.js')
var md = require('markdown-it')({
  html: true
})


// md.use(mk)

/*
  change to Katex for math rendering
 */
md.use(require('markdown-it-math'), {
  inlineOpen: '$',
  inlineClose: '$',
  blockOpen: '$$',
  blockClose: '$$',
  inlineRenderer: function (str) {
    var strHtml = str
    var tpl = '<span class="math inline latex-error" data-latex="$data$">$latex$</span>'

    try {
      strHtml = renderLatex(str)
      tpl = tpl.replace('error', '')
    } catch (e) {
      // console.log('[----]', e, str)
    }

    return tpl.replace('$latex$', strHtml).replace('$data$', str)
  },
  blockRenderer: function (str) {
    var strHtml = str
    var tpl = '<span class="math block latex-error" data-latex="$data$">$latex$</span>'
    try {
      strHtml = renderLatex(str)
      tpl = tpl.replace('error', '')
    } catch (e) {
      // console.log('[----]', e, str)
    }

    return tpl.replace('$latex$', strHtml).replace('$data$', str);
  }
});


function renderLatex(latex){
  
  // 去除不标准的latex字符
  latex = latex
    .replace(/\＞/g, '>')
    .replace(/…/g, '\\ldots ')
    .replace(/\＜/g, '<')
    .replace(/≤/g, '\\le ')
    .replace(/≥/g, '\\ge ')
    .replace(/≠/g, '\\ne ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/≈/g, '\\approx ')
    .replace(/•/g, '\\cdot ')
    .replace(/π/g, '\\pi ')
    .replace(/，/g, ', ')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/△/g, '\\bigtriangleup ')
    .replace(/∠/g, '\\angle ')
    .replace(/\′/g, '\\backprime ') //TODO
    .replace(/α/g, '\\alpha ')

    .replace(/⋆/g, '\\ast ')

  return katex.renderToString(latex)
}



md.renderer.rules.image = function(tokens, idx, options, env, self){
  
  var token = tokens[idx]

  var src = ''

  if(token.attrs && token.attrs[0] && token.attrs[0][1]){
    src = token.attrs[0] && token.attrs[0][1]
  }
  var exp = src.match(/#(.*)/)
  var styl = 'float: $;'
  if(exp && exp[1]){
    exp = exp[1]
  }

  if(exp === 'right' || exp === 'left'){
    styl = styl.replace('$', exp)
    token.attrs.push(['style', styl])
  }

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    self.renderInlineAsText(token.children, options, env);

  return self.renderToken(tokens, idx, options);
}


module.exports = md 