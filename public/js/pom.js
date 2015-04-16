// Sound/video for break
var gongSound = function(){
  var gong = new Audio("../sound/chinese-gong.mp3")
  gong.play();
}
var addVideoDiv = function(){
  $('.video_container').show();
  $('.video_container').append("<iframe width='560' height='315' src='https://www.youtube.com/embed/6HOIX_U4FNY' frameborder='0' allowfullscreen></iframe>");

}

var addBreakTimer = function(breakDuration){
  $('.break_timer').show();
  var timerElement = document.getElementsByClassName('break_timer')[0];
  var breakTimer = new Timer(breakDuration, timerElement,'break_timer');
  $('.break_timer').append('<p><button>Start your break!</button></p>')
  var startBreakButton = $('.break_timer button')[0]
  startBreakButton.addEventListener('click', breakTimer.tick.bind(breakTimer));
}

// Timer objet

var Timer = function(minutes, element, timerType, breakDuration){
  this.model = new Timer.Model(minutes, timerType, breakDuration);
  this.view = new Timer.View(element);
  this.view.render(this.model);
}

Timer.prototype.tick = function(){

  if (this.model.seconds < 0 && this.model.minutes < 0){
    return this
  }
  else {
    this.view.render(this.model.tick());
    setTimeout(this.tick.bind(this), 1000);
  }
}

Timer.Model = function(minutes, timerType, breakDuration){
  this.minutes = minutes;
  this.seconds = 0;
  this.timerType = timerType;
  this.breakDuration = breakDuration;
}

Timer.Model.prototype.tick = function(){
  if (this.seconds === 0) {
    if (this.minutes === 0 ){

      if (this.timerType === 'regular'){
        // this.seconds = '';
        // $('.video_container').empty();
        addVideoDiv();

        $('.break_timer').empty();
        addBreakTimer(this.breakDuration);
        gongSound();


        $('.timer').empty();
        $('.timer').hide();
        return;
      }
      else if(this.timerType === 'break_timer') {
        $('.break_timer').empty();
        $('.video_container').empty();
        $('.video_container').hide();
        gongSound();

        //repeat button
        return;

      }
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


var getTimer = function(pomDuration, breakDuration){
  $('.timer').empty();
  $('.timer').show();
  var timerElement = document.getElementsByClassName('timer')[0];
  var timer = new Timer(pomDuration, timerElement, 'regular', breakDuration);
  console.log(timer);
  $('.timer').append("<div class='start_timer'><button>Start!</button></div>");
  var startButton = $('.timer button')[0];

  startButton.addEventListener('click', timer.tick.bind(timer));

}

var getEditForm = function(){
  console.log($(event.target).attr('href'));
  var editRoute = '/' + $(event.target).attr('href') + '/edit';
  console.log(editRoute);
  $.ajax({
    url: editRoute,
    type: 'get',
  })
  .done(function(response){
    console.log('completed edit ajax call');
    if ($('.pom_input_fields form').length === 0){
      $('.pom_input_fields').append(response);
      $('.pom_input_fields').show();
    }
    else {

      $('.pom_input_fields').empty();
      $('.pom_input_fields').append(response);
      $('.pom_input_fields').show();
      //Need to be able to have an EDIT PARTIAL
    }
  })
  .fail(function(error){
    console.log("this ajax call to edit the pom failed");
  });
}

var deletePom = function(){
    var deleteRoute = '/' + $(event.target).attr('href') + '/delete';

    $.ajax({
      url: deleteRoute,
      type: 'DELETE',
    })
    .done(function(response){
      console.log("Nice you just deleted that item with an ajax call");
      $('.pom_input_fields').empty();
      $('.pom_input_fields').hide();

      $('.poms_list').empty();
      $('.poms_list').append(response);
      $('.poms_list').show();
    })
    .fail(function(error){
      console.log("Error deleting that item with an ajax call");

    });
}

var editPom = function(event){
  event.preventDefault();

  var formDiv = $(event.target).closest("form[method='post']")
  var inputData = formDiv.serialize();
  console.log(inputData);
  var correctUrl = '/' + formDiv.attr('action') + '/edit';

  $.ajax({
    url: correctUrl,
    data: inputData,
    type:'PUT',
  })
  .done(function(response){
    console.log('you editied the database with ajax call');
    $('.pom_input_fields').empty();
    $('.pom_input_fields').hide();

    $('.poms_list').empty();
    $('.poms_list').append(response);
    $('.poms_list').show();
  })
  .fail(function(error){
    console.log('ajax edit failed')
  });
}


$(document).ready(function() {

  $('.poms_list').on('click','a', function(event){

    event.preventDefault();

    var pomToBeAltered = $(event.target).closest('.single_pom');
    var pomDuration = parseInt($(event.target).closest('.single_pom').find('.pom_duration').text());
    var breakDuration = parseInt($(event.target).closest('.single_pom').find('.break_duration').text());
    $('.poms_list').hide();


    if ($(event.target).hasClass('start_pom')){
      getTimer(breakDuration);
    }
    else if($(event.target).hasClass('edit')){
      getEditForm();
    }
    else if($(event.target).hasClass('delete')){
      deletePom();
    }
  });


  $('.pom_input_fields').on('click',".pom_edit input[type='submit']", editPom);

});
