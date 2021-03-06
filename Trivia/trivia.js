//makes URL from submited data
var baseURL;
//checks if anything was passed through
if (window.location.search !== '') {
  baseURL = `https://opentdb.com/api.php${window.location.search}`
} else {
  baseURL = `https://opentdb.com/api.php?amount=10`
}

//gets all document elements
const main = document.querySelector('main');
const questionContainer = document.querySelector('.question');
const answerContainer = document.querySelector('.answers');
const nextBtn = document.querySelector('#next-btn');
const backBtn = document.querySelector('#back-btn');
const scoreText = document.querySelector('#score');
const questionNum = document.querySelector('#quest-num');
const end = document.querySelector('.ending');
const endScore = document.querySelector('.end-score');
const endAmount = document.querySelector('.end-amount');
const endPercent = document.querySelector('.end-percent');
const timeText = document.querySelector('.timer');
const leaderboardBtn = document.querySelector('.leaderboard');
const leader = document.querySelector('.leader');
const scores = document.querySelector('.scores');
const leaderAdd = document.querySelector('#leader-add');
const leaderBack = document.querySelector('#leader-back');
const bar = document.querySelector('.bar');
const icon = document.querySelector('#categoryIcon');
const categoryName = document.querySelector('.categoryName');


//declares all variables needed for JS
var result;
var count = -1;
var guessed = false;
var score = 0;
var amountCorrect = 0;
var amount;
var ansBnt;
var categoryKey;
var timeScore = 100;
var timer;
var leaderboardData;
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
var categoryIcon = {
  general: 'https://giphy.com/embed/26ufdipQqU2lhNa4g',
  books: 'https://giphy.com/embed/3o85xBwvWcj1Z11Gda',
  film: 'https://giphy.com/embed/xUOxeZ7Cgf5RAZ0tLq',
  music: 'https://giphy.com/embed/3oriNYvVkCgIhSIKic',
  theatres: 'https://giphy.com/embed/26hiubgNAC4Enzd1S',
  television: 'https://giphy.com/embed/muL2iYJR1MNPCdXxHv',
  video: 'https://giphy.com/embed/R6f2XTDc3RlL2',
  board: 'https://giphy.com/embed/1WyJrpqEI74qs',
  nature: 'https://giphy.com/embed/l0MYEqx0khJxVyXcc',
  computers: 'https://giphy.com/embed/11jQqqyF4S5MWY',
  mathematics: 'https://giphy.com/embed/3ohs88j0jPszpGCbyy',
  mythology: 'https://giphy.com/embed/fbFbMdF9KI3QY',
  sports: 'https://giphy.com/embed/vcYJ10AVGFZbG',
  geography: 'https://giphy.com/embed/X6hiFJjvTDAAw',
  history: 'https://giphy.com/embed/wSrdicIdgKY8M',
  politics: 'https://giphy.com/embed/3SlnytgfJTaxy',
  art: "https://giphy.com/embed/aJCEZPCJnVtXW",
  celebrities: 'https://giphy.com/embed/3o6gDRuqYeG11VeBG0',
  animals: 'https://giphy.com/embed/33zX3zllJBGY8',
  vehicles: 'https://giphy.com/embed/l0Iy2xpoNWyfyjpuM',
  comics: 'https://giphy.com/embed/iLup1YcSTLaUg',
  gadgets: 'https://giphy.com/embed/fnkyJXcCXZngY',
  anime: 'https://giphy.com/embed/nSKCHXMmNb7yM',
  cartoon: 'https://giphy.com/embed/4pjKt6jfT6Z7W' //Makers of the API miss spelled cartoon
}

//makes the api request
axios.get(baseURL)
.then(res => {
  result = res.data.results;
  amount = result.length;
  nextQuestion();
})

//changes the html to the next question
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

  //adds the question
  let questionText = document.createElement('h4');
  questionText.innerHTML = result[count].question
  questionContainer.appendChild(questionText)

  //adds the buttons
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
  //changes colors
  dynamicButtons();
  //add categoryIcon
  addIcon()
  //starts timer
  timer = setInterval(time, 200)
  timeText.innerHTML = `Time: ${timeScore}`
}

