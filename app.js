var quizType;
var questionCount = 0;

function generateBasicQuestionInput(){
	var basicQuestionInput = $('<div>').attr('class', 'basic-question-input-element');
	var frontLabel = $('<p>').text("Front: ").css('font-size', '18px');
	var frontInput = $('<input>').attr('class', 'front-input');
	var backLabel = $('<p>').text("Back: ").css('font-size', '18px');
	var backInput = $('<input>').attr('class', 'back-input');
	basicQuestionInput.append(frontLabel);
	basicQuestionInput.append(frontInput);
	basicQuestionInput.append(backLabel);
	basicQuestionInput.append(backInput);
	return basicQuestionInput;
};

function generateClozeQuestionInput(){
	var clozeQuestionInput = $('<div>').attr('class', 'cloze-question-input-element');
	var fullTextLabel = $('<p>').text("Full text: ").css('font-size', '18px');
	var fullTextInput = $('<input>').attr('class', 'full-text-input');
	var hiddenPhraseLabel = $('<p>').text("Phrase to hide: ").css('font-size', '18px');
	var hiddenPhraseInput = $('<input>').attr('class', 'hidden-phrase-input');
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

$( document ).ready(function() {
    $(".quiz-type-btn").click(function() {
    	quizType = $(this).data('selector');
    	takeQuizInput();
    });

    $("body").on("click", "#add-question-btn", function(){
	    addQuestionInput();
	});

	$("body").on("click", "#save-btn", function(){
	    if (quizType === "standard"){
			$('.basic-question-input-element').each(function( index ) {
			  console.log($('.basic-question-input-element')[index].find('p'));
			});;
		} else if (quizType === "cloze") {
			$('#question-input-holder').append(generateClozeQuestionInput());
		};
	});
});