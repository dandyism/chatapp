var socket = io.connect();
var chat = new Chat(socket);

var appendMessage = function(data) {
  var div = $('<div>').text(data.username + ": " + data.message);
  $('.chatbox').append(div);
}

$(document).ready(function(){
  socket.on('serverMessage', function(data){
    appendMessage(data);
  });

  $('body').on('submit', 'form.chatinput', function(event) {
    event.preventDefault();
    
    var message = $(this).find('input').val();
    $(this).find('input').val("");
    chat.sendMessage(message);
  });
})



