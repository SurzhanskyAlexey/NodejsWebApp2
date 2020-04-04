"use strict";
//console.log('test');

//alert(questNumber());
  //  document.querySelector('.continue-test').onclick = getQuestion;

    // function getQuestion (){
//     let test_session = getCookie('test_session');
//     if (test_session == undefined ) {
//         alert ('Сессия потеряна авторизуйтесь снова2');
//     }
//     else {
//         console.log('nazhal');
//         let cookieSession = getCookie('session');
//         let cookieId = getCookie('id');
// //console.log(cookieId);
//         if (cookieSession == undefined || cookieSession == ''||cookieId == undefined||cookieId == '') {
//             alert ('Сессия потеряна авторизуйтесь снова');
//         } else{
//             formAnswer.onsubmit = async function(event) {
//                 event.preventDefault();
//             };
//             fetch ('/get-question',
//                 {
//                     method: 'POST',
//                     headers: {
//                             'Content-type': 'application/json'
//                     },
//                     body: new FormData(document.forms.formAnswer)
//                 }
//             ).then(function(response) {
//                  console.log(response.text());
//                     return response.text();
//
//                 }
//             ).then(function (body){
//                // showQuestion(body);
//             }) }
//     };
// };

// function showQuestion (data) {
//   //  localStorage.setItem('question', JSON.stringify(data));
//     if (data[0]['question'] !== undefined && a < 10) {
//         let out = '<div class="row"></div><form id="answer-form" action="" method="POST"><input type="hidden" name="id_questions" value="'+data[0]['id_questions']+'"><h4 class="question">';
//         out +=data[0]['question'];
//         out += '</h4></div></br>';
//         for (let i = 0; i < data.length; i++) {
//             out +='<label><input type="checkbox" name="'+data[i]['id_answers']+'" value="1"><input name="'+data[i]['id_answers']+'" value="0" type="hidden"><h6>'+data[i]['answer']+'</h6></label>';
//         }
//
//         out += '<input type="submit" class="button-primary-outlined continue-test" value="Следующий вопрос"></i></form>'
//
//         document.querySelector('.answer').innerHTML = out;
//         document.querySelector('.continue-test').onclick = getQuestion;
//
//     } else {
//
//         document.querySelector('.answer').innerHTML = (JSON.stringify(data))
//     }
//
//     }
function randomInteger(){
    let numRand = Math.random()*10000000000;
    numRand = Math.round(numRand);
   // console.log(numRand);
    return (numRand);
};
function setTestCookie () {
    let rI = 'test_session='+randomInteger();
    //console.log(rI);
    document.cookie = rI;
    getQuestion();
}
function checkAnswer() {

}
