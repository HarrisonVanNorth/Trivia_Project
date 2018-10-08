const baseURL = ('https://opentdb.com/api.php?amount=10&type=multiple')
const questionContainer = document.querySelector('.question');
const answerContainer = document.querySelector('.answers');
const nextBtn = document.querySelector('#next-btn')
var result;
var count = -1;
var guessed = false;
var score = 0;


axios.get(baseURL)
.then(res => {
  console.log(res.data.results)
  result = res.data.results
  nextQuestion();
})

var nextQuestion = () => {
  count++;
  let previousAnswers = document.querySelectorAll('.answer-btn')
  if (previousAnswers.length > 0) {
    for (let i = 0; i < previousAnswers.length; i++) {
      previousAnswers[i].parentNode.removeChild(previousAnswers[i]);
    }
  }
  let previousQuestion = document.querySelector('h4')
  if (previousQuestion !== null) {
    previousQuestion.parentNode.removeChild(previousQuestion);
  }

  let questionText = document.createElement('h4');
  questionText.innerText = result[count].question
  questionContainer.appendChild(questionText)

  let answer = [result[count].correct_answer, ...result[count].incorrect_answers]
  for(let i = 0; i < answer.length; i++) {
    let answerBtn = document.createElement('button');
    answerBtn.textContent = answer[i]
    answerBtn.classList.add('answer-btn')
    answerContainer.appendChild(answerBtn)
  }
}

answerContainer.addEventListener('click', e => {
  if (guessed === false) {
    let ansBtn = document.querySelectorAll('.answer-btn')
    if (e.target.tagName === 'BUTTON') {
      if (e.target.innerText === result[count].correct_answer){
        score++;
        e.target.style.backgroundColor = 'green'
      } else {
        e.target.style.backgroundColor = 'red'
        for (let i = 0; i < ansBtn.length; i++) {
          if (ansBtn[i].innerText === result[count].correct_answer){
            ansBtn[i].style.backgroundColor = 'green'
          }
        }
      }
      guessed = true;
    }
  }
})

nextBtn.addEventListener('click', e => {
  if(guessed === true){
    guessed = false;
    nextQuestion();
  }
})
