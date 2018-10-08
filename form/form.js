axios.get('https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple')
.then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
