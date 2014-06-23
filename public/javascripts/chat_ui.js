var socket = io.connect();

var appendMessage = function(message) {
  $('.chatbox').append(message);
}

$(document).ready(function(){
  socket.on('serverMessage', function(data){
    appendMessage(data);
  });
})



