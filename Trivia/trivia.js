//makes URL from submited data
const baseURL = `https://opentdb.com/api.php${window.location.search}`
// const baseURL = ('https://opentdb.com/api.php?amount=10&type=multiple')
//gets all document elements
const questionContainer = document.querySelector('.question');
const answerContainer = document.querySelector('.answers');
const nextBtn = document.querySelector('#next-btn')
const scoreText = document.querySelector('#score')
const questionNum = document.querySelector('#quest-num')
//declares all variables needed for JS
var result;
var count = -1;
var guessed = false;
var score = 0;
var amount;

//makes the api request
axios.get(baseURL)
.then(res => {
  result = res.data.results
  amount = result.length;
  nextQuestion();
})

var nextQuestion = () => {
  count++;
  questionNum.innerText = `Question: ${count + 1}`
  //removes previous answer buttons
  let previousAnswers = document.querySelectorAll('.answer-btn')
  if (previousAnswers.length > 0) {
    for (let i = 0; i < previousAnswers.length; i++) {
      previousAnswers[i].parentNode.removeChild(previousAnswers[i]);
    }
  }
  //removes the previous question
  let previousQuestion = document.querySelector('h4')
  if (previousQuestion !== null) {
    previousQuestion.parentNode.removeChild(previousQuestion);
  }

  let questionText = document.createElement('h4');
  questionText.innerHTML = result[count].question
  questionContainer.appendChild(questionText)

  let randomArr = random()
  let answer = [result[count].correct_answer, ...result[count].incorrect_answers]
  for(let i = 0; i < answer.length; i++) {
    let answerBtn = document.createElement('button');
    answerBtn.innerHTML = answer[randomArr[i]]
    answerBtn.classList.add('answer-btn')
    answerBtn.id = answer[randomArr[i]]
    answerContainer.appendChild(answerBtn)
  }
}

//handles the users click on an answer
answerContainer.addEventListener('click', e => {
  if (guessed === false) {
    if (e.target.tagName === 'BUTTON') {
      let ansBtn = document.querySelectorAll('.answer-btn')
      guessed = true;
      nextBtn.classList.remove('greyed-out')
      if (e.target.id === result[count].correct_answer){
        score++;
        e.target.style.backgroundColor = 'green'
        scoreText.innerText = `Score: ${score}`
      } else {
        e.target.style.backgroundColor = 'red'
        e.target.style.color = 'black'
      }
      for (let i = 0; i < ansBtn.length; i++) {
        if (ansBtn[i].id === result[count].correct_answer){
          ansBtn[i].style.backgroundColor = 'green'
        } else {
          ansBtn[i].classList.add('greyed-out')
        }
      }
      if (count >= amount - 1) {
        nextBtn.classList.add('greyed-out')
      }
    }
  }
})

//randomizes answer order
function random() {
  let arr = [0,1,2,3]
  let newArr = []
  for (let a = arr, i = a.length; i--; ) {
    let random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    newArr.push(random)
  }
  return newArr
}

//handles the next button click
nextBtn.addEventListener('click', e => {
  if(guessed === true && count < amount - 1){
    guessed = false;
    nextQuestion();
    nextBtn.classList.add('greyed-out')
  }
})
