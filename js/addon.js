var addons = {
  process: function(settings, cb) {
    var ele = this;
    var pointNum = settings.number || 50;
    var timer = settings.timer || 2000;
    var interval = settings.timer / pointNum;
    var addPoint = function() {
      if(pointNum <= 0) {
        return;
      }
      ele.append('.');
      pointNum--;
      setTimeout(addPoint, interval)
    };
    addPoint();
    setTimeout(cb, timer);
  }
}
