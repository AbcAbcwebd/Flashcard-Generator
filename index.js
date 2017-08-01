// Hosted version assumes only one user at a time. 
// Since socket.io is not differentiating between users, things will get weird if multiple users are using the site at the same time. 

var express = require('express');
var app = express();

var http = require('http').Server(app);
app.use(express.static('public'))
var io = require('socket.io')(http);

// Linking to custom modules
var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

var quizType;
var allFlashcards = [];

app.get('/index.html', function(req,res){
    console.log(req);
//    res.sendFile("./public/index.html");
    res.sendFile('public/index.html', { root: __dirname });
    res.sendFile('app.js', { root: __dirname });
});

function returnQuiz(){
    io.emit('question-array', allFlashcards);
};

io.on('connection', function(socket){
  socket.on('question_obj', function(msg){
    if (msg === "Complete*89"){
        returnQuiz();
    } else {
        if (msg.type === "standard"){
            var newCard = new BasicCard(msg.prompt, msg.answer);
            allFlashcards.push(newCard);
        } else if (msg.type === "cloze"){
            var newCard = new ClozeCard(msg.prompt, msg.answer);
            newCard.findPartialText();
            if (newCard.partialText.indexOf("_________") >= 0){
                allFlashcards.push(newCard);
            };
        };
    };
  });

  // So that new user doesn't end up with old user's questions.
  socket.on('disconnect', function() {
    allFlashcards = [];  
  });
});

http.listen(8080, function(){

});

// Functionality for interacting with the application via the command line: 
var inquirer = require('inquirer');
var currentQuestion = 0;
var correctCount = 0;

function displayStart(){
    console.log("*****   *****    ***    *****   *****");

    console.log("*         *     *   *   *   *     *");

    console.log("*****     *     *****   *****     *");

    console.log("    *     *    *     *  *  *      *");

    console.log("    *     *    *     *  *   *     *");

    console.log("*****     *    *     *  *   *     *");
};

function playBasicQuestion(){
    console.log("Front: " + allFlashcards[currentQuestion].front);
    inquirer.prompt([ 
       {
            type: 'input',
            name: 'basicAns',
            message: "What's on the back?"
        } 
    ]).then(function (answers) {
        if (answers.basicAns === allFlashcards[currentQuestion].back){
            console.log("Correct!");
            correctCount++;
        } else {
            console.log("Sorry, the answer was " + allFlashcards[currentQuestion].back);
        }
        currentQuestion++;
        if (currentQuestion < allFlashcards.length){
            playBasicQuestion();
        } else {
            console.log("You got " + correctCount + " out of " + allFlashcards.length + " correct");
            console.log("Thanks for playing!");
        };
    });
};

function playClozeQuestion(){
    console.log(allFlashcards[currentQuestion].partialText);
    inquirer.prompt([ 
       {
            type: 'input',
            name: 'clozeAns',
            message: "Complete the sentence."
        } 
    ]).then(function (answers) {
        if (answers.clozeAns === allFlashcards[currentQuestion].cloze){
            console.log("Correct!");
            correctCount++;
        } else {
            console.log("Sorry, the full sentence was: " + allFlashcards[currentQuestion].fullText);
        }
        currentQuestion++;
        if (currentQuestion < allFlashcards.length){
            playClozeQuestion();
        } else {
            console.log("You got " + correctCount + " out of " + allFlashcards.length + " correct");
            console.log("Thanks for playing!");
        };
    });
};

function addStandardFlashcard(){
    inquirer.prompt([ 
        {
            type: 'input',
            name: 'front',
            message: 'What do you want on the front of the flash card?'
        },
        {
            type: 'input',
            name: 'back',
            message: 'What do you want on the back of the flash card?'
        },
        {
            type: 'confirm',
            name: 'additionalQuestion',
            message: 'Do you want to add another flashcard?',
            default: 'Y'
        }
    ]).then(function (answers) {
        var newCard = new BasicCard(answers.front, answers.back);
        allFlashcards.push(newCard);
        if (answers.additionalQuestion){
            addStandardFlashcard();
        } else {
            displayStart();
            playBasicQuestion();
        };
    });
};

function addClozeFlashcard(){
    inquirer.prompt([ 
        {
            type: 'input',
            name: 'fullText',
            message: 'What do you the full text to be?'
        },
        {
            type: 'input',
            name: 'cloze',
            message: 'Which phrase to you want to obscure?'
        },
        {
            type: 'confirm',
            name: 'additionalQuestion',
            message: 'Do you want to add another flashcard?',
            default: 'Y'
        }
    ]).then(function (answers) {
        var newCard = new ClozeCard(answers.fullText, answers.cloze);
        newCard.findPartialText();
        if (newCard.partialText.indexOf("_________") < 0){
            addClozeFlashcard();
            return;
        }
        allFlashcards.push(newCard);
        if (answers.additionalQuestion){
            addClozeFlashcard();
        } else {
            displayStart();
            playClozeQuestion();
        };
    });
};

inquirer.prompt([
    {
        name: 'quizType',
        type: 'list',
        message: 'Which type of flash cards would you like?',
        choices: ['standard', 'cloze']
    }
]).then(function (answers) {
    if (answers.quizType === 'standard'){
        quizType = 'standard';
        addStandardFlashcard();
    } else if (answers.quizType === 'cloze'){
        quizType = 'cloze';
        addClozeFlashcard();
    };
});