

//makes URL from submited data
const baseURL = `https://opentdb.com/api.php${window.location.search}`
// const baseURL = ('https://opentdb.com/api.php?amount=10&type=multiple')
//gets all document elements
const main = document.querySelector('main')
const questionContainer = document.querySelector('.question');
const answerContainer = document.querySelector('.answers');
const nextBtn = document.querySelector('#next-btn')
const backBtn = document.querySelector('#back-btn')
const scoreText = document.querySelector('#score')
const questionNum = document.querySelector('#quest-num')
const end = document.querySelector('.ending')
const endScore = document.querySelector('.end-score')
const endPercent = document.querySelector('.end-percent')
//declares all variables needed for JS
var result;
var count = -1;
var guessed = false;
var score = 0;
var amount;
var ansBnt;
var categoryKey;
var mainColors = {
  orange:'darkorange',
  green: 'darkgreen',
  pink: '#de03c3',
  yellow: '#cab104',
  blue: 'darkblue',
  red: 'darkred',
  purple: '#600759'
}
var buttonColors = {
  orange:'#fba829',
  green: '#4eaf0d',
  pink: '#f2099a',
  yellow: '#ebdf05',
  blue: '#1626f4',
  red: '#ed0528',
  purple: '#d01cf7'
}

//makes the api request
axios.get(baseURL)
.then(res => {
  result = res.data.results;
  amount = result.length;
  nextQuestion();
})
var nextQuestion = () => {
  backBtn.style.color = 'white'
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

  let answer = [result[count].correct_answer, ...result[count].incorrect_answers]
  let randomArr = random(answer.length);
  for(let i = 0; i < answer.length; i++) {
    let answerBtn = document.createElement('button');
    answerBtn.style.color = '#eae7d8'
    answerBtn.innerHTML = answer[randomArr[i]]
    answerBtn.classList.add('answer-btn')
    answerBtn.id = answer[randomArr[i]]
    answerContainer.appendChild(answerBtn)
  }
  dynamicBackground();
  dynamicButtons();
}

//handles the users click on an answer
answerContainer.addEventListener('click', e => {
  if (guessed === false) {
    if (e.target.tagName === 'BUTTON') {
      ansBtn = document.querySelectorAll('.answer-btn')
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
        } else if (ansBtn[i].style.backgroundColor !== 'red'){
          ansBtn[i].classList.add('greyed-out')
        }
      }
      //checks if the game has ended if it has it brings up the score card
      if (count >= amount - 1) {
        nextBtn.classList.add('greyed-out')
        end.classList.remove('hidden')
        endScore.innerHTML = `${score} out of ${amount}`
        endPercent.innerHTML = `${((score/amount) * 100).toFixed(0)}%`
      }
    }
  }
})

//randomizes answer order
function random(length) {
  let arr = []
  for (let i = 0; i < length; i++) {
    arr.push(i)
  }
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

//changes the bacground color of each button inreation to category
var dynamicButtons = () => {
  ansBnt = document.querySelectorAll('.answer-btn')
  categoryKey = result[count].category;
  for(let i = 0; i < ansBnt.length; i++){
    if(categoryKey.includes('Entertainment') || categoryKey.includes('Celebrities')){
      nextBtn.style.backgroundColor = buttonColors.orange
      backBtn.style.backgroundColor = buttonColors.orange
      ansBnt[i].style.backgroundColor = buttonColors.orange
      ansBnt[i].style.color = 'black'
      backBtn.style.color = 'black'
    } else if(categoryKey.includes('Science')){
      nextBtn.style.backgroundColor = buttonColors.green
      backBtn.style.backgroundColor = buttonColors.green
      ansBnt[i].style.backgroundColor = buttonColors.green
    } else if(categoryKey.includes('Art')){
      nextBtn.style.backgroundColor = buttonColors.pink
      backBtn.style.backgroundColor = buttonColors.pink
      ansBnt[i].style.backgroundColor = buttonColors.pink
    } else if(categoryKey.includes('History') || categoryKey.includes('Mythology')){
      nextBtn.style.backgroundColor = buttonColors.yellow
      backBtn.style.backgroundColor = buttonColors.yellow
      ansBnt[i].style.backgroundColor = buttonColors.yellow
      ansBnt[i].style.color = 'black'
      backBtn.style.color = 'black'
    } else if(categoryKey.includes('Geography')){
      nextBtn.style.backgroundColor = buttonColors.blue
      backBtn.style.backgroundColor = buttonColors.blue
      ansBnt[i].style.backgroundColor = buttonColors.blue
    } else if(categoryKey.includes('Sports')){
      nextBtn.style.backgroundColor = buttonColors.red
      backBtn.style.backgroundColor = buttonColors.red
      ansBnt[i].style.backgroundColor = buttonColors.red
    } else if(categoryKey.includes('Animals') || categoryKey.includes('Vechicles') || categoryKey.includes('General Knowledge') || categoryKey.includes('Politics') || categoryKey.includes('Vehicles')){
      nextBtn.style.backgroundColor = buttonColors.purple
      backBtn.style.backgroundColor = buttonColors.purple
      ansBnt[i].style.backgroundColor = buttonColors.purple
    }
  }
}
// Chenges bacground color of the main tag in relation to the category
var dynamicBackground = () => {
  categoryKey = result[count].category;
  if(categoryKey.includes('Entertainment') || categoryKey.includes('Celebrities')){
    main.style.backgroundColor = mainColors.orange
  } else if(categoryKey.includes('Science')){
    main.style.backgroundColor = mainColors.green
  } else if(categoryKey.includes('Art')){
    main.style.backgroundColor = mainColors.pink
  } else if(categoryKey.includes('History') || categoryKey.includes('Mythology')){
    main.style.backgroundColor = mainColors.yellow
  } else if(categoryKey.includes('Geography')){
    main.style.backgroundColor = mainColors.blue
  } else if(categoryKey.includes('Sports')){
    main.style.backgroundColor = mainColors.red
  } else if(categoryKey.includes('Animals') || categoryKey.includes('Vechicles') || categoryKey.includes('General Knowledge') || categoryKey.includes('Politics') || categoryKey.includes('Vehicles')){
    main.style.backgroundColor = mainColors.purple
  }
}
