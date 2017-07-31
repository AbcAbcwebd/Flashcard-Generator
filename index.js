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
        console.log(newCard.partialText);
        allFlashcards.push(newCard);
        if (answers.additionalQuestion){
            addClozeFlashcard();
        } else {

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