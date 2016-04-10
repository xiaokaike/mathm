var renderer = new marked.Renderer();

// renderer.heading = function (text, level) {
//   return text;
// };

renderer.image = function(href, title, text){
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  var exp = href.match(/#(.*)/);
  var styl = ' style="float: $;"'
  exp = exp[1] ? exp[1] : null;
  if(exp === 'right' || exp === 'left'){
    styl = styl.replace('$', exp);
    out += styl;
  }

  out += this.options.xhtml ? '/>' : '>';
  return out;
};

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

var testVal = '![XXX](http://img.jyeoo.net/quiz/images/201204/4/53aae10e.png#right)如图，长方形ABCD，设其长AD=a，宽AB=b（a＞b），在BC边上选取一点E，将△ABE沿AE翻折后B至直线BD上的O点，若O为长方形ABCD的对称中心，则$\\frac{a}{b}$的值是_____．'

new Vue({
  el: '#editorWrap',
  data: {
    input: '',
    formula: formula,
    initFormula: false
  },
  filters: {
    marked: function(s){

      s = s.replace(/\_\_\_\_\_/g, '\\_\\_\\_\\_\\_');

    	var markdown = marked(s, {
        renderer: renderer
      });
    	return markdown;
    },
    latex: function(latex){
      
      latex = latex.replace("{/}", "\\")
      return '$'+ latex +'$';

    }
  },
  watch: {
  	input: function(){
  		this.udpateMath(this.$els.output);
  	}
  },
  ready: function(){
  	var that = this;
  	
    Vue.nextTick(function(){
      setTimeout(function(){
        that.udpateMath(that.$els.formula);
        that.initFormula = true;
      }, 1000);      
    })


    this.initEditor(this.$els.editor);

    setTimeout(function(){
      that._editor.setValue(testVal)
    }, 1000);

  },
  methods:{
  	udpateMath: function($el){
  		MathJax.Hub.Queue(
  			['resetEquationNumbers', MathJax.InputJax.TeX], 
  			['Typeset', MathJax.Hub, $el]
  		);
  	},
    onClickLatex: function(e){
      var la = e.currentTarget.dataset.value;
      // this.input = this.input + la;

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

      var markdown = marked(val, {
        renderer: renderer
      });

      this.input = markdown
      // return markdown;
    },
    onAcePaste: function(){

    }
  }
});