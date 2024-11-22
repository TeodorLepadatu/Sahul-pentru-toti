function validateQuiz() {
    // definesc raspunsurile corecte
    var correctAnswers = ["rocada mica", "in centru", "sa controleze centrul"];

    // iau valorile input de la utilizator
    var userAnswers = [];
    userAnswers.push(document.getElementById("q1").value);
    userAnswers.push(document.querySelector('input[name="q2"]:checked').value);
    userAnswers.push(document.getElementById("q3").value);

    // verific raspunsurile
    var score = 0;
    for (var i = 0; i < correctAnswers.length; i++) {
        if (userAnswers[i] == correctAnswers[i]) {
            score++;
        }
    }

    // afisare rezultate
    alert("Ai raspuns corect la  " + score + " intrebari, din totalul de " + correctAnswers.length);
    return false;
}
function validateQuiz1() {
  var correctAnswers = ["Nf6"];
  var userAnswers = [];
  userAnswers.push(document.getElementById("q1").value);
  var score = 0;
  var regex = /^N/; 
  
  for (var i = 0; i < correctAnswers.length; i++) {
      if (userAnswers[i] == correctAnswers[i]) {
          score++;
      }
  }

  if (score < 1) {
      if (regex.test(userAnswers[0])) {
          alert("Ai ales piesa buna, dar mutarea nu este cea corecta");
      } else {
          alert("Ai raspuns gresit");
      }
  } else {
      alert("Ai raspuns corect");
  }

  return false;
}
