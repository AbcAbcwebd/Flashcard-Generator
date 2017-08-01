// This file holds client side JavaScript.

var quizType;
var questionCount = 0;
var currentQuestion = 0;
var questionsArray = [];
var correctCount = 0;

function generateBasicQuestionInput(){
	var basicQuestionInput = $('<div>').attr('class', 'basic-question-input-element');
	var frontLabel = $('<p>').text("Front: ").css('font-size', '18px');
	var frontInput = $('<input>').attr('class', 'front-input').attr('id', 'front-input-' + questionCount);
	var backLabel = $('<p>').text("Back: ").css('font-size', '18px');
	var backInput = $('<input>').attr('class', 'back-input').attr('id', 'back-input-' + questionCount);
	basicQuestionInput.append(frontLabel);
	basicQuestionInput.append(frontInput);
	basicQuestionInput.append(backLabel);
	basicQuestionInput.append(backInput);
	return basicQuestionInput;
};

function generateClozeQuestionInput(){
	var clozeQuestionInput = $('<div>').attr('class', 'cloze-question-input-element');
	var fullTextLabel = $('<p>').text("Full text: ").css('font-size', '18px');
	var fullTextInput = $('<input>').attr('class', 'full-text-input').attr('id', 'full-text-input-' + questionCount);
	var hiddenPhraseLabel = $('<p>').text("Phrase to hide: ").css('font-size', '18px');
	var hiddenPhraseInput = $('<input>').attr('class', 'hidden-phrase-input').attr('id', 'hidden-phrase-input-' + questionCount);
	clozeQuestionInput.append(fullTextLabel);
	clozeQuestionInput.append(fullTextInput);
	clozeQuestionInput.append(hiddenPhraseLabel);
	clozeQuestionInput.append(hiddenPhraseInput);
	return clozeQuestionInput;
};

function addQuestionInput(){
	if (quizType === "standard"){
		$('#question-input-holder').append(generateBasicQuestionInput());
	} else if (quizType === "cloze") {
		$('#question-input-holder').append(generateClozeQuestionInput());
	};
	questionCount++;
};

function takeQuizInput(){
	$('#display-holder').empty();
	var instructions = $('<p>').text("Please add your quiz questions.");
	var questionInputDiv = $('<div>').attr('id', 'question-input-holder');
	var addQuestionButton = $('<button>').attr('id', 'add-question-btn').text('Add Flash Card');
	var saveButton = $('<button>').attr('id', 'save-btn').text('Save');
	$('#display-holder').append(instructions);
	$('#display-holder').append(questionInputDiv);
	$('#display-holder').append(addQuestionButton);
	$('#display-holder').append(saveButton);

	addQuestionInput();
};

function sendToServer(questionObj){
	$.getScript( "/socket.io/socket.io.js" ).done(function() {
//		var socket = io.connect('http://localhost:8080');
		var socket = io.connect('https://flash-card-app-175414.appspot.com/');
		socket.emit('question_obj', questionObj);
	});
};

$( document ).ready(function() {
    $(".quiz-type-btn").click(function() {
    	quizType = $(this).data('selector');
    	takeQuizInput();
    });

    $("body").on("click", "#add-question-btn", function(){
	    addQuestionInput();
	});

    // When the save button is clicked, the client side javascript loops through the submited questions and sends each to the server. 
    // When all questions have been submited, the client side sends the code "Complete*89" to let the server know that the transmission is complete. 
    // The random numbers are added to the end to decrease the liklihood that a user will accidently just use to word 'complete' on a flashcard. 
	$("body").on("click", "#save-btn", function(){
		if (quizType === "standard"){
		    for (var i = 0; i < questionCount; i++){
		    	var localFrontValue = $('#front-input-' + i)[0].value;
		 		var localBackValue = $('#back-input-' + i)[0].value;
		 		var standardObj = {
		 			type: "standard",
		 			prompt: localFrontValue,
		 			answer: localBackValue
		 		};
		 		sendToServer(standardObj);
		    };
		    sendToServer("Complete*89");
		} else if (quizType === "cloze") {
			for (var x = 0; x < questionCount; x++){
				var localFullTextValue = $('#full-text-input-' + x)[0].value;
				var localHiddenPhraseValue = $('#hidden-phrase-input-' + x)[0].value;
				var clozeObj = {
		 			type: "cloze",
		 			prompt: localFullTextValue,
		 			answer: localHiddenPhraseValue
		 		};
		 		sendToServer(clozeObj);
			};
			sendToServer("Complete*89");
		};
	});

	$("body").on("click", "#next-btn", function(){
		var localAnswer = $('#answer-input')[0].value;
		$('#display-holder').empty();
		if ((quizType === "standard" && localAnswer === questionsArray[currentQuestion].back) || (quizType === "cloze" && localAnswer === questionsArray[currentQuestion].cloze)){
			$('#display-holder').append("<p>That's correct!</p>");
			correctCount++;
			currentQuestion++;
			setTimeout(runQuestion, 2000);
		} else if (quizType === "standard"){
			$('#display-holder').append("<p>Sorry, the correct answer was " + questionsArray[currentQuestion].back + "</p>");
			currentQuestion++;
			setTimeout(runQuestion, 3000);
		} else if (quizType === "cloze") {
			$('#display-holder').append("<p>Sorry, the correct answer was:</p><br><p>" + questionsArray[currentQuestion].fullText + "</p>");
			currentQuestion++;
			setTimeout(runQuestion, 3000);
		};
	});
});

function endGame(){
	$('#display-holder').empty();
	$('#display-holder').append("<p>Thanks for playing!</p><br><p>You got " + correctCount + " of " + questionsArray.length + " correct.</p>");
};

function runQuestion(){
	if (currentQuestion >= questionsArray.length){
		endGame();
		return;
	};
	$('#display-holder').empty();
	var displayPrompt;
	if (quizType === "standard"){
		displayPrompt = $('<p>').text(questionsArray[currentQuestion].front);	
	} else if (quizType === "cloze"){
		displayPrompt = $('<p>').text(questionsArray[currentQuestion].partialText);
	};
	var answerInput = $('<input>').attr('id', 'answer-input');
	var nextButton = $('<button>').text("Next").attr('id', 'next-btn');
	$('#display-holder').append(displayPrompt);
	$('#display-holder').append(answerInput);
	$('#display-holder').append(nextButton);
};

// Confirms quiz type (to prevent errors) and recieves questions array.
$.getScript( "/socket.io/socket.io.js" ).done(function() {
//		var socket = io.connect('http://localhost:8080');
		var socket = io.connect('https://flash-card-app-175414.appspot.com/');
	    socket.on('question-array', function(quizArray){
	    	questionsArray = quizArray; 
	    	runQuestion(); 	
	    });
});