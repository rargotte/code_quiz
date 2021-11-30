const penalization = 5;

var startButton = document.querySelector(".startButton");
var container = document.querySelector(".container");
var score = 0;
var secondsLeft = 75;
var markup = container.outerHTML;
var quizDone = false;



var quiz1 = {
    question: "Inside which HTML element do we put the JavaScript?",
    answers: {
        answer1: "1. <javascript>",
        answer2: "2. <scripting>",
        answer3: "3. <script>"
    },
    correctAnswer: "b_3",
};
var quiz2 = {
    question: "How do you call a function named 'myFunction'?",
    answers: {
        answer1: "1. myFunction()",
        answer2: "2. call function myFunction()",
        answer3: "3. call myFunction()"
    },
    correctAnswer: "b_1",
};

var quiz3 = {
    question: "How do you create a function in JavaScript?",
    answers: {
        answer1: "1. function: myfunction()",
        answer2: "2. function = myfunction()",
        answer3: "3. function myfunction()"
    },
    correctAnswer: "b_3",
};

var quiz4 = {
    question: "How to write an IF statement in JavaScript?",
    answers: {
        answer1: "1.  if i = 5",
        answer2: "2.  if (i == 5)",
        answer3: "3.  if i == 5 then"
    },
    correctAnswer: "b_2",
};

var quiz = [quiz1, quiz2, quiz3, quiz4];

function initializeVar() {
    secondsLeft = 75;
    score = 0;
    container = document.querySelector(".container");
    quizDone = false;
};


//Function to clean up the screen.
function cleanupScreen() {
    container.innerHTML = '';
};

//Function to start the timer
function startTimer() {

    //Create the element for the timer
    var timerElement = document.createElement("div");
    timerElement.textContent = "TIME: " + secondsLeft;
    timerElement.setAttribute("class", "timer");
    container.prepend(timerElement);
    var timerInterval = setInterval(function () {
        secondsLeft--;
        if (secondsLeft < 0) { secondsLeft = 0 }
        timerElement.textContent = "TIME: " + secondsLeft;
        timerElement.setAttribute("class", "timer");
       

        if (secondsLeft === 0 || quizDone ) {
            //Stops execution of action 
            clearInterval(timerInterval);
            //Calls function to end quiz
            endQuiz();
        }
    }, 1000)
}
function showMessage(string) {
    var inactiveMessage = document.getElementsByName("resultMessage");
    for (var i = 0; i < inactiveMessage.length; i++) {
        inactiveMessage[i].innerHTML = '';
        inactiveMessage[i].outerHTML = '';
    }
    var lineElement = document.createElement("hr");
    var messageResult = document.createElement("h2");
    var messageText = document.createTextNode(string);
    lineElement.setAttribute("style", "margin-left: 16%");
    lineElement.setAttribute("name", "resultMessage");
    messageResult.setAttribute("id", "resultMessage");
    messageResult.appendChild(messageText);
    lineElement.append(messageResult);
    container.appendChild(lineElement);
}

function showNextQuestion(active) {
    var allQuestionsAndAnswers = document.querySelectorAll('[data-id]');
    nextQuestion = 1 + parseInt(active, 10);
    if (nextQuestion < quiz.length) {
        //Change status hide / show
        for (var i = 0; i < allQuestionsAndAnswers.length; i++) {
            if (allQuestionsAndAnswers[i].getAttribute("data-id") == active) {
                //Hide active active question
                if (allQuestionsAndAnswers[i].getAttribute("class") == "showQuestion") {
                    allQuestionsAndAnswers[i].setAttribute("class", "hideQuestion");
                    //Hide active buttons (answers)
                } else if (allQuestionsAndAnswers[i].getAttribute("class") == "showButton") {
                    allQuestionsAndAnswers[i].setAttribute("class", "hideButton");
                }
            } else { //Show next Q&A..

                if (allQuestionsAndAnswers[i].getAttribute("data-id") == nextQuestion) {
                    if (allQuestionsAndAnswers[i].getAttribute("class") == "hideQuestion") {
                        allQuestionsAndAnswers[i].setAttribute("class", "showQuestion");
                    } else if (allQuestionsAndAnswers[i].getAttribute("class") == "hideButton") {
                        allQuestionsAndAnswers[i].setAttribute("class", "showButton");
                    }
                }
            }
        }
    } else {
        quizDone = true;
    }
}

function handleUserAnswer(userEvent) {
    var userInput = userEvent.target;

    if (userInput.id === "Back") {

        resetQuiz();

    } else if (userInput.id === "Clear") {

        clearScores();

    } else {

        var rightAnswer = quiz[userInput.getAttribute("data-id")].correctAnswer;

        if (userInput.id === rightAnswer) {
            score = score + 5;
            showMessage("Correct!");
        } else {
            secondsLeft = secondsLeft - penalization;
            showMessage("Wrong!");
        }
        showNextQuestion(userInput.dataset.id);
    }
}



//Function to get user input
function getUserAnswers(listClass) {
    var buttonLists = document.getElementsByClassName(listClass);
    //Create the event listener to all buttonList groups
    for (var i = 0; i < buttonLists.length; i++) {

        buttonLists[i].addEventListener("click", function (event) {
            event.preventDefault();
            var isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return
            } else {
                handleUserAnswer(event);
            }
        })
    }
}





