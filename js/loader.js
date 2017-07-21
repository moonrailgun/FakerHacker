$(function() {
  i18next.init({
    lng: 'zh_CN',
    debug: false,
    resources: {
      en: {
        translation: {
          "key": "hello world"
        }
      },
      zh_CN: {
        translation: zh_CN
      }
    }
  }, function(err, t) {
    // init set content
    updateContent();
  });

  function updateContent() {
    // document.getElementById('output').innerHTML = i18next.t('key');
  }

  i18next.on('languageChanged', function() {
    updateContent();
  });

  var analyzeSegment = function(segment) {
    if(typeof segment == 'string') {
      return {
        content: i18next.t(segment),
        timer: Math.random()*500
      }
    }else if (typeof segment == 'object') {
      var res = Object.assign({}, {content: i18next.t(segment.name)}, segment);
      if(!res.timer) {
        res.timer = Math.random()*500
      }

      return res;
    }
  }

  var execAddon = function(addonSetting, ele, cb) {
    var name = addonSetting.name;
    if(!!name && !!addons[name] && typeof addons[name] == 'function') {
      addons[name].call(ele, addonSetting, cb);
    }else {
      console.warn("执行拓展失败:" + JSON.stringify(addonSetting));
      cb();
    }
  }

  var list = [];
  // 加载数据
  for (var blockName in paragraph) {
    if (paragraph.hasOwnProperty(blockName)) {
      var block = paragraph[blockName];
      if($.isArray(block)){
        for (var i = 0; i < block.length; i++) {
          list.push(analyzeSegment(block[i]));
        }
      }else {
        list.push(analyzeSegment(block));
      }
    }
  }

  console.log(list);

  var index = 0;
  var addConsoleLog = function () {
    if(list.length <= index) {
      index = 0;
    }
    currentSegment = list[index];
    var $ele = $('<p>'+ currentSegment.content +'</p>').appendTo('#log');
    index++;
    $('body').scrollTop($('body')[0].scrollHeight);
    if(!!currentSegment.addons) {
      var addonIndex = 0;
      var addonSetting = currentSegment.addons[addonIndex];
      var execAddonCb = function() {
        if(currentSegment.addons.length>addonIndex) {
          addonIndex++;
          addonSetting = currentSegment.addons[addonIndex];
          if(!!addonSetting) {
            execAddon(addonSetting, $ele, execAddonCb);
          } else {
            setTimeout(addConsoleLog, currentSegment.timer);
          }
        } else if (!!currentSegment.timer) {
          setTimeout(addConsoleLog, currentSegment.timer);
        }
      }
      execAddon(addonSetting, $ele, execAddonCb);
    }else{
      if(!!currentSegment.timer) {
        setTimeout(addConsoleLog, currentSegment.timer);
      }
    }
  }
  addConsoleLog();
});
