var socket = io.connect();
var chat = new Chat(socket);

var appendMessage = function(message) {
  $('.chatbox').append(message);
}

$(document).ready(function(){
  socket.on('serverMessage', function(data){
    appendMessage(data);
  });

  $('body').on('submit', 'form.chatinput', function(event) {
    event.preventDefault();
    
    var message = $(this).find('input[name="message"]').val();
    
    chat.sendMessage(message);
  });
})



