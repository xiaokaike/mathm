var Vue = require('vue')
var $ = require('jquery')
var _ = require('lodash')

var project_uploads_path = '/upload';
var imageFieldName = 'upfile';

Array.prototype.first = function() {
  return this[0];
}

Array.prototype.last = function() {
  return this[this.length-1];
}

new Vue({
  el: '#app',
  data: {
    text: '',
    imageUrl: '',
  },
  filters: {
    md: {
      read: function(val) {
        return val
      },
      // view -> model
      // formats the value when writing to the data.
      write: function(src) {
        if(!src){
          return ''
        }
        return '![image]($src)'.replace('$src', src)
      }
    }
  },
  ready: function(){

  },
  methods:{
    handlePaste: function(event){
      var that = this;
      var filename, image, pasteEvent, text;
      pasteEvent = event;

      if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
        image = isImage(pasteEvent);
        if (image) {
          event.preventDefault();
          filename = getFilename(pasteEvent) || 'image-' + Date.now() + '.png';
          text = "{{" + filename + "}}";
          return uploadFile(image.getAsFile(), filename, function(data){
            console.log(data);
            that.uploadComplete(data);
          });
        }
      }
    },
    handleDrag: function(e){
      var that = this;  

      //获取文件列表
      var fileList = e.dataTransfer.files;
      var img = document.createElement('img');
      var hasImg = false;

      _.each(fileList, function(f, i) {
        if (/^image/.test(f.type)) {
          //创建图片的base64

          var xhr = new XMLHttpRequest();
          xhr.open("post", project_uploads_path + "?type=ajax", true);
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

          //模拟数据
          var fd = new FormData();
          fd.append(imageFieldName, f);

          xhr.send(fd);
          xhr.addEventListener('load', function(e) {
            var r = e.target.response;
            var json;
            that.uploadComplete(JSON.parse(r));
            if (i === fileList.length - 1) {
              img.remove();
            }
          });
          hasImg = true;
        }
      });

      if (hasImg) {
        e.preventDefault();
      }
    },
    handleDragover: function(e){
      e.preventDefault();
    },
    uploadComplete: function(data){

      this.imageUrl = data.url
      this.text = '![image]($src)'.replace('$src', data.url) 
    }
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

function uploadFile(item, filename, callback) {
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
      callback(e)
      return;
    },
    error: function(response) {
      return console.log(response);
    },
    complete: function() {
      
    }
  });
}