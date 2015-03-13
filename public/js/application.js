$(document).ready(function() {


// User homepage
  $('button.my_poms').on('click', function(event){
    //console.log(event);
    var correctUrl = '/' + $(this).attr('formaction') + '/tasks';
    event.preventDefault();
    $.ajax({
      url: correctUrl,
      type:'get',
    }).done(function(response){
      //console.log('made it here');
      //console.log(response)
      $('.video_container').empty();
      $('.poms_list').empty();
      $('.poms_list').append(response);
      $('.poms_list').show();
      $('.pom_input_fields').hide();
      $('.timer').hide();



      $('.signin').hide();
      // $('.welcome').hide();
    }).fail(function(){
      console.log('this failed');
    });
  });

// Click button to generate new pom input fields
  $('button.new_poms').on('click', function(event){
    event.preventDefault();
    $('.timer').hide();
    $('.timer').empty();

    $('.break_timer').hide();
    $('.break_timer').empty();

    $('.video_container').hide();
    $('.video_container').empty();


    if ( $('.pom_create').length === 1) {
      $('.pom_input_fields input').each(function(index){
        if (index !== 4){
          this.value = '' ;
        }
      });
      $('.pom_input_fields').show();
      $('.poms_list').hide();
      $('.timer').hide();


    }
    else {
      var correctUrl = '/' + $(this).attr('formaction') + '/task/new'
      var inputData = $(this).serialize();
      $.ajax({
        url: correctUrl,
        type:'get',
        data: inputData,
      }).done(function(response){
        $('.poms_list').hide();
        $('.pom_input_fields').show();
        $('.pom_input_fields').append(response);
        $('.signin').hide();
        $('.timer').hide();


        // $('.welcome').hide();
        // $('.userhome').hide();
      }).fail(function(){
        console.log('this failed');
      });

    }

  });

  // Submit input fields to create new Task

  $('.pom_input_fields').on('click',".pom_create input[type='submit']", function(event){

    event.preventDefault();
    console.log("doin it");

    var formDiv = $(event.target).closest("form[method='post']")
    var inputData = formDiv.serialize();
    console.log(inputData)

    var correctUrl = '/'+ formDiv.attr('action') + '/task/new';
    console.log(correctUrl);
    $.ajax({
      url: correctUrl,
      type:'POST',
      data: inputData,
    }).done(function(response){
      console.log(response);
      $('.poms_list').empty();
      $('.poms_list').append(response);
      $('.poms_list').show();

      $('.pom_input_fields').hide();
      // $('.poms_list').append('<p>' + '</p>');
      $('.signin').hide();
      // $('.welcome').hide();
      $('.userhome').hide();
    }).fail(function(){
      console.log('new failure');
    });

  });

// controller-style code for timer
  // var timerText = document.getElementsByClassName('timer')[0];
  // var timer = new Timer(1, timerText);
  // timerText.addEventListener('click', timer.tick.bind(timer));


});

