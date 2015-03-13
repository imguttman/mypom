$(document).ready(function(){

  var Timer = function(minutes, element){
    this.model = new Timer.Model(minutes);
    this.view = new Timer.View(element);
    this.view.render(this.model);
  }

  Timer.prototype.tick = function(){
    this.view.render(this.model.tick());
    setTimeout(this.tick.bind(this), 1000);
  }

  Timer.Model = function(minutes){
    this.minutes = minutes;
    this.seconds = 0;
  }

  Timer.Model.prototype.tick = function(){
    if (this.seconds === 0) {
      if (this.minutes === 0 ){
        return this;
      }
      else {
        this.minutes-= 1;
        this.seconds = 59;
      }
    }
    else {
      this.seconds-= 1;
    }
    return this
  }

  Timer.View = function(element){
    this.element = element;
  }

  Timer.View.prototype.render = function(model){
    var secs = (model.seconds < 10) ? ('0' + model.seconds) : model.seconds;
    this.element.innerHTML = model.minutes + ":" + secs
  }
});




