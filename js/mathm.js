var formula = {
    'common': [
        "{/}frac{ }{ }", "^{ }/_{ }", "x^{ }", "x_{ }", "x^{ }_{ }", "{/}bar{ }", "{/}sqrt{ }", "{/}nthroot{ }{ }",
        "{/}sum_x^xx", "{/}sum", "{/}log_{ }", "{/}ln", "{/}int_{ }^{ }", "{/}oint_{ }^{ }", "\\left\\{_1^1\\right\\}", "^{\\frown}_{AB}"
    ],
    'symbol': [
        "+", "-", "{/}pm", "{/}times", "{/}ast", "{/}div", "/", "{/}bigtriangleup",
        "=", "{/}ne", "{/}approx", ">", "<", "{/}ge", "{/}le", "{/}infty",
        "{/}cap", "{/}cup", "{/}because", "{/}therefore", "{/}subset", "{/}supset", "{/}subseteq", "{/}supseteq",
        "{/}nsubseteq", "{/}nsupseteq", "{/}in", "{/}ni", "{/}notin", "{/}mapsto", "{/}leftarrow", "{/}rightarrow",
        "{/}Leftarrow", "{/}Rightarrow", "{/}leftrightarrow", "{/}Leftrightarrow", "∠", "º", '{/}perp', '{/}odot'
    ],
    'letter': [
        "{/}alpha", "{/}beta", "{/}gamma", "{/}delta", "{/}varepsilon", "{/}varphi", "{/}lambda", "{/}mu",
        "{/}rho", "{/}sigma", "{/}omega", "{/}Gamma", "{/}Delta", "{/}Theta", "{/}Lambda", "{/}Xi",
        "{/}Pi", "{/}Sigma", "{/}Upsilon", "{/}Phi", "{/}Psi", "{/}Omega", "{/}pi"
    ]
};


new Vue({
  el: '#editorWrap',
  data: {
    input: '',
    formula: formula,
    initFormula: false
  },
  filters: {
    marked: function(s){
    	var markdown = marked(s);
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
  	
  	setTimeout(function(){
  		that.input = '![XXX](http://img.jyeoo.net/quiz/images/201204/4/53aae10e.png#right)如图，长方形ABCD，设其长AD=a，宽AB=b（a＞b），在BC边上选取一点E，将△ABE沿AE翻折后B至直线BD上的O点，若O为长方形ABCD的对称中心，则$\\frac{a}{b}$的值是_____．'
  	}, 1000);
  	
    Vue.nextTick(function(){
      setTimeout(function(){
        that.udpateMath(that.$els.formula);
        that.initFormula = true;
      }, 1000);      
    })

  },
  methods:{
  	udpateMath: function($el){
  		MathJax.Hub.Queue(
  			['resetEquationNumbers', MathJax.InputJax.TeX], 
  			['Typeset', MathJax.Hub, $el]
  		);
  	},
    onClickLatex: function(e){
      this.input = this.input + e.currentTarget.dataset.value;
    }
  }
});