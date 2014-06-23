var socket = io.connect();
var chat = new Chat(socket);

var messageTemplate;

var appendMessage = function(data) {
  var rendered = messageTemplate({
    username: data.username,
    message: data.message
  });
  $('.chatbox').append(rendered);
}

var appendNotification = function (data) {
  var rendered = notificationTemplate({
    message: data
  });
  
  $('.chatbox').append(rendered);
}


$(document).ready(function(){
  socket.on('serverMessage', function(data){
    appendMessage(data);
  });
  
  socket.on('nicknameChangeResult', function(data) {
    if (!data.success) {
      appendNotification(data.message);
    }
  });
  
  socket.on('notification', function(data) {
    appendNotification(data);
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
  notificationTemplate = _.template($('#chat-notification-template').html());
});



