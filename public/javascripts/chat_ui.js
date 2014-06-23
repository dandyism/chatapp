var socket = io.connect();
var chat = new Chat(socket);

var messageTemplate;

var appendMessage = function(data) {
  var renderedMessage = messageTemplate({
    username: data.username,
    message: data.message
  });
  $('.chatbox').append(renderedMessage);
}

$(document).ready(function(){
  socket.on('serverMessage', function(data){
    appendMessage(data);
  });
  
  socket.on('nicknameChangeResult', function(data) {
    appendMessage({
      username: "system",
      message: data.message
    });
  });
  
  $('body').on('submit', 'form.chatinput', function(event) {
    event.preventDefault();
    
    var message = $(this).find('input').val();
    $(this).find('input').val("");
    if (message[0] == '/') {
      var command = message.split(' ')[0];
      var args = message.slice(command.length);
      chat.processCommand(command, args);
    } else {
      chat.sendMessage(message);
    }
    
  });
  
  messageTemplate = _.template($('#chat-message-template').html());
})



