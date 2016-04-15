var Vue = require('vue')
var $ = require('jquery')


var project_uploads_path = '/upload';


Array.prototype.first = function() {
  return this[0];
}

Array.prototype.last = function() {
  return this[this.length-1];
}

new Vue({
  el: '#app',
  data: {
  },
  filters: {
    
  },
  ready: function(){


  },
  methods:{
    handlePaste: function(event){
      var filename, image, pasteEvent, text;
      pasteEvent = event;

      if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
        image = isImage(pasteEvent);
        if (image) {
          event.preventDefault();
          filename = getFilename(pasteEvent) || "image.png";
          text = "{{" + filename + "}}";
          return uploadFile(image.getAsFile(), filename);
        }
      }
    },
    
  }
});


function isImage(data) {
  var i, item;
  i = 0;
  while (i < data.clipboardData.items.length) {
    item = data.clipboardData.items[i];
    if (item.type.indexOf("image") !== -1) {
      return item;
    }
    i++;
  }
  return false;
}


function getFilename(e) {
  var value;
  if (window.clipboardData && window.clipboardData.getData) {
    value = window.clipboardData.getData("Text");
  } else if (e.clipboardData && e.clipboardData.getData) {
    value = e.clipboardData.getData("text/plain");
  }
  value = value.split("\r");
  return value.first();
}

function uploadFile(item, filename) {
  var formData = new FormData();
  formData.append("file", item, filename);
  
  console.log(formData)

  return $.ajax({
    url: project_uploads_path,
    type: "POST",
    data: formData,
    dataType: "json",
    processData: false,
    contentType: false,
    headers: {
      "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")
    },
    beforeSend: function() {
      return console.log('beforeSend');
    },
    success: function(e, textStatus, response) {
      return console.log(e, textStatus, response);
    },
    error: function(response) {
      return showError(response.responseJSON.message);
    },
    complete: function() {
      return closeSpinner();
    }
  });
}