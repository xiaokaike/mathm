new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  filters: {
    marked: function(s){
    	var markdown = marked(s);
    	
    	return markdown;
    }
  },
  watch: {
  	input: function(){
  		MathJax.Hub.Queue(
  			['resetEquationNumbers', MathJax.InputJax.TeX], 
  			['Typeset', MathJax.Hub, this.$els.output]
  		)
  	}
  },
  methods:{
  	
  }
});