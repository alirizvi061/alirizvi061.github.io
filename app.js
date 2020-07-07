/***************************************************************
API website - https://opentdb.com/api_config.php 
*************************************************************/

/***************************************************************
 * step 1: Ajax works, API connected. Just waiting for it to provide the right information.
 *************************************************************/

const baseURL = 'https://opentdb.com/api.php?'
const amount = 'amount=11'
    // const category = 'category=9'  '&' + category +  //This was left in because of future posibility of using categories but this isn't used
const difficulty = 'difficulty=medium'
const type = 'type=boolean'
let queryURL = baseURL + amount + '&' + difficulty + '&' + type;

/***************************************************************
Step 2: This function is created to call on the server and fetch the data it's asked to fetch and display it on the div with the class of 'quesiton' on the screen
*************************************************************/
let dataArr = [];

const closeButton = () => {
    $('.closeButton').on('click', (event) => {
        $('#modal').hide();
    })
}

function getQuestions() {
    let res = $.ajax({
        type: 'GET',
        async: false,
        url: queryURL
    }).then((data) => {
        dataArr = data.results
        questionFunc();
    });
}

/***************************************************************
 * This function pulls out the correct_answer field from the array
 *************************************************************/
const correctAnswer = (data) => {


    for (let i = 0; i < data.length; i++) {
        let paramData = data[i].correct_answer
        return paramData;
    }
}

/***************************************************************
 * Create a function that displays a counter of how many questions the player has gotten right 
 *************************************************************/
let number = 0
const scoreCounter = (param) => {
        number = number + param
        const $count = $('<div>').html("Your Score: " + number).addClass('countButton')
        $('.container').html($count)
    }
    /***************************************************************
     * Start game function shows <p>, button text changes once clicked on
     *************************************************************/
let startGame = () => {
    $('.start').on('click', (event) => {
        $('.onScreenQuestion').show()
        $(event.currentTarget).text('Next Question')
        $('#pressStart').hide()
        scoreCounter(0);
        setMessage(' ');
    })
}

/***************************************************************
 * Reset counter function
 *************************************************************/
const resetCounter = () => {
    number = 0;
}

/***************************************************************
 * the below for loop shows the questions on the screen in a list form
 *************************************************************/
let questionFunc = () => {
    let question = dataArr.pop()

    if (question) {
        const $question = $(`<p>${question.question}</p>`).addClass('onScreenQuestion')
        $('#onScreenUl').html($question)
        const $break = $('<br />')
        $question.append($break)
        const $buttonT = $('<button>').text('True').addClass('true-button').css('position', 'relative')
        $($question).append($buttonT)
        const $buttonF = $('<button>').text('False').addClass('false-button').css('position', 'relative')
        $($question).append($buttonF)
        $('.onScreenQuestion').hide();
    }
    /***************************************************************
     * the below onClick function registers the question's index from questionArr and the true false buttons respectively
     *************************************************************/


    $(".true-button, .false-button").on('click', (event) => {
        /***************************************************************
         * on click, the buttons log whether the answers are correct or not
         *************************************************************/

        if ($(event.target).hasClass('true-button')) {
            console.log('true button')

            if (question.correct_answer == 'True') {
                setMessage('You\'re Right!')
                questionFunc(dataArr)
                scoreCounter(1)
            } else {
                setMessage('Wrong, Better Luck Next Question!')
                questionFunc(dataArr)
            }
        } else if ($(event.target).hasClass('false-button')) {
            if (question.correct_answer == 'False') {
                setMessage('You\'re Right!')
                questionFunc(dataArr)
                scoreCounter(1)
            } else {
                setMessage('Wrong, Better Luck Next Question!')
                questionFunc(dataArr)
            }
        }
        checkFunc()
    })

    const checkFunc = () => {
        if (dataArr.length === 0) {
            $('.onScreenQuestion').remove()
            resetOrEndGame()
        }
    }
}


/***************************************************************
 * setMessage Function displays a message on the screen
 *************************************************************/

const setMessage = (message) => {
    $('.message').html(message).addClass('message')
}

/***************************************************************
 * Reset Function Resets the game for replaying 
 *************************************************************/
const resetOrEndGame = () => {
    let resetButton = $('<button>').text('Reset').addClass('resetButton')
    let endButton = $('<button>').text('End Game').addClass('endButton')

    $('.footerButtons').append(resetButton)
    $('.footerButtons').append(endButton)

    resetButton.on('click', () => {
        setMessage(' ');
        resetCounter();
        $('.start').html('Restart Game')
        $('#pressStart').html('Press "Restart Game" to restart game').show()
        $('.resetButton, .endButton').hide()
        getQuestions();
        startGame();
        questionFunc();
    })

    endButton.on('click', () => {
        window.close();
    })
}

/***************************************************************
 * jQuery on window load call
 *************************************************************/
$(() => {
    getQuestions(); //returns questions from API call from the API 
    startGame(); // Starts game
    closeButton(); //Closes intro modal
    // correctAnswer(questionArr);
})