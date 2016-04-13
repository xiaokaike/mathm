'use strict';

var Vue = require('vue')
var md = require('./md.js')
var katex = require('katex')
var ace = require('brace');
require('brace/mode/markdown');
require('brace/theme/eclipse');

window.katex = katex;

var formula = {
  'common': {
    name: '常用',
    value: [
      "{/}frac{a}{b}", "^{a}/_{b}", "a^{b}", "a_{b}", "x^{a}_{b}", "{/}bar{a}", "{/}sqrt{x}",
      "{/}sum_x^xx", "{/}sum", "{/}log_{x}", "{/}ln", "{/}int_{a}^{b}", "{/}oint_{a}^{b}", "\\left\\{_1^1\\right\\}", "^{\\frown}_{AB}"
    ]
  },
  'symbol': {
    name: '符号',
    value: [
      "+", "-", "{/}pm", "{/}times", "{/}ast", "{/}div", "/", "{/}bigtriangleup",
      "=", "{/}ne", "{/}approx", ">", "<", "{/}ge", "{/}le", "{/}infty",
      "{/}cap", "{/}cup", "{/}because", "{/}therefore", "{/}subset", "{/}supset", "{/}subseteq", "{/}supseteq",
      "{/}nsubseteq", "{/}nsupseteq", "{/}in", "{/}ni", "{/}notin", "{/}mapsto", "{/}leftarrow", "{/}rightarrow",
      "{/}Leftarrow", "{/}Rightarrow", "{/}leftrightarrow", "{/}Leftrightarrow", "∠", "º", '{/}perp', '{/}odot'
    ]
  },
  'letter': {
    name: '字母',
    value: [
      "{/}alpha", "{/}beta", "{/}gamma", "{/}delta", "{/}varepsilon", "{/}varphi", "{/}lambda", "{/}mu",
      "{/}rho", "{/}sigma", "{/}omega", "{/}Gamma", "{/}Delta", "{/}Theta", "{/}Lambda", "{/}Xi",
      "{/}Pi", "{/}Sigma", "{/}Upsilon", "{/}Phi", "{/}Psi", "{/}Omega", "{/}pi"
    ]
  }
};

var testVal = '![XXX](http://img.jyeoo.net/quiz/images/201204/4/53aae10e.png#right)如图，长方形ABCD，设其长AD=a，宽AB=b（a＞b），在BC边上选取一点E，将△ABE沿AE翻折后B至直线BD上的O点，若O为长方形ABCD的对称中心，则 $\\frac{a}{b}$ 的值是_____．'

new Vue({
  el: '#editorWrap',
  data: {
    input: '',
    formula: formula,
    initFormula: false
  },
  filters: {
    toLatexHtml: function(str){
      try {
        return '<span class="math inline">' + katex.renderToString (str) + '</span>';
      } catch (e) {
        return '<span class="math inline">' + str + '</span>';
      }
    },
    latex: function(latex){
      return latex.replace("{/}", "\\")
    }
  },
  ready: function(){
    var that = this;

    that.initFormula = true;
    this.initEditor(this.$els.editor);

    setTimeout(function(){
      that._editor.setValue(testVal)
    }, 1000);

  },
  methods:{
    onClickLatex: function(e){
      var la = e.currentTarget.dataset.value;
      la = '$' + la + '$'
      this._editor.insert(la)
    },
    initEditor: function($el){
      this._editor = ace.edit($el)
      this._editor.getSession().setMode("ace/mode/markdown")
      this._editor.setTheme('ace/theme/eclipse')
      this._editor.renderer.setShowGutter(false);
      this._editor.getSession().setUseWrapMode(true);

      // this._editor.on('focus', this.onAceFocus);
      // this._editor.on('blur', this.onAceBlur);
      // this._editor.on('copy', this.onAceCopy);
      this._editor.on('paste', this.onAcePaste);
      this._editor.on('change', this.onAceChange.bind(this));
    },
    onAceChange: function(){
      var val = this._editor.getValue();

      val = val.replace(/\_\_\_\_\_/g, '\\_\\_\\_\\_\\_');


      this.input = md.render(val)
    },
    onAcePaste: function(){

    }
  }
});