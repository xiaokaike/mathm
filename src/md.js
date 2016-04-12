'use strict';

var katex = require('katex')
var md = require('markdown-it')()

/*
  change to Katex for math rendering
 */
md.use(require('markdown-it-math'), {
  inlineOpen: '$',
  inlineClose: '$',
  blockOpen: '$$',
  blockClose: '$$',
  inlineRenderer: function (str) {
    try {
      return '<span class="math inline">' + katex.renderToString (str) + '</span>';
    } catch (e) {
      return '<span class="math inline">' + e + '</span>';
    }
  },
  blockRenderer: function (str) {
    try {
      return '<span class="math block">' + katex.renderToString (str) + '</span>';
    } catch (e) {
      return '<span class="math block">' + e + '</span>';
    }
  }
});




md.renderer.rules.image = function(tokens, idx, options, env, self){
  
  var token = tokens[idx]

  var src = token.attrs[0][1]
  var exp = src.match(/#(.*)/)
  var styl = 'float: $;'
  exp = exp[1] ? exp[1] : null

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