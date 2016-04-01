new Vue({
  el: '#editor',
  data: {
    input: ''
  },
  filters: {
    marked: function(s){
    	var markdown = marked(s);
    	return markdown;
    }
  },
  watch: {
  	input: function(){
  		this.udpateMath();
  	}
  },
  ready: function(){
  	var that = this;
  	
  	setTimeout(function(){
  		that.input = '![神算子](http://img.jyeoo.net/quiz/images/201204/4/53aae10e.png#right)如图，长方形ABCD，设其长AD=a，宽AB=b（a＞b），在BC边上选取一点E，将△ABE沿AE翻折后B至直线BD上的O点，若O为长方形ABCD的对称中心，则$\\frac{a}{b}$的值是_____．'
  	}, 1000);
  	
  },
  methods:{
  	udpateMath: function(){
  		MathJax.Hub.Queue(
  			['resetEquationNumbers', MathJax.InputJax.TeX], 
  			['Typeset', MathJax.Hub, this.$els.output]
  		);
  	}
  }
});