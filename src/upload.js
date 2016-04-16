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
    isFocus: false,
    isDrogover: false
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
    handleTPaste: function(event){
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
    handleTFocus: function(e){
      this.isFocus = true
    },
    handleTBlur: function(e){
      this.isFocus = false
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
        this.isDrogover = false
        e.preventDefault()
      }
    },
    handleDragover: function(e){
      this.isDrogover = true
      e.preventDefault()
    },
    handleDragend: function(e){
      this.isDrogover = false
      e.preventDefault()
    },
    uploadComplete: function(data){

      this.imageUrl = data.url
      this.text = '![image]($src)'.replace('$src', data.url) 
    },
    fileInputClick: function(e){
      console.log('fileInputClick', e)
    },
    fileInputChange: function(e){
      var myFiles = e.target.files
      console.log('fileInputChange', e)
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


function _handleUpload(file) {
  this.$dispatch('beforeFileUpload', file);
  var form = new FormData();
  var xhr = new XMLHttpRequest();
  try {
    form.append('Content-Type', file.type || 'application/octet-stream');
    // our request will have the file in the ['file'] key
    form.append('file', file);
  } catch (err) {
    this.$dispatch('onFileError', file, err);
    return;
  }

  return new Promise(function(resolve, reject) {

    xhr.upload.addEventListener('progress', this._onProgress, false);

    xhr.onreadystatechange = function() {
      if (xhr.readyState < 4) {
        return;
      }
      if (xhr.status < 400) {
        var res = JSON.parse(xhr.responseText);
        this.$dispatch('onFileUpload', file, res);
        resolve(file);
      } else {
        var err = JSON.parse(xhr.responseText);
        err.status = xhr.status;
        err.statusText = xhr.statusText;
        this.$dispatch('onFileError', file, err);
        reject(err);
      }
    }.bind(this);

    xhr.onerror = function() {
      var err = JSON.parse(xhr.responseText);
      err.status = xhr.status;
      err.statusText = xhr.statusText;
      this.$dispatch('onFileError', file, err);
      reject(err);
    }.bind(this);

    xhr.open('POST', this.action, true);
    if (this.headers) {
      for(var header in this.headers) {
        xhr.setRequestHeader(header, this.headers[header]);
      }
    }
    xhr.send(form);
    this.$dispatch('afterFileUpload', file);
  }.bind(this));
},