//handles the users click on an answer
answerContainer.addEventListener('click', e => {
  if (guessed === false) {
    if (e.target.tagName === 'BUTTON') {
      ansBtn = document.querySelectorAll('.answer-btn')
      guessed = true;
      nextBtn.classList.remove('greyed-out')
      if (e.target.id === result[count].correct_answer){
        score += timeScore
        amountCorrect++;
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
        endScore.innerHTML = `Score: ${score}`
        endAmount.innerHTML = `${amountCorrect} out of ${amount}`
        endPercent.innerHTML = `${((amountCorrect/amount) * 100).toFixed(0)}%`
      }
      //stops timer
      clearInterval(timer);
      timeScore = 100;
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
    timeText.style.color = 'black'
  }
})

//changes the background color of each button and background by category
var dynamicButtons = () => {
  ansBnt = document.querySelectorAll('.answer-btn')
  categoryKey = result[count].category;
  for(let i = 0; i < ansBnt.length; i++){
    if(categoryKey.includes('Entertainment') || categoryKey.includes('Celebrities')){
        nextBtn.style.backgroundColor = buttonColors.orange
        backBtn.style.backgroundColor = buttonColors.orange
        ansBnt[i].style.backgroundColor = buttonColors.orange
        main.style.backgroundColor = mainColors.orange
        ansBnt[i].style.color = 'black'
        backBtn.style.color = 'black'
    } else if(categoryKey.includes('Science')){
        nextBtn.style.backgroundColor = buttonColors.green
        backBtn.style.backgroundColor = buttonColors.green
        ansBnt[i].style.backgroundColor = buttonColors.green
        main.style.backgroundColor = mainColors.green
    } else if(categoryKey.includes('Art')){
        nextBtn.style.backgroundColor = buttonColors.pink
        backBtn.style.backgroundColor = buttonColors.pink
        ansBnt[i].style.backgroundColor = buttonColors.pink
        main.style.backgroundColor = mainColors.pink
    } else if(categoryKey.includes('History') || categoryKey.includes('Mythology')){
        nextBtn.style.backgroundColor = buttonColors.yellow
        backBtn.style.backgroundColor = buttonColors.yellow
        ansBnt[i].style.backgroundColor = buttonColors.yellow
        main.style.backgroundColor = mainColors.yellow
        ansBnt[i].style.color = 'black'
        backBtn.style.color = 'black'
    } else if(categoryKey.includes('Geography')){
        nextBtn.style.backgroundColor = buttonColors.blue
        backBtn.style.backgroundColor = buttonColors.blue
        ansBnt[i].style.backgroundColor = buttonColors.blue
        main.style.backgroundColor = mainColors.blue
    } else if(categoryKey.includes('Sports')){
        nextBtn.style.backgroundColor = buttonColors.red
        backBtn.style.backgroundColor = buttonColors.red
        ansBnt[i].style.backgroundColor = buttonColors.red
        main.style.backgroundColor = mainColors.red
    } else if(categoryKey.includes('Animals') || categoryKey.includes('Vechicles') || categoryKey.includes('General Knowledge') || categoryKey.includes('Politics') || categoryKey.includes('Vehicles')){
        nextBtn.style.backgroundColor = buttonColors.purple
        backBtn.style.backgroundColor = buttonColors.purple
        ansBnt[i].style.backgroundColor = buttonColors.purple
        main.style.backgroundColor = mainColors.purple
    }
  }
}
//adds icon for current category
var addIcon = () => {
  categoryKey = result[count].category.toLowerCase();
  for ( let i in categoryIcon){
    if (categoryKey.includes(i)){
        icon.src = categoryIcon[i]
    }
  }
}
//handles timer and time score
var time = () => {
  timeScore--
  timeText.innerHTML = `Time: ${timeScore}`
  bar.style.width = `${timeScore}%`
  if (timeScore < 52) {
    timeText.style.color = 'white';
  }
  if (timeScore === 0) {
    clearInterval(timer)
  }
}

var writeLeaderboard = (data) => {
  end.classList.add('hidden')
  leader.classList.remove('hidden')
  let row = document.createElement('div')
  row.classList.add('row')
  for (let x in data[0]) {
    let col = document.createElement('div')
    col.classList.add('col')
    col.innerHTML = x
    row.appendChild(col)
  }
  scores.appendChild(row)
  for (let i = 0; i < data.length; i++) {
    let row = document.createElement('div')
    row.classList.add('row')
    for (let x in data[i]) {
      let col = document.createElement('div')
      col.classList.add('col')
      col.innerHTML = data[i][x]
      row.appendChild(col)
    }
    scores.appendChild(row)
  }
}

var deleteLeaderboard = () => {
  let rows = document.querySelectorAll('.row')
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].parentNode.removeChild(rows[i]);
    }
  }
}

leaderboardBtn.addEventListener('click', e=> {
  axios.get('leaderboard.json')
  .then(e => {
    leaderboardData = e.data;
    writeLeaderboard(leaderboardData)
  })
})

leaderAdd.addEventListener('click', e=> {
  let name = prompt('What is your name?')
  let obj = {"Name": name, "Score": score, "Amount Correct": `${amountCorrect} out of ${amount}`}
  leaderboardData.push(obj)
  deleteLeaderboard()
  writeLeaderboard(leaderboardData)
})

leaderBack.addEventListener('click', e=> {
  leader.classList.add('hidden')
  end.classList.remove('hidden')
  deleteLeaderboard()
})
