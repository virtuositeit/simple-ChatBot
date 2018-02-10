/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.

  var sentences = ["One of the most ", 
	           " things about graduating is that my parents are ", 
	           " a huge party! I decided to have a backyard barbecue for all my family and ",
	           ". I've invited my best friend ", 
	           ", and of course my teacher Mrs. ", 
	           ". My dad is going to ", 
	           " hamburgers on his shiny new grill, and mom is going to make her famous ", 
	           " salad. After we finish partying, we can go swimming in our new pool. ", 
	           "!"];
  var essay = [];

  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, welcome to Mad Libs! Let's create a story today."); //We start with the introduction;
  setTimeout(timedQuestion, 2000, socket,"First, can you enter an adjective?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
	essay.push(sentences[questionNum]);
	essay.push(data)
        questionNum= bot(data,socket,questionNum,essay,sentences);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum,essay,sentences) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Noted!'; // output response
  waitTime = 800;
  question = 'Next, please provide a verb ending in "ing":';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Gotcha!';
  waitTime = 800;
  question = 'Now, please think of a plural noun:';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= 'Input recorded!';
  waitTime = 800;
  question = 'This time, please enter the name of a celebrity:';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= 'Nice, ' + input + ' is on the list!';
  waitTime = 800;
  question = 'Okey now, you will think of a silly word....';
  }
  else if (questionNum == 4) {
  answer= 'Haha, that was funny!';
  waitTime = 800;
  question = 'Next, will you enter another verb?';
  }
  else if (questionNum == 5) {
  answer= 'Cool!';
  waitTime = 800;
  question = 'We\'re almost there. Can you think of something alive this time? (animals, insects, plants, aliens, etc.):';
  }
  else if (questionNum == 6) {
  answer= 'Wow! I would not have thought of that ;-)';
  waitTime = 800;
  question = 'One last request from me: I want you to enter another silly word. The sillier the better!';
  }
  else if (questionNum == 7) {
  essay.push(sentences[questionNum + 1]);
  answer= essay.join('');// output response
  waitTime =0;
  question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