function renderQuestion() {
    //Create the element for the question

    var questionText = "";
    container = document.querySelector(".container");

    for (var i = 0; i < quiz.length; i++) {
        var questionElement = document.createElement("h2");
        questionText = document.createTextNode(quiz[i].question);
        questionElement.appendChild(questionText);
        //Showing only the first question. Others are hidden
        if (i == 0) {
            questionElement.setAttribute("class", "showQuestion");
        } else {
            questionElement.setAttribute("class", "hideQuestion");
        }
        questionElement.setAttribute("data-id", i);
        console.log(container);
        container.appendChild(questionElement);

        //Create the list of buttons for possible answers
        answersObj = quiz[i].answers;
        j = 0. // counter of possible answers
        groupElement = document.createElement("group");
        groupElement.setAttribute("class", "buttonList");
        groupElement.setAttribute("data-id", i);
        for (var property in answersObj) {
            buttonElement = document.createElement("button");
            buttonText = document.createTextNode(`${answersObj[property]}`)
            j = j + 1;
            buttonElement.setAttribute("ID", "b_" + j);
            //Showing only answers of first question. Others are hidden.
            if (i == 0) {
                buttonElement.setAttribute("class", "showButton");
            } else {
                buttonElement.setAttribute("class", "hideButton");
            }
            buttonElement.setAttribute("data-id", i);
            buttonText = document.createTextNode(`${answersObj[property]}`)
            buttonElement.appendChild(buttonText);
            groupElement.appendChild(buttonElement);

        }

        container.appendChild(groupElement);
    }

}

function deleteQuestionsandAnswers() {
    var eraseQuestions = document.querySelectorAll('[data-id]');
    for (var i = 0; i < eraseQuestions.length; i++) {
        eraseQuestions[i].remove();
    }
}
//Displaying last result answer, providing score and asking for Initials.
function getInitials() {
    var allDoneElement = document.createElement("h2");
    allDoneText = document.createTextNode("All done!");
    allDoneElement.appendChild(allDoneText);

    var yourFinalScore = document.createElement("p");
    yourFinalScoreText = document.createTextNode("Your final Score is: " + score);
    yourFinalScore.setAttribute("class", "paragraph")
    yourFinalScore.appendChild(yourFinalScoreText);

    var enterInitials = document.createElement("label")
    enterInitialsText = document.createTextNode("Enter Inititals: ");
    enterInitials.setAttribute("for", "Enter Initials");
    enterInitials.appendChild(enterInitialsText);

    var textArea = document.createElement("textarea");
    textArea.setAttribute("id", "initials");

    var submitInitials = document.createElement("button");
    submitInitials.setAttribute("id", "save");
    submitInitials.setAttribute("class", "singleButton");
    submitInitialsText = document.createTextNode("Submit");
    submitInitials.appendChild(submitInitialsText);

    

    container.prepend(submitInitials);
    container.prepend(textArea);
    container.prepend(enterInitials);
    container.prepend(yourFinalScore);
    container.prepend(allDoneElement);

    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function (event) {
        event.preventDefault();

        var currentUser = {
            grade: score,
            initials: textArea.value
        }
        var userGrade = JSON.parse(localStorage.getItem("userGrade"));
        if ((userGrade == null) || (userGrade !== null && userGrade.grade < score)) {

            localStorage.setItem("userGrade", JSON.stringify(currentUser));
        }
        showScore();
    })

}





function showScore() {
    cleanupScreen();
    var titleScoresElement = document.createElement("h2");
    titleScoresText = document.createTextNode("Highscores");
    titleScoresElement.appendChild(titleScoresText);
    container.appendChild(titleScoresElement);

    var highGrade = JSON.parse(localStorage.getItem("userGrade"));
    if (highGrade !== null) {
        var highScoreElement = document.createElement("h3");
        highScoreText = document.createTextNode(highGrade.initials + "   " + highGrade.grade);
        highScoreElement.appendChild(highScoreText);
        container.appendChild(highScoreElement);
    }

    var buttonBack = document.createElement("button");
    buttonBack.setAttribute("id", "Back");
    buttonBack.setAttribute("class", "singleButton");
    buttonBackText = document.createTextNode("Go Back");
    buttonBack.appendChild(buttonBackText);

    var buttonClearScore = document.createElement("button");
    buttonClearScore.setAttribute("id", "Clear");
    buttonClearScore.setAttribute("class", "singleButton");
    buttonClearScoreText = document.createTextNode("Clear HighScores");
    buttonClearScore.appendChild(buttonClearScoreText);

    var listOfButtons = document.createElement("div");
    listOfButtons.setAttribute("class", "scoreButtons");
    listOfButtons.appendChild(buttonBack);
    listOfButtons.appendChild(buttonClearScore);


    container.appendChild(listOfButtons);
    getUserAnswers("scoreButtons");

}

function clearScores() {

    localStorage.clear("userGrade");
    showScore();


}






//Function to end Quiz
function endQuiz() {
    deleteQuestionsandAnswers();
    getInitials();
}

function startQuiz() {

    initializeVar();
    cleanupScreen();
    startTimer();
    renderQuestion();
    getUserAnswers("buttonList");

}

function resetQuiz() {
    var bodyElement = document.querySelector('body');
    container.remove();
    originalBody = markup + bodyElement.outerHTML;
    bodyElement.outerHTML = originalBody;
    startButton = document.querySelector(".startButton");
    startButton.addEventListener("click", function (event) {
        event.preventDefault();
        startQuiz();

    })
}

startButton.addEventListener("click", function (event) {
    event.preventDefault();
    startQuiz();
})



