var quizType;

function generateBasicQuestionInput(){
	var basicQuestionInput = $('<div>').attr('class', 'basic-question-input-element').text("Test text");
//	var frontInput = $('<input>').value('Front').attr('class', 'front-input');
//	var backInput = $('<input>').value('Back').attr('class', 'back-input');
//	basicQuestionInput.append(frontInput);
//	basicQuestionInput.append(backInput);
	return basicQuestionInput;
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

	if (quizType === "standard"){
		console.log("Standard");
		$('#question-input-holder').append(generateBasicQuestionInput());

	};

};

$( document ).ready(function() {
    $(".quiz-type-btn").click(function() {
    	quizType = $(this).data('selector');
    	takeQuizInput();
    });
});