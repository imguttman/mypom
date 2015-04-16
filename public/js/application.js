
var displayUserPoms = function(event){
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
  }).fail(function(){
    console.log('this failed');
  });
}

var getNewPomForm = function(event){

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

    }).fail(function(){
      console.log('getting new pom forms failed');
    });
  }
}

var generatePom = function(event){
  event.preventDefault();

  var formDiv = $(event.target).closest("form[method='post']")
  var inputData = formDiv.serialize();

  var correctUrl = '/'+ formDiv.attr('action') + '/task/new';
  $.ajax({
    url: correctUrl,
    type:'POST',
    data: inputData,
  }).done(function(response){
    $('.poms_list').empty();
    $('.poms_list').append(response);
    $('.poms_list').show();
    $('.pom_input_fields').hide();
    $('.signin').hide();
    $('.userhome').hide();
  }).fail(function(){
    console.log('failure generating pom');
  });

}
$(document).ready(function() {

// Ajax for Login

// Ajax for Register/login


// User homepage
  $('button.my_poms').on('click', displayUserPoms);
// Click button to generate new pom input fields
  $('button.new_poms').on('click', getNewPomForm);
  // Submit input fields to create new Task
  $('.pom_input_fields').on('click',".pom_create input[type='submit']", generatePom);
});

