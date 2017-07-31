// Eventually this app could use Express to interact with a front end (see index.html and app.js).
// This functionality is not yet operational, however, due to issues with getting the front end and backend to interact with each other. 
// GitHub Pages may be part of the issue here since they don't seem to support backend. 
// I deployed a version to Google Cloud App Engine, but kept getting 502 errors and decided to focus on getting the core Node.js part up and running. 
var express = require('express');
var app = express();

app.get('/testA', function(req,res){
    console.log(req);
    res.status(200).send("Directory accessed");
});

// Linking to custom modules
var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

// Functionality for interacting with the application via the command line: 
var inquirer = require('inquirer');
var quizType;
var allFlashcards = [];
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
            console.log("Error: Phrase not found in sentence.");
            console.log("Please re-add flash card.");
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