$(document).ready(function() {

  var gongSound = function(){
    var gong = new Audio("../sound/chinese-gong.mp3")
    gong.play();
  }

  var addVideoDiv = function(){
    // var vimeoVids = []
    var videoId = "24456787";

    var apiUrl = "https://vimeo.com/api/v2/video/"+ videoId +".json"
    $('.video_container').show();

    $('.video_container').append("<iframe width='560' height='315' src='https://www.youtube.com/embed/6HOIX_U4FNY' frameborder='0' allowfullscreen></iframe>");

  }

  var addBreakTimer = function(){
    // $('.break_timer').empty();
    $('.break_timer').show();
    var timerElement = document.getElementsByClassName('break_timer')[0];
    var breakTimer = new Timer(0, timerElement,'break_timer');
    $('.break_timer').append('<p><button>Start your break!</button></p>')
    var startBreakButton = $('.break_timer button')[0]

    startBreakButton.addEventListener('click', breakTimer.tick.bind(breakTimer));
  }

  var Timer = function(minutes, element, timerType){
    this.model = new Timer.Model(minutes, timerType);
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

  Timer.Model = function(minutes, timerType){
    this.minutes = minutes;
    this.seconds = 5;
    this.timerType = timerType;
  }

  Timer.Model.prototype.tick = function(){
    if (this.seconds === 0) {
      if (this.minutes === 0 ){

        if (this.timerType === 'regular'){
          // this.seconds = '';
          // $('.video_container').empty();
          addVideoDiv();

          $('.break_timer').empty();
          addBreakTimer();
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

  $('.poms_list').on('click','a', function(event){

    event.preventDefault();

    var pomToBeAltered = $(event.target).closest('.single_pom');
    var pomDuration = parseInt($(event.target).closest('.single_pom').find('.pom_duration').text());
    var breakDuration = parseInt($(event.target).closest('.single_pom').find('.break_duration').text());
    $('.poms_list').hide();


    if ($(event.target).hasClass('start_pom')){
      $('.timer').empty();
      $('.timer').show();
      var timerElement = document.getElementsByClassName('timer')[0];
      var timer = new Timer(pomDuration, timerElement, 'regular');
      console.log(timer);
      $('.timer').append("<div class='start_timer'><button>Start!</button></div>")
      var startButton = $('.timer button')[0]
      startButton.addEventListener('click', timer.tick.bind(timer));



    }
    else if($(event.target).hasClass('edit')){
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
    else if($(event.target).hasClass('delete')){
      var deleteRoute = '/' + $(event.target).attr('href') + '/delete';

      $.ajax({
        url: deleteRoute,
        type: 'DELETE',
      })
      .done(function(response){
        console.log("Nice you just deleted that item");
        $('.pom_input_fields').empty();
        $('.pom_input_fields').hide();

        $('.poms_list').empty();
        $('.poms_list').append(response);
        $('.poms_list').show();
      })
      .fail(function(error){

      });

    }
  });

  $('.video_container').on('click', 'button', function(event){

    var vimeoVidUrl = $(event.target).attr('formaction');
    console.log(vimeoVidUrl);

    $.ajax({
      url: vimeoVidUrl,
      type: 'get',
      dataType:'json',
    })
    .done(function(response){
      var data = JSON.parse(response);
      console.log(data);
      // console.log(response);
      // <iframe src="//player.vimeo.com/video/VIDEO_ID" width="400" height="300" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

    })
    .fail(function(error){

    });
  })

  $('.pom_input_fields').on('click',".pom_edit input[type='submit']", function(event){

    event.preventDefault();
    console.log("editing event!");

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
      console.log('heyo you made it here and edited that shit');
      $('.pom_input_fields').empty();
      $('.pom_input_fields').hide();

      $('.poms_list').empty();
      $('.poms_list').append(response);
      $('.poms_list').show();
    })
    .fail(function(error){
      console.log('shit your edit failed')
    });
  });

});